'use strict';
var apiBase = 'http://localhost:3000/';
var apiPath = {
    login: 'user/login',
    passwordRecovery: 'user/recovery'
};

/*
 This is a helpful function that will construct us the full url to connect to our backend by giving just the key.
 We need first to define a key in API_PATH for the path in order to use.

 Ex: $http(build('login'))
 */

function buildURL(path) {
    return apiBase + apiPath[path];
}

/*
 More information: https://github.com/Narzerus/angular-permission#defining-roles

 In this function we will define all the different roles that our users can have.
 How it works?

 Permission.defineRole('NAME_FOR_ROLE', function () {
 return A_CONDITION_THAT_RETURNS_TRUE_IF_USER_BELONGS_TO_THIS_ROLE;
 }
 */

function loadPermissions(Permission, UserFactory) {
    Permission.defineRole('anonymous', function () {
        return !UserFactory.getUser();
    });

    Permission.defineRole('user', function () {
        if (angular.isDefined(UserFactory.getUser())) {
            if (UserFactory.getUser().role === 'user') {
                return true;
            }
        }
    });

    Permission.defineRole('administrator', function () {
        if (angular.isDefined(UserFactory.getUser())) {
            if (UserFactory.getUser().role === 'administrator') {
                return true;
            }
        }
    });
}

/*
 Sometimes we need to have a temporal variable accessible across the entire application but we don't mind if we loose it
 by reloading the web. For example, if we have a list with content paginated and we want to edit some articles but
 without loosing the page we were at the list, we can save it as a temporal variable and then recover it.
 To do that we should use $rootScope but injecting it in every controller/service/factory we want to recover or save it.
 This is an alike function that uses $rootScope but makes it accessible by $scope so we don't have to inject it every
 time.

 We have three small functions. Create, remove and get. How to use it?
 1- Creating a temporal variable: $scope.tmpData('add', 'variableName', 'content');
 1- Removing a temporal variable: $scope.tmpData('remove', 'variableName');
 1- Getting  a temporal variable: $scope.tmpData('get', 'variableName');

 We can storage an object, array or simply a string.
 */

function tmpData($rootScope) {
    var tmpDataObject = {};
    $rootScope.tmpData = function (method, key, value) {
        switch (method) {
            case 'add' :
                tmpDataObject[key] = value;
                break;
            case 'remove' :
                delete tmpDataObject[key];
                break;
            case 'get' :
                return tmpDataObject[key];
        }
    };
}