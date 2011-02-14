# Disclaimer

THIS CODE WAS WRITTEN WITHIN HOURS FOR A COMPETITION, IT WAS CLOBBERED TOGETHER FROM EXISTING JAVASCRIPT AND HTML, IT IS PURE POC.

# JSONLoops

JSONLoops is a multi-user audio sequencer reminiscent of Fruityloops. Audio playback is handled by node.js servers, while multiple browsers act as control devices. Songs are stored in the JSONloop format, which are simply nested JSON arrays. 


## Installation (coming soon)

   npm install JSONloops

You'll also need to install irrKlang and compile node as 32 bit. We'll be replacing this with a much easier process soon.

## Usage

    git clone https://github.com/marak/jsonloops
    cd jsonloops
    node server.js
  
The audio sequencer will now start playing on your local machine, you'll hear sounds. To access a control interface for your JSONloops server, visit http://localhost:8080/


## Why did you build this?

Because I'm insane.


## The JSONLoop format

A JSONLoop is nothing but a nested JSON array that follows a somewhat specific format.

    the arrays are nested in the following hierarchy 
    
    * SONG
    *   TRACKS
    *     MEASURES
    *       BEATS
  
Check out the [nyc.json](https://github.com/Marak/JSONloops/blob/master/loops/nyc.json) file or [metronome.json](https://github.com/Marak/JSONloops/blob/master/loops/metronome.json) file for example loops.

## Authors

[Marak Squires](https://github.com/marak/) - Created project, JavaScript, HTML, CSS, invented the JSONloops format, built core sequencing code

[Elijah Insua](https://github.com/tmpvar/) - Writer of C bindings, solver of the hard problems

[hij1nx](https://github.com/hij1nx/) - Writer of C bindings, JavaScript, HTML, CSS UX and UI.

