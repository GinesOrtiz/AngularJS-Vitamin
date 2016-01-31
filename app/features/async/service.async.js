(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.async')
        .factory('AsyncFactory', AsyncFactory);


    AsyncFactory.$inject = ['$http', '$q'];
    function AsyncFactory($http, $q) {
        return {
            getLoremIpsum: function () {
                /*
                 More information: https://docs.angularjs.org/api/ng/service/$q

                 To start with our promise we declare a random variable, I always use "dfd" because the first example I
                 saw. Once we create it, we assign the $q.defer() function to it in order to create a raw promise.
                 */
                var dfd = $q.defer();

                /*
                 We continue as normal doing all we need to do on our service without caring about the return.
                 */
                $http
                    .get('https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1')
                    .then(function (response) {
                        /*
                         Once we know is time to finish the promise we have two options depending what we want.
                         If everything is OK we will resolve the promise, otherwise we want to reject it.

                         The difference is which event it triggers. In the case of resolve, we will call the .success or
                         the first function in the .then declaration.

                         As obviously at the reject we call the .error or the second function from .then
                         Reject also will trigger $stateChangeError and $statePermissionsChangeError if used as a
                         resolve in the state declaration.

                         Returning to resolve case, we will return the exact data we need to use. By default the response
                         from $http will contain information as status, statusText, config, headers and data. This last
                         one is where the info is, so we will resolve the promise with that specific content.
                         */
                        dfd.resolve(response.data);
                    }, function (err) {
                        dfd.reject(err);
                    });

                return dfd.promise;
            }
        };
    }

}());