'use strict';

app.factory('StatsService', statsService);

statsService.$inject = [];

function statsService () {


    /* Compute All Statistics for Experiment */
    const computeStatsForExperiment = (targetKeys, keyPairs, keyStrokes) => {
        
        console.log(`Target Keys: ${targetKeys}`);
        console.log("Key Pairs: ", keyPairs);
        console.log("Num Key Strokes Recorded: ", keyStrokes.length)
        console.log("Key Strokes: ", keyStrokes);

        const responseTimeStats = computeResponseTimeStats(targetKeys, keyPairs);
        const keyAccuracyStats  = computeKeyAccuracyStats(targetKeys, keyStrokes);

        return { responseTimeStats, keyAccuracyStats };
    }


    /* Compute Experiment Response Time Statistics */
    const computeResponseTimeStats = (targetKeys, keyPairs) => {

        const totalResponseTimeStats = _.chain(keyPairs).map("duration").thru(descriptiveStats).value();

        const firstToSecondKeyResponseTimeStats = responseTimeStatsFromTargetIndex(0, keyPairs);
        const secondToFirstKeyResponseTimeStats = responseTimeStatsFromTargetIndex(1, keyPairs);
        
        return { totalResponseTimeStats, firstToSecondKeyResponseTimeStats, secondToFirstKeyResponseTimeStats };
    }


    /* Compute Experiment Accuracy Statistics */
    const computeKeyAccuracyStats = (targetKeys, keyStrokes) => {

        // Individual Key Accuracies
        const firstKey  = keyAccuracyStatsForTargetIndex(0, targetKeys, keyStrokes);
        const secondKey = keyAccuracyStatsForTargetIndex(1, targetKeys, keyStrokes);
        
        // Combined Key Accuracies
        const metrics = ['total', 'hits', 'miss'];
        const allKeys = _.reduce(metrics, (acc, m) => (acc[m] = firstKey[m] + secondKey[m], acc), {});
        
        return { allKeys, firstKey, secondKey };
    }
    
    

    ////////////////////////////////////////////////////////////////////////////////////////
    // Helper Functions
    ////////////////////////////////////////////////////////////////////////////////////////

    /* Compute Accuracy of Key Strokes at Target Key Index */
    const keyAccuracyStatsForTargetIndex = (targetIndex, targetKeys, keyStrokes) => {

        const targetStrokes = _.filter(keyStrokes, (stroke, idx) => (idx % 2 === targetIndex));
        
        const hits = _.filter(targetStrokes, (s) => (s.key === targetKeys[targetIndex])).length;
        
        return { hits, total: targetStrokes.length, miss: (targetStrokes.length - hits) };
    }

    /* Compute Response Time Stats For Pairs Starting at Target Key Index */
    const responseTimeStatsFromTargetIndex = (targetIndex, keyPairs) => {
        
        const filterTargetIndex = (pair, idx) => (idx % 2 == targetIndex);
        
        return _.chain(keyPairs).filter(filterTargetIndex).map("duration").thru(descriptiveStats).value();
    }

    /* Compute Descriptive Statistics on Array of Data */
    const descriptiveStats = (data) => {
        
        const metrics = ['standardDeviation', 'variance', 'interquartileRange', 'mean', 'mode', 'min', 'max'];
        
        return _.reduce(metrics, (acc, m) => (acc[m] = ss[m](data), acc), {});
    }


    /* Expose Functions Publicly  */
    return { computeStatsForExperiment };
}