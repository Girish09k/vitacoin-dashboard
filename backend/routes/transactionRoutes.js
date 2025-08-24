const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Badge = require('../models/Badge');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Badge awarding helper function with monthly spending calculation
const checkAndAwardBadges = async (user, io) => {
  const badges = await Badge.find();

  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  const monthlySpendingTransactions = await Transaction.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(user._id),
        type: 'deduction',
        date: { $gte: startOfMonth, $lte: endOfMonth },
      }
    },
    { $group: { _id: null, totalSpent: { $sum: "$amount" } } }
  ]);

  const monthlySpending = monthlySpendingTransactions.length > 0 ? monthlySpendingTransactions[0].totalSpent : 0;

  for (const badge of badges) {
    if (user.badges.some(b => b.equals(badge._id))) continue;

    if (badge.name === 'Bronze Spender' && monthlySpending >= 100) {
      user.badges.push(badge._id);
      await user.save();
      io.to(user._id.toString()).emit('badgeEarned', { badge });
    } else if (badge.name === 'Silver Spender' && monthlySpending >= 500) {
      user.badges.push(badge._id);
      await user.save();
      io.to(user._id.toString()).emit('badgeEarned', { badge });
    } else if (badge.name === 'Gold Spender' && monthlySpending >= 1000) {
      user.badges.push(badge._id);
      await user.save();
      io.to(user._id.toString()).emit('badgeEarned', { badge });
    }
  }

  const vitacoinMasterBadge = badges.find(b => b.name === 'Vitacoin Master');
  if (
    vitacoinMasterBadge &&
    user.coinBalance >= 100 &&
    !user.badges.some(b => b.equals(vitacoinMasterBadge._id))
  ) {
    user.badges.push(vitacoinMasterBadge._id);
    await user.save();
    io.to(user._id.toString()).emit('badgeEarned', { badge: vitacoinMasterBadge });
  }
};

// Create a transaction
router.post('/', async (req, res) => {
  try {
    const { type, amount, description } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const transaction = new Transaction({ user: userId, type, amount, description });
    await transaction.save();

    if (type === 'earning') {
      user.coinBalance += amount;
    } else if (type === 'deduction') {
      user.coinBalance -= amount;
      if (user.coinBalance < 0) user.coinBalance = 0;
    }
    await user.save();

    const io = req.app.get('io');
    await checkAndAwardBadges(user, io);

    io.to(userId.toString()).emit('userUpdate', {
      coinBalance: user.coinBalance,
      newTransaction: transaction,
    });

    res.status(201).json({ transaction, coinBalance: user.coinBalance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all transactions for a user
router.get('/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.params.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
