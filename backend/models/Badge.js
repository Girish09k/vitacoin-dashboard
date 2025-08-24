const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  criteria: String,  // criteria description or logic
  iconUrl: String,   // URL to badge icon image
});

module.exports = mongoose.model('Badge', BadgeSchema);

