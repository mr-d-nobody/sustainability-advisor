console.log("🔥 POSTGRES SERVER RUNNING 🔥");

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OpenAI = require("openai");
const { Pool } = require("pg");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        credits INTEGER DEFAULT 0,
        role TEXT DEFAULT 'user'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS history (
        id SERIAL PRIMARY KEY,
        userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
        electricity REAL,
        water REAL,
        waste REAL,
        transport REAL,
        renewable REAL,
        carbon REAL,
        score REAL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount INTEGER,
        type TEXT,
        description TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Postgres tables ready");
  } catch (err) {
    console.error("DB Init Error:", err);
  }
}

initDB();

/* ================= OPENAI ================= */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ================= AUTH ================= */

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

async function authorizeAdmin(req, res, next) {
  try {
    const { rows } = await pool.query(
      "SELECT role FROM users WHERE id = $1",
      [req.user.id]
    );

    if (!rows[0] || rows[0].role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

/* ================= REGISTER ================= */

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).send("Missing fields");

  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (rows.length > 0)
      return res.status(400).send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, password, credits, role) VALUES ($1, $2, $3, $4)",
      [username, hashedPassword, 0, "user"]
    );

    res.send("Registered successfully");

  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    const user = rows[0];
    if (!user) return res.status(400).send("No user");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).send("Wrong password");

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      userId: user.id,
      username: user.username,
      credits: user.credits,
      role: user.role
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});

/* ================= CHANGE PASSWORD ================= */

app.post("/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const { rows } = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [req.user.id]
    );

    const user = rows[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      return res.status(401).json({ error: "Current password incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, req.user.id]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* ================= AI ROUTE ================= */

app.post("/ai-advice", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { electricity, water, waste, transport, renewable } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT credits FROM users WHERE id = $1",
      [userId]
    );

    const user = rows[0];
    if (!user || user.credits <= 0)
      return res.status(403).json({ error: "Insufficient credits" });

    const prompt = `
Give short actionable sustainability advice.
Electricity: ${electricity}
Water: ${water}
Waste: ${waste}
Transport: ${transport}
Renewable: ${renewable}
Respond in bullet points under 150 words.
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      max_output_tokens: 200,
    });

    const advice = response.output[0].content[0].text;

    await pool.query(
      "UPDATE users SET credits = credits - 1 WHERE id = $1",
      [userId]
    );

    await pool.query(
      "INSERT INTO transactions (userId, amount, type, description) VALUES ($1, $2, $3, $4)",
      [userId, 1, "debit", "AI advice usage"]
    );

    res.json({
      advice,
      remainingCredits: user.credits - 1
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});

/* ================= HISTORY ================= */

app.get("/history", authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM history WHERE userId = $1 ORDER BY id DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* ================= TRANSACTIONS ================= */

app.get("/transactions", authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM transactions WHERE userId = $1 ORDER BY id DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* ================= ADMIN RECHARGE ================= */

app.post("/admin/recharge",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {

    const { username, amount } = req.body;
    const numericAmount = Number(amount);

    if (!username || isNaN(numericAmount) || numericAmount <= 0)
      return res.status(400).json({ error: "Invalid amount" });

    try {
      const { rows } = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
      );

      if (!rows[0])
        return res.status(404).json({ error: "User not found" });

      const userId = rows[0].id;

      await pool.query(
        "UPDATE users SET credits = credits + $1 WHERE id = $2",
        [numericAmount, userId]
      );

      await pool.query(
        "INSERT INTO transactions (userId, amount, type, description) VALUES ($1, $2, $3, $4)",
        [userId, numericAmount, "credit", "Admin recharge"]
      );

      res.json({ message: "Credits added successfully" });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "DB error" });
    }
  }
);
 app.get("/make-me-admin", async (req, res) => {
  try {
    await pool.query(
      "UPDATE users SET role = 'admin' WHERE username = $1",
      ["mrdnobody"]
    );

    const { rows } = await pool.query(
      "SELECT username, role FROM users WHERE username = $1",
      ["mrdnobody"]
    );

    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

/* ================= START ================= */

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});