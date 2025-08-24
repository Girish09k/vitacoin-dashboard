const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Public leaderboard - top 10 by coin balance
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .populate('badges')
      .sort({ coinBalance: -1 })
      .limit(10);

    const leaderboard = users.map(user => ({
      _id: user._id,
      username: user.username,
      coinBalance: user.coinBalance,
      badgesCount: user.badges.length,
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Authenticated user rank & personalized view
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().populate('badges').sort({ coinBalance: -1 });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      _id: user._id,
      username: user.username,
      coinBalance: user.coinBalance,
      badgesCount: user.badges.length,
    }));

    const myStats = leaderboard.find(entry => entry._id.toString() === req.user.userId);

    res.json({ myStats, top10: leaderboard.slice(0, 10) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
