

//------------------------------------MAIN--------------------------------------



function HandleMIDI(e) {
    if (e instanceof pitch) {
        e.pitch = 60;
        e.send();
    } else {
        e.send();
    }
}

