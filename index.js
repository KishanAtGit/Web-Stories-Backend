const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const authenticator = require('./middleware/authenticator');
const storyRoutes = require('./routes/story');
const bookmarkRoutes = require('./routes/bookmarks');
const likesRoutes = require('./routes/likes');

const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/story', storyRoutes);
app.use('/api/bookmark', authenticator, bookmarkRoutes);
app.use('/api/likes', authenticator, likesRoutes);

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
  db()
    .then(() => console.log('Connected to DB'))
    .catch(err => console.log(err));
});
