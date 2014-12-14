
var services = angular.module('myApp.services', []);

services.service('wardrobeService', function($http, $rootScope){

  this.uri = "http://localhost:8080/wardrobes";

  // GET /wardrobes
  this.getAllWardrobes = function($q, $http) {
    var deferred = $q.defer();
   
    $http.get(this.uri).
      success(function(data, status, headers, config) {
        console.log(status);
        // this callback will be called asynchronously
        // when the response is available
        deferred.resolve(data);
      }).
      error(function(data, status, headers, config) {
        console.log(status);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

      return deferred;
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
  this.getUserByUsername = function($q, $http) {
    var deferred = $q.defer();

    var url_user = this.uri + "/search/findByUsername?username=" + $rootScope.user.username;
    console.log(url_user);

     
    $http.get(url_user).
        success(function(data, status, headers, config) {
          console.log(status);
          console.log(data);
          // this callback will be called asynchronously
          // when the response is available
          $rootScope.user = data._embedded.users[0];
          deferred.resolve(data._embedded.users[0]);
        }).
        error(function(data, status, headers, config) {
          console.log(status);
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

    return deferred;
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