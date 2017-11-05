var note1
var note2
var vCC

function HandleMIDI(e) {
   if (e instanceof NoteOn && (e.pitch == note1 || e.pitch == note2)) {
       var cc = new ControlChange;
       cc.number = vCC;
       cc.value = 127;
       cc.send()
   } else if (e instanceof NoteOff && (e.pitch == note1 || e.pitch == note2)) {
       var cc = new ControlChange;
       cc.number = vCC;
       cc.value = 0;
       cc.send()
   } else {
       e.send();
   }
}

//---------------------------------ParameterChanged-----------------------------
function ParameterChanged(param, value) {
    note1 = MIDI.noteNumber(mRange[GetParameter(pNote1)]);
    note2 = MIDI.noteNumber(mRange[GetParameter(pNote2)]);
    vCC = GetParameter(pCC);
}

//--------------------------------USER CONTROLS--------------------------------

var PluginParameters = [];

var pNote1 = "1st Trigger Note"
var pNote2 = "2nd Trigger Note"
var pCC = "Control Change Send"

function buildKeyPitchMenu() {
    var result = [];
    for (var i = 21; i < 109; i++) {
        result.push(MIDI.noteName(i));
    }
    return result;
}

function buildCCMenu() {
    var result = [];
    for (var i = 0; i < 128; i++) {
        result.push(String(i)+" ("+MIDI.ccName(i)+")");
    }
    return result;
}

var mRange = buildKeyPitchMenu();
var mCC = buildCCMenu();


PluginParameters.push({name: pNote1,
                       type: "menu",
               valueStrings: mRange,
                   minValue: 0,
                   maxValue: 87,
               defaultValue: 15,
              numberOfSteps: 87});

PluginParameters.push({name: pNote2,
                       type: "menu",
               valueStrings: mRange,
                   minValue: 0,
                   maxValue: 87,
               defaultValue: 63,
              numberOfSteps: 87});
              
              
PluginParameters.push({name: pCC,
                       type: "menu",
               valueStrings: mCC,
                   minValue: 0,
                   maxValue: 127,
               defaultValue: 86,
              numberOfSteps: 127});

