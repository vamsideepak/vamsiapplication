app.controller('SignInController', ['$scope', '$controller', 'authenticateService',  '$location','toaster', 'Idle',  
    function($scope, $controller, authenticateService,  $location, toaster, Idle) {
        
        if(window.localStorage.email != undefined && window.localStorage.token != undefined){
            $location.path('/dashboard')
        }
            $scope.loginUser = {
                email: '',
                password: ''
            };
           
            $scope.signIn = function() {
                authenticateService.signInUser($scope.loginUser, function(response) {
                    if (response.success) {
                        Idle.watch();
                        $scope.user = {}
                        var user = response.data
                        window.localStorage.email =  user.email
                        window.localStorage.token =  user.token
                        toaster.pop('info',"Hey, Welcome to WOWSOME!");
                        $location.path("/dashboard");
                        
                    } else {
                        toaster.pop('error',response.message);
                        $scope.error = response.message;
                        $scope.errorClass = "alert alert-danger";
                        
                    }
                });
            };
       
    }
]);
