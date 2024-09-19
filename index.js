const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/get', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
