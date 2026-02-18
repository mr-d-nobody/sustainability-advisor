console.log("🔥 THIS EXACT SERVER FILE IS RUNNING 🔥");

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

 
console.log("HF TOKEN LOADED:", process.env.HF_TOKEN ? "YES" : "NO");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");


// ================= CREATE TABLES =================

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
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


// ================= HEALTH CHECK =================

app.get("/ping", (req, res) => {
  res.json({ status: "Backend working" });
});


// ================= AI ROUTE =================

const axios = require("axios");

app.post("/ai-advice", async (req, res) => {
  try {
    const { electricity, water, waste, transport, renewable } = req.body;

    const prompt = `
Give short actionable sustainability advice:

Electricity: ${electricity}
Water: ${water}
Waste: ${waste}
Transport: ${transport}
Renewable: ${renewable}

Respond in bullet points.
`;

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "HuggingFaceH4/zephyr-7b-beta",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    const advice = response.data.choices[0].message.content;

    res.json({ advice });

  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);
    res.status(500).json({
      advice: "AI failed to generate advice."
    });
  }
});

// ================= REGISTER =================

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Missing fields");
  }

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) return res.status(500).send("DB error");

      if (user) {
        return res.status(400).send("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword],
        (err) => {
          if (err) return res.status(500).send("Insert error");
          res.send("Registered");
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
      if (!user) return res.status(400).send("No user");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).send("Wrong password");

      const token = jwt.sign({ id: user.id }, "secret");
      res.json({ token, userId: user.id });
    }
  );
});


// ================= SAVE =================

app.post("/save", (req, res) => {
  const data = req.body;

  db.run(
    `INSERT INTO history
    (userId,electricity,water,waste,transport,renewable,carbon,score,date)
    VALUES (?,?,?,?,?,?,?,?,datetime('now'))`,
    [
      data.userId,
      data.electricity,
      data.water,
      data.waste,
      data.transport,
      data.renewable,
      data.carbon,
      data.score
    ],
    () => res.send("Saved")
  );
});


// ================= HISTORY =================

app.get("/history/:userId", (req, res) => {
  db.all(
    "SELECT * FROM history WHERE userId=? ORDER BY id DESC",
    [req.params.userId],
    (err, rows) => {
      res.json(rows);
    }
  );
});


// ================= START =================

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
