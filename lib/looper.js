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
    bpm: 96.5,
    beats: 8,
    measures: 2,
    volume : 1
  };

  // Song is a JSONLoop, it's been passed in as a nested JSON string
  this.song = eval(loop.toString());

  // Measures in song, measures contain beats
  this.measures = options.measures;
  
  // Beats per measure, the amount of beats inside each measure
  this.beats = options.beats;
  
  // Beats Per Minute - The amount of beats which will play per minute, aka the tempo of the song
  this.bpm = options.bpm;

  // Default Volume
  this.volume = options.volume || 1;

  // Current position of beat being played in the song ( or track )
  this.position = 0;
  
  // theMix stores a flat representation of the song ( all tracks crunched into one stream)
  this.theMix = [];

  // Current state of the sequencer, is it paused?
  this.paused = false;
  
  // Create a mix from the current song
  this.create_mix(this.song);

  // Start stepping into the sequence yo!
  this.step();
  
};


// Extend Looper with the EventEmitter class
sys.inherits(Looper, events.EventEmitter);

Looper.prototype.start = function ( ) {
  this.paused = false;
};

Looper.prototype.stop = function ( ) {
  this.paused = true;
};

Looper.prototype.set_bpm = function ( bpm ) {
  this.bpm = bpm;
};

Looper.prototype.set_beat = function(track, measure, beat, wav) {
  var length = this.song[track][0].length;
  this.song[track][measure][beat] = [wav];
  var where = parseInt(measure*length, 10) + parseInt(beat,10);
  this.theMix[where].push(wav);
};

// This is a float (0-1)
Looper.prototype.set_volume = function ( volume ) {
  this.volume = volume;
};

Looper.prototype.create_mix = function ( song ) {

  var m      = 0,
      b      = 0,
      t      = 0
      self   = this,
      before = this.position, beats = [],
      loc    = 0;

  this.song = song;

  for(m; m < song[0].length; m++){
    for(b = 0; b < song[0][m].length; b++){

      loc = (m>0)                     ? 
            (m*song[0][m].length) + b :
            b;

      for(t = 0; t < song.length; t++){
        if (!beats[loc]) {
          beats[loc] = [];
        }

        if (song[t][m][b][0]) {
          beats[loc].push(song[t][m][b][0]);
        }
      }
    }
  }
  console.log(beats);
  this.theMix = beats;
};

Looper.prototype.step = function () {
  var self = this, start = Date.now();
  //
  // This timer is responible for playing audio. Each "step" in the sequence is represented by one interval of the timer
  //
  function next() {
    var toPlay = self.theMix;
    if (toPlay && !self.paused && (Date.now() - start) > 60000/ (self.bpm * self.measures)) {
      start = Date.now();
      if (self.position >= toPlay.length) {
        self.position = 0;
      }

      // Emit the step event for anyone listening to the sequencer
      self.emit('step');
      var set = toPlay[self.position], i, l = set.length;
      // For every track in the song, play every beat
      for(i = 0; i<l; i++){
        play.sound(set[i], self.volume);
      }

      // Since we have played a step, increase the position
      self.position++;

      // Continue processing the sequence
      process.nextTick(next);
    } else {
      process.nextTick(next);
    }
  }
  next();
}

// Set global exports to that of our Class constructor
exports.Looper = Looper;