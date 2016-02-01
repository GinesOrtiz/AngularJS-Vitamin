(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.async')
        .factory('AsyncFactory', AsyncFactory);


    AsyncFactory.$inject = ['$http'];
    function AsyncFactory($http) {
        return {
            getLoremIpsum: function () {
                return $http
                    .get('https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1')
                    .then(function (response) {
                        /*
                         In this case we are calling an external service. Using the function .then we can return
                         the response information to the controller or resolve that requested it.

                         .then has two functions. The first one is for a success response, the second one is for
                         a error catch.
                         */
                        return response.data;
                    });
            }
        };
    }

}());