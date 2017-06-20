(function() {
  "use strict";

  angular.module("app")
    .component("reddit", {
      controller: controller,
      templateUrl: '../posts/home.template.html'
    });

  controller.$inject = ['$http'];

  function controller($http) {
    const vm = this;

    vm.$onInit = function() {
      vm.form = false;
      vm.sortBy = "-created_at";

      $http.get("/api/posts")
        .then((posts) => {
          vm.posts = posts.data;
        });
    };

    vm.createPost = function() {
      vm.post.showComments = true;
      vm.post.vote_count = 0;
      vm.post.created_at = new Date();
      vm.post.comments = [];
      $http.post("/api/posts", vm.post)
        .then(() => {
          $http.get('/api/posts')
            .then((posts) => {
              vm.posts = posts.data;
            });
        });
      vm.toggleForm();
      delete vm.post;
      vm.newPost.$setPristine();
    };

    vm.removePost = function(post) {
      $http.delete(`/api/posts/${post.id}`)
        .then(() => {
          $http.get('/api/posts')
            .then((response) => {
              vm.posts = response.data;
            });
        });
    };

    vm.addComment = function(post) {
      console.log(post.comments.newComment);
      $http.post(`/api/posts/${post.id}/comments`, post.comments.newComment)
        .then(() => {
          $http.get("/api/posts")
            .then((posts) => {
              vm.posts = posts.data;
              vm.posts.forEach((post) => {
                post.showComments = true;
              });
            });
        });
      delete post.comments.newComment;
    };

    vm.removeComment = function(post, comment) {
      $http.delete(`/api/posts/${post.id}/comments/${comment.id}`)
        .then(() => {
          $http.get(`/api/posts/${post.id}/comments`)
            .then((response) => {
              post.comments = response.data;
            });
        });
    };

    vm.toggleComments = function(post) {
      post.showComments = !post.showComments;
    };

    vm.toggleForm = function() {
      if (!vm.form) {
        vm.form = true;
      } else if (vm.form) {
        vm.form = false;
      }
    };

    vm.upVote = function(post) {
      post.vote_count++;
      $http.patch(`/api/posts/${post.id}`, post)
        .then(() => {
          $http.get("/api/posts")
            .then((posts) => {
              vm.posts = posts.data;
            });
        });
    };

    vm.downVote = function(post) {
      if (post.vote_count > 0) {
        post.vote_count--;
      }
      $http.patch(`/api/posts/${post.id}`, post)
        .then(() => {
          $http.get("/api/posts")
            .then((posts) => {
              vm.posts = posts.data;
            });
        });
    };
  }
}());
