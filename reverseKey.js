/*
 * ---Reversed Keyboard
 * Copyright © 2015 SynthWorks.nyc
 * for feedback and suggestions and support, visit www.synthworks.nyc 
 */

function HandleMIDI(e) {
    if (e instanceof Note) {
        pitchIn = e.pitch;
        pitchOut = -pitchIn + 129;
        e.pitch = pitchOut;

        e.send();

    } else {
        e.send()
    }
}



