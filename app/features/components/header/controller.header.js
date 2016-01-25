(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.components')
        .controller('HeaderComponentController', HeaderComponentController);

    HeaderComponentController.$invoke = ['$scope'];
    function HeaderComponentController($scope) {

    }
}());
