'use strict';

app.factory('ExperimentService', experimentService);

experimentService.$inject = [];


function experimentService () {
	
    /* Compute KeyStroke Pairs*/
    const computeKeyStrokePairs = (keyStrokes) => {

        let pairs = [];

        for (let i = 0; i < keyStrokes.length; i++) {

            if (i + 1 < keyStrokes.length) {

                const ks1 = keyStrokes[i];
                const ks2 = keyStrokes[i + 1];

                pairs.push({
                    duration: ks2.time - ks1.time,
                    path: `(${ks1.key}, ${ks2.key})`,
                    strokes: [ks1, ks2]
                });
            }
        }

        return pairs;
    };

	
    /* Expose Functions Publicly  */
    return { computeKeyStrokePairs };
}