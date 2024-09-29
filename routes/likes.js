const express = require('express');
const likesRoutes = express();
const Story = require('../models/story');
const Like = require('../models/likes');

likesRoutes.get('/checkLiked', async (req, res, next) => {
  try {
    // Use req.query to access query parameters in a GET request
    const { createdBy, slideId } = req.query;

    const yourLikes = await Like.find({
      createdBy,
      slideId,
    });

    // Return response based on whether a like exists
    if (!yourLikes.length) {
      return res.status(200).json({ liked: false });
    } else {
      return res.status(200).json({ liked: true });
    }
  } catch (error) {
    next(error);
  }
});

likesRoutes.post('/updateLike', async (req, res, next) => {
  try {
    const { storyId, slideId, createdBy } = req.body;

    // Check if the user has already liked this slide
    const yourLikes = await Like.find({
      createdBy,
      slideId,
    });

    // If the like exists, remove it (dislike)
    if (yourLikes.length) {
      await Like.deleteOne({ _id: yourLikes[0]._id });

      // Find the story by storyId
      const story = await Story.findById(storyId);
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }

      // Find the slide within the story
      const slide = story.slides.find(slide => slide._id.equals(slideId));
      if (slide) {
        // Decrease the like count (ensure it does not go below 0)
        slide.likes = Math.max(slide.likes - 1, 0);
        await story.save();
      }

      return res.status(200).json({ message: 'Like removed successfully!' });
    }

    // Add a new like if it doesn't exist
    const newLike = new Like({
      slideId,
      createdBy,
    });
    await newLike.save();

    // Find the story and increment the like count for the slide
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const slide = story.slides.find(slide => slide._id.equals(slideId));
    if (slide) {
      slide.likes = (slide.likes || 0) + 1;
      await story.save();
    }

    res.status(201).json({ message: 'Like added successfully!' });
  } catch (error) {
    next(error);
  }
});

module.exports = likesRoutes;
