'use strict';

angular.module('geoappApp')
  .controller('AdminDashboardCtrl', function ($scope, $rootScope, $location, $http, $cookieStore, uiGmapGoogleMapApi, socket, md5) {
    
    //Set map center
    $scope.map = { center: { latitude: 1.3438218, longitude: 103.6798139 }, zoom: 8 };
    $scope.userMarkers = [];
    
    $http.get('/api/things').success(function(awesomeThings) {
      console.log(awesomeThings);
      $scope.userMarkers = awesomeThings;
      socket.syncUpdates('thing', $scope.userMarkers);
    }).error(function(data){
      console.log(data);
    });

    $scope.getUserDetailsFromServer = function(){
      $http.post('/api/user', { type: 'getUserLocationDetails',
                    key: $rootScope.key, 
                    session_id:$scope.sessionID
                    }).success(function(data){
                      if(data.success){
                        for(var i=0;i<data.data.length;i++){
                          $scope.tempObj = {
                                              id:i,
                                              latitude: data.data[i].lat, 
                                               longitude: data.data[i].lng,
                                               title:data.data[i].email,
                                               options: {
                                                  labelContent: data.data[i].email,
                                                  labelAnchor:"22 0",
                                                  labelClass:"marker-labels"
                                               } 
                                            };

                          $scope.userMarkers.push($scope.tempObj);  
                        }
                      }
                      else{
                        $scope.formSubmissionOutput = 'Invalid Session';  
                        $location.path('admin');
                      }
                      
                    }).error(function(data){
                      console.log(data);
                      $scope.formSubmissionOutput = data;
                    });
    };

    uiGmapGoogleMapApi.then(function(maps) {
      $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    });

    $scope.init= function(){
      //Check Session
      $scope.sessionID = $cookieStore.get('session');
      if($scope.sessionID != ''){
        $http.post('/api/user', { type: 'checkSession',
                    key: $rootScope.key, 
                    session_id:$scope.sessionID
                    }).success(function(data){
                      if(data.success){
                        $scope.formSubmissionOutput = 'Valid Session';  

                        $scope.getUserDetailsFromServer();
                      }
                      else{
                        $scope.formSubmissionOutput = 'Invalid Session';  
                        $location.path('admin');
                      }
                      
                    }).error(function(data){
                      console.log(data);
                      $scope.formSubmissionOutput = data;
                    });
      }
      else{
        $location.path('admin');
      }
    };

    //Initializer
    $scope.init();
  });
