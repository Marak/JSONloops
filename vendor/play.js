// play.js - Marak Squires
// Mit yo, copy paste us some credit

var player;

try {
  var irrKlang = require(__dirname + "/../../node-irrklang/lib/irrklang").irrKlang
  player = new irrKlang()
} catch (e) {
  player = { play : function() { /* noop */ } };
}

if(typeof exports === 'undefined'){


  /*  the browser version 
  
      assumes you have already embedded the audio file as an embed tag
      
      
      <embed id = "hat" autostart = "false" src = "./wavs/drums/tick.wav"/>
      <embed id = "snare" autostart = "false" src = "./wavs/drums/snare.wav"/>
      <embed id = "kick" autostart = "false" src = "./wavs/drums/kick.wav"/>
      
      play.sound('hat'); // plays tick.wav
      play.sound('snare'); // plays snare.wav

  */


  var play = {
    sound: function ( wav ) {
      
      var og = wav;
      wav = wav.toString() || '';
      wav = wav.replace('./wavs/','');
      wav = wav.replace('.wav','');
      debug.log('wav ' + wav);



      var newID = wav + new Date().getTime();
      $('body').append('<embed id = "' + newID + '" autostart="true" src = "' + og + '"/>');
      //$('#' + );

      
      // set autostart of embed to start playing
      //$(e).attr('autostart',true);
      //$('body').append(e);
      
      
      return wav;
    }
  };
}
else{

  var sys = require('sys')
    , http = require('http')
    , colors = require('./color');

  var play = exports;

  // say stuff, speak
  exports.sound = function(filename, volume){
    player.play(filename, volume);
  }
}
