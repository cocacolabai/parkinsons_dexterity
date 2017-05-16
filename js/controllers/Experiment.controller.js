'use strict';

app.controller('ExperimentController', experimentController);

experimentController.$inject = ['$scope', 'ExperimentService', 'StatsService', 'RecorderService', 'ReporterService'];

function experimentController ($scope, ExperimentService, StatsService, RecorderService, ReporterService) {
	
	
	/* Set Default Experiment Form Options */
	const loadDefaults = () => {
		$scope.filter = {};
		$scope.rawData = null;
		$scope.statsReport = null;
		$scope.filter.id = null;
		$scope.filter.name = null;
		$scope.filter.duration = 2;
		$scope.filter.rotation = "0";
		$scope.filter.hand_used = "";
		$scope.filter.hand_dominant = "";
		$scope.filter.key_left = "W".toLowerCase();
		$scope.filter.key_right = "O".toLowerCase();
		$scope.rotations = ["0", "90", "180", "270"];
		$scope.hands = ["left", "right"];
		$scope.dominant_hands = ["left", "right"];
		RecorderService.resetRecorder();
	};


	/* Recorder State Changed */
	$scope.$on('recorder:state_change', function(event, new_state) {
		$scope.$evalAsync(() => {
			$scope.recorder_state = new_state;
		});
	});


	const saveRawData = () => {
		// Get header keys
		let keys = _.keys($scope.rawData[0]);

		// Convert to csv string
		let csv = keys.join(",");
		csv += "\n";

		// Append row data
		$scope.rawData.forEach( (row) => {
			csv += `${row["key"]}, ${row["time"]} \n`;
		});

		// Save file
		saveAs(new File([csv], "experiment.csv", { type: "text/csv;charset=utf-8" }));
	}

	const saveStats = () => {
		$scope.statsReport.download("experiment_output");
	}


	/* Experiment Completion Handler */
	const experimentStatistics = (keyStrokes) => {

		$scope.rawData = keyStrokes;

		const keyPairs = ExperimentService.computeKeyStrokePairs(keyStrokes);
		
		const targetKeys = [$scope.filter.key_left, $scope.filter.key_right];
		
		const experimentStats = StatsService.computeStatsForExperiment(targetKeys, keyPairs, keyStrokes);

		const metadata = $scope.filter;

		$scope.statsReport = ReporterService.generateReport(keyStrokes, keyPairs, experimentStats, metadata);
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
	$scope = _.merge($scope, { loadDefaults, beginExperiment, saveStats, saveRawData });
}