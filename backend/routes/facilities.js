const express = require('express');
const db = require('../db/init');
const router = express.Router();

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM facilities').all();
  res.json(rows);
});

module.exports = router;