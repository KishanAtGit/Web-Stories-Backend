const mongoose = require('mongoose');
const bookmarkSchema = new mongoose.Schema({
  bookmarks: [
    {
      heading: String,
      description: String,
      imageURL: String,
      likes: Number,
    },
  ],
  createdBy: String,
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
