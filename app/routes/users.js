"use strict";

const express = require('express');
const router = express.Router();
const knex = require('../db');
const bcrypt = require('bcryptjs');

//  REGISTRATION ROUTE
router.route('/signup')
  .post((req, res, next) => {
    if (req.body.user_name.trim() && req.body.password.trim()) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      knex('users')
        .insert({
          user_name: req.body.user_name,
          password: hash
        })
        .returning('id')
        .then((id) => {
          return knex('users')
            .where('id', id[0])
            .first();
        })
        .then((user) => {
          //You should log them in here before creating the session
          req.session.userId = user.id;
          res.json(req.session);
        })
        .catch((err) => {
          next(new Error(err));
        });
    } else {
      res.send('Username and password required');
    }
  });

router.route('/login')
  .get((req, res) => {
    // res.render('auth/login');
  })
  .post((req, res) => {
    knex('users')
      .where('user_name', req.body.user_name)
      .first()
      .then((user) => {
        if (user) {
          let matches = bcrypt.compareSync(req.body.password, user.password);
          if (matches) {
            req.session.user_id = user.id;
            res.json(req.session);
          }
        } else {
          res.send("Invalid username");
        }
      })
      .catch(err => {
        res.locals.error = err
        res.send(err);
      });
  });

router.route('/logout')
  .post((req, res) => {
    // req.session = null;
    res.json(req.session);
    // res.redirect('/');
  });

module.exports = router;
