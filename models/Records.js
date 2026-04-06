const mongoose = require('mongoose');
const { nextId } = require('../utils/idGenerator');

const recordSchema = new mongoose.Schema({
    recId: {
        type: String,
        unique: true,
        required: true,
        match: [/^REC\d{3}$/, 'Record id must be in the format REC001']
    },
    amount:{
        type: Number,
        required: [true, 'Amount is required']
    },
    type:{
        type: String,
        enum: ["income", "expense"],
        required: [true, 'Type is required']
    },
    category:{
        type: String,
        required: [true, 'Category is required']
    },
    date:{
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        maxlength: [200, 'Description cannot exceed 200 characters']
    },
    userId: {
        type: String,
        required: [true, 'User ID is required']
    },
    userName: {
        type: String,
        required: [true, 'User name is required']
    }

},{ timestamps: true });

recordSchema.set('id', false);

recordSchema.pre('validate', async function () {
  if (!this.recId) {
    this.recId = await nextId('REC', mongoose.model('Record'), 'recId', 3);
  }
});

module.exports = mongoose.model('Record', recordSchema);