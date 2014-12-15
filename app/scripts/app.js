'use strict';

var API_BASE_URL = 'http://localhost:8080/';
var CONTENT_TAG = 'content';
var HREF_TAG = 'href';
var LINKS_TAG = 'links';
var GETLIST_OP = 'getList';
var EMBEDDED = '_embedded';

// Underscore must already be loaded on the page 
var underscore = angular.module('underscore', [])
  .factory('_', function() { 
    return window._;
  });


// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'oauth',
  'ngStorage',
  'infinite-scroll',
  'myApp.services',
  'underscore',
  'restangular',
  'spring-data-rest',
  'ngResource'
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

app.config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl(API_BASE_URL);

    RestangularProvider.setResponseExtractor(function(data, operation, route, url, response, deferred) {

      //console.log(data);
      //console.log(operation);
      //console.log(route);
      //console.log(url);
      //console.log(response);
      
      var returnData = data;
      if(operation == GETLIST_OP && CONTENT_TAG in data) {
        console.log("operation == GETLIST_OP && CONTENT_TAG in data");

        for(var i = 0; i < data[CONTENT_TAG].length; i++) {
          data[CONTENT_TAG][i][HREF_TAG] = data[CONTENT_TAG][i][LINKS_TAG][0][HREF_TAG];
          delete data[CONTENT_TAG][i][LINKS_TAG];
        }
        returnData = data[CONTENT_TAG];
        delete data[CONTENT_TAG];
        for(var key in data) {
          returnData[key] = data[key];
        }
      }

      if (operation == GETLIST_OP && EMBEDDED in data) {
        console.log("operation == GETLIST_OP && EMBEDED in data");
        returnData = data[EMBEDDED][route];
      }

      //console.log(returnData);
      return returnData;
    });
});


app.config(function (SpringDataRestInterceptorProvider) {
    SpringDataRestInterceptorProvider.apply();
});


app.controller('appCtrl', function($scope, $http, $rootScope, $sessionStorage, usersService, Restangular, SpringDataRestAdapter) {

  $rootScope.oauth = {
    site : "https://instagram.com",
    client_id: "be05542e8e5b49fa91b74fcb3800af8e",
    redirect_uri : "http://localhost:8000/app",
    scope : "basic",
    response_type : "token"
  };

  //myWardrobeService.api_uri = 'http://localhost:8080';

  $rootScope.loggedin = false;
  $rootScope.user = {
    id : null,
    username : null,
    token : null,
    wardrobes : []
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
 
      $rootScope.user.id = returnJsonp.data.id;
      $rootScope.user.username = returnJsonp.data.username;
      $rootScope.user.token = token.access_token;

      //console.log($rootScope.user.id);
      //console.log($rootScope.user.token);

      var returnUserPromise = usersService.getUserByUsername($rootScope.user.username);

      returnUserPromise.then(
        function(returnUser) {
          console.log(returnUser);
          if (returnUser._embeddedItems && returnUser._embeddedItems.length == 1) {
            $rootScope.user = returnUser._embeddedItems[0];
            $rootScope.user.location = $rootScope.user._links.self.href;
            console.log($rootScope.user);
          }
          else {
            var user = {
              username : $rootScope.user.username
            };
            var returnUserLocation = usersService.addUser(user);
            returnUserLocation.then(
              function(location) {
                console.log(location);
                $rootScope.user.location = location;
                //$rootScope.user._links.self.href = location;
              }
            );

          }
        }
      );


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

