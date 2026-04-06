const User = require('../models/User');

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
    return res.status(400).json({
      error: "Email already exists"
    });
  }
    res.status(400).json({ error: err.message });
  }    
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ usrId: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ usrId: req.params.id }, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUserBalance = async (req, res) => {
  try {
    const user = await User.findOne({ usrId: req.params.id }).select('usrId name amountAvailable');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.user.role === 'viewer' && req.user.userId !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden: viewers can only access their own balance' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createUser, getUsers, updateUser, deleteUser, getUserBalance };