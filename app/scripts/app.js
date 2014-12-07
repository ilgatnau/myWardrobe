'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'oauth',
  'ngStorage',
  'infinite-scroll'
]);

app.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache'; 
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);

app.controller('appCtrl', function($scope, $http, $rootScope, $sessionStorage) {

  $rootScope.loggedin = false;
  $rootScope.user = {
    id : "",
    username : "",
    token: ""
  };

  $scope.$on('oauth:login', function(event, token) {
    //"https://api.instagram.com/v1/users/self?access_token=" + token.access_token
    console.log('Authorized third party app with token', token.access_token);

    // Set global token value;
    $rootScope.user.token = token.access_token;

    var url = "https://api.instagram.com/v1/users/self?access_token=" + $rootScope.user.token + "&callback=JSON_CALLBACK";
    
    //Access-Control-Allow-Origin error, required jsonp requests

    //$http.get(url).success(function(data) {
    //  $scope.user.instagram.id = data.counts.id;
    //  $scope.user.instagram.username = data.username;
    //  $scope.user.instagram.token = data.counts.token.access_token;
    //  console.log($scope.user);
    //});

    $http.jsonp(url)
        .success(function(returnJsonp){
            console.log(returnJsonp);

      $rootScope.user.id = returnJsonp.data.id;
      $rootScope.user.username = returnJsonp.data.username;
      $rootScope.user.token = token.access_token;

      console.log($rootScope.user.id);
      console.log($rootScope.user.token);
    });

  });

  $scope.$on('oauth:logout', function(event) {
    console.log('The user has signed out');

    $rootScope.user.token = null;
  });

  $scope.$on('oauth:denied', function(event) {
    console.log('The user did not authorize the third party app');
    $rootScope.user.token = null;
  });

  $scope.$on('oauth:expired', function(event) {
    console.log(event.targetScope.user.token)
    var url = "https://api.instagram.com/v1/users/self?access_token=" + event.targetScope.user.token + "&callback=JSON_CALLBACK";
    console.log(url);
    //window.location.replace(url);
  });

  $scope.$on('oauth:profile', function(profile) {
    console.log('User profile data retrieved: ', profile);
  });
});

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});

  $routeProvider.when('/access_token=:accessToken', {
      template: '',
      controller: function ($location, AccessToken) {
        var hash = $location.path().substr(1);
        AccessToken.setTokenFromString(hash);
        $location.path('/');
        $location.replace();
      }
    })
}]);

$(document).ready(function() {
    $.scrollUp({
        animation: 'fade',
        activeOverlay: '#00FFFF',
        scrollImg: {
            active: true,
            type: 'background',
            src: 'img/top.png'
        }
    });
});