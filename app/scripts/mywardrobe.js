
var services = angular.module('myApp.services', []);

services.service('wardrobeService', function($http, $rootScope){

  this.uri = "http://localhost:8080/wardrobes";

  // GET /wardrobes
  this.getAllWardrobes = function() {
   
    $http.get(this.uri).
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

});

services.service('usersService', function($http, $rootScope) {

  this.uri = "http://localhost:8080/users";

  // GET /users
  this.getAllUsers = function() {
   
    $http.get(this.uri).
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

  // GET /users/{id}
  this.getUserByUsername = function() {

    var url_user = this.uri + "/search/findByUsername?username=" + $rootScope.user.username;
    console.log(url_user);

    return 
    $http.get(url_user).
        success(function(data, status, headers, config) {
          console.log(status);
          console.log(data);
          // this callback will be called asynchronously
          // when the response is available
          $rootScope.user = data._embedded.users[0];
        }).
        error(function(data, status, headers, config) {
          console.log(status);
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

  };

  // POST /users
  this.addUser = function() {

    $http.post(this.uri).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

  };

});