const express = require('express');
const storyRoutes = express();
const Story = require('../models/story');

storyRoutes.post('/create', async (req, res, next) => {
  try {
    const { category, slides, createdBy, createdOn } = req.body;
    const newStory = new Story({
      category,
      slides,
      createdBy,
      createdOn,
    });
    await newStory.save();
    res.status(201).json({ message: 'Story Created Successfully!' });
  } catch (error) {
    next(error);
  }
});

module.exports = storyRoutes;
