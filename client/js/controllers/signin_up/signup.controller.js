app.controller('SignUpController', ['$scope', '$controller',  'authenticateService', '$location', 'toaster',
    function ($scope, $controller,  authenticateService,  $location, toaster ) {

            $scope.registerUser = {
                name: '',
                email: '',
                password: '',
                address:'',
                phone_number: ''
            };
/**
 * User Signup
*/
            $scope.signUp = function () {
                authenticateService.createUser($scope.registerUser, function (response) {
                    if (response.success == true) {
                        toaster.pop('success',' Registration Successfull')
                        $location.path('/signIn')
                        $scope.successMsg = response.message
                    }
                    else {
                        if(response.success == false){
                            $scope.errorMessage = response.message
                            toaster.pop('error', $scope.errorMessage)
                        }
                    }
                });

            };

           

          
    }
]);