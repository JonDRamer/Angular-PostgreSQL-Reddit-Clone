dropdb reddit-clone --if-exists
dropdb reddit-clone-test --if-exists

createdb reddit-clone
createdb reddit-clone-test

knex migrate:latest --knexfile app/knexfile.js
knex migrate:latest --env test --knexfile app/knexfile.js

knex seed:run --knexfile app/knexfile.js
