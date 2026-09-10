require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'motionscan-backend', phase: 1 });
});

app.listen(PORT, () => {
  console.log(`MotionScan backend listening on http://localhost:${PORT}`);
});