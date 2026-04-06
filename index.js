const express = require('express');
const connectDB = require('./config/db');
const app = express();
const port = 3000;
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/users', userRoutes);
app.use('/records', recordRoutes);
app.use('/summary', summaryRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});