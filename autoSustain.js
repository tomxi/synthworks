/*
 * ---Auto Sustain for IT
 * Copyright © 2015 SynthWorks.nyc
 * for feedback and suggestions and support, visit www.synthworks.nyc 
 */

var gpVel
var gpPitch
var gpTempo
var gpDuration
var timeOff

function bpmToMS(bpm, beats) {
    return (1 / bpm) * beats * 60000
}

function HandleMIDI(e) {
    if (e instanceof NoteOn && e.pitch == gpPitch && e.value != 0) {
        //Trace('I\'m here~~');
        var p = new NoteOn;
        var off = new NoteOff;
        p.velocity = gpVel;
        p.pitch = gpPitch;
        off.pitch = gpPitch;
        p.send();
        //Trace(timeOff)
        off.sendAfterMilliseconds(timeOff);
    } else if (e instanceof NoteOff && e.pitch == gpPitch) {
        //Trace('NoteOff')
    } else if (e instanceof NoteOn && e.pitch == gpPitch && e.value == 0){
        //Trace('NoteOn 0')
    } else {
        e.send()
    }
}

//----------------------------------Initialize---------------------------------
function ParameterChanged(param, value) {
    gpVel = GetParameter(pVel);
    gpPitch = MIDI.noteNumber(mPitch[GetParameter(pPitch)]);
    gpTempo = GetParameter(pTempo);
    gpDuration = GetParameter(pDuration);
    timeOff = bpmToMS(gpTempo, gpDuration);
}

//--------------------------------USER CONTROLS--------------------------------

var PluginParameters = [];

var pPitch = "Pitch";
var pVel = "Note Velocity";
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


PluginParameters.push({name: pPitch,
                       type: "menu",
               valueStrings: mPitch,
                   minValue: 0,
                   maxValue: 87,
               defaultValue: 63,
              numberOfSteps: 87});

PluginParameters.push({name: pVel,
                       type: "lin",
                   minValue: 1,
                   maxValue: 127,
               defaultValue: 70,
              numberOfSteps: 126})

PluginParameters.push({name: pTempo,         //3
                       type: "lin",
                   minValue: 10,
                   maxValue: 250,
               defaultValue: 123,
              numberOfSteps: 240,
                       unit: " bpm"});
              
PluginParameters.push({name: pDuration,      //4
                       type: "lin",
                   minValue: 0.5,
                   maxValue: 100,
               defaultValue: 29,
              numberOfSteps: 199,
                       unit: " beats"});