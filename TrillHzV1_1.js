/*
 * ---Trill v1.1
 * Copyright © 2014 by Qingyang (Tom) Xi
 * for feedback and suggestions and support: qingyang.xi@icloud.com 
 */


//----------------------------Gloabal Variables---------------------------------
var processSwitch = false;
var midiRelay;
var noteStartTime;
var iterCheck = 0;
var rythmList = [1/96, 1/64, 1/48, 1/32, 1/24, 1/16, 1/12, 1/8, 1/6, 1/4];


//---------------------------------BODY-----------------------------------------
function syncToHerz(myTempo, myRythm) {
    var numberPerBeat = 1 / (rythmList[myRythm] * 4);
    return (numberPerBeat * myTempo / 60); 
}



function HandleMIDI(e) {
    if (e instanceof NoteOn 
        && (GetParameter(paramTrigger) == 0
        || e.pitch == GetParameter(paramTrigger) + 20 )) {
        processSwitch = true;
        midiRelay = e;
        noteStartTime = new Date().getTime();
    } else if (e instanceof NoteOff 
        && (GetParameter(paramTrigger) == 0
        || e.pitch == GetParameter(paramTrigger) + 20 )) {
        processSwitch = false;
        iterCheck = 0;
    } else {
        e.send();
    }
}

function ProcessMIDI() {
    if (processSwitch) {
        var noteLength = new Date().getTime() - noteStartTime;
        var Hz = GetParameter(paramHz);
        var noteIter = noteLength * Hz / 1000;
        var offAfter = 1 / Hz * 1000;
        
        if (noteIter >= iterCheck) {
            var on = new NoteOn(midiRelay);
            var deltaVel = GetParameter(paramVelRan) * 2 * Math.random() - GetParameter(paramVelRan);
            on.velocity = MIDI.normalizeData(on.velocity + deltaVel);
            if (iterCheck % 2 == 1) {
                on.pitch += GetParameter(paramInterval);
            }
            var off = new NoteOff(on);
            on.send();
            off.sendAfterMilliseconds(offAfter * 1.1);
            iterCheck += 1;    
        }
    } 
}

//---------------------------------USER CONTROLS--------------------------------

var PluginParameters = [];

var paramTrigger = "Trigger Note";
var paramInterval = "Tremolo Interval";
var paramHz = "Hertz";
var paramVelRan = "Velocity Randomizer";

function buildAllPitchMenu() {
    var result = [];
    result.push("All Notes");
    for (var i = 21; i < 109; i++) {
        result.push(MIDI.noteName(i));
    }
    return result;
}

var allPitchMenuList = buildAllPitchMenu();
var rythmMenuList = ["64th Triplet", "64th Notes", "32nd Triplet", "32nd Notes", 
                     "16th Triplet", "16th Notes", "8th Triplet", "8th Notes",
                     "Quarter Triplet", "Quarter Notes"];
  
PluginParameters.push({name: paramTrigger,       //0
                       type: "menu",
               valueStrings: allPitchMenuList,
                   minValue: 0,
                   maxValue: 88,
               defaultValue: 0,
              numberOfSteps: 88});

PluginParameters.push({name: paramInterval,      //1
                       type: "lin",
                   minValue: -12,
                   maxValue: 12,
               defaultValue: 0,
              numberOfSteps: 24,
                       unit: " st"});

PluginParameters.push({name: paramHz,            //2
                       type: "lin",
                   minValue: 1,
                   maxValue: 30,
               defaultValue: 10,
              numberOfSteps: 290,
                       unit: " Hz"});
            
                       
PluginParameters.push({name: paramVelRan,        //3
                       type: "lin",
                   minValue: 0,
                   maxValue: 10,
               defaultValue: 2,
              numberOfSteps: 10,
                       unit: " (+/-)"});                       
                       