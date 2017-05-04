'use strict';

app.controller('ExperimentController', experimentController);

experimentController.$inject = ['$scope', 'ExperimentService', 'StatsService', 'RecorderService'];

function experimentController ($scope, ExperimentService, StatsService, RecorderService) {
