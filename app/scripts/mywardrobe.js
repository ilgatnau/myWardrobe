
var services = angular.module('myApp.services', [])

.service('usersService', function($http, $rootScope) {

  this.uri = "http://localhost:8081/users";

  this.follows = [];
  this.tags = [];

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
  this.getUser = function() {

    var url_user = this.uri + "/" + $rootScope.user.id;

    return
      $http.get(url_user).
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