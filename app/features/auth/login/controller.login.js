"use strict";
(function () {
    angular
        .module('angularJS-Vitamin.auth')
        .controller('LoginController', LoginController);

    LoginController.$invoke = ['$scope', 'UserFactory', '$state'];
    function LoginController($scope, UserFactory, $state) {
        $scope.loginForm = {
            username: null,
            password: null
        };

        $scope.login = function () {
            $scope.loginForm.error = false;
            UserFactory.doLogin($scope.loginForm)
                .then(function () {
                    $state.go('dashboard');
                }, function (err) {
                    $scope.loginForm.error = err;
                })
        }
    }
}());
