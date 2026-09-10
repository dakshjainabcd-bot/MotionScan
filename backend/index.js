require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', phase: 2 }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/screenings', require('./routes/screenings'));
app.use('/api/facilities', require('./routes/facilities'));
app.use('/api/config', require('./routes/config'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`MotionScan backend on http://localhost:${PORT}`));