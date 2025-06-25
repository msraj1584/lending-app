const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Loan = require('../models/Loan');

router.get('/users', async (req, res) => {
  const users = await User.find().lean();
  res.render('users', { users });
});

router.post('/users', async (req, res) => {
  const { name } = req.body;
  await User.create({ name });
  res.redirect('/users');
});

router.get('/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  const loans = await Loan.find({ userId: user._id }).lean();

  loans.forEach(loan => {
    const totalRepaid = loan.repayments?.reduce((sum, r) => sum + r.amount, 0) || 0;
    loan.balance = loan.amount - totalRepaid;
  });

  res.render('userDetails', { user, loans });
});

module.exports = router;