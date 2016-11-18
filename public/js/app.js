var youtubeScrapper = angular.module('youtubeScrapper', [
    'ui.router'
]);

youtubeScrapper.run(function($rootScope, $location) {
    console.log($location);
    $rootScope.currentRoute = function(path) {
        return path === $location.$$path;
    }
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

    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
});





