/*
 We want our functions to be private and only accessible for this module to use it.
 */
(function () {
    /*
     Force the strict mode: http://www.w3schools.com/js/js_strict.asp
     */
    'use strict';
    angular
        .module('angularJS-Vitamin.dashboard', [])
        .config(DashboardConfig);
    /*
     With the empty array of dependencies (it could not be empty) we declare the module so now we can start adding
     different things to it as a config, controllers, directives or services/factories.

     Every time we add pieces to our module we will use this nomenclature:

     .config(PascalCaseToFunction)
     .run('PascalCaseRunFunction', PascalCaseRunFunction)

     PascalCaseToFunction.$invoke = ['$SomeProvider'];
     function PascalCaseToFunction($SomeProvider){ ... }

     PascalCaseRunFunction.$invoke = ['$SomeModuleConfiguration'];
     function PascalCaseRunFunction($SomeModuleConfiguration){ ... }

     IMPORTANT
     ---------
     The main idea is that in the module declaration we only implement the $stateProvider with ONLY the module
     state routes.
     In some cases we can add the .run function if needed.

     */

    DashboardConfig.$invoke = ['$stateProvider'];
    function DashboardConfig($stateProvider) {
        $stateProvider
        /*
         Declaration of state routes for this module (only features from this one)
         */
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: '/features/dashboard/home/home.tpl.html',
                controller: 'HomeController',
                data: {
                    template: 'complex',        // Template name without extension from /layouts folder
                    permissions: {
                        /*
                         More information: https://github.com/Narzerus/angular-permission

                         Main basics of configuration at this point.
                         We have two different options: only and except. We provide an array of roles that are or not
                         able to enter in this route. In the opposite case, they will be redirect to redirectTo state.

                         Examples:
                         1- If we want only non registered users to enter we say -> only : ['anonymous']
                         2- If we want only registered users to enter we say -> except : ['anonymous']

                         */
                        except: ['anonymous'],
                        redirectTo: 'login'
                    }
                },
                resolve: {
                    /*
                     More information: https://github.com/angular-ui/ui-router/wiki#resolve

                     Resolve will make the controller and view wait until all params are resolved.
                     This method is commonly used when we implement an async load and we need to wait until the resources
                     are loaded to print it into the view or use it in the controller.

                     In the case of an $http resource we will need to implement promises to make it works. To see an
                     example open the service.async.js from the Async feature.
                     */
                    userInfo: function (UserFactory) {
                        return UserFactory.getUser();
                    }
                }
            });
    }
}());
