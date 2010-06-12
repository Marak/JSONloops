#JSONloops 
## a javascript audio sequencer for node.js and the browser that can sequence songs in JSONloop the format

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
  