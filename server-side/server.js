// Existing imports and setup...
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected');
});

// Create expenses table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10,2),
    category VARCHAR(255),
    date DATE
  )
`, err => {
  if (err) throw err;
});

// GET all expenses
app.get('/expenses', (req, res) => {
  db.query('SELECT * FROM expenses ORDER BY date DESC', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ✅ NEW: GET total amount spent
app.get('/expenses/total', (req, res) => {
  db.query('SELECT SUM(amount) AS totalSpent FROM expenses', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]); // { totalSpent: ... }
  });
});

// POST new expense
app.post('/expenses', (req, res) => {
  const { amount, category, date } = req.body;
  const sql = 'INSERT INTO expenses (amount, category, date) VALUES (?, ?, ?)';
  db.query(sql, [amount, category, date], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Expense added', id: result.insertId });
  });
});

// PUT (update) an expense
app.put("/expenses/:id", (req, res) => {
  const { id } = req.params;
  const { amount, category, date } = req.body;
  db.query(
    "UPDATE expenses SET amount = ?, category = ?, date = ? WHERE id = ?",
    [amount, category, date, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Update failed" });
      res.json({ message: "Expense updated successfully" });
    }
  );
});

// DELETE an expense
app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM expenses WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Expense deleted' });
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
