'use strict';

/*
  Since this is designed for Android APP. 
  User authentication uses device UUID as user name
  User only need to enter password to authenticate
  Improves UX
*/
angular.module('geoappApp')
  .controller('LoginCtrl', function ($scope, $rootScope, $location, $http, md5) {
  	
  	$scope.pass = '12345';

  	$scope.actionLogin = function(){
      $scope.pass = md5.createHash($scope.pass);
      if(typeof $scope.pass !== 'undefined' &&
        $scope.pass !== ''){

        $http.post('/api/user', { type: 'login',
                    key: $rootScope.key, 
                    uuid: $rootScope.uuid, 
                    pass : $scope.pass 
                    }).success(function(data){
                      
                      $scope.formSubmissionOutput = data;
                      $location.path('user');
                    }).error(function(data){
                      console.log(data);
                    });
      }
  		else{
        $scope.formSubmissionOutput = 'Password not defined';
      }
  	};


    //$http.post('/api/things', { name: $scope.newThing });
  });
