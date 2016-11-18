youtubeScrapper.controller('LoginController', function($scope, $location, $http) {
    $scope.user = {};

    if (localStorage.getItem('isAdmin') || localStorage.getItem('isLogged')) {
        $location.path('/crawler');
    }

    $scope.login = function(user) {
        $http.post('/auth/signin', user)
            .then(function(data) {
                console.log(data);
                if (data.data.username === 'admin') {
                    localStorage.setItem('isAdmin', data.data._id);
                } else {
                    localStorage.setItem('isLogged', data.data._id);
                }
                $location.path('/crawler');
            })
            .catch(function(err) {
                console.log(err);
            });  
    };
});