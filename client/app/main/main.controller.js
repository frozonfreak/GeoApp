'use strict';

angular.module('geoappApp')
  .controller('MainCtrl', function ($scope, $http, $location, socket) {
    $scope.awesomeThings = [];
    $scope.lat = '0';
    $scope.lng = '0';
    $scope.accuracy = '0';
    $scope.error = '';
    $scope.model = { myMap: undefined };
    $scope.myMarkers = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.actionLogin = function(){
      $location.path('login');
    };
    
    $scope.actionRegister = function(){
      $location.path('register');
    };

    $scope.actionAdminLogin = function(){
      $location.path('admin');
    };

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.showResult = function () {
        return $scope.error === '';
    };

    $scope.mapOptions = {
        //center: new google.maps.LatLng($scope.lat, $scope.lng),
        //zoom: 15,
        //mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.showPosition = function (position) {
        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;
        $scope.accuracy = position.coords.accuracy;
        $scope.$apply();

        //var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
        //$scope.model.myMap.setCenter(latlng);
        //$scope.myMarkers.push(new google.maps.Marker({ map: $scope.model.myMap, position: latlng }));
    };

    $scope.showError = function (error) {
         switch (error.code) {
             case error.PERMISSION_DENIED:
                 $scope.error = 'User denied the request for Geolocation.';
                 break;
             case error.POSITION_UNAVAILABLE:
                 $scope.error = 'Location information is unavailable.';
                 break;
             case error.TIMEOUT:
                 $scope.error = 'The request to get user location timed out.';
                 break;
             case error.UNKNOWN_ERROR:
                 $scope.error = 'An unknown error occurred.';
                 break;
         }
         $scope.$apply();
     };
    $scope.init = function(){
      /*if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
      }
      else{
        console.log('Geolocation not supported');
      }*/
    };

    //Initializer
    $scope.init();
  });
