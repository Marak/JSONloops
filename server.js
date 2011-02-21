/*******************************
JSONloops is a javascript audio sequencer that runs on JSON arrays of sounds

    JSONloops are nested arrays that contain: a nested array, a sound, or null
    
    the arrays are nested in the following hierarchy 
    
    * SONG
    *   TRACKS
    *     MEASURES
    *       BEATS
  

  *******************************/

var Looper = require('./lib/looper').Looper,
fs = require('fs'),
colors = require('./vendor/color'),
sys = require('sys');

//var song = fs.readFileSync('./loops/metronome.json');

var songName = process.argv[2] || 'nyc';

// Load the NYC.json song
var song = fs.readFileSync('./loops/' + songName + '.json');

// Load up a drum kit
var drums = require('./kits/drums').drums;

// Create a new sequencer using the Looper Class
var sequencer = new Looper(song, drums);

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter;

sequencer.on('step', function(){
  emitter.emit('step', sequencer);
});

var clients = {};
function LoopServer (client, con) {

  con.on('ready', function () {
    // When the client connection is ready, bind the Looper step event to the client's step event
    emitter.on('step', client.step);
  });

  con.on('end', function () {
    // Nothing is bound to the end event for now
  });

  /* Expose some methods to Dnode, this could probaly be done with a loop of the modules exports */
  this.create_mix = function ( song ) {
    song = JSON.parse(song);
    sequencer.create_mix(song);
  };

  this.stop = function ( ) {
    sequencer.stop();
  };

  this.start = function ( ) {
    sequencer.start();
  };
  
  this.bpm = function( bpm ) {
    sequencer.set_bpm( bpm );
  }
  
  this.volume = function(volume) {
    sequencer.set_volume(volume);
  }
  
  this.beat = function(track, measure, beat, wav) {
    sequencer.set_beat(track, measure, beat, wav);
  }
    
}

var connect = require('connect');
var server = connect.createServer()
    .use(connect.staticProvider(__dirname + '/public'));
    
server.listen(8080);

var DNode = require('dnode');
DNode(LoopServer).listen(server, {
    transports : 'websocket xhr-multipart xhr-polling htmlfile'.split(' '),
});

console.log('*** entering JSONLoops [http://127.0.0.1:8080/] ***'.red);

process.on('SIGINT', function() {
  console.log('\b\b*** leaving JSONLoops ***'.red);
  process.exit(0);
});
