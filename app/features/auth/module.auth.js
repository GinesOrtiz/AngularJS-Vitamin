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