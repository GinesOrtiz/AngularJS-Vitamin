var API_base = 'http://localhost:3000/';
var API_paths = {
    login : 'user/login',
    passwordRecovery : 'user/recovery'
};

function buildURL(path){
    return API_base + API_paths[path];
}

function loadPermissions(Permission, UserFactory){
    Permission.defineRole('anonymous', function () {
        return !UserFactory.getUser();
    });

    Permission.defineRole('user', function () {
        if(angular.isDefined(UserFactory.getUser())){
            if(UserFactory.getUser().role === 'user'){
                return true;
            }
        }
    });

    Permission.defineRole('administrator', function () {
        if(angular.isDefined(UserFactory.getUser())){
            if(UserFactory.getUser().role === 'administrator'){
                return true;
            }
        }
    });
}


function tmpData($rootScope) {
    var tmpDataObject = {};
    $rootScope.tmpData = function (method, key, value) {
        switch (method) {
            case 'add' :
                tmpDataObject[key] = value;
                break;
            case 'remove' :
                delete tmpDataObject[key];
                break;
            case 'get' :
                return tmpDataObject[key];
                break;
        }
    };
}
"use strict";

(function () {
    angular
        .module('angularJS-Vitamin', [
            'ui.router',
            'ngAnimate',
            'ngStorage',
            'permission',
            'angular-loading-bar',
            'ngSanitize',
            'jm.i18next',
            'tmh.dynamicLocale',

            'angularJS-Vitamin.auth',
            'angularJS-Vitamin.dashboard',
            'angularJS-Vitamin.components'
        ])
        .config(appConfig)
        .run(appRun);


    appConfig.$invoke = ['$locationProvider', '$i18nextProvider', 'cfpLoadingBarProvider', '$urlRouterProvider', 'tmhDynamicLocaleProvider'];
    function appConfig($locationProvider, $i18nextProvider, cfpLoadingBarProvider, $urlRouterProvider, tmhDynamicLocaleProvider) {
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get("$state");
            $state.transitionTo('login');
        });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $i18nextProvider.options = {
            lng: 'es',
            useCookie: false,
            useLocalStorage: false,
            resGetPath: '/assets/locale/es.json',
            defaultLoadingValue: ''
        };

        cfpLoadingBarProvider.includeSpinner = false;

        tmhDynamicLocaleProvider.localeLocationPattern('/angular/i18n/angular-locale_{{locale}}.js');
    }

    appRun.$invoke = ['permission', 'UserFactory', '$rootScope', '$http', 'tmhDynamicLocale'];
    function appRun(Permission, UserFactory, $rootScope, $http, tmhDynamicLocale) {
        $rootScope.$on('$stateChangePermissionStart', function (event, args) {
            var reqPerms = args.data.permissions;
            var anonymousUser = angular.isDefined(reqPerms.only) && reqPerms.only[0] === 'anonymous';
            var locale = (navigator.language || navigator.userLanguage).split('-')[0];

            $rootScope.layoutTemplate = '/layouts/' + args.data.template + '.html';

            // If not anonymous user put Auth header
            if (!anonymousUser) {
                $http.defaults.headers.common['x-auth-token'] = UserFactory.getUserToken();
                locale = UserFactory.getUser().locale;
            }

            tmhDynamicLocale.set(locale);
        });

        loadPermissions(Permission, UserFactory);
        tmpData($rootScope);
    }
}());
"use strict";
(function () {
    angular
        .module('angularJS-Vitamin.auth', [])
        .config(authConfig);

    authConfig.$invoke = ['$urlRouterProvider', '$stateProvider'];
    function authConfig($urlRouterProvider, $stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: '/features/auth/login/login.tpl.html',
                controller: 'LoginController',
                data: {
                    template: 'empty',
                    permissions: {
                        only: ['anonymous'],
                        redirectTo: 'dashboard'
                    }
                }
            })
            .state('logout', {
                url: '/logout',
                controller: function ($state, UserFactory) {
                    UserFactory.doLogout();
                    $state.go('login');
                },
                data: {
                    template: 'empty',
                    permissions: {
                        except: ['anonymous'],
                        redirectTo: 'dashboard'
                    }
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: '/features/auth/signup/signup.tpl.html',
                controller: 'SignupController',
                data: {
                    template: 'empty',
                    permissions: {
                        only: ['anonymous'],
                        redirectTo: 'dashboard'
                    }
                }
            })
    }
}());
"use strict";
(function () {
    angular
        .module('angularJS-Vitamin.components', [])
        .directive('vitHeader', vitHeader)
        .directive('roleAuth', roleAuth);

    function vitHeader() {
        return {
            restrict: 'E',
            templateUrl: '/features/components/header/header.tpl.html',
            controller: 'HeaderComponentController'
        }
    }

    function roleAuth(UserFactory, $compile) {
        return {
            restrict: 'A',
            scope: {
                'roleAuth': '@'
            },
            link: function compile(scope, element, attrs) {
                var authRoles = JSON.parse(attrs.roleAuth.replace(/'/g, '"'));
                var userRole = UserFactory.getUser().role;

                if (angular.isDefined(authRoles.only) && authRoles.only.indexOf(userRole) < 0) {
                    element.remove();
                }
                if (angular.isDefined(authRoles.except) && authRoles.except.indexOf(userRole) >= 0) {
                    element.remove();
                }
            }
        }
    }
}());
"use strict";
(function () {
    angular
        .module('angularJS-Vitamin.dashboard', [])
        .config(dashboardConfig);

    dashboardConfig.$invoke = ['$urlRouterProvider', '$stateProvider'];
    function dashboardConfig($urlRouterProvider, $stateProvider) {
        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: '/features/dashboard/home/home.tpl.html',
                controller: 'HomeController',
                data: {
                    template: 'complex',
                    permissions: {
                        except: ['anonymous'],
                        redirectTo: 'login'
                    }
                }
            });
    }
}());

"use strict";
(function () {
    angular
        .module('angularJS-Vitamin.auth')
        .factory('UserFactory', UserFactory);

    UserFactory.$invoke = ['$http', '$q', '$localStorage'];
    function UserFactory($http, $q, $localStorage) {
        return {
            getUser: function () {
                return $localStorage.User;
            },
            getUserToken: function () {
                return $localStorage.User.token;
            },
            doLogout: function () {
                delete $localStorage.User;
            },
            doLogin: function (credentials) {
                var dfd = $q.defer();

                //$http
                //    .post(buildURL('login'), credentials)
                //    .then(function (response) {
                //        if(!response.data.error){
                //            $localStorage.User = response.data.user;
                //            dfd.resolve(true);
                //        }else{
                //            dfd.reject(response);
                //        }
                //    }, function (err) {
                //        dfd.reject(err);
                //    });

                // FAKE DATA TO SIMULATE A LOGIN
                var userInfo = null;
                switch (credentials.username + ':' + credentials.password) {
                    case 'demo@demo.com:demo':
                        userInfo = {name: 'demo', role: 'user'};
                        break;
                    case 'admin@admin.com:admin':
                        userInfo = {name: 'admin', role: 'administrator'};
                        break;
                    case 'moderator@moderator.com:moderator':
                        userInfo = {name: 'moderator', role: 'moderator'};
                        break;
                    default :
                        dfd.reject(true);
                        break;
                }

                userInfo.locale = 'en';
                userInfo.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
                $localStorage.User = userInfo;
                dfd.resolve(true);

                // END FAKE LOGIN

                return dfd.promise;
            },
            doSignup: function (credentials) {
                var dfd = $q.defer();

                //$http
                //    .post(buildURL('login'), credentials)
                //    .then(function (response) {
                //        if(!response.data.error){
                //            dfd.resolve(response.data.user);
                //        }else{
                //            dfd.reject(response);
                //        }
                //    }, function (err) {
                //        dfd.reject(err);
                //    });


                // FAKE SIGNUP

                var existingUsers = ['demo@demo.com', 'admin@admin.com', 'manager@manager.com'];

                if (existingUsers.indexOf(credentials.email) < 0) {
                    dfd.resolve(true);
                } else {
                    dfd.resolve({success: false, msg: 'email_already_taken'});
                }

                // END FAKE SIGNUP

                return dfd.promise;
            }
        }
    }
}());
"use strict";
(function () {
    angular
        .module('angularJS-Vitamin.auth')
        .controller('LoginController', LoginController);

    LoginController.$invoke = ['$scope', 'UserFactory', '$state'];
    function LoginController($scope, UserFactory, $state) {
        $scope.loginForm = {
            username: null,
            password: null
        };

        $scope.login = function () {
            $scope.loginForm.error = false;
            UserFactory.doLogin($scope.loginForm)
                .then(function () {
                    $state.go('dashboard');
                }, function (err) {
                    $scope.loginForm.error = err;
                })
        }
    }
}());

"use strict";
(function () {
    angular
        .module('angularJS-Vitamin.auth')
        .controller('SignupController', SignupController);

    SignupController.$invoke = ['$scope', 'UserFactory', '$state'];
    function SignupController($scope, UserFactory, $state) {
        $scope.signupForm = {
            email: null,
            password: null,
            password2: null
        };

        $scope.signup = function () {
            $scope.signupForm.error = false;
            UserFactory.doLogin($scope.loginForm)
                .then(function (response) {
                    if (response.success) {
                        $state.go('dashboard');
                    } else {
                        $scope.loginForm.errorEmail = err;
                    }
                }, function (err) {
                    $scope.loginForm.error = err;
                })
        }
    }
}());
"use strict";
(function () {
    angular
        .module('angularJS-Vitamin.components')
        .controller('HeaderComponentController', HeaderComponentController);

    HeaderComponentController.$invoke = ['$scope'];
    function HeaderComponentController($scope) {

    }
}());

"use strict";
(function () {
    angular
        .module('angularJS-Vitamin.dashboard')
        .controller('HomeController', HomeController);

    HomeController.$invoke = ['$scope', 'UserFactory', '$state'];
    function HomeController($scope, UserFactory, $state) {
        $scope.user = UserFactory.getUser();
    }
}());