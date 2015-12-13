"use strict";
(function () {
    angular
        .module('angularJS-Vitamin.auth')
        .controller('SignupController', SignupController);

    SignupController.$invoke = ['$scope', 'UserFactory', '$state'];
    function SignupController($scope, UserFactory, $state) {
        $scope.signupForm = {
            email: null,
            password: null,
            password2: null
        };

        $scope.signup = function () {
            $scope.signupForm.error = false;
            UserFactory.doLogin($scope.loginForm)
                .then(function (response) {
                    if (response.success) {
                        $state.go('dashboard');
                    } else {
                        $scope.loginForm.errorEmail = err;
                    }
                }, function (err) {
                    $scope.loginForm.error = err;
                })
        }
    }
}());