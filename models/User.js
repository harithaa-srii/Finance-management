const mongoose = require('mongoose');
const { nextId } = require('../utils/idGenerator');

const userSchema = new mongoose.Schema({
  usrId: {
    type: String,
    unique: true,
    required: true,
    match: [/^USR\d{3}$/, 'User id must be in the format USR001']
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },
   role: {
    type: String,
    enum: ["viewer", "analyst", "admin"],
    default: "viewer",
  },
  amountAvailable: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true,
  }
},{ timestamps: true });

userSchema.pre('validate', async function () {
  if (!this.usrId) {
    this.usrId = await nextId('USR', mongoose.model('User'), 'usrId', 3);
  }
});

module.exports = mongoose.model('User', userSchema);