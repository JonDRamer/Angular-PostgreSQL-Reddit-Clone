exports.seed = function(knex, Promise) {

  const text1 = [
    "I love starting the weekend off by reflecting on what happened in the past week.",
  ].join("\n")

  const text2 = [
    "Ready for today's photo shoot!"
  ].join("\n\n")

  const text3 = [
    "Catching up on some overdue reading."
  ].join("\n\n")

  return knex('comments')
    .del()
    .then(() => knex('posts')
      .del())
    .then(function() {
      return Promise.all([
        createPost(
          'Weekend Vibes',
          text1,
          'Sarah',
          'https://images.pexels.com/photos/163187/coffee-tablet-headphones-work-163187.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb',
          new Date()
        ),
        createPost(
          'Gearing Up',
          text2,
          'Beto',
          'https://images.pexels.com/photos/28855/pexels-photo-28855.jpg?w=1260&h=750&auto=compress&cs=tinysrgb',
          new Date()
        ),
        createPost(
          "Hitting the books",
          text3,
          'Justin',
          'https://images.pexels.com/photos/267642/pexels-photo-267642.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb',
          new Date()
        ),
      ])
    })

  function createPost(title, body, author, image_url, created_at) {
    return knex('posts')
      .insert({
        title,
        body,
        author,
        image_url,
        created_at
      })
      .returning('id')
      .then(ids => ids[0])
  }
};
