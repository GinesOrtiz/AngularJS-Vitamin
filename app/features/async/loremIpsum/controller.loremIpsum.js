(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.async')
        .controller('LoremIpsumController', LoremIpsumController);

    LoremIpsumController.$invoke = ['$scope', 'loremIpsum'];
    function LoremIpsumController($scope, loremIpsum) {
        /*
         Because we defined in the resolve loremImpsum as key for the promise result, we can just inject it on our
         controller to get the information we pass by resolving it.

         In this case loremIpsum is an array so we pick up the first slot of it.
         */
        $scope.loremIpsum = loremIpsum[0];
    }
}());