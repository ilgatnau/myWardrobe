'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'views/view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', [function() {

}]);

view1App.controller('InstagramFeedController', function($scope, $rootScope, Instagram) {
	console.log($rootScope.user_id);
  console.log($rootScope.user_token);
  $scope.instagram = new Instagram();
  
});