"use strict";


exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', table => {
    table.increments()
      .primary();
    table.string("user_name")
      .notNullable();
    table.string("password")
      .notNullable();
    table.dateTime("created_at")
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
