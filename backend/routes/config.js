const express = require('express');
const db = require('../db/init');
const router = express.Router();

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM config').all();
  const config = Object.fromEntries(rows.map(r => [r.key, JSON.parse(r.value)]));
  res.json(config);
});

module.exports = router;