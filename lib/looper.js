/* looper.js - Marak Squires 2010 */

var sys = require('sys'),
    colors = require('../vendor/color'),
    play = require('../vendor/play'),
    fs = require('fs'),
    events = require('events');

//
// The Looper Class, responible for creating a new "Looper", aka the sequencer
//

var Looper = function ( loop, drums, options ) {
  
  // Inherits from the EventEmitter class
  events.EventEmitter.call(this);
  
  // Set default options if they were not passed in
  options = options || {
    bpm: 80,
    beats: 8,
    measures: 2,
  };

  // Song is a JSONLoop, it's been passed in as a nested JSON string
  this.song = eval(loop.toString());

  // Measures in song, measures contain beats
  this.measures = options.measures;
  
  // Beats per measure, the amount of beats inside each measure
  this.beats = options.beats;
  
  // Beats Per Minute - The amount of beats which will play per minute, aka the tempo of the song
  this.bpm = options.bpm;
  
  // Current position of beat being played in the song ( or track )
  this.position = 0;
  
  // theMix stores a flat representation of the song ( all tracks crunched into one stream)
  this.theMix = [];

  // Current state of the sequencer, is it paused?
  this.paused = false;
  
  // Create a mix from the current song
  this.create_mix(this.song);
  
  // Start stepping into the sequence yo!
  this.step(this.theMix);
  
};


// Extend Looper with the EventEmitter class
sys.inherits(Looper, events.EventEmitter);

Looper.prototype.start = function ( ) {
  this.paused = false;
};

Looper.prototype.stop = function ( ) {
  this.paused = true;
};

Looper.prototype.create_mix = function ( song ) {
  this.theMix = [];
  //require('eyes').inspect(song);
  /* i had meant to make the comments here be:
  
     m for measure
     b for beat
     t for track
     
     but i don't think the variables are right. variables are misleading atm 
  */

  this.theMix = [];

  var m = 0;
      b = 0,
      t = 0;

  if (this.song !== song) {
    var delta = song.length-this.song.length*this.position;
    console.log(delta, this.position);
    //m = this.position;
  }

  this.song = song;
  var before = this.position;
  for(m; m < song[0].length; m++){
    for(b = 0; b < song[0][m].length; b++){
      for(t = 0; t < song.length; t++){
        this.theMix.push(song[t][m][b]);
      }
    }
  }
};

Looper.prototype.step = function (steps) {
  var self = this, start = Date.now();

  // We've ran out of steps to play, this is the end of the loop, let's start it over again!
  if (!steps.length) {
    sys.puts('*** looped ***'.red);
    // Reset the position
    this.position = 0;

    this.create_mix(this.song);
    steps = JSON.parse(JSON.stringify(this.theMix))
  }

  //
  // This timer is responible for playing audio. Each "step" in the sequence is represented by one interval of the timer
  //
  function next() {
    if (!self.paused && (Date.now() - start) > 60000/self.bpm) {
      // Emit the step event for anyone listening to the sequencer
      self.emit('step');
      console.log("\n\n======", self.position, steps.length, self.song.length);

      // For every track in the song, play every beat
      for(var t = 0; t < self.song.length; t++){
        var sound = steps.shift();
        // If there is no lenth, it means we have a empty space
        if(sound && sound.length){
          play.sound(sound);
        }
      }

      // Since we have played a step, increase the position
      self.position++;

      // Continue processing the sequence
      self.step(steps);
    } else {
      process.nextTick(next);
    }
  }
  next();
}

// Set global exports to that of our Class constructor
exports.Looper = Looper;