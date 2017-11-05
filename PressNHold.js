var cdTrig = false
var startTime


function sendCC(ch, number, value) {
    var cc = new ControlChange;
    cc.channel = ch;
    cc.number = number;
    cc.value = value;
    cc.send();
}

function HandleMIDI(e) {
    if (e instanceof NoteOn) {
        startTime = new Date();
        cdTrig = true
    } else {
        cdTrig = false
    }
}

function ProcessMIDI() {
    if (cdTrig) {
        var now = new Date();
        var elapsedTime = now - startTime;
        if (elapsedTime >= GetParameter(pDur)) {
            sendCC(2, 89, 127)
        }
    }
}


//--------------------------------USER CONTROLS--------------------------------

var PluginParameters = [];
var pDur = "Holding Duration";          

PluginParameters.push({name: pDur,           //0
                       type: "lin",
                   minValue: 0,
                   maxValue: 5,
               defaultValue: 3,
              numberOfSteps: 50});

