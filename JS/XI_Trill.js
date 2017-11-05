var processSwitch = false;

function HandleMIDI(e) {
    e.send();
    if (e instanceof NoteOn && e.pitch == GetParameter(paramTrigger)) {
        processSwitch = true;
    } else if (e instanceof NoteOff && e.pitch == GetParameter(paramTrigger)) {
        processSwitch = false;
    }
    Trace(processSwitch);
}

function ProcessMIDI() {
    if (processSwitch) {	
        var repeatNote = new NoteOn();
        
        repeatNote.
        }

}

//---------------------------------USER CONTROLS--------------------------------

var PluginParameters = [];

var paramTrigger = "Trigger Note";
var paramInterval = "Trill Interval";
var paramTempo = "Tempo";
var paramSpeed = "Trill Speed";
var paramSync = "Sync to Tempo";

function buildAllPitchMenu() {
    var result = [];
    for (var i = 0; i < 120; i++) {
        result.push(MIDI.noteName(i));
    }
    return result;
}

var allPitchMenuList = buildAllPitchMenu();

PluginParameters.push({name: paramTrigger,       //0
                       type: "menu",
               valueStrings: allPitchMenuList,
                   minValue: 0,
                   maxValue: 119,
               defaultValue: 60,
              numberOfSteps: 119});

PluginParameters.push({name: paramInterval,      //1
                       type: "lin",
                   minValue: 0,
                   maxValue: 12,
               defaultValue: 2,
              numberOfSteps: 12,
                       unit: " st"});

PluginParameters.push({name: paramSpeed,         //2
                       type: "lin",
                   minValue: 5,
                   maxValue: 2000,
               defaultValue: 150,
              numberOfSteps: 1995,
                       unit: " ms"});

                       
PluginParameters.push({name: paramSync,          //a
                       type: "menu",
               valueStrings: ["no", "yes"],
                   minValue: 0,
                   maxValue: 1,
               defaultValue: 0,
              numberOfSteps: 1});
              
PluginParameters.push({name: paramTempo,         //b
                       type: "lin",
                   minValue: 10,
                   maxValue: 250,
               defaultValue: 120,
              numberOfSteps: 240,
                       unit: " bpm"});
