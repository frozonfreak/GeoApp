'use strict';

angular.module('geoappApp')
  .controller('RegisterCtrl', function ($scope, $rootScope, $http, md5) {

  	$scope.boolAllowRegistration = false;
  	$scope.boolGetUserLocation = false;

  	//Testing with hardcoded values
  	$scope.user = {
  					email:'test@test.com',
  					verifyEmail:'test@test.com',
  					pass:'12345',
  					verifyPass:'12345'
  					};
  	$scope.actionRegisterUser = function(){
  		if(typeof $scope.user.email !== 'undefined' &&
  			typeof $scope.user.verifyEmail !== 'undefined' &&
  			typeof $scope.user.pass !== 'undefined' &&
  			typeof $scope.user.verifyPass !== 'undefined' &&
  			$scope.user.email !== '' && 
  			$scope.user.verifyEmail !== '' && 
  			$scope.user.pass !== '' && 
  			$scope.user.verifyPass !== ''){

  			if($scope.email === $scope.verifyEmail && $scope.pass === $scope.verifyPass){
  				$scope.formSubmissionOutput = 'Register User in progress...';
          $scope.user.pass = md5.createHash($scope.user.pass);
  				$scope.user.verifyPass = md5.createHash($scope.user.verifyPass);

  				//Register User
  				$http.post('/api/user', { type: 'register',
                    key: $rootScope.key, 
                    uuid: $rootScope.uuid, 
  								 	email: $scope.user.email,
  								 	pass : $scope.user.pass ,
  								 	lat : $scope.lat,
  								 	lng : $scope.lng, 
  								 	accuracy: $scope.accuracy
  								 	}).success(function(data){
                      console.log(data);
                      $scope.formSubmissionOutput = data;
                    }).error(function(data){
                      console.log(data);
                    });
  			}
  			else{
  				$scope.formSubmissionOutput = 'Verification failed';
  			}	
  		}
  		else{
  			$scope.formSubmissionOutput = 'All fields needs to be defined';
  		}
  	};

  	$scope.actionGetUserLocation = function(){
  		$scope.boolGetUserLocation = false;
  		$scope.formSubmissionOutput = 'Retriving User Location...';
  		navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
  	};

    $scope.showPosition = function (position) {
        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;
        $scope.accuracy = position.coords.accuracy;
        $scope.boolGetUserLocation = true;
        $scope.formSubmissionOutput = '';
        $scope.$apply();
        
        //var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
        //$scope.model.myMap.setCenter(latlng);
        //$scope.myMarkers.push(new google.maps.Marker({ map: $scope.model.myMap, position: latlng }));
    };

    $scope.showError = function (error) {
    	$scope.boolGetUserLocation = false;
  		$scope.formSubmissionOutput = '';
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
    	//Check if browser supports geo location. Enable registration only if geolocation supported
    	//Else display error
    	if (navigator.geolocation) {
    		$scope.boolAllowRegistration = true;
    		
    	}
    	else{
    		$scope.boolAllowRegistration = false;
    	  	$scope.output = 'Browser does not support GeoLocation. Kindly try another browser. ';
    	}
    };

    //Initializer function
    $scope.init();
  });
