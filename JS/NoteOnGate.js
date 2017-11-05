function ban(e, fTrigMode, counter) {
    if (counter < fTrigMode) {
        return false;
    } else {
        return true;
    }
}


//------------------------------------MAIN--------------------------------------

var gpTrigger;
var gpTrigMode;
var counter


function HandleMIDI(e) {
    var kill = ban(e, gpTrigMode, counter);
    Trace(kill)
    if (kill == false 
        && e instanceof NoteOn 
        && e.pitch == MIDI.noteNumber(mTrigger[gpTrigger]))
    {
        counter +=1
        e.send()
    } else if (kill 
               && e instanceof NoteOn
               && e.pitch == MIDI.noteNumber(mTrigger[gpTrigger])) {
        Trace("Note Banned")
    } else {
        e.send()
    }
    Trace(counter)
}

//---------------------------ParameterChanged-----------------------------
function ParameterChanged(param, value) {
    gpTrigger  = GetParameter(pTrigger);
    gpTrigMode = GetParameter(pTrigMode);
    
    onetimeThrough = true;
    counter = 0;
}

//--------------------------------USER CONTROLS--------------------------------

var PluginParameters = [];

var pTrigger = "Trigger Note";                  //menu: [21-109)Def:60
var pTrigMode = "How many passes?";                 //menu: 0=>127, 127=>0


function buildKeyPitchMenu() {
    var result = [];
    for (var i = 21; i < 109; i++) {
        result.push(MIDI.noteName(i));
    }
    return result;
}


var mTrigger = buildKeyPitchMenu();




    

PluginParameters.push({name: pTrigger,      //2
                       type: "menu",
               valueStrings: mTrigger,
                   minValue: 0,
                   maxValue: 87,
               defaultValue: 39,
              numberOfSteps: 87});

PluginParameters.push({name: pTrigMode,     //3
                       type: "lin",
                   minValue: 1,
                   maxValue: 10,
               defaultValue: 1,
              numberOfSteps: 9});
