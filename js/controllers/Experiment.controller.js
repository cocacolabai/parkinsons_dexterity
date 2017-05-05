'use strict';

app.controller('ExperimentController', experimentController);

experimentController.$inject = ['$scope', 'ExperimentService', 'StatsService', 'RecorderService', 'ReporterService'];

function experimentController ($scope, ExperimentService, StatsService, RecorderService, ReporterService) {
	
	
	/* Set Default Experiment Form Options */
	const loadDefaults = () => {
		$scope.filter = {};
		$scope.filter.id = 1;
		$scope.filter.name = "Kurt DaCosta";
		$scope.filter.duration = 1;
		$scope.filter.rotation = "0";
		$scope.filter.key_left = "W".toLowerCase();
		$scope.filter.key_right = "O".toLowerCase();
		$scope.rotations = ["0", "90", "180", "270"];
		RecorderService.resetRecorder();
	};


	/* Recorder State Changed */
	$scope.$on('recorder:state_change', function(event, new_state) {
		$scope.$evalAsync(() => {
			$scope.recorder_state = new_state;
		});
	});


	/* Experiment Completion Handler */
	const experimentStatistics = (keyStrokes) => {

		const keyPairs = ExperimentService.computeKeyStrokePairs(keyStrokes);
		
		const targetKeys = [$scope.filter.key_left, $scope.filter.key_right];
		
		const experimentStats = StatsService.computeStatsForExperiment(targetKeys, keyPairs, keyStrokes);

		const metadata = $scope.filter;

		ReporterService.generateReport(keyStrokes, keyPairs, experimentStats, metadata);
	}


	/* Begin Experiment */
	const beginExperiment = function () {
		const duration = $scope.filter.duration * 1000;
		RecorderService.setRecorderConfiguration(duration, experimentStatistics);
		RecorderService.startWatching();
	}


	/* Load Form Defaults */
	loadDefaults();


	/* Add Functions to Controller scope */
	$scope = _.merge($scope, { loadDefaults, beginExperiment });
}