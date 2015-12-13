"use strict";
(function () {
    angular
        .module('angularJS-Vitamin.components')
        .controller('HeaderComponentController', HeaderComponentController);

    HeaderComponentController.$invoke = ['$scope'];
    function HeaderComponentController($scope) {

    }
}());
