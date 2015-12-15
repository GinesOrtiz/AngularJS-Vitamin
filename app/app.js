"use strict";

(function () {
    angular
        .module('angularJS-Vitamin', [
            /*
             To make it easier first will inject all external dependencies to our main module
             */
            'ui.router',
            'ngAnimate',
            'ngStorage',
            'permission',
            'angular-loading-bar',
            'ngSanitize',
            'jm.i18next',
            'tmh.dynamicLocale',

            /*
             Then all our app modules
             */
            'angularJS-Vitamin.auth',
            'angularJS-Vitamin.async',
            'angularJS-Vitamin.dashboard',
            'angularJS-Vitamin.components'
        ])
        .config(appConfig)
        .run(appRun);


    appConfig.$invoke = ['$locationProvider', '$i18nextProvider', 'cfpLoadingBarProvider', '$urlRouterProvider', 'tmhDynamicLocaleProvider'];
    function appConfig($locationProvider, $i18nextProvider, cfpLoadingBarProvider, $urlRouterProvider, tmhDynamicLocaleProvider) {
        /*
         In case non of all the $stateProvider states gets resolved, we want to redirect the user to specific path.
         For example /login. By it's own nature, login will redirect to /dashboard if the user is already logged.
         */
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get("$state");
            $state.transitionTo('login');
        });

        /*
         Normally people don't care about the /#/ path on their apps url but is something that every time it disturbs me
         so this is how to disable it by enabling the HTML5 mode.
         */
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        /*
         Declaration of basic functionality for i18n module
         */
        $i18nextProvider.options = {
            lng: 'es',                              // Default locale
            useCookie: false,
            useLocalStorage: false,
            resGetPath: '/assets/locale/es.json',   // Locale file with lng from above
            defaultLoadingValue: ''
        };

        /*
         With this we can disable a spin gif that shows up when the loading bar is trigger. Which I don't like
         */
        cfpLoadingBarProvider.includeSpinner = false;

        /*
         Define the path to angular's i18n. This affects to calendars and dates only.
         */
        tmhDynamicLocaleProvider.localeLocationPattern('/angular/i18n/angular-locale_{{locale}}.js');
    }

    appRun.$invoke = ['permission', 'UserFactory', '$rootScope', '$http', 'tmhDynamicLocale'];
    function appRun(Permission, UserFactory, $rootScope, $http, tmhDynamicLocale) {
        $rootScope.$on('$stateChangePermissionStart', function (event, args) {
            /*
            In every state configuration from module.*.js we define inside data object a template key. This will tell
            angular which template it should render for the view. Here we make the url to use in index.html with an
            ng-include.
             */
            $rootScope.layoutTemplate = '/layouts/' + args.data.template + '.html';

            /*
            With this code we can detect if user is not anonymous and inject some Auth in every external call to a
            resource. This is useful when our backend needs a token validation for calls.
             */

            //var reqPerms = args.data.permissions;
            //var anonymousUser = angular.isDefined(reqPerms.only) && reqPerms.only[0] === 'anonymous';
            //if (!anonymousUser) {
            //    $http.defaults.headers.common['x-auth-token'] = UserFactory.getUserToken();
            //    locale = UserFactory.getUser().locale;
            //}

            var locale = (navigator.language || navigator.userLanguage).split('-')[0];
            tmhDynamicLocale.set(locale);
        });

        /*
        Normally we can externalize some functions to have a more friendly and readable app config file.
        In this case those two functions are created in utils.js.
         */
        loadPermissions(Permission, UserFactory);
        tmpData($rootScope);
    }
}());