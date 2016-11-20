youtubeScrapper.controller('DashboardController', function($scope, $location, $rootScope) {
    if (!$rootScope.isLogged && !$rootScope.isAdmin) $location.path('/login');
});