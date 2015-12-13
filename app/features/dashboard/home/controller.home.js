"use strict";
(function () {
    angular
        .module('angularJS-Vitamin.dashboard')
        .controller('HomeController', HomeController);

    HomeController.$invoke = ['$scope', 'UserFactory', '$state'];
    function HomeController($scope, UserFactory, $state) {
        $scope.user = UserFactory.getUser();
    }
}());