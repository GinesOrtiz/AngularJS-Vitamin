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
