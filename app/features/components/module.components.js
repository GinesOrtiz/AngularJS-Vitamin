"use strict";
(function () {
    angular
        .module('angularJS-Vitamin.components', [])
        .directive('vitHeader', vitHeader)
        .directive('roleAuth', roleAuth);

    function vitHeader() {
        return {
            restrict: 'E',
            templateUrl: '/features/components/header/header.tpl.html',
            controller: 'HeaderComponentController'
        }
    }

    function roleAuth(UserFactory, $compile) {
        return {
            restrict: 'A',
            scope: {
                'roleAuth': '@'
            },
            link: function compile(scope, element, attrs) {
                var authRoles = JSON.parse(attrs.roleAuth.replace(/'/g, '"'));
                var userRole = UserFactory.getUser().role;

                if (angular.isDefined(authRoles.only) && authRoles.only.indexOf(userRole) < 0) {
                    element.remove();
                }
                if (angular.isDefined(authRoles.except) && authRoles.except.indexOf(userRole) >= 0) {
                    element.remove();
                }
            }
        }
    }
}());