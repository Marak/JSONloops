/*******************************
JSONloops is a javascript audio sequencer that runs on JSON arrays of sounds

    JSONloops are nested arrays that contain: a nested array, a sound, or null
    
    the arrays are nested in the following hierarchy 
    
    * SONG
    *   TRACKS
    *     MEASURES
    *       BEATS
  

  *******************************/

var JSONloops = {};
JSONloops = exports;

JSONloops.start = function (options) {
  
  /* 
     options:
     
     {
       "port": 8080,
       "servers" []
     }
  
  */ 
  
  
  var connect = require('connect');
  var server = connect.createServer()
      .use(connect.static('./public'));

  var DNode = require('dnode');


  // Start up the Connect server for browser clients
  server.listen(Number(options.port));

  // Start up the listening dnode server
  DNode(LoopServer).listen(server, {
      transports : 'websocket xhr-multipart xhr-polling htmlfile'.split(' '),
      io: { reconnect: true }
  }).listen(Number(options.port) + 100);

  // Check if any other JSONloops servers were passed in the options
  // If so, we are going to attempt to connect to them
  options.servers.forEach(function(v,i){
    console.log('Attempting to connect to server: ' + v);
    
    // Split up the pairs, maybe move this to bin
    v = v.split(':');
    var uri  = v[0],
        port = v[1];
    
    console.log(uri, port);
    
    /*
    DNode.connect(uri, Number(port) + 100, function (remote) {
      
      sequencer.on('step', function(){
        remote.step(sequencer.song);
      });
        
    });
    */
    
  });
  
  console.log(('*** starting a JSONLoops server @ [http://127.0.0.1:' + options.port + '/] ***').red);

  process.on('SIGINT', function() {
    console.log('\b\b*** leaving JSONLoops ***'.red);
    process.exit(0);
  });
  
};


var Looper = require('./JSONloops/looper').Looper,
fs = require('fs'),
colors = require('colors'),
sys = require('sys');

//var song = fs.readFileSync('./loops/metronome.json');

var songName = 'nyc';

// Load the NYC.json song
var song = fs.readFileSync('./loops/' + songName + '.json');

// Load up a drum kit
var drums = require('./JSONloops/kits/drums').drums;

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

  /* Expose some methods to DNode, this could probaly be done with a loop of the modules exports */
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
  
  this.step = function( song ) {
    
    console.log('remote stepping')
    
    // Check if we have a bi-directional connection with current client, if not, create a new one
    //sequencer.create_mix(song);
  }
  
}