var sys = require('sys')
  , exec = require('child_process').exec
  , spawn = require('child_process').spawn
  , child;

// say stuff, speak
exports.start = function(text){
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
  });
}

