/* looper.js - Marak Squires 2010 */

var sys = require('sys');
var colors = require('../vendor/color');
var play = require('../vendor/play');
var fs = require('fs');

if(typeof exports === 'undefined'){
  var exports = window;
}

exports.loop = function ( loop, drums, options ) {
  
  options = options || {
    bpm: 180,
    beats: 8,
    measures: 2,
  };


  /******* SEQUENCER CONFIG *******/


    var song = eval(loop.toString());

    // measures in song
    var measures = options.measures;
    // beats per measure
    var beats = options.beats;
    // beats per minute
    var bpm = options.bpm;
    // the current beat position
    var position = 0;
    var theMix = [];
    var theTracks = [];

  /******* END SEQUENCER CONFIG *****/

  /******** START JSONlooper *******/

  function json_loop( song ){
    // for every measure in the track
    for(var m = 0; m < song[0].length; m++){
      for(var b = 0; b < song[0][m].length; b++){
        for(var t = 0; t < song.length; t++){
          theMix.push(song[t][m][b]);
        }
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
          //sys.puts(('playing ' + sound).grey);
          play.sound(sound);
        }
      }
      position++;
      step(steps);
    },60000 / bpm);
  }

  /**** START UP THE LOOPER ****/
  json_loop(song);
  step(theMix);
  /******* END JSONlooper ******/

  //return options;
};

