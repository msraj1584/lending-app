const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema({
  amount: Number,
  date: { type: Date, default: Date.now }
});

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: Number,
  date: { type: Date, default: Date.now },
  remarks: String,
  repayments: [repaymentSchema]
});

module.exports = mongoose.model('Loan', loanSchema);