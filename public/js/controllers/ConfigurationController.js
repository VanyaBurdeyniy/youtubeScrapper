youtubeScrapper.controller('ConfigurationController', function($scope, $http, $location, $rootScope) {
    $scope.user = {};

    if (!$rootScope.isLogged && !$rootScope.isAdmin) $location.path('/login');

    function getUsers() {
        $http.get('/users')
            .then(function(data) {
                console.log(data);
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].username === 'admin') data.data.splice(i, 1);
                }
                $scope.users = data.data;
            })
            .catch(function(err) {
                console.log(err);
            });
    }
    getUsers();
    
    $scope.create = function(user) {
        $http.post('/auth/signup', user)
            .then(function(data) {
                console.log(data);
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    $scope.delete = function(user) {
        $http.post('/user/delete', user)
            .then(function(data) {
                getUsers();
            })
            .catch(function(err) {
                console.log(err);
            });
    }
});