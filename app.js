"use strict";


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const port = process.env.PORT || 3000;

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('tiny'));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, 'app/public')));
app.use(express.static(path.join(__dirname, '/./', 'node_modules')));


app.get('/', (req, res) => {
  res.render('index.html')
})

app.use('/api/posts', require('./app/routes/posts'));
app.use('/api/posts', require('./app/routes/comments'));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
