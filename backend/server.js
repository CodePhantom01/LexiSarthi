const app = require('./src/app');
require('dotenv').config({ quiet: true });
const connectDB = require('./src/config/db');
require('./src/jobs/dailyWordJob');


const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

app.listen(PORT, () => {
  console.log(`backend running on port ${PORT}`);
});
