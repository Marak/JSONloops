/*******************************
JSONloops is a javascript audio sequencer that runs on JSON arrays of sounds

    JSONloops are nested arrays that contain: a nested array, a sound, or null
    
    the arrays are nested in the following hierarchy 
    
    * SONG
    *   TRACKS
    *     MEASURES
    *       BEATS

    a 2 measure song with 4 beats in each measure might be structured as something like this
    
    * SONG
    *   TRACK1
    *     MEASURE1
    *       BEAT
    *       BEAT
    *       BEAT
    *       BEAT            
    *     MEASURE2
    *       BEAT
    *       BEAT
    *       BEAT
    *       BEAT            
    *   TRACK2
    *     MEASURE1
    *       BEAT
    *       BEAT
    *       BEAT
    *       BEAT            
    *     MEASURE2
    *       BEAT
    *       BEAT
    *       BEAT
    *       BEAT            
    *   TRACK3
    *     MEASURE1
    *       BEAT
    *       BEAT
    *       BEAT
    *       BEAT            
    *     MEASURE2
    *       BEAT
    *       BEAT
    *       BEAT
    *       BEAT            
  
  *******************************/

var sys = require('sys');
var colors = require('./lib/color');
var play = require('./lib/play');

// measures in song
var measures = 1;
// beats per measure
var beats = 4;
// beats per minute
var bpm = 180;

// the current beat position
var position = 0;

// simple drum kit
var drums = {
  kick : './wavs/kick.wav',
  snare : './wavs/snare.wav',
  tick : './wavs/tick.wav',
  phazed : './wavs/phazed.wav'
};

// simple 4 beat drum loop, notice the empty arrays which represent beats with no note playing
var song = [
  [  /* TRACK 1 - kicks  */  
    [  /* measure 1 */ 
      [drums.tick],
      [drums.tick],
      [drums.tick], 
      [drums.tick],
      [drums.tick], 
      [drums.tick],
      [drums.tick], 
      [drums.tick]  
    ]
  ],
  [  /* TRACK 1 - kicks  */  
    [  /* measure 1 */ 
      [drums.kick],
      [drums.kick],
      [drums.kick], 
      [drums.kick],
      [drums.kick], 
      [drums.kick],
      [drums.kick], 
      [drums.kick]  
    ]
  ],
  [  /* TRACK 1 - kicks  */  
    [  /* measure 1 */ 
      [drums.snare],
      [drums.snare],
      [drums.snare], 
      [drums.snare],
      [drums.snare], 
      [drums.snare],
      [drums.snare], 
      [drums.snare]  
    ]
  ],
  [  /* TRACK 1 - kicks  */  
    [  /* measure 1 */ 
      [drums.phazed],
      [drums.phazed],
      [drums.phazed], 
      [drums.phazed],
      [drums.phazed], 
      [drums.phazed],
      [drums.phazed], 
      [drums.phazed]  
    ]
  ]
];


var track = 0, measure=0, pos = 0;
setInterval(function(){

  for (var i = 0; i<song.length; i++)
  {
    sys.puts(song[i][measure][pos]);
    play.start(song[i][measure][pos]);
  }
  pos++
  if (pos > 7) { 
    pos = 0;
    measure++;
  }
  
  if (measure >= song[0].length) {
    measure = 0;
    pos = 0;
  }
}, 60000/bpm);


/*
var theMix = [];
var theTracks = [];
function json_loop( song ){


//sys.puts(song[0].length);
  // for every measure in the track
  for(var m = 0; m < song[0].length; m++){
//    sys.puts('measure ' + m);
    sys.puts(JSON.stringify(song[0][m], true , "  "));
    for(var b = 0; b < song[0][m].length; b++){
      sys.puts('beat ' + b);
      //sys.puts(m,b);
      theMix.push(song[0][m][b]);
      theMix.push(song[1][m][b]);
      //theMix.push(song[2][m][b]);
    
    }  
  }


sys.puts(JSON.stringify(theMix, true, "  "));

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


json_loop(song);
step(theMix);*/