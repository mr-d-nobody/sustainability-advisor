console.log("🔥 THIS EXACT SERVER FILE IS RUNNING 🔥");

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OpenAI = require("openai");

require("dotenv").config();

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const app = express();
app.use(cors());
app.use(express.json());

// ================= OPENAI SETUP =================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000,
});

// ================= DATABASE =================

const path = require("path");

const dbPath = path.resolve(__dirname, "database.db");
console.log(" USING DB FILE:", dbPath);

const db = new sqlite3.Database(dbPath);

// ================= CREATE TABLES =================

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  credits INTEGER DEFAULT 0,
  role TEXT DEFAULT 'user'
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  electricity REAL,
  water REAL,
  waste REAL,
  transport REAL,
  renewable REAL,
  carbon REAL,
  score REAL,
  date TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  amount INTEGER,
  type TEXT,          -- 'credit' or 'debit'
  description TEXT,
  date TEXT
)
`);

// ================= HEALTH CHECK =================

app.get("/ping", (req, res) => {
  res.json({ status: "Backend working" });
});

// ================= AUTH MIDDLEWARE =================

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

function authorizeAdmin(req, res, next) {
  const userId = req.user.id;

  db.get("SELECT role FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  });
}
// ================= CHANGE PASSWORD =================

app.post("/change-password", authenticateToken, async (req, res) => {
  console.log("Change password hit");
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Missing fields" });
  }

  db.get("SELECT password FROM users WHERE id = ?", [userId], async (err, user) => {

    if (err) return res.status(500).json({ error: "DB error" });
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(currentPassword, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Current password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.run(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId],
      (err) => {
        if (err) return res.status(500).json({ error: "Update failed" });

        res.json({ message: "Password updated successfully" });
      }
    );
  });
});

// ================= REGISTER =================

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).send("Missing fields");

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) return res.status(500).send("DB error");
      if (user) return res.status(400).send("User already exists");

      const hashedPassword = await bcrypt.hash(password, 10);

      db.run(
        "INSERT INTO users (username, password, credits, role) VALUES (?, ?, ?, ?)",
        [username, hashedPassword, 0, "user"],
        (err) => {
          if (err) return res.status(500).send("Insert error");
          res.send("Registered successfully");
        }
      );
    }
  );
});

// ================= LOGIN =================

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=?",
    [username],
    async (err, user) => {
      if (err) return res.status(500).send("DB error");
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
        credits: user.credits ?? 0,
        role: user.role
      });
    }
  );
});
//Transaction history route
app.get("/transactions", authenticateToken, (req, res) => {

  const userId = req.user.id;

  db.all(
    "SELECT * FROM transactions WHERE userId = ? ORDER BY id DESC",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json(rows);
    }
  );
});
// ================= AI ROUTE =================

app.post("/ai-advice", authenticateToken, async (req, res) => {
  try {
    const { electricity, water, waste, transport, renewable } = req.body;
    const userId = req.user.id;

    db.get("SELECT credits FROM users WHERE id = ?", [userId], async (err, user) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (!user) return res.status(404).json({ error: "User not found" });

      if (user.credits <= 0) {
        return res.status(403).json({
          error: "No credits left. Contact owner to recharge."
        });
      }

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
        input: [
          {
            role: "system",
            content:
              "You are a practical sustainability advisor giving clear advice.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_output_tokens: 200,
      });

      const advice = response.output[0].content[0].text;

      db.run(
        "UPDATE users SET credits = credits - 1 WHERE id = ?",
        [userId],
        () => {
          db.run(
            "INSERT INTO transactions (userId, amount, type, description, date) VALUES (?, ?, ?, ?, datetime('now'))",
            [userId, 1, "debit", "AI advice usage"]
          );
        }
      );

      res.json({
        advice,
        remainingCredits: user.credits - 1
      });
    });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI failed" });
  }
});

// ================= SAVE =================

app.post("/save", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const data = req.body;

  db.run(
    `INSERT INTO history
    (userId,electricity,water,waste,transport,renewable,carbon,score,date)
    VALUES (?,?,?,?,?,?,?,?,datetime('now'))`,
    [
      userId,
      data.electricity,
      data.water,
      data.waste,
      data.transport,
      data.renewable,
      data.carbon,
      data.score,
    ],
    (err) => {
      if (err) return res.status(500).send("DB error");
      res.send("Saved");
    }
  );
});

// ================= HISTORY =================

app.get("/history", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    "SELECT * FROM history WHERE userId=? ORDER BY id DESC",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).send("DB error");
      res.json(rows);
    }
  );
});

// ================= ADMIN RECHARGE =================

app.post("/admin/recharge",
  authenticateToken,
  authorizeAdmin,
  (req, res) => {

    const { username, amount } = req.body;

    console.log("Recharge request:", username, amount);

    if (!username || !amount)
      return res.status(400).json({ error: "Missing fields" });

    db.run(
      "UPDATE users SET credits = credits + ? WHERE username = ?",
      [numericAmount, username],
      function (err) {

        if (err) {
          console.error("Recharge DB error:", err);
          return res.status(500).json({ error: "DB error" });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: "User not found" });
        }


        db.get("SELECT id FROM users WHERE username = ?", [username], (err, user) => {

          db.run(
            "INSERT INTO transactions (userId, amount, type, description, date) VALUES (?, ?, ?, ?, datetime('now'))",
            [user.id, numericAmount, "credit", "Admin recharge"]
          );
        });

        res.json({ message: "Credits added successfully" });
      }
    );
  }
);

// ================= START =================

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});