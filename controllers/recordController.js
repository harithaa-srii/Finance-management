const Record = require('../models/Records');
const User = require('../models/User');

const getRecordDelta = (type, amount) => {
  const value = Number(amount);
  return type === 'income' ? value : -value;
};

const createRecord = async (req, res) => {
  try {
    const associatedUserId = req.user.userId || req.body.userId;
    const associatedUserName = req.user.userName || req.body.userName;

    if (!associatedUserId || !associatedUserName) {
      return res.status(400).json({ error: 'User id and username are required in headers or request body' });
    }

    const user = await User.findOne({ usrId: associatedUserId });
    if (!user) {
      return res.status(404).json({ error: 'Associated user not found' });
    }

    const record = await Record.create({
      ...req.body,
      userId: associatedUserId,
      userName: associatedUserName
    });

    const delta = getRecordDelta(record.type, record.amount);
    await User.findOneAndUpdate(
      { usrId: associatedUserId },
      { $inc: { amountAvailable: delta } }
    );

    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getRecords = async (req, res) => {
  try {
    const { type, category, userId, userName } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (userId) filter.userId = userId;
    if (userName) filter.userName = userName;

    if (req.user.role === 'viewer') {
      if (!req.user.userId) {
        return res.status(400).json({ error: 'User id header is required for viewer access' });
      }
      filter.userId = req.user.userId;
    }

    const records = await Record.find(filter);
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const existingRecord = await Record.findOne({ recId: req.params.id });
    if (!existingRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const updatedUserId = req.body.userId || existingRecord.userId;
    const updatedUserName = req.body.userName || existingRecord.userName;
    const updatedType = req.body.type || existingRecord.type;
    const updatedAmount = req.body.amount !== undefined ? Number(req.body.amount) : existingRecord.amount;

    const oldUser = await User.findOne({ usrId: existingRecord.userId });
    if (!oldUser) {
      return res.status(404).json({ error: 'Original associated user not found' });
    }

    let newUser = oldUser;
    if (existingRecord.userId !== updatedUserId) {
      newUser = await User.findOne({ usrId: updatedUserId });
      if (!newUser) {
        return res.status(404).json({ error: 'Updated associated user not found' });
      }
    }

    const record = await Record.findOneAndUpdate(
      { recId: req.params.id },
      { ...req.body, userId: updatedUserId, userName: updatedUserName },
      { new: true, runValidators: true }
    );

    const oldDelta = getRecordDelta(existingRecord.type, existingRecord.amount);
    const newDelta = getRecordDelta(updatedType, updatedAmount);

    if (existingRecord.userId === updatedUserId) {
      const balanceChange = newDelta - oldDelta;
      if (balanceChange !== 0) {
        await User.findOneAndUpdate(
          { usrId: updatedUserId },
          { $inc: { amountAvailable: balanceChange } }
        );
      }
    } else {
      await User.findOneAndUpdate(
        { usrId: existingRecord.userId },
        { $inc: { amountAvailable: -oldDelta } }
      );
      await User.findOneAndUpdate(
        { usrId: updatedUserId },
        { $inc: { amountAvailable: newDelta } }
      );
    }

    res.status(200).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findOne({ recId: req.params.id });
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const user = await User.findOne({ usrId: record.userId });
    if (!user) {
      return res.status(404).json({ error: 'Associated user not found' });
    }

    const delta = getRecordDelta(record.type, record.amount);
    await User.findOneAndUpdate(
      { usrId: record.userId },
      { $inc: { amountAvailable: -delta } }
    );

    await Record.findOneAndDelete({ recId: req.params.id });
    res.status(200).json({ message: 'Record deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const match = {};

    let amountAvailable = null;

    if (req.user.role === 'viewer') {
      if (!req.user.userId) {
        return res.status(400).json({ error: 'User id header is required for summary access' });
      }
      match.userId = req.user.userId;
      const user = await User.findOne({ usrId: req.user.userId }).select('amountAvailable');
      amountAvailable = user ? user.amountAvailable : 0;
    } else if (req.query.userId) {
      match.userId = req.query.userId;
      const user = await User.findOne({ usrId: req.query.userId }).select('amountAvailable');
      amountAvailable = user ? user.amountAvailable : 0;
    }

    const incomeResult = await Record.aggregate([
      { $match: { ...match, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const expenseResult = await Record.aggregate([
      { $match: { ...match, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
    const totalExpense = expenseResult.length > 0 ? expenseResult[0].total : 0;
    const amountInHand = amountAvailable !== null ? amountAvailable : totalIncome - totalExpense;
    res.status(200).json({ totalIncome, totalExpense, amountInHand });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createRecord, getRecords, updateRecord, deleteRecord, getSummary };