/*
 * ---Glissando v1.2
 * Copyright © 2014 by Qingyang (Tom) Xi
 * for feedback and suggestions and support: qingyang.xi@icloud.com 
 */

//----------------------------Gloabal Variables---------------------------------
var naturalPitches = buildNaturalPitchesList(); //list of numbers (0-119)

var alteredPitchList = [];//where readied pitches are stored in list form
//-----------------------------Helper Functions---------------------------------
function buildNaturalPitchesList() {
    var result = [];
    naturalsInOctave = [0, 2, 4, 5, 7, 9, 11];
    for (var octave = 0; octave < 10; octave++) {
        for (var noteIndex = 0; noteIndex < 7; noteIndex++) {
            result.push(octave * 12 + naturalsInOctave[noteIndex]);
        }
    }
    return result;
}

function buildGlissList() {
    var start = GetParameter(paramStartingNote);
    var end = GetParameter(paramEndingNote);
    if (end > start) {
        return naturalPitches.slice(start, end + 1);
    } else if (end < start) {
        return naturalPitches.slice(end, start + 1).reverse();
    } else {
        return naturalPitches[start];
    }
}

function noteNameForPitch(pitch) {
    switch (pitch % 12) {
        case 0:
            return "C";
        case 2:
            return "D";
        case 4:
            return "E";
        case 5:
            return "F";
        case 7:
            return "G";
        case 9:
            return "A";
        case 11:
            return "B";
    }
}

function alteredPitch(pitch) {
    return pitch + GetParameter(noteNameForPitch(pitch)) - 1;
}

function alteredList(pitchList) {
    var result = [];
    for (var i in pitchList) {
        result.push(alteredPitch(pitchList[i]));
    }
    return result;
}

function buildTimeList(totalTime, glissLength) {
    var result = [];
    switch (GetParameter(paramSpeedTyep)) {
        case 0:
            for (var i = 0; i<glissLength; i++) {
                result.push(i * totalTime / (glissLength - 1));
            }
            return result;

        case 1:
            var exp = GetParameter(paramExp);
            for (var j = 0; j<glissLength; j++) {
                result.push(Math.pow(j, exp) * totalTime / Math.pow((glissLength - 1), exp));
            }
            return result;
    }
}

function buildVeloList(glissLength) {
    var result = [];
    var totalDVelo = GetParameter(paramVeloEnd) - GetParameter(paramVeloStart);
    var stepDVelo = totalDVelo / (glissLength - 1.0);
    for (var i = 0; i<glissLength; i++) {
        result.push(GetParameter(paramVeloStart) + i * stepDVelo);
    }
    return result;
}
//---------------------------------BODY-----------------------------------------
function HandleMIDI(e) {
    if (e instanceof NoteOn && 
        e.pitch == GetParameter(paramTrigger) && 
        alteredPitchList.length > 1) 
        {
        var msPerBeat = 60000.00 / GetParameter(paramTempo);
        var totalTime = msPerBeat * GetParameter(paramDuration);
        
        var timeList = buildTimeList(totalTime, alteredPitchList.length);
        var veloList = buildVeloList(alteredPitchList.length);
        
        for (var i in timeList) {
            var on = new NoteOn();
            on.pitch = alteredPitchList[i];
            on.velocity = veloList[i];
            on.sendAfterMilliseconds(timeList[i]);
            var off = new NoteOff(on);
            off.sendAfterMilliseconds(timeList[i] + GetParameter(paramCutOff));
        }
    } else {
        e.send();
    }
}

//---------------------------------ParameterChanged-----------------------------
function ParameterChanged(param, value) {
    var glissPitchList = buildGlissList();
    alteredPitchList = alteredList(glissPitchList);
}

//---------------------------------USER CONTROLS--------------------------------
var PluginParameters = [];


var paramTrigger = "Trigger Note";
var paramStartingNote = "Starting Note";
var paramEndingNote = "Ending Note";
var paramTempo = "Tempo";
var paramDuration = "Gliss Duration";
var paramCutOff = "Single Note Duration";
var paramVeloStart = "Starting Velocity";
var paramVeloEnd = "Ending Velocity";
var paramSpeedTyep = "Glissando type";
var paramExp = "Log Gliss Control";

var alterationsMenu = ["Flat", "Natural", "Sharp"];
var pitches = ["A", "B", "C", "D", "E", "F", "G"];
var speedTyepMenu = ["Linear/Even", "Logrhythmic"];

function buildPitchMenu() {
    var result = [];
    for (var i in naturalPitches) {
        result.push(MIDI.noteName(naturalPitches[i]));
    }
    return result;
}

function buildAllPitchMenu() {
    var result = [];
    for (var i = 0; i < 120; i++) {
        result.push(MIDI.noteName(i));
    }
    return result;
}

var pitchMenuList = buildPitchMenu();
var allPitchMenuList = buildAllPitchMenu();


PluginParameters.push({name: paramTrigger,       //0
                       type: "menu",
               valueStrings: allPitchMenuList,
                   minValue: 0,
                   maxValue: 119,
               defaultValue: 60,
              numberOfSteps: 119});

PluginParameters.push({name: paramStartingNote,  //1
                       type: "menu",
               valueStrings: pitchMenuList,
                   minValue: 0,
                   maxValue: 69,
               defaultValue: 35,
              numberOfSteps: 69});


PluginParameters.push({name: paramEndingNote,    //2
                       type: "menu",
               valueStrings: pitchMenuList,
                   minValue: 0,
                   maxValue: 69,
               defaultValue: 49,
              numberOfSteps: 69});

PluginParameters.push({name: paramTempo,         //3
                       type: "lin",
                   minValue: 10,
                   maxValue: 250,
               defaultValue: 120,
              numberOfSteps: 240,
                       unit: " bpm"});
              
PluginParameters.push({name: paramDuration,      //4
                       type: "lin",
                   minValue: 0.1,
                   maxValue: 10,
               defaultValue: 1,
              numberOfSteps: 198,
                       unit: " beats"});
                       
PluginParameters.push({name: paramCutOff,        //5
                       type: "lin",
                   minValue: 50,
                   maxValue: 6000,
               defaultValue: 100,
              numberOfSteps: 5950,
                       unit: " ms"});

PluginParameters.push({name: paramVeloStart,     //6
                       type: "lin",
                   minValue: 0,
                   maxValue: 127,
               defaultValue: 60,
              numberOfSteps: 127});

PluginParameters.push({name: paramVeloEnd,       //7
                       type: "lin",
                   minValue: 0,
                   maxValue: 127,
               defaultValue: 110,
              numberOfSteps: 127}); 
              
PluginParameters.push({name: paramSpeedTyep,     //8
                       type: "menu",
               valueStrings: speedTyepMenu,
                   minValue: 0,
                   maxValue: 1,
               defaultValue: 1,
              numberOfSteps: 1});

PluginParameters.push({name: paramExp,           //9
                       type: "lin",
                   minValue: 0.01,
                   maxValue: 3,
               defaultValue: 0.7,
              numberOfSteps: 299});

for (var i in pitches) {                         //10-16
    PluginParameters.push({name: pitches[i],
                           type: "menu",
                   valueStrings: alterationsMenu,
                  numberOfSteps: 2,
                       minValue: 0,
                       maxValue: 2,
                   defaultValue: 1});
}