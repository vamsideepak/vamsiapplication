app.controller('wowsomeUserController', ['$scope', '$location', 'appService', 'authenticateService','toaster', 'Idle','$uibModal',
    function ($scope,  $location, appService, authenticateService,toaster,Idle, $uibModal) {   
        Idle.watch();   
        //$scope.wowSomeUsers = []
        if(window.localStorage.email != undefined && window.localStorage.token != undefined){
            $location.path('/dashboard')
        }
      else  if(window.localStorage.email == undefined && window.localStorage.token == undefined){
            $location.path('/signIn')
        }
            // appService.getwowSomeUsers(function (response) {
            //     $scope.wowSomeUsers = response.data;
            // });

            $scope.getUserDetails = function() {
                $scope.email = window.localStorage.email
                $scope.wowSomeUsers = []
                appService.wowsomeUserDetail($scope.email, function(response) {
                    if (response.error) {
                        toaster.pop('error','Something Went wrong')
                    } else if(response.success){
                       
                        $scope.wowSomeUsers.push(response.data); 
                        $scope.wowname = response.data.name
                    }
                });
            }
            $scope.getUserDetails();


            $scope.logoutUser = {
                email:''
            }

            $scope.signOut = function() {
                
                $scope.logoutUser.email = window.localStorage.email
                authenticateService.signOutUser($scope.logoutUser, function(response) {
                    if (response.error) {
                        
                    } else if(response.success){

                        var i = localStorage.length;
                        while (i--) {
                            var key = localStorage.key(i);
                            localStorage.removeItem(key);
                        }
                        toaster.pop('success','Successfully LoggedOut')
                        $location.path("/signIn");
                        Idle.unwatch();

                    }
                });
            }

                  /************************IDLE TIMER CODE STARTS HERE***************************/
                  function closeModals() {
                    if ($scope.warning) {
                        $scope.warning.close();
                        $scope.warning = null;
                    }
    
                    if ($scope.timedout) {
                        $scope.timedout.close();
                        $scope.timedout = null;
                    }
                }
    
                $scope.$on('IdleStart', function () {
                    closeModals();
                    $scope.warning = $uibModal.open({
                        templateUrl: 'warning-dialog.html',
                        windowClass: 'modal-danger'
                    });
                });
    
                $scope.$on('IdleEnd', function () {
                    closeModals();
                    
                });
    
                $scope.$on('IdleTimeout', function () {
                    closeModals();
                    $scope.timedout = $uibModal.open({
                        templateUrl: 'timedout-dialog.html',
                        windowClass: 'modal-danger'
                    });
                    timeout = true;
                    Idle.unwatch();
                    $scope.signOut();
                });
    
       
    } 
]);
