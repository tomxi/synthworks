/*
 * ---Sustain Pedal to Note for Clinton the Musical
 * Copyright © 2015 SynthWorks.nyc
 * for feedback and suggestions and support, visit www.synthworks.nyc 
 */


function HandleMIDI(e) {
    if (e instanceof ControlChange && e.number == 64) {
        var p = new NoteOn;

        if (e.value == 127) {
            p.velocity = GetParameter(pVel);
        } else if (e.value == 0) {
            p.velocity = 0;
        }

        p.pitch = MIDI.noteNumber(mPitch[GetParameter(pPitch)]);
        p.send();

    } else {
        e.send()
    }
}


//--------------------------------USER CONTROLS--------------------------------

var PluginParameters = [];

var pPitch = "Pitch";
var pVel = "Note Velocity";


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
