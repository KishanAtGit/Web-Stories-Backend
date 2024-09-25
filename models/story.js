const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  category: String,
  slides: [
    {
      heading: String,
      description: String,
      imageURL: String,
      likes: Number,
    },
  ],
  createdBy: String,
  createdOn: String,
});

module.exports = mongoose.model('Story', storySchema);
