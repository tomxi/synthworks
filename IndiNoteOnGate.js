function ban(e, fTrigMode, counterDict) {
    if (counterDict[e.pitch] < fTrigMode) {
        return false;
    } else {
        return true;
    }
}

//------------------------------------MAIN--------------------------------------

var gpTrigMode;
var counterDict;

function HandleMIDI(e) {
    var kill = ban(e, gpTrigMode, counterDict);
    Trace(kill)
    if (kill == false && e instanceof NoteOn) {
        counterDict[e.pitch] += 1
        e.send()
    } else if (kill && e instanceof NoteOn) {
        Trace("Note Banned")
    } else {
        e.send()
    }
}

//---------------------------ParameterChanged-----------------------------
function ParameterChanged(param, value) {

    gpTrigMode = GetParameter(pTrigMode);
    counterDict = buildCounterDict()
}

//--------------------------------USER CONTROLS--------------------------------

var PluginParameters = [];

var pTrigMode = "How many passes?";                 //menu: 0=>127, 127=>0

function buildCounterDict() {
    var result = {};
    for (var i = 0; i < 128; i++) {
        result[i] = 0
    }
    return result;
}

PluginParameters.push({name: pTrigMode,     //3
                       type: "lin",
                   minValue: 1,
                   maxValue: 10,
               defaultValue: 1,
              numberOfSteps: 9});
