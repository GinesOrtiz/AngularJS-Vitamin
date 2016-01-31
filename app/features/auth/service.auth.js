(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.auth')
        .factory('UserFactory', UserFactory);

    UserFactory.$inject = ['$http', '$q', '$localStorage'];
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
        };
    }
}());