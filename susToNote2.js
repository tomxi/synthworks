/*
 * ---Sustain Pedal to Note for Clinton the Musical
 * Copyright © 2015 SynthWorks.nyc
 * for feedback and suggestions and support, visit www.synthworks.nyc 
 */


function bpmToMS(bpm, beats) {
    return (1 / bpm) * beats * 60000
}

var gpTempo = GetParameter(pTempo);
var gpDuration = GetParameter(pDuration);
var timeOff = bpmToMS(gpTempo, gpDuration)

function HandleMIDI(e) {
    if (e instanceof ControlChange && e.number == 64 && e.value == 127) {
        var p = new NoteOn;
        var off = new NoteOff;

        p.velocity = GetParameter(pVel);
        p.pitch = MIDI.noteNumber(mPitch[GetParameter(pPitch)]);
        off.pitch = MIDI.noteNumber(mPitch[GetParameter(pPitch)]);
        p.send();
        Trace(timeOff)
        off.sendAfterMilliseconds(timeOff);
    } else {
        e.send()
    }
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
                   maxValue: 40,
               defaultValue: 29,
              numberOfSteps: 79,
                       unit: " beats"});