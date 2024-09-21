const express = require('express');
const authRoutes = express();
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

//to register an User
authRoutes.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exist' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: 'User Registered Successfully' });
  } catch (error) {
    next(error);
  }
});

//to authenticate an user's credentials
authRoutes.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: 'Wrong username or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).json({ message: 'Wrong username or password' });
    } else {
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_TOKEN_SECRET_KEY
      );
      res
        .status(202)
        .header('auth-token', token)
        .json({ message: 'Logged in successfully!', token, userId: user._id });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = authRoutes;
