const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  slideId: String,
  createdBy: String,
});

module.exports = mongoose.model('Like', likeSchema);
