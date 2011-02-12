# JSONLoops

JSONLoops is a multi-user audio sequencer reminiscent of Fruityloops. Audio playback is handled by node.js servers, while multiple browsers act as control devices. Songs are stored in the JSONloop format, which simply nested JSON arrays. 


## Installation (coming soon)

   npm install JSONloops

## Usage

  git clone https://github.com/marak/jsonloops
  cd jsonloops
  node server.js
  
The audio sequencer will now start playing on your local machine, you'll hear sounds. To access a control interface for your JSONloops server, visit http://localhost:8080/

## The JSONLoop format

A JSONLoop is nothing but a nested JSON array that follows a somewhat specific format.

    the arrays are nested in the following hierarchy 
    
    * SONG
    *   TRACKS
    *     MEASURES
    *       BEATS
  
Check out the [nyc.json](https://github.com/Marak/JSONloops/blob/master/loops/nyc.json) file or [metronome.json](https://github.com/Marak/JSONloops/blob/master/loops/metronome.json) file for example loops.