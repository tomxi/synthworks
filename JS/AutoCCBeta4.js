/*
 * ---SynthWorks AutoCC Beta4 by Tom Xi and Brian Li
 * Copyright © 2014 SYNTHWORKS, LLC
 * for feedback, suggestions, and support: support@synthworks.nyc 
 */

//---------------------------Helper Functions-----------------------------------


function buildOnOffList(fTempo, fDuration, fDelay) {
/*Return this list: [onset(ms), duration(ms)]*/
    var on = Number(fDelay) / Number(fTempo) * 60000;
    var dur = (Number(fDuration) / Number(fTempo) * 60000);
    return [on, dur];
}

function buildTimeList(fOnOffList, fSType, fSExp) {
/*Return a list of length 128 in ms. 
  fSType: [Linear, Log]
  fOnOffList: [onset(ms), duration(ms)]*/
    var result = [];
    var on = fOnOffList[0];
    var dur = fOnOffList[1];
    switch (fSType) {
        case 0: //Linear
            for (var i = 0; i < 128; i++) {
                result.push((i * dur / 127) + on);
            }
            return result;

        case 1: //Log
            for (var j = 0; j < 128; j++) {
                result.push((Math.pow(j,fSExp) * dur / Math.pow(127,fSExp))+on);
            }
            return result;
    }
}

function buildCCList(fDir) {
/*Return a list from 0-127 or 127-0 according to fDir. 
  fDir: (0:incresing, 1:decresing)*/
    var result = [];
    switch (fDir) {
        case 0: //incresing
            for (var i = 0; i < 128; i++) {
                result.push(i);
            }
            return result;

        case 1: //decresing
            for (var i = 127; i >= 0; i--) {
                result.push(i);
            }
            return result;
    }
}

function triggerBool(e, fTriggerMenu, fTrigger, fTrigMode) {
/*Return True or False depending on Trigger conditions.
  fTriggerMenu: a list of strings of the note names
  fTrigger: MIDI note values
  fTrigMod: [Once Only, Every Time]*/
    tNote = MIDI.noteNumber(fTriggerMenu[fTrigger]);
    switch (fTrigMode) {
        case 0: //once only
            if (e instanceof NoteOn && e.pitch == tNote && onetimeThrough) {
                onetimeThrough = false;
                return true;
            } else {
                return false;
            }

        case 1: //EveryTime
            if (e instanceof NoteOn && e.pitch == tNote) {
                return true;
            } else {
                return false;
            }
    }
}

function sendCC(ch, number, value) {
    var cc = new ControlChange;
    cc.channel = ch;
    cc.number = number;
    cc.value = value;
    cc.send();
}

//------------------------------------MAIN--------------------------------------
var onetimeThrough = true;
var onOffList;
var timeList;
var CCList;
var ch;
var processSwitch;
var startTime;
var CCIter;
var gpTarget;
var gpTrigger;
var gpTrigMode;


function HandleMIDI(e) {
    e.send();
    
    var trigger = triggerBool(e, mTrigger, gpTrigger, gpTrigMode);

    if (trigger) {
        startTime = new Date();
        processSwitch = true;
        CCIter = 0;
    }
}

function ProcessMIDI() {
    if (CCIter > 127) {
        CCIter = 0;
        Trace("Finished. It took " + (new Date() - startTime) + " ms.");
        processSwitch = false;
    }
    if (processSwitch) {
        var now = new Date();
        var elapsedTime = now - startTime;
        if (elapsedTime >= timeList[CCIter]) {
            while (elapsedTime > timeList[CCIter+1]) {
                CCIter += 1;
            }
            sendCC(ch, gpTarget, CCList[CCIter]);
            CCIter += 1;
        }
    }
}

//---------------------------------ParameterChanged-----------------------------
function ParameterChanged(param, value) {

    
    var gpCh = GetParameter(pCh);
    var gpTempo = GetParameter(pTempo);
    var gpDuration = GetParameter(pDuration);
    var gpDelay = GetParameter(pDelay);
    var gpDir = GetParameter(pDir);
    var gpSType = GetParameter(pSType);
    var gpSExp = GetParameter(pSExp);
    gpTarget = GetParameter(pTarget);
    gpTrigger  = GetParameter(pTrigger);
    gpTrigMode = GetParameter(pTrigMode);
    
    onetimeThrough = true;
    onOffList = buildOnOffList(gpTempo, gpDuration, gpDelay);
    timeList = buildTimeList(onOffList, gpSType, gpSExp);
    CCList = buildCCList(gpDir);
    ch = Number(mCh[gpCh]);
    processSwitch = false;
    CCIter = 0;
}

//--------------------------------USER CONTROLS--------------------------------

var PluginParameters = [];

var pCh = "Output MIDI Channel";                                                 //Menu: 1-16
var pTarget = "Target Controller Number";    //menu: 0-127   Def:1
var pTrigger = "Trigger Note";                  //menu: [21-109)Def:60
var pTrigMode = "Trigger Mode";                 //menu: 0=>127, 127=>0
var pTempo = "Tempo";                                 //lin: 25-250 (BPM)
var pDuration = "Duration";                       //lin:
var pDelay = "Delayed Onset";                     //lin:
var pDir = "Sweep Direction";                //menu:
var pSType = "Sweep Type";                     //menu: Linear Log
var pSExp = "Log Curve";                        //lin:

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

function buildChMenu() {
    var result = [];
    for (var i = 0; i < 16; i++) {
        result.push(String(i+1));
    }
    return result;
}

var mTarget = buildCCMenu();
var mTrigger = buildKeyPitchMenu();
var mTrigMode = ["1st Time", "Always"];
var mDir = ["0 -> 127", "127 -> 0"];
var mSType = ["Linear", "Log"];
var mCh = buildChMenu();



PluginParameters.push({name: pCh,           //0
                       type: "menu",
               valueStrings: mCh,
                   minValue: 0,
                   maxValue: 15,
               defaultValue: 0,
              numberOfSteps: 15});


PluginParameters.push({name: pTarget,       //1
                       type: "menu",
               valueStrings: mTarget,
                   minValue: 0,
                   maxValue: 127,
               defaultValue: 1,
              numberOfSteps: 127});
    

PluginParameters.push({name: pTrigger,      //2
                       type: "menu",
               valueStrings: mTrigger,
                   minValue: 0,
                   maxValue: 87,
               defaultValue: 39,
              numberOfSteps: 87});

PluginParameters.push({name: pTrigMode,     //3
                       type: "menu",
               valueStrings: mTrigMode,
                   minValue: 0,
                   maxValue: 1,
               defaultValue: 0,
              numberOfSteps: 1});

PluginParameters.push({name: pTempo,        //4
                       type: "lin",
                   minValue: 25,
                   maxValue: 250,
               defaultValue: 120,
              numberOfSteps: 225,
                       unit: " BPM"});

PluginParameters.push({name: pDuration,     //5
                       type: "lin",
                   minValue: 0.1,
                   maxValue: 40,
               defaultValue: 2,
              numberOfSteps: 399,
                       unit: " Beats"});
    
PluginParameters.push({name: pDelay,        //6
                       type: "lin",
                   minValue: 0,
                   maxValue: 40,
               defaultValue: 0,
              numberOfSteps: 400,
                       unit: " Beats"});
    
PluginParameters.push({name: pDir,          //7
                       type: "menu",
               valueStrings: mDir,
                   minValue: 0,
                   maxValue: 1,
               defaultValue: 0,
              numberOfSteps: 1});
    
PluginParameters.push({name: pSType,        //8
                       type: "menu",
               valueStrings: mSType,
                   minValue: 0,
                   maxValue: 1,
               defaultValue: 0,
              numberOfSteps: 1});
    
PluginParameters.push({name: pSExp,         //9
                       type: "lin",
                   minValue: 0.5,
                   maxValue: 2,
               defaultValue: 1.00,
              numberOfSteps: 150});