'use strict';

var user_token;

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

app.factory('Reddit', function($http) {
  var Reddit = function() {
    this.items = [];
    this.busy = false;
    this.after = '';
  };

  Reddit.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;

    var url_feed = "https://api.instagram.com/v1/users/self/feed?access_token=" + user_token + "&jsonp=JSON_CALLBACK";
    url_feed += "&count=10&min_id=" + (this.items.length - 1);

    console.log(url_feed);

    var url = "http://api.reddit.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
    $http.jsonp(url).success(function(data) {
      var items = data.data.children;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i].data);
      }
      this.after = "t3_" + this.items[this.items.length - 1].id;
      this.busy = false;
    }.bind(this));
  };

  return Reddit;
});

app.config(['$provide', function($provide) {
  $provide.factory('instagramService', function() {

    console.log("instagramService created");
    return "instagramService created";
  });
}]);

app.controller('appCtrl', function($scope, $http, $rootScope) {
  $scope.loggedin = false;
  $scope.user = {
    id : "",
    username : "",
    token: ""
  };

  $scope.$on('oauth:login', function(event, token) {
    //"https://api.instagram.com/v1/users/self?access_token=" + token.access_token
    console.log('Authorized third party app with token', token.access_token);

    // Set global token value;
    user_token = token.access_token;
    $rootScope.user_token = token.access_token;

    var url = "https://api.instagram.com/v1/users/self?access_token=" + token.access_token + "&callback=JSON_CALLBACK";
    
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

      $scope.user.id = returnJsonp.data.id;
      $scope.user.username = returnJsonp.data.username;
      $scope.user.token = token.access_token;
      console.log($scope.user);
    });

  });

  $scope.$on('oauth:logout', function(event) {
    console.log('The user has signed out');
  });

  $scope.$on('oauth:denied', function(event) {
    console.log('The user did not authorize the third party app');
  });

  $scope.$on('oauth:expired', function(event) {
    console.log('The access token is expired. Please refresh.');
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
