app.service('appService', ['$http', function ($http) {
    var app = {
      

        getwowsomeUsers: function(callback) {
            $http.get('/api/wowsomes')
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    callback(data);
                });
        },

        wowsomeUserDetails: function (email, callback) {
            $http.get('/api/wowsomes/' + email + '/userdetails')
                .success(function(data) {
                    callback(data);
                })
                .error(function(data) {
                    callback(data);
                });
        }
        

    };
    return {
        getwowSomeUsers: app.getwowsomeUsers,
        wowsomeUserDetail: app.wowsomeUserDetails
        };

}]);