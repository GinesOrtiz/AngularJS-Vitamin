(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.dashboard')
        .controller('HomeController', HomeController);
    /*
     Because of how we defined Gulp inject JS files, all modules.*.js files were injected in the very top of the app.js
     in assets/js/app.js file. This allows us to append controllers, services/factories or directives to an existing
     module.

     That why we don't use the empty array in the module declaration. In this case we say that we are going to append
     a controller called HomeController to the dashboard module.

     Using PascalCase we define the name of the controller and the function associate as well.

     As a second param out function is getting 'userInfo' which is defined in the resolve from dashboard state in the
     module.dashboard.js
     */

    HomeController.$inject = ['$scope', 'userInfo', '$filter'];
    function HomeController($scope, userInfo, $filter) {
        $scope.user = userInfo;
        $scope.html = '<br>demo<br>';
        var demo = $filter('i18next')('auth...');
    }
}());