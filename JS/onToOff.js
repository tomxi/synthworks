
// -----------------------~~~~~~CHANGE ME~~~~~-------------------------------
// NoteOn (on trigPitch) to NoteOff (on susPitch)
// Change trigPitch to the pitch you want to play to turn off the sustain 
// on susPitch.
trigPitch = 62;  // D above middle C
susPitch = 60; 	// Change this pitch to the susPitch in Kill NoteOff


// ---------------------DONT CHANGE BELOW THIS LINE--------------------------
function HandleMIDI(e) {
e.send(); // Comment this line out if doesn't want the trigger pitch to sound.
	if (e instanceof NoteOn && e.velocity != 0 && e.pitch == trigPitch) { 		
		e.velocity = 0;
		e.pitch = susPitch;
		e.send();
	}
}