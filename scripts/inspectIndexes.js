const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/financeDB');
    const indexes = await mongoose.connection.db.collection('records').indexes();
    console.log(indexes);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();