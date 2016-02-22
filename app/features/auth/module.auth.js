(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.auth', [])
        .config(AuthConfig)
        .run(AuthRun);

    AuthConfig.$inject = ['$stateProvider'];
    function AuthConfig($stateProvider) {
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
            });
    }

    AuthRun.$inject = ['Permission', 'UserFactory'];
    function AuthRun(Permission, UserFactory) {

        /*
         More information: https://github.com/Narzerus/angular-permission#defining-roles

         In this function we will define all the different roles that our users can have.
         How it works?

         Permission.defineRole('NAME_FOR_ROLE', function () {
         return A_CONDITION_THAT_RETURNS_TRUE_IF_USER_BELONGS_TO_THIS_ROLE;
         }
         */

        Permission.defineRole('anonymous', function () {
            return !UserFactory.getUser();
        });

        Permission.defineRole('user', function () {
            if (angular.isDefined(UserFactory.getUser())) {
                if (UserFactory.getUser().role === 'user') {
                    return true;
                }
            }
        });

        Permission.defineRole('administrator', function () {
            if (angular.isDefined(UserFactory.getUser())) {
                if (UserFactory.getUser().role === 'administrator') {
                    return true;
                }
            }
        });
    }
}());