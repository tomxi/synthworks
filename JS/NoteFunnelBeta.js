/*
 * ---Note Funnel Beta
 * Copyright © 2015 SynthWorks.nyc
 * for feedback and suggestions and support, visit www.synthworks.nyc 
 */


function HandleMIDI(e) {
    if (e instanceof Note) {
        e.pitch = MIDI.noteNumber(mRange[GetParameter(pTarget)])
        e.send()
    } else {
        e.send()
    }
}


//--------------------------------USER CONTROLS--------------------------------

var PluginParameters = [];

var pTarget = "Target Note";

function buildKeyPitchMenu() {
    var result = [];
    for (var i = 21; i < 109; i++) {
        result.push(MIDI.noteName(i));
    }
    return result;
}

var mRange = buildKeyPitchMenu();


PluginParameters.push({name: pTarget,
                       type: "menu",
               valueStrings: mRange,
                   minValue: 0,
                   maxValue: 87,
               defaultValue: 39,
              numberOfSteps: 87});
