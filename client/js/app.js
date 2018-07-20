
var app = angular.module('WoWsome', ['ngRoute', 'ngResource','ngSanitize','toaster','ngIdle','ui.bootstrap']);

// configure our routes
app.config(function ($routeProvider) {
    $routeProvider
    // .when('/', {
    //     templateUrl: '/client/views/signin_up/landingpage.html',
    // })
        .when('/signIn', {
            templateUrl: '/client/views/signin_up/sign.in.html',
            controller: 'SignInController'
        })
        .when('/signUp', {
            templateUrl: '/client/views/signin_up/sign.up.html',
            controller: 'SignUpController'
        })
        .when('/forbidden', {
            templateUrl: '/client/views/wowuser/forbidden.html'
        })
        .when('/dashboard', {
            templateUrl: '/client/views/wowuser/dashboard.html',
            controller: 'wowsomeUserController'
        })

});

// configure interceptor to send add toke in required requests
app.config(function ($httpProvider, $windowProvider) {
    // alternatively, register the interceptor via an anonymous factory
    $httpProvider.interceptors.push(function ($q, $window) {
        return {
            'request': function (config) {
                if ($window.localStorage.token) {
                    config.headers['x-access-token'] = $window.localStorage.token;
                }
                return config;
            },

            'response': function (response_config) {
                if (response_config.headers()["x-access-token"]) {
                    $window.localStorage.token = response_config.headers()["x-access-token"];
                    
                }
                return response_config;
            },
            'responseError': function (rejection) {
                if (rejection.status == 403) {
                    var i = localStorage.length;
                    while (i--) {
                        var key = localStorage.key(i);
                        localStorage.removeItem(key);
                    }
                    $window.location.href = "#forbidden";
                    if (rejection.data.error.show_error) {
                       
                    }
                }
                return $q.reject(rejection);
            }
        };
    });
});

app.run(function($rootScope) {
	$rootScope.Math = window.Math;

});
// This code is for session timeout
app.config(function(IdleProvider, KeepaliveProvider) {
    IdleProvider.idle(900); // in seconds
    IdleProvider.timeout(300); // in seconds
    IdleProvider.interrupt('mousedown touchstart');
});