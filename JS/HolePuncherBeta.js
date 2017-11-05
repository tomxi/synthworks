/*
 * ---Hole Puncher Beta
 * Copyright © 2014 SynthWorks.nyc
 * for feedback and suggestions and support, visit www.synthworks.nyc 
 */

var holeList = [];

//---------------------------Helper Functions-----------------------------------
function addHoleList(holeList, start, end) {
    var x = MIDI.noteNumber(start);
    var y = MIDI.noteNumber(end);
    if (x>y) {
        var s = y;
        var e = x;
    } else {
        var s = x;
        var e = y;
    }
    for (var i = s; i <= e; i++) {
        holeList.push(i);
    } 
}


//------------------------------------MAIN--------------------------------------
function HandleMIDI(e) {
    if(e instanceof NoteOn && holeList.indexOf(e.pitch) >= 0 ) { 
        ; //DoNothing
    } else {
        e.send();
    }
}

//---------------------------------ParameterChanged-----------------------------
function ParameterChanged(param, value) {
    var gpHole1 = GetParameter(pHole1);
    var gp1Start = mRange[GetParameter(p1Start)];
    var gp1End = mRange[GetParameter(p1End)];
    var gpHole2 = GetParameter(pHole2);
    var gp2Start = mRange[GetParameter(p2Start)];
    var gp2End = mRange[GetParameter(p2End)];
    var gpHole3 = GetParameter(pHole3);
    var gp3Start = mRange[GetParameter(p3Start)];
    var gp3End = mRange[GetParameter(p3End)];

    holeList = [];
    if (gpHole1) {
        addHoleList(holeList, gp1Start, gp1End);
    }
    if (gpHole2) {
        addHoleList(holeList, gp2Start, gp2End);
    }
    if (gpHole3) {
        addHoleList(holeList, gp3Start, gp3End);
    }
}


//--------------------------------USER CONTROLS--------------------------------

var PluginParameters = [];

var pHole1 = "Punch Hole 1";
var p1Start = "Start of Hole 1";
var p1End = "End of Hole 1";

var pHole2 = "Punch Hole 2";
var p2Start = "Start of Hole 2";
var p2End = "End of Hole 2";

var pHole3 = "Punch Hole 3";
var p3Start = "Start of Hole 3";
var p3End = "End of Hole 3";


function buildKeyPitchMenu() {
    var result = [];
    for (var i = 21; i < 109; i++) {
        result.push(MIDI.noteName(i));
    }
    return result;
}

var mSwitch = ["Off", "On"];
var mRange = buildKeyPitchMenu();

PluginParameters.push({name: pHole1,
                       type: "menu",
               valueStrings: mSwitch,
                   minValue: 0,
                   maxValue: 1,
               defaultValue: 0,
              numberOfSteps: 1});

PluginParameters.push({name: p1Start,
                       type: "menu",
               valueStrings: mRange,
                   minValue: 0,
                   maxValue: 87,
               defaultValue: 39,
              numberOfSteps: 87});

PluginParameters.push({name: p1End,
                       type: "menu",
               valueStrings: mRange,
                   minValue: 0,
                   maxValue: 87,
               defaultValue: 39,
              numberOfSteps: 87});

PluginParameters.push({name: pHole2,
                       type: "menu",
               valueStrings: mSwitch,
                   minValue: 0,
                   maxValue: 1,
               defaultValue: 0,
              numberOfSteps: 1});

PluginParameters.push({name: p2Start,
                       type: "menu",
               valueStrings: mRange,
                   minValue: 0,
                   maxValue: 87,
               defaultValue: 39,
              numberOfSteps: 87});

PluginParameters.push({name: p2End,
                       type: "menu",
               valueStrings: mRange,
                   minValue: 0,
                   maxValue: 87,
               defaultValue: 39,
              numberOfSteps: 87});

PluginParameters.push({name: pHole3,
                       type: "menu",
               valueStrings: mSwitch,
                   minValue: 0,
                   maxValue: 1,
               defaultValue: 0,
              numberOfSteps: 1});

PluginParameters.push({name: p3Start,
                       type: "menu",
               valueStrings: mRange,
                   minValue: 0,
                   maxValue: 87,
               defaultValue: 39,
              numberOfSteps: 87});

PluginParameters.push({name: p3End,
                       type: "menu",
               valueStrings: mRange,
                   minValue: 0,
                   maxValue: 87,
               defaultValue: 39,
              numberOfSteps: 87});
