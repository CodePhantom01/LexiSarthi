const express = require('express');
const cors = require("cors");
const wordRoutes = require('./routes/wordRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/words', wordRoutes);

app.get('/', (req, res) => {
  res.send('LexiSarthi API is running');
});

app.use('/api/users', userRoutes);

module.exports = app;
