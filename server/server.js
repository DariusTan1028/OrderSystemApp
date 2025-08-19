const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

// Setup SQLite
const db = new Database('orders.db');
db.prepare('CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, item TEXT, qty INTEGER)').run();

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Test API
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// ✅ Add Order API
app.post('/api/add-order', (req, res) => {
  const { item, qty } = req.body;
  if (!item || !qty) return res.status(400).json({ error: 'Missing item or qty' });
  db.prepare('INSERT INTO orders (item, qty) VALUES (?, ?)').run(item, qty);
  res.json({ success: true });
});

// ✅ Get Orders API
app.get('/api/orders', (req, res) => {
  const orders = db.prepare('SELECT * FROM orders').all();
  res.json(orders);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
