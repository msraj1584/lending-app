const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const User = require('../models/User');

router.get('/', async (req, res) => {
  const loans = await Loan.find().populate('userId').lean();
  res.render('index', { loans });
});

router.get('/add', async (req, res) => {
  const users = await User.find().lean();
  res.render('addLoan', { users });
});

router.post('/add', async (req, res) => {
  const { userId, amount, remarks } = req.body;
  await Loan.create({ userId, amount, remarks });
  res.redirect('/');
});

router.get('/loan/:id', async (req, res) => {
  const loan = await Loan.findById(req.params.id).populate('userId').lean();
  const totalRepaid = loan.repayments.reduce((sum, r) => sum + r.amount, 0);
  loan.balance = loan.amount - totalRepaid;
  res.render('loanDetails', { loan });
});

router.post('/loan/:id/repay', async (req, res) => {
  const { amount } = req.body;
  await Loan.findByIdAndUpdate(req.params.id, {
    $push: { repayments: { amount } }
  });
  res.redirect(`/loan/${req.params.id}`);
});

module.exports = router;