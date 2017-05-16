'use strict';

app.factory('RecorderService', recorderService);

recorderService.$inject = ['$rootScope'];

function recorderService ($rootScope) {

    /* Recorder State Enum */
    const RecorderStateEnum = {
        "WAITING"  : 0,
        "READY"    : 1,
        "STARTED"  : 2,
        "STOPPED"  : 3,
        stateTitle: {
            0: "Waiting To Begin",
            1: "Ready To Start - please click first key to start",
            2: "Running",
            3: "Completed. Reset experiment before running again."
        }
    }

    //////////////////////////////////////////////////////////
    //  Service Variables
    //////////////////////////////////////////////////////////

    let service = {};
    let options = {};
    let timers = [];
    let recordings = [];
    let recorderState = RecorderStateEnum.WAITING;

    //////////////////////////////////////////////////////////
    //  Public API 
    //////////////////////////////////////////////////////////

    service.setRecorderConfiguration = function (duration, callback) {
        options.duration = duration || 1000;
        options.callback = callback || null;
    }

    service.startWatching = function () {
        setRecorderState(RecorderStateEnum.READY);
    }

    service.startRecording = function () {
        setRecorderState(RecorderStateEnum.STARTED);
        const timer = setTimeout(this.stopRecording, options.duration);
        timers.push(timer);
    }

    service.stopRecording = function () {
        setRecorderState(RecorderStateEnum.STOPPED);
        options.callback && options.callback(recordings);
    }

    service.resetRecorder = function () {
        setRecorderState(RecorderStateEnum.WAITING);
        timers.forEach(clearTimeout);
        timers = [];
        recordings = [];
    }

    //////////////////////////////////////////////////////////
    //  Private API
    //////////////////////////////////////////////////////////

    const setRecorderState = function (stateEnum) {
        recorderState = stateEnum;
        const state_value = RecorderStateEnum.stateTitle[stateEnum];
        $rootScope.$broadcast('recorder:state_change', state_value);
    }


    $rootScope.handleKeypress = function (event) {
        
        if (recorderState == RecorderStateEnum.READY) {
            service.startRecording();
        }

        if (recorderState == RecorderStateEnum.STARTED) {
            
            recordings.push({
                key: String.fromCharCode(event.keyCode),
                time: new Date().getTime()
            });
        }
    }
    
    /* Expose Service Public API */
    return service;
}