const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Stub for password reset request (send link)
router.post('/request-reset', async (req, res) => {
  const { username } = req.body;
  // Normally here you would generate a reset token, save it and email the user.
  // For demo, just check user exists.
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Send email logic here (omitted)

    res.json({ message: 'Password reset instructions sent to registered email (simulated)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


