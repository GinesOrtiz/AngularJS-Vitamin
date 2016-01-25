(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.components', [])
        .directive('vitHeader', vitHeader)
        .directive('roleAuth', roleAuth);
    /*
     This module is that "special one" that doesn't follows the rules.
     Components is an itemset which contains only directives.

     The rule is the following one: If and only if the directive doesn't have a view and the use of the controller is
     very small we can define the hole thing in the module component.

     The directive vitHeader represents the header directive. Because it have a view we only define the basics of the
     directive on the module and externalize the view and controller in a different folder with its name.
     */

    function vitHeader() {
        return {
            restrict: 'E',
            templateUrl: '/features/components/header/header.tpl.html',
            controller: 'HeaderComponentController'
        };
    }

    /*
     roleAuth is a simple directive that, depending of the user role and an object that passes by the attribute
     role-auth, we remove or not the element from the DOM. This allows us to show or hide elements in a view depending
     of the user role. I mean, in the same template two different users can see different thing depending of the role.

     I made the syntax exactly the same as angular-permissions in order to make it easier to use. In the header view
     there's an example of how implement it.
     */
    function roleAuth(UserFactory) {
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
        };
    }
}());