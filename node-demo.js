/*******************************
JSONloops is a javascript audio sequencer that runs on JSON arrays of sounds

    JSONloops are nested arrays that contain: a nested array, a sound, or null
    
    the arrays are nested in the following hierarchy 
    
    * SONG
    *   TRACKS
    *     MEASURES
    *       BEATS
  
  *******************************/
var sys = require('sys');
var colors = require('./lib/color');
var play = require('./lib/play');
var fs = require('fs');

/******* SEQUENCER CONFIG *******/

  var song = fs.readFileSync('./loops/metronome.json');
  song = JSON.parse(song.toString());
  
  var drums = require('./kits/drums').drums;
  var metronome = require('./kits/metronome').metronome;

  // measures in song
  var measures = 1;
  // beats per measure
  var beats = 4;
  // beats per minute
  var bpm = 160;
  // the current beat position
  var position = 0;
  var theMix = [];
  var theTracks = [];

/******* END SEQUENCER CONFIG *****/

/******** START JSONlooper *******/
var track = 0, measure=0, pos = 0;
setInterval(function(){

  for (var i = 0; i<song.length; i++)
  {
    var wav = eval(song[i][measure][pos].toString());
    sys.puts(pos.toString().yellow + ' ' + song[i][measure][pos].toString().grey + ' => '.green + wav.cyan);
    play.start(wav);
  }
  pos++
  if (pos > 7) { 
    pos = 0;
    measure++;
  }
  
  if (measure >= song[0].length) {
    sys.puts('##LOOPING##'.red);
    measure = 0;
    pos = 0;
  }
}, 60000/bpm);
/******* END JSONlooper ******/
