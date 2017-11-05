/*
 * ---SynthWorks Auto Patch Advance v1.0 by Tom Xi and Brian Li
 * Copyright © 2014 SYNTHWORKS, LLC
 * for feedback, suggestions, and support: support@synthworks.nyc 
 */
 
function HandleMIDI(e) {
    if (e instanceof NoteOn) {
        e.send();
        var cc = new ControlChange;
        cc.number = GetParameter(paramCC) + 85;
        cc.value = 127;
        cc.send();
        cc.trace();
    }
}

//---------------------------------USER CONTROLS--------------------------------

var PluginParameters = [];

var paramCC = "CC Number";
var list = ["85","86","87","88","89","90"];


PluginParameters.push({name: paramCC,                 //0
                       type: "menu",
               valueStrings: ["85","86","87","88","89","90"],
                   minValue: 0,
                   maxValue: 5,
               defaultValue: 2,
              numberOfSteps: 5});