"use strict";


exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', table => {
    table.increments()
    table.string("title")
      .notNullable()
    table.text("body")
      .notNullable()
    table.string("author")
      .notNullable()
    table.string("image_url")
      .notNullable()
    table.integer("vote_count")
      .defaultTo(0)
      .notNullable()
    table.integer("user_id")
      .index()
      .references("id")
      .inTable("users")
      .onDelete("cascade")
    table.dateTime("created_at")
      .notNullable()
      .defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts')
}
