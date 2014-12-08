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

app.service('myWardrobeService', function($http, $rootScope) {
  
  this.api_uri = '';
  this.follows = [];
  this.tags = [];
  this.username = '';
  this.user_id = '';
  
  this.users = function() {

    var url_users = this.api_uri + "/users";

    $http.get(url_users).
      success(function(data, status, headers, config) {
        console.log(status);
        // this callback will be called asynchronously
        // when the response is available
      }).
      error(function(data, status, headers, config) {
        console.log(status);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

  };

  this.addUser = function() {

    var req = {
     method: 'POST',
     url: this.api_uri + "/users",
     headers: {
     //   'Access-Control-Allow-Origin': '*',
     //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
     //   'Access-Control-Allow-Headers': 'x-requested-with'
       },
     data: {
      "username": this.username, 
      "token": "31924338.be05542.bde471768f3d4f319afb07711c96ee1bd", 
      "firstName" : "firstName", 
      "secondName" : "secondName"},
    }

    $http(req).
      success(function(data, status, headers, config) {
        console.log(status);
        console.log(data);
        // this callback will be called asynchronously
        // when the response is available
      }).
      error(function(data, status, headers, config) {
        console.log(status);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  }

  this.user = function() {

    var url_user = this.api_uri;

    if(this.user_id && this.user_id != '') {
      url_user += "/users/" + this.user_id;
    }
    else if (this.username && this.username != ''){
      url_user += "/users/search/findByUsername?" + this.username;
    }

    var req = {
     method: 'GET',
     url: url_user,
     headers: {
     //   'Access-Control-Allow-Origin': '*',
     //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
     //   'Access-Control-Allow-Headers': 'x-requested-with'
       }
    }

    console.log(url_user);

    //var success =
    $http(req).
      success(function(data, status, headers, config) {
        console.log(status);
        console.log(data);

        if (status == 200) {
          var user = data;
          if (user.id && user.id != null) {
            this.user_id = user.id;
          }
          else {
            this.addUser();
          }
        }
        // this callback will be called asynchronously
        // when the response is available
      }).
      error(function(data, status, headers, config) {
        console.log(status);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  };
}); 

app.controller('appCtrl', function($scope, $http, $rootScope, $sessionStorage, myWardrobeService) {

  //$rootScope.myWardrobeService = new myWardrobe();

  $rootScope.oauth = {
    site : "https://instagram.com",
    client_id: "be05542e8e5b49fa91b74fcb3800af8e",
    redirect_uri : "http://localhost:8000/app",
    scope : "basic",
    response_type : "token"
  };

  myWardrobeService.api_uri = 'http://localhost:8080';

  $rootScope.loggedin = false;
  $rootScope.user = {
    id : "",
    username : "",
    token: ""
  };

  $sessionStorage.user = $rootScope.user;

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

      myWardrobeService.username = $rootScope.user.username;
      var tempUser = myWardrobeService.user();
      console.log(tempUser);
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

    var oauth = event.targetScope.oauth;
    var url = oauth.site + "/oauth/authorize";
    url += "?response_type=" + oauth.response_type;
    url += "&client_id=" + oauth.client_id;
    url += "&redirect_uri=" + encodeURIComponent(oauth.redirect_uri);
    url += "&scope=" + oauth.scope;

    window.location.replace(url);
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

