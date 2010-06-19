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
  var bpm = 116;
  // the current beat position
  var position = 0;
  var theMix = [];
  var theTracks = [];

/******* END SEQUENCER CONFIG *****/

function json_loop( song ){
  // for every measure in the track
  for(var m = 0; m < song[0].length; m++){
    for(var b = 0; b < song[0][m].length; b++){
      theMix.push(eval(song[0][m][b]));
      //theMix.push(song[1][m][b]);
      //theMix.push(song[2][m][b]);
    }  
  }
}

function step(steps){
  if(!steps.length){
    sys.puts('***looped***'.red);
    position = 0;
    json_loop(song);
    step(theMix);
    return;
  }
  setTimeout(function(){
    sys.puts(('measure ' + (position + 1)).blue.underline);
    // for every beat, pop a sound off theMix
    for(var t = 0; t < song.length; t++){
      var sound = steps.shift();
      if(sound.length){
        sys.puts(('playing ' + sound).grey);
        play.start(sound);
      }
    }
    position++;
    step(steps);
  },60000 / bpm);
}

/**** START UP THE LOOPER ****/
json_loop(song);
step(theMix);