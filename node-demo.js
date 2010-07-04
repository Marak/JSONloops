/*******************************
JSONloops is a javascript audio sequencer that runs on JSON arrays of sounds

    JSONloops are nested arrays that contain: a nested array, a sound, or null
    
    the arrays are nested in the following hierarchy 
    
    * SONG
    *   TRACKS
    *     MEASURES
    *       BEATS
  

  *******************************/


var looper = require('./lib/looper'),
sys = require('sys');

sys.puts(JSON.stringify(looper.loop()));
