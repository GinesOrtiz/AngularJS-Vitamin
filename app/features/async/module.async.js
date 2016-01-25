(function () {
    'use strict';

    angular
        .module('angularJS-Vitamin.async', [])
        .config(AsyncConfig);

    AsyncConfig.$invoke = ['$stateProvider'];
    function AsyncConfig($stateProvider) {
        $stateProvider
            .state('loremIpsum', {
                url: '/lorem',
                templateUrl: '/features/async/loremIpsum/loremIpsum.tpl.html',
                controller: 'LoremIpsumController',
                data: {
                    template: 'complex',
                    permissions: {
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

                     The name we define will be the same to inject in our controller.
                     */
                    loremIpsum: function (AsyncFactory) {
                        return AsyncFactory.getLoremIpsum();
                    }
                }
            });
    }
}());