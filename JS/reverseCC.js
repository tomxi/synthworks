/*
 * ---Reversed Controls
 * Copyright © 2015 SynthWorks.nyc
 * for feedback and suggestions and support, visit www.synthworks.nyc 
 */

var gpCC

function HandleMIDI(e) {
    if (e instanceof ControlChange && e.number == gpCC) {
        numIn = e.value;
        numOut = -numIn + 127;
        e.value = numOut;
        e.send();
    } else {
        e.send();
    }
}

//---------------------------------ParameterChanged-----------------------------
function ParameterChanged(param, value) {
    gpCC = GetParameter(pCC);
}

//---------------------------------USER CONTROLS--------------------------------
function buildCCMenu() {
    var result = [];
    for (var i = 0; i < 128; i++) {
        result.push(String(i)+" ("+MIDI.ccName(i)+")");
    }
    return result;
}


var PluginParameters = [];

var pCC = "CC Number";
var mCC = buildCCMenu();


PluginParameters.push({name: pCC,                 //0
                       type: "menu",
               valueStrings: mCC,
                   minValue: 0,
                   maxValue: 127,
               defaultValue: 1,
              numberOfSteps: 127});