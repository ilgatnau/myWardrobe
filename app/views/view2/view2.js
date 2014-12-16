'use strict';

angular.module('myApp.inspirations', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/inspirations', {
    templateUrl: 'views/view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', [function() {

}]);

view1App.controller('InstagramFeedController', function($scope, Instagram) {
  $scope.instagram = new Instagram();
});