const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes below this line
router.use(authMiddleware);

// GET user profile using userId from authenticated token
router.get('/profile', async (req, res) => {
  try {
    // Use authenticated user ID from req.user set by authMiddleware
    const user = await User.findById(req.user.userId).populate('badges');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      email: user.email,
      phone: user.phone, // <-- Added phone field
      coinBalance: user.coinBalance,
      badges: user.badges,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile - protect route with authMiddleware
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, email, phone } = req.body; // <-- Added phone

    if (!username || !email || !phone) {
      return res.status(400).json({ message: 'Username, email and phone are required' });
    }

    // Check if the username or email is taken by other users
    const usernameTaken = await User.findOne({ username, _id: { $ne: userId } });
    if (usernameTaken) return res.status(400).json({ message: 'Username is already taken' });

    const emailTaken = await User.findOne({ email, _id: { $ne: userId } });
    if (emailTaken) return res.status(400).json({ message: 'Email is already taken' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = username;
    user.email = email;
    user.phone = phone; // <-- Updated phone
    await user.save();

    return res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
