'use strict';

/*
  Since this is designed for Android APP. 
  User authentication uses device UUID as user name
  User only need to enter password to authenticate
  Improves UX
*/
angular.module('geoappApp')
  .controller('UserCtrl', function ($scope, $rootScope, $http, md5) {
  	
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
                      console.log(data);
                      $scope.formSubmissionOutput = data;
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
