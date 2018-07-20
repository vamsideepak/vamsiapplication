app.service('authenticateService', ['$http', function ($http) {
    var authenticate = {
        

        signUp: function (user, callback) {
            $http.post('/api/wowsome', user)
                .success(function (result) {
                    callback(result);
                })
                .error(function (err) {
                    callback(err);
                });
        },


        signIn: function (user, callback) {
            $http.post('/api/wowsomes/login', user)
                .success(function (result) {
                    callback(result);
                })
                .error(function (err) {
                    callback(err);
                });
        },

        signOut: function(user, callback) {
            $http.put('/api/wowsomes/logout', user)
                .success(function (result) {
                    callback(result);
                })
                .error(function (err) {
                    callback(err);
                });
        },
 
    };
    return {
       
        createUser: authenticate.signUp,
        signInUser: authenticate.signIn,
        signOutUser: authenticate.signOut, 
    };

}]);
