'use strict';

angular.module('geoappApp')
  .controller('AdminCtrl', function ($scope, $rootScope, $location, $http, $cookieStore, md5) {
  	
  	$scope.admin = {
  						email:'admin@admin.com',
  						pass:'12345'
  					};

  	$scope.actionLogin = function(){
      $scope.admin.pass = md5.createHash($scope.admin.pass);
      if(typeof $scope.admin.pass !== 'undefined' &&
      	typeof $scope.admin.email !== 'undefined' &&
      	$scope.admin.email !== '' &&
        $scope.admin.pass !== ''){

        $http.post('/api/user', { type: 'adminLogin',
                    key: $rootScope.key, 
                    email:$scope.admin.email,
                    pass : $scope.admin.pass 
                    }).success(function(data){
                      
                      $scope.formSubmissionOutput = data;
                      $cookieStore.put('session', data.session_id);
                      $location.path('admin/dashboard');
                    }).error(function(data){
                    	console.log(data);
                      $scope.formSubmissionOutput = data;
                    });
      }
  		else{
        $scope.formSubmissionOutput = 'Password not defined';
      }
  	};

  });
