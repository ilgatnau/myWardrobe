'use strict';

var view1App = angular.module('myApp.view1', ['ngRoute']);

view1App.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'views/view1/view1.html',
    controller: 'View1Ctrl'
  });
}]);

view1App.controller('View1Ctrl', [function() {

}]);

view1App.controller('InstagramFollowsController', function($scope, Instagram) {
  $scope.instagram = new Instagram();
});