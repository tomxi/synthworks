
// -----------------------~~~~~~CHANGE ME~~~~~-------------------------------
// Kill NoteOff (on susPitch)
//change 60 to the pitch you want to have the NoteOff ignored. 60 is middle C.
susPitch = 60;


// ---------------------DONT CHANGE BELOW THIS LINE--------------------------
function HandleMIDI(e) {
	if (e instanceof NoteOn && e.velocity == 0 && e.pitch == susPitch) {  		
		// Do Nothing
		Trace('NoteOn 0.');
	} else if (e instanceof NoteOff && e.pitch == susPitch) {
		// Still does nothing.
		Trace('NoteOff');
	} else {
		Trace('pass');
		e.send();
	}
}