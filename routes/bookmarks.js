const express = require('express');
const bookmarkRoutes = express();
const Bookmark = require('../models/bookmarks');
const authenticator = require('../middleware/authenticator');

bookmarkRoutes.get('/getYourBookmarks/:id', async (req, res, next) => {
  try {
    const yourBookmarks = await Bookmark.find({ createdBy: req.params.id });
    res.status(200).json(yourBookmarks);
  } catch (error) {
    next(error);
  }
});

bookmarkRoutes.post('/createBookmarks', async (req, res, next) => {
  try {
    const { bookmarks, createdBy } = req.body;
    const newBookmark = new Bookmark({
      bookmarks,
      createdBy,
    });
    await newBookmark.save();
    res.status(201).json({ message: 'Bookmark Created Successfully!' });
  } catch (error) {
    next(error);
  }
});

module.exports = bookmarkRoutes;
