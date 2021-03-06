'use strict';

angular.module('myApp.home', ['ngRoute', 'jQuery'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'views/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', function($scope, jQuery) {
  $scope.localWeather = null;
  $scope.weather = null;

  jQuery(document).ready(function() {
    loadWeather('San Juan Despi',''); //@params location, woeid
  });

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position.coords.latitude+','+position.coords.longitude);
      console.log(position);
    });
  }

});

// Docs at http://simpleweatherjs.com

/* Does your browser support geolocation? */
if ("geolocation" in navigator) {
  $('.js-geolocation').show(); 
} else {
  $('.js-geolocation').hide();
}

/* Where in the world are you? */
$('.js-geolocation').on('click', function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
  });
});


function loadWeather(location, woeid) {
  $.simpleWeather({
    location: location,
    woeid: woeid,
    unit: 'c',
    success: function(weather) {
      var html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
      html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
      html += '<li class="currently">'+weather.currently+'</li>';
      html += '<li>'+weather.alt.temp+'&deg;C</li></ul>';  
      
      $("#weather").html(html);
      $("#linkWeather").val(weather.code).change();

      //$scope.weather = weather.code;
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });


}
