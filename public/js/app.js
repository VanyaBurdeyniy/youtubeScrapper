var youtubeScrapper = angular.module('youtubeScrapper', [
    'ui.router'
]);

youtubeScrapper.run(function($rootScope, $location) {
    console.log($location);
    $rootScope.currentRoute = function(path) {
        return path === $location.$$path;
    };
    $rootScope.isAdmin = localStorage.getItem('isAdmin');
    $rootScope.isLogged = localStorage.getItem('isLogged');

    $rootScope.loading = false;

    $rootScope.logout = function() {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isLogged');
        $location.path('/login');
    };

    // if (!$rootScope.isLogged && !$rootScope.isAdmin) $location.path('/login');
});

youtubeScrapper.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('index', {
            name: 'index',
            url: '/',
            templateUrl: '../views/dashboard.html',
            controller: 'DashboardController'
        })

        .state('login', {
            name: 'login',
            url: '/login',
            templateUrl: '../views/login.html',
            controller: 'LoginController'
        })

        .state('crawler', {
            name: 'crawler',
            url: '/crawler',
            templateUrl: '../views/crawler.html',
            controller: 'CrawlerController'
        })

        .state('configuration', {
            name: 'configuration',
            url: '/configuration',
            templateUrl: '../views/configuration.html',
            controller: 'ConfigurationController'
        })

    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/crawler');
});





