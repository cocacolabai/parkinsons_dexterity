'use strict';

/* Initalize Angular Application */
const app = angular.module('app', ['ui.router']);


/* Load Underscore In Root Scope */
app.run(['$rootScope', function ($rootScope) {
	$rootScope._ = window._;
}]);


/* Application URL State Router */
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('', '/');

    $stateProvider.state('app', {
        url: '/',
        controller: 'ExperimentController',
        templateUrl: 'templates/experiment.tpl.html'
    });

}]);