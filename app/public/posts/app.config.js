(function() {
  'use strict';

  angular.module('app', ['angularMoment', 'ui.router'])
    .config(config);

  config.$inject = ["$stateProvider", "$urlServiceProvider", "$locationProvider"];

  function config($stateProvider, $urlServiceProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $urlServiceProvider.rules.otherwise({
      state: 'home'
    });

    $stateProvider
      .state({
        name: 'home',
        url: '/home',
        component: 'reddit'
      })
      .state({
        name: 'editPost',
        url: '/edit/:id',
        component: 'edit'
      });
  }
}());
