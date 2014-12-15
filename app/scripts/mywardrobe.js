
var services = angular.module('myApp.services', [
  'spring-data-rest',
  'ngResource'  
  ]);

services.service('wardrobeService', function($q, $http, $rootScope, SpringDataRestAdapter){

  this.uri = "http://localhost:8080/wardrobes";

  // GET /wardrobes
  this.getAllWardrobes = function() {
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

services.service('usersService', function($q, $http, $rootScope, SpringDataRestAdapter) {

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
  this.getUserByUsername = function(username) {
    var deferred = $q.defer();
    var url_user = this.uri + "/search/findByUsername?username=" + username;

    $http.get(url_user).
        success(function(data, status, headers, config) {
          var processedResponse = data;
          //var processedResponse = SpringDataRestAdapter.process(data);
          deferred.resolve(processedResponse);
        }).
        error(function(data, status, headers, config) {
          console.log(status);
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

    return deferred.promise;
  };

  // POST /users
  this.addUser = function(user) {
    var deferred = $q.defer();

    var req = {
     method: 'POST',
     url: this.uri,
     data: { username: user.username },
    }

    $http(req).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        deferred.resolve(headers("Location"));
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

      return deferred.promise;
  };

});