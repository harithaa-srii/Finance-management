const mongoose = require('mongoose');

const dropStaleRecordIndex = async () => {
  const db = mongoose.connection.db;
  const collection = db.collection('records');
  const indexes = await collection.indexes();
  const staleIndex = indexes.find(index => index.name === 'id_1');
  if (staleIndex) {
    await collection.dropIndex('id_1');
    console.log('Dropped stale unique index id_1 from records collection');
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/financeDB');
    await dropStaleRecordIndex();
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;