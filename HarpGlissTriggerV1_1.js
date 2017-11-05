/*
 * ---SynthWorks Harp Gliss Trigger v1.0 by Tom Xi and Brian Li
 * Copyright © 2014 SYNTHWORKS, LLC
 * for feedback, suggestions, and support: support@synthworks.nyc 
 */

//----------------------------Gloabal Variables---------------------------------
var naturalPitches = buildNaturalPitchesList(); //list of numbers (0-119)
var alteredPitchList = [];//where readied pitches are stored in list form
var msPerBeat
var totalTime
var timeList
var offTimeList
var veloList
//-----------------------------Helper Functions---------------------------------
function buildNaturalPitchesList() {
    var result = [21,23];
    naturalsInOctave = [0, 2, 4, 5, 7, 9, 11];
    for (var octave = 2; octave < 9; octave++) {
        for (var noteIndex = 0; noteIndex < 7; noteIndex++) {
            result.push(octave * 12 + naturalsInOctave[noteIndex]);
        }
    }
    result.push(108);
    return result;
}

function buildGlissList() {
    var start = GetParameter(paramStartingNote);
    var end = GetParameter(paramEndingNote);
    if (end >= start) {
        return naturalPitches.slice(start, end + 1);
    } else if (end < start) {
        return naturalPitches.slice(end, start + 1).reverse();
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
    switch (GetParameter(paramSpeedType)) {
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

function buildOffTimeList(timeList, overlap) {
    var shifted = timeList.slice(1);
    l = timeList.length;
    shifted.push(2*timeList[l-1]-timeList[l-2]);
    addOverlap = function(i) {return (i + overlap)}
    return shifted.map(addOverlap);
}

function buildVeloList(glissLength) {
    var result = [];
    var totalDVelo = GetParameter(paramVeloEnd) - GetParameter(paramVeloStart);
    var stepDVelo = totalDVelo / Math.max(1, (glissLength - 1.0));
    for (var i = 0; i<glissLength; i++) {
        result.push(GetParameter(paramVeloStart) + i * stepDVelo);
    }
    return result;
}
//---------------------------------BODY-----------------------------------------
function HandleMIDI(e) {
    if (e instanceof Note && 
        alteredPitchList.length != 1 &&
        (GetParameter(paramTrigger) == 0 || e.pitch == (GetParameter(paramTrigger)+20))) 
        {
        if (e instanceof NoteOn){
            for (var i in timeList) {
                var on = new NoteOn();
                on.pitch = alteredPitchList[i];
                on.velocity = veloList[i];
                on.sendAfterMilliseconds(timeList[i]);
                var off = new NoteOff(on);
                off.sendAfterMilliseconds(offTimeList[i]);
            }
        }
    } else {
        e.send();
    }
}

//---------------------------------ParameterChanged-----------------------------
function ParameterChanged(param, value) {
    var glissPitchList = buildGlissList();
    alteredPitchList = alteredList(glissPitchList);
    msPerBeat = 60000.00 / GetParameter(paramTempo);
    totalTime = msPerBeat * GetParameter(paramDuration);        
    timeList = buildTimeList(totalTime, alteredPitchList.length);
    offTimeList = buildOffTimeList(timeList, GetParameter(paramOverlap));
    veloList = buildVeloList(alteredPitchList.length);
}

//---------------------------------USER CONTROLS--------------------------------
var PluginParameters = [];


var paramTrigger = "Trigger Note";
var paramStartingNote = "Start Note";
var paramEndingNote = "End Note";
var paramTempo = "Tempo";
var paramDuration = "Gliss Duration";
var paramVeloStart = "Start Velocity";
var paramVeloEnd = "End Velocity";
var paramSpeedType = "Velocity Curve";
var paramExp = "ND Curve";
var paramOverlap = "Legato Overlap";

var alterationsMenu = ["Flat", "Natural", "Sharp"];
var pitches = ["A", "B", "C", "D", "E", "F", "G"];
var speedTypeMenu = ["Linear", "Logarithmic"];

function buildPitchMenu() {
    var result = [];
    for (var i in naturalPitches) {
        result.push(MIDI.noteName(naturalPitches[i]));
    }
    return result;
}

function buildAllPitchMenu() {
    var result = [];
    result.push('All Notes');
    for (var i = 21; i < 109; i++) {
        result.push(MIDI.noteName(i));
    };
    return result;
}

var pitchMenuList = buildPitchMenu();
var allPitchMenuList = buildAllPitchMenu();


PluginParameters.push({name: paramTrigger,       //0
                       type: "menu",
               valueStrings: allPitchMenuList,
                   minValue: 0,
                   maxValue: 88,
               defaultValue: 0,
              numberOfSteps: 88});

PluginParameters.push({name: paramStartingNote,  //1
                       type: "menu",
               valueStrings: pitchMenuList,
                   minValue: 0,
                   maxValue: 51,
               defaultValue: 23,
              numberOfSteps: 51});


PluginParameters.push({name: paramEndingNote,    //2
                       type: "menu",
               valueStrings: pitchMenuList,
                   minValue: 0,
                   maxValue: 51,
               defaultValue: 37,
              numberOfSteps: 51});

PluginParameters.push({name: paramTempo,         //3
                       type: "lin",
                   minValue: 10,
                   maxValue: 250,
               defaultValue: 120,
              numberOfSteps: 240,
                       unit: " bpm"});
              
PluginParameters.push({name: paramDuration,      //4
                       type: "lin",
                   minValue: 0.5,
                   maxValue: 10,
               defaultValue: 2,
              numberOfSteps: 38,
                       unit: " beats"});

PluginParameters.push({name: paramOverlap,      //5
                       type: "lin",
                   minValue: 0,
                   maxValue: 1000,
               defaultValue: 50,
              numberOfSteps: 1000,
                       unit: "ms"});                       

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
              
PluginParameters.push({name: paramSpeedType,     //8
                       type: "menu",
               valueStrings: speedTypeMenu,
                   minValue: 0,
                   maxValue: 1,
               defaultValue: 1,
              numberOfSteps: 1});

PluginParameters.push({name: paramExp,           //9
                       type: "lin",
                   minValue: 0.5,
                   maxValue: 2,
               defaultValue: 0.8,
              numberOfSteps: 150});

for (var i in pitches) {                         //10-16
    PluginParameters.push({name: pitches[i],
                           type: "menu",
                   valueStrings: alterationsMenu,
                  numberOfSteps: 2,
                       minValue: 0,
                       maxValue: 2,
                   defaultValue: 1});
}