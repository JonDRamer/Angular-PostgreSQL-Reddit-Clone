"use strict";


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
require('dotenv')
  .load();

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('tiny'));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  // keys: [
  //   process.env.SESSION_KEY1,
  //   process.env.SESSION_KEY2,
  //   process.env.SESSION_KEY3
  // ],
  secret: 'userId',
  maxAge: 24 * 60 * 60 * 1000
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/../', 'node_modules')));

app.use('/api/posts', require('./routes/posts'));
app.use('/api/posts', require('./routes/comments'));
app.use('/api/users', require('./routes/users'));


app.use('*', (req, res) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, 'public'),
  });
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;;
