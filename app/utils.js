var API_base = 'http://localhost:3000/';
var API_paths = {
    login : 'user/login',
    passwordRecovery : 'user/recovery'
};

function buildURL(path){
    return API_base + API_paths[path];
}

function loadPermissions(Permission, UserFactory){
    Permission.defineRole('anonymous', function () {
        return !UserFactory.getUser();
    });

    Permission.defineRole('user', function () {
        if(angular.isDefined(UserFactory.getUser())){
            if(UserFactory.getUser().role === 'user'){
                return true;
            }
        }
    });

    Permission.defineRole('administrator', function () {
        if(angular.isDefined(UserFactory.getUser())){
            if(UserFactory.getUser().role === 'administrator'){
                return true;
            }
        }
    });
}


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
                break;
        }
    };
}