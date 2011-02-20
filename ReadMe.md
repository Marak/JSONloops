# Disclaimer

This is Alpha software which was created for NYC Music Hack Day 2011. We won best colloborative project. This library works and is awesome. It could be epic if we all work on it. 


# JSONLoops

JSONLoops is a multi-user audio sequencer reminiscent of Fruityloops. Audio playback is handled by node.js servers, while multiple browsers act as control devices. Songs are stored in the JSONloop format, which are simply nested JSON arrays. 

# Video Demo

[http://www.youtube.com/watch?v=MSZLLgel6Gs](http://www.youtube.com/watch?v=MSZLLgel6Gs)

# Warning: The current installation process for JSONloops is not complete. We were in a rush to make a working prototype and we haven't bundled all the deps correctly into a NPM package. We'll have a NPM package published shortly.

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

*can anyone create a proper json-schema to represent this? it also has to validate the loop is well formed...*

## Authors

[Marak Squires](https://github.com/marak/) - Created project, JavaScript, HTML, CSS, invented the JSONloops format, built core sequencing code

[Elijah Insua](https://github.com/tmpvar/) - Writer of C bindings, solver of the hard problems

[hij1nx](https://github.com/hij1nx/) - Writer of C bindings, JavaScript, HTML, CSS UX and UI.

