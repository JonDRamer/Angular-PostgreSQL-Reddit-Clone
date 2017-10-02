"use strict";

const express = require('express');
const router = express.Router();
const knex = require('../../db/knex');

router.get('/', (req, res, next) => {
  knex('posts')
    .then(posts => {
      return knex('comments')
        .whereIn('post_id', posts.map(p => p.id))
        .then((comments) => {
          const commentsByPostId = comments.reduce((result, comment) => {
            result[comment.post_id] = result[comment.post_id] || []
            result[comment.post_id].push(comment)
            return result
          }, {})
          posts.forEach(post => {
            post.comments = commentsByPostId[post.id] || []
          })
          res.json(posts)
        })
    })
    .catch(err => next(err))
})

router.post('/', (req, res, next) => {
  knex('posts')
    .insert(params(req))
    .returning('*')
    .then(posts => res.json(posts[0]))
    .catch(err => next(err))
})

router.get('/:id', (req, res, next) => {
  knex('posts')
    .where({
      id: req.params.id
    })
    .first()
    .then(post => res.json(post))
    .catch(err => next(err))
})

router.patch('/:id', (req, res, next) => {
  knex('posts')
    .update(params(req))
    .where({
      id: req.params.id
    })
    .returning('*')
    .then(posts => res.json(posts[0]))
    .catch(err => next(err))
})

router.delete('/:id', (req, res, next) => {
  knex('posts')
    .del()
    .where({
      id: req.params.id
    })
    .then(() => res.end())
    .catch(err => next(err))
})

router.post('/:id/votes', (req, res, next) => {
  knex('posts')
    .update('vote_count', knex.raw('vote_count + 1'))
    .where({
      id: req.params.id
    })
    .then(() => knex('posts')
      .where({
        id: req.params.id
      })
      .first())
    .then(post => res.json({
      vote_count: post.vote_count
    }))
    .catch(err => next(err))
})

router.delete('/:id/votes', (req, res, next) => {
  knex('posts')
    .update('vote_count', knex.raw('vote_count - 1'))
    .where({
      id: req.params.id
    })
    .then(() => knex('posts')
      .where({
        id: req.params.id
      })
      .first())
    .then(post => res.json({
      vote_count: post.vote_count
    }))
    .catch(err => next(err))
})

function params(req) {
  return {
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
    image_url: req.body.image_url,
    vote_count: req.body.vote_count
  }
}

module.exports = router;
