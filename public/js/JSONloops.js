 var r, theSong, sounds = [], socket, connecting, playing = false, iconZoom = 100;

  $.fn.disableSelection = function() {
    $(this).attr('unselectable', 'on')
      .css('-moz-user-select', 'none')
      .each(function() { 
        this.onselectstart = function() { return false; };
    });
  };

  $(window).load(function () {

    connectToServer();
    
    $("body").disableSelection();
    
    $(window).resize(function() {
      $("#sounds-container-dynamic").fadeOut();
    });
    
    $("#zoom").slider({
      min: 20,
      max: 150,
      value: 100,
      slide: function(a, b) {
        $("#sounds-container-dynamic").fadeOut();
        iconZoom = b.value;          
        $("#zoomLevel").text(iconZoom);
        $("#sequencer-container img").css("zoom", iconZoom + "%");
      } 
    });
    
    $("#masterVolume").slider({
      min: 0,
      max: 100,
      value: 80,
      slide: function(a, b) {        
        $("#masterVolumeLevel").text(b.value);
        r.volume(b.value/100);
      } 
    });
    
    $("#bpm").slider({
      min: 40,
      max: 200,
      value: 180,
      slide: function(a, b) {
        $("#bpmLevel").text(b.value); // superficial update
        // Set the remote bpm
        r.bpm(b.value);
        
      },
      stop: function(a, b) {
        
        $("#bpmLevel").text(b.value);
        
      }
    });
    
    // jQuery UI events
    $('#play').click(function(){
      if (playing) {
        r.stop();
        $(this).addClass("pause");
        playing = false;
      }
      else {
        r.start();
        $(this).removeClass("pause");
        playing = true;
      }
    });
    
    $('#sounds-button').toggle(function() {
      $(this).addClass("up");
      $("#sounds-container-dynamic").fadeOut();
      $("#previews").slideDown();
    }, function() {
      $(this).removeClass("up");
      $("#sounds-container-dynamic").fadeOut();        
      $("#previews").slideUp();        
    });
    
    $('#extras-button').toggle(function() {
      $(this).addClass("up");
      $("#sounds-container-dynamic").fadeOut();
      $("#extra-controls").slideDown();
    }, function() {
      $(this).removeClass("up");
      $("#sounds-container-dynamic").fadeOut();        
      $("#extra-controls").slideUp();        
    });      
    
    $('#addTrack').click(function(){
      addTrack();
    });

    var report;

    $("#sequencer-container").scroll(function() {
      $("#sounds-container-dynamic").fadeOut();
    });

    $("#sequencer-container").live("click", function(e) {

      // Do a bit of event delegation to determine if current target is an img tag ( and a note )
      var note = e.target;
      if($(note).get(0).tagName !== "IMG") {
        return false;
      }

      // Seems to be an offset if you are zoomed in a bunch? Perhaps for iPad?
      if(iconZoom == 100) {
        
        // Render the note selection window
        $("#sounds-container-dynamic").css({
          "top": $(note).offset().top - 31,
          "left": $(note).offset().left - 31
        }).fadeIn();          
      }
      else {
        
        // Render the note selection window
        $("#sequencer-mask").fadeIn();
        $("#sounds-container-dynamic").css({
          "top": ($("#sequencer-container").position().top + 40),
          "left": ($("body").width()/2) - ($(note).width()/2)
        }).fadeIn();
      }

      var parent = $(note).parent();

      report = {
        track: parent.attr("data-track"),
        measure: parent.attr("data-measure"),
        beat: parent.attr("data-beat")
      };

      $('#sounds-container-dynamic').scrollTop(0);
      $('#sounds-container-dynamic').scrollTop($("#sounds-inline a[name='"+$(note)[0].name+"']").position().top - 31);

    });
    
    // When you click "close" on the sounds-container
    $(".close").click(function() {
      $("#sounds-container-dynamic").scrollTop(0);
      $("#sounds-container-dynamic").fadeOut();
      $("#sequencer-mask").fadeOut();        
      return false;
    });
    
    // When you click on a note
    $("#sounds-container-dynamic a").click(function() {
      
      
      // Get a report of the current hit note
      report.sound = $(this)[0].name;
      
      // Sync up the song based on the note report
      r.beat(report.track, report.measure, report.beat, './wavs/' + report.sound + '.wav')
      //theSong[report.track][report.measure][report.beat] = './wavs/' + report.sound + '.wav';
      //r.create_mix(JSON.stringify(theSong));
      

      // Reset UI container
      $("#sounds-container-dynamic").scrollTop(0);
      $("#sounds-container-dynamic").fadeOut();
      $("#sequencer-mask").fadeOut();        
    });
    
      $("body").delay(500).fadeIn('slow');      
    
  });
  


  function connectToServer() {
    socket = DNode(function () {
      this.step = function (sequencer) {
        if (sequencer.song) {
          theSong = sequencer.song;
        }
        if(($('#sequencer tr').length === 0) || $('#sequencer tr').length !== sequencer.song.length) {
          renderSequencer(sequencer);
        }
        else {
          updateSequencer(sequencer);
          
        }
      };
    }).connect({ reconnect: 500 }, function (remote) {
      playing = true;
      r = remote;
    });
  }

  function updateSequencer(sequencer) {
    
    $('#sequencer tr td').removeClass('active');
    
    
    // Go through each note and check to see if its up to date, if not update that shit
    $('#sequencer tr td').each(function(i, v){
      var b, m, t, n;
      b = $(v).attr('data-beat');
      m = $(v).attr('data-measure');
      t = $(v).attr('data-track');
      n = $(v).attr('data-note');
      
      var c = sequencer.song[t][m][b][0] || '';
      
      c = c.toString();
      
      if(c !== n){

        $(v).attr('data-note', c);
        
        // This line doesn't look very sturdy at all. :-(
        var f = c.substr(c.lastIndexOf("/")+1, c.lastIndexOf(".")-7);
        
        if(f == '') {
          f = 'rest';
        }
        
        $(v).html('<img style="zoom:'+(iconZoom||'100')+'%" src="img/' + f + '.png" name="'+f+'"/>');
        
        
      }

      var myPos = i;
      
      
      if(myPos === sequencer.position){
        $("#sequencer tr").each(function() {
          $("td", this).eq(myPos).addClass('active col')
        })
        
      }
      
    });
    
    var volume = Math.round(sequencer.volume*100);            
    $("#bpmLevel").text(sequencer.bpm);
    $("#masterVolumeLevel").text(volume);
    $("#bpm").slider("option", "value", sequencer.bpm);
    $("#masterVolume").slider("option", "value", volume);
    
  }

  function renderSequencer(sequencer) {

    theSong = sequencer.song;
    $('#sequencer tr').remove();
    var position = sequencer.position,
    cnt = 0;
    for (var t = 0; t < sequencer.song.length; t++) {
      cnt = 0;
      // Create a new row in the table for every track
      $('#sequencer').append('<tr></tr>');
      
      // Create cells for each beat in that track
      for (var m = 0; m < sequencer.song[t].length; m++) {
        for (var b = 0; b < sequencer.song[t][m].length; b++) {
          cnt++;
          var beat = sequencer.song[t][m][b];
          if (!beat.length) {
            beat = '';
          }
          var style = "";
          if(cnt === position + 1) {
            style = "active"; 
          }
          
          if(typeof beat !== "string") {
            beat = beat[0] || beat[0].toString() || '';
          }

          // This line doesn't look very sturdy at all. :-(
          var f = beat.substr(beat.lastIndexOf("/")+1, beat.lastIndexOf(".")-7);

          if(f == '') {
            f = 'rest';
          }
          $('#sequencer tr:last').append('<td class = "' + style + '" data-note = "'+beat+'" data-track="'+t+'" data-measure="'+m+'" data-beat="'+b+'"><img style="zoom:'+(iconZoom||'100')+'%" src="img/' + f + '.png" name="'+f+'"/></td>');

          var volume = Math.round(sequencer.volume*100);            
          $("#bpmLevel").text(sequencer.bpm);
          $("#masterVolumeLevel").text(volume);
          $("#bpm").slider("option", "value", sequencer.bpm);
          $("#masterVolume").slider("option", "value", volume);

        }
      }
    }
  }

  function renderDropDown(active, sounds) {
    
    return active;
    var html = '';
    
    html += '<select>';
    html += '<option>' + active + '</option>';
    
    sounds.forEach(function(v, i){
      html += '<option>' + v + '</option>';
    });
    
    html += '</select>';
    
    return html;
  }
  
  function addTrack() {
    
    //theSong.push(JSON.parse(JSON.stringify(theSong[0])));
    var ml= theSong[0].length, m=0, b=0, bl = theSong[0][0].length, beats, track = [];

    for (m; m<ml; m++) {
      beats = [];
      for (b=0; b<bl; b++) {
        beats.push([]);
      }
      track.push(beats);
    }

    theSong.push(track);
    r.create_mix(JSON.stringify(theSong));
  }