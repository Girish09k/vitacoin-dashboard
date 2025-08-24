const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Badge = require('../models/Badge');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/progress', async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate('badges');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const allBadges = await Badge.find();

    const userBadges = user.badges.map(b => b._id.toString());

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlySpendingAgg = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          type: 'deduction',
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" }
        }
      }
    ]);

    const monthlySpending = (monthlySpendingAgg.length > 0) ? monthlySpendingAgg[0].totalSpent : 0;

    const badgeProgress = allBadges.map(badge => {
      const isEarned = userBadges.includes(badge._id.toString());
      let progress = 0;
      let total = 0;

      if (badge.name === "Bronze Spender") {
        total = 100;
        progress = Math.min(monthlySpending, total);
      } else if (badge.name === "Silver Spender") {
        total = 500;
        progress = Math.min(monthlySpending, total);
      } else if (badge.name === "Gold Spender") {
        total = 1000;
        progress = Math.min(monthlySpending, total);
      }

      if (badge.name === 'Vitacoin Master') {
        total = 100;
        progress = Math.min(user.coinBalance, total);
      }

      return {
        badge,
        isEarned,
        progress,
        total,
      };
    });

    res.json(badgeProgress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
