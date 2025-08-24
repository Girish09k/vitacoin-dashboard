const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Ticket = require('../models/Ticket');

router.use(authMiddleware);

// Create a new ticket
router.post('/', async (req, res) => {
  try {
    const { subject, description } = req.body;
    const ticket = new Ticket({
      user: req.user.userId,
      subject,
      description,
    });
    await ticket.save();
    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all tickets for logged in user
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


