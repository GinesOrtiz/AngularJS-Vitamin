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