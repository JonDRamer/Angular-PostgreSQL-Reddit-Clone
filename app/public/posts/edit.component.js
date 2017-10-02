(function() {
  "use strict";

  angular.module("app")
    .component("edit", {
      controller: controller,
      templateUrl: './edit.template.html'
    });

  controller.$inject = ['$http', '$stateParams', '$state'];

  function controller($http, $stateParams, $state) {
    const vm = this;
    vm.$onInit = function() {
      vm.form = false;

      $http.get(`/api/posts/${$stateParams.id}`)
        .then((result) => {
          vm.post = result.data;
          vm.post.showComments = true;
        });
    };

    vm.toggleForm = function() {
      if (!vm.form) {
        vm.form = true;
      } else if (vm.form) {
        vm.form = false;
      }
    };

    vm.updatePost = function() {
      vm.post.vote_count = 0;
      vm.post.created_at = new Date();
      vm.post.comments = [];
      $http.patch(`/api/posts/${$stateParams.id}`, vm.post)
        .then(() => {
          $state.go('home');
        });
      vm.toggleForm();
      vm.updatedPost.$setPristine();
    };

    vm.removePost = function() {
      $http.delete(`/api/posts/${$stateParams.id}`);
      delete vm.post;
      $state.go('home');
    };
  }
}());
