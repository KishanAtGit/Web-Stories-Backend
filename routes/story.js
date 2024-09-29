const express = require('express');
const storyRoutes = express();
const Story = require('../models/story');
const authenticator = require('../middleware/authenticator');

storyRoutes.get('/getAllStories', async (req, res, next) => {
  try {
    const stories = await Story.find();
    res.status(200).json(stories);
  } catch (error) {
    next(error);
  }
});

storyRoutes.get(
  '/getYourStories/:id',
  authenticator,
  async (req, res, next) => {
    try {
      const yourStories = await Story.find({ createdBy: req.params.id });
      res.status(200).json(yourStories);
    } catch (error) {
      next(error);
    }
  }
);

storyRoutes.post('/create', authenticator, async (req, res, next) => {
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

storyRoutes.patch('/update/:storyId', authenticator, async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { category, slides } = req.body;
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    story.category = category;
    story.slides = slides;
    await story.save();
    res.status(200).json({ message: 'Story updated successfully', story });
  } catch (error) {
    next(error);
  }
});

module.exports = storyRoutes;
