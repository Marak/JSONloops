// play.js - Marak Squires
// Mit yo, copy paste us some credit
// var irrKlang = require(__dirname + "/../../node-irrklang/lib/irrklang").irrKlang,
//    player   = new irrKlang();

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
    , colors = require('./color')  
    , exec = require('child_process').exec
    , spawn = require('child_process').spawn
    , child;

 
  var play = exports;

  // say stuff, speak
  exports.sound = function(filename, callback){
    sys.puts('playing'.grey + ' -> '.yellow + filename.toString().magenta);

    //player.play(filename);

    /*
    var commands = [text];
    var childD = spawn("afplay", commands);
    childD.stdout.setEncoding('ascii');
    childD.stderr.setEncoding('ascii');  
    childD.stderr.addListener('data', function(data){});
    childD.stdout.addListener('data', function(data){});
    childD.addListener('exit', function (code, signal) {
      if(code == null || signal != null) {
        sys.puts('couldnt talk, had an error ' + '[code: '+ code + '] ' + '[signal: ' + signal + ']');
      }
      //sys.puts( 'completed'.green + '=>'.yellow + text.toString().magenta);
      //callback(); // i think i have to apply / call the arguments here
    });
    */
  }
  
  
}
