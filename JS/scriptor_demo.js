/*
 * ---Note Triggering Timed Sustain
 * Copyright © 2017 Tom Xi
 * 
 */

var gpPitch
var gpTempo
var gpDuration
var timeOff


function bpmToMS(bpm, beats) {
    return (1 / bpm) * beats * 60000
}

function HandleMIDI(e) {
	e.send()
    if (e instanceof NoteOn && e.pitch == gpPitch && e.value != 0) {

        var sustain = new ControlChange;
        var off = new ControlChange;

        sustain.number = 64;
        sustain.value = 127;

        off.number =64;
        off.value = 0;

        sustain.send();
        off.sendAfterMilliseconds(timeOff);
    }
}

//----------------------------------Initialize---------------------------------
function ParameterChanged(param, value) {
    gpPitch = MIDI.noteNumber(mPitch[GetParameter(pPitch)]);
    gpTempo = GetParameter(pTempo);
    gpDuration = GetParameter(pDuration);
    timeOff = bpmToMS(gpTempo, gpDuration);
}

//--------------------------------USER CONTROLS--------------------------------

var PluginParameters = [];

var pPitch = "Pitch";
var pTempo = "Tempo";
var pDuration = "Duration";


function buildKeyPitchMenu() {
    var result = [];
    for (var i = 21; i < 109; i++) {
        result.push(MIDI.noteName(i));
    }
    return result;
}

var mPitch = buildKeyPitchMenu();


PluginParameters.push({name: pPitch,        //1
                       type: "menu",
               valueStrings: mPitch,
                   minValue: 0,
                   maxValue: 87,
               defaultValue: 63,
              numberOfSteps: 87});

PluginParameters.push({name: pTempo,         //2
                       type: "lin",
                   minValue: 10,
                   maxValue: 250,
               defaultValue: 123,
              numberOfSteps: 240,
                       unit: " bpm"});
              
PluginParameters.push({name: pDuration,      //3
                       type: "lin",
                   minValue: 0.5,
                   maxValue: 100,
               defaultValue: 29,
              numberOfSteps: 199,
                       unit: " beats"});