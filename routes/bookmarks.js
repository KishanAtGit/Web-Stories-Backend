const express = require('express');
const bookmarkRoutes = express();
const Bookmark = require('../models/bookmarks');

bookmarkRoutes.get('/getYourBookmarks/:id', async (req, res, next) => {
  try {
    const yourBookmarks = await Bookmark.find({ createdBy: req.params.id });

    if (!yourBookmarks.length) {
      return res.status(404).json({ message: 'No bookmarks found' });
    }

    res.status(200).json(yourBookmarks[0].bookmarks);
  } catch (error) {
    next(error);
  }
});

bookmarkRoutes.post('/updateBookmark', async (req, res, next) => {
  try {
    const { bookmarksData, createdBy } = req.body;

    let existingBookmark = await Bookmark.findOne({ createdBy });

    if (existingBookmark) {
      const slideIndex = existingBookmark.bookmarks.findIndex(
        bookmark => bookmark.slideId === bookmarksData.slideId
      );

      if (slideIndex !== -1) {
        existingBookmark.bookmarks.splice(slideIndex, 1);
        await existingBookmark.save();
        return res
          .status(200)
          .json({ message: 'Bookmark removed successfully!' });
      } else {
        existingBookmark.bookmarks.push(bookmarksData);
        await existingBookmark.save();
        return res
          .status(201)
          .json({ message: 'Bookmark added successfully!' });
      }
    } else {
      const newBookmark = new Bookmark({
        bookmarks: [{ ...bookmarksData }],
        createdBy,
      });
      await newBookmark.save();
      return res.status(201).json({ message: 'Bookmark added successfully!' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = bookmarkRoutes;
