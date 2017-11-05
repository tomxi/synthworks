/*
 * ---Glissando 1.0
 * Copyright © 2014 by Qingyang (Tom) Xi
 * for feedback and suggestions and support: qingyang.xi@icloud.com 
 */

//----------------------------Gloabal Variables----------------------------------
var naturalPitches = buildNaturalPitchesList();
var pitchMenuList = buildPitchMenu();

var paramStartingNote = "Trigger/Starting Note";
var paramEndingNote = "Ending Note";
var paramTempo = "Tempo";
var paramDuration = "Gliss Duration";
var paramCutOff = "Single Note Duration";
var paramVeloStart = "Starting Velocity";
var paramVeloEnd = "Ending Velocity";
var paramSpeedTyep = "Glissando type";
var paramExp = "Logrhythmic Glissando Control";

var alteredPitchList = [];
var alterationsMenu = ["Flat", "Natural", "Sharp"];
var pitches = ["A", "B", "C", "D", "E", "F", "G"];
var speedTyepMenu = ["Linear/Even", "Logrhythmic"];


//-----------------------------Helper Functions----------------------------------
function buildNaturalPitchesList() {
    var result = [];
    naturalsInOctave = [0, 2, 4, 5, 7, 9, 11];
    for (var octave = 1; octave < 9; octave++) {
        for (var noteIndex = 0; noteIndex < 7; noteIndex++) {
            result.push(octave * 12 + naturalsInOctave[noteIndex]);
        }
    }
    result.push(108);
    return result;
}

function c4NoteName(number) {
    return MIDI.noteName(number+12);
}

function c4NoteNumber(string) {
    return MIDI.noteNumber(string) - 12;
}

function buildGlissList() {
    return naturalPitches.slice(GetParameter(paramStartingNote),GetParameter(paramEndingNote)+1);
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
    for (i in pitchList) {
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
        case 1:
            var exp = GetParameter(paramExp);
            for (var i = 0; i<glissLength; i++) {
                result.push(Math.pow(i, exp) * totalTime / Math.pow((glissLength - 1), exp));
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
//---------------------------------BODY------------------------------------------
function HandleMIDI(e) {
    var triggerNote = naturalPitches[GetParameter(paramStartingNote)];
    if (e instanceof NoteOn && 
        e.pitch == triggerNote && 
        alteredPitchList.length > 1) 
        {
        var msPerBeat = 60000.00 / GetParameter(paramTempo);
        var totalTime = msPerBeat * GetParameter(paramDuration);
        var timeList = buildTimeList(totalTime, alteredPitchList.length);
        var veloList = buildVeloList(alteredPitchList.length);
        
        for (var i in timeList) {
            var on = new NoteOn;
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

//---------------------------------ParameterChanged------------------------------
function ParameterChanged(param, value) {
    var glissPitchList = buildGlissList();
    alteredPitchList = alteredList(glissPitchList);
    //Trace(alteredPitchList);
}

//---------------------------------USER CONTROLS---------------------------------

var PluginParameters = [];

function buildPitchMenu() {
    var result = [];
    for (var i in naturalPitches) {
        result.push(c4NoteName(naturalPitches[i]));
    }
    return result;
}

PluginParameters.push({name: paramStartingNote,  //0
                       type: "menu",
               valueStrings: pitchMenuList,
                   minValue: 0,
                   maxValue: 56,
               defaultValue: 28,
              numberOfSteps: 56});


PluginParameters.push({name: paramEndingNote,    //1
                       type: "menu",
               valueStrings: pitchMenuList,
                   minValue: 0,
                   maxValue: 56,
               defaultValue: 35,
              numberOfSteps: 56});

PluginParameters.push({name: paramTempo,         //2
                       type: "lin",
                   minValue: 10,
                   maxValue: 250,
               defaultValue: 120,
              numberOfSteps: 240,
                       unit: " bpm"});
              
PluginParameters.push({name: paramDuration,      //3
                       type: "lin",
                   minValue: 0.1,
                   maxValue: 10,
               defaultValue: 1,
              numberOfSteps: 198,
                       unit: " beats"});
                       
PluginParameters.push({name: paramCutOff,        //4
                       type: "lin",
                   minValue: 50,
                   maxValue: 6000,
               defaultValue: 100,
              numberOfSteps: 5950,
                       unit: " ms"});

PluginParameters.push({name: paramVeloStart,     //5
                       type: "lin",
                   minValue: 0,
                   maxValue: 127,
               defaultValue: 60,
              numberOfSteps: 127});

PluginParameters.push({name: paramVeloEnd,       //6
                       type: "lin",
                   minValue: 0,
                   maxValue: 127,
               defaultValue: 110,
              numberOfSteps: 127}); 
              
PluginParameters.push({name: paramSpeedTyep,     //7
                       type: "menu",
               valueStrings: speedTyepMenu,
                   minValue: 0,
                   maxValue: 1,
               defaultValue: 0,
              numberOfSteps: 1});

PluginParameters.push({name: paramExp,     //8
                       type: "lin",
                   minValue: 0.01,
                   maxValue: 3,
               defaultValue: 0.7,
              numberOfSteps: 299});

for (var i in pitches) {
    PluginParameters.push({name: pitches[i],
                           type: "menu",
                   valueStrings: alterationsMenu,
                  numberOfSteps: 2,
                       minValue: 0,
                       maxValue: 2,
                   defaultValue: 1});
}