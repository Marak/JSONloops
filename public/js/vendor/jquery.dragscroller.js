/*
 * DragScroller - jQuery Plugin
 * version: 1.1.2 (2011/04/15)
 * Created by: digitalillusion
 *
 * Dual licensed under the MIT (http://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt)
 * and GPL (http://github.com/jquery/jquery/blob/master/GPL-LICENSE.txt) licenses.
 * 
 */

(function($) {
  function DragScroller() {
    var self = this;
    this.delay          = 50;
    this.dragging       = false;
    this.xstart         = 0;
    this.ystart         = 0;
    this.xoffset        = 0,
    this.yoffset        = 0,
    this.smoothScrollIntv = null;
    this.settings = {
      canvasSelector : "",
      canvasItemsSelector : "",
      attrition : 0.2,
      enabled   : true,
      redrawFunction  : null,
      updateFunction  : null
    }
    this._jumpTo = function (xdrag, ydrag) {
      // Get bg position prior to set it
      var bgpos = self._getBgPosition();
      var bgx = bgpos[0];
      var bgy = bgpos[1];

      self._setBgPosition(xdrag, ydrag);
   
      // Calculate delta with the old background position
      var xdelta = 0; var ydelta = 0;
      xdelta = xdrag - bgx;
      ydelta = ydrag - bgy;
      self.xoffset += xdelta;
      self.yoffset += ydelta;
      
      if(self.settings.updateFunction) {
        self.settings.updateFunction(xdelta, ydelta);
      }
      $(self.settings.canvasItemsSelector).each(function() {
        if(!self.settings.redrawFunction) {
          $(this).css('left', self._cssToNum($(this).css('left')) + xdelta);
          $(this).css('top', self._cssToNum($(this).css('top')) + ydelta);
        } else {
          self.settings.redrawFunction($(this), xdelta, ydelta);
        }
      });
    };
    this._getBgPosition = function () {
      if($.browser.msie) {
        var bgx = $(self.settings.canvasSelector).css("background-position-x");
        var bgy = $(self.settings.canvasSelector).css("background-position-y");
        return Array(
            self._cssToNum(bgx, 10),
            self._cssToNum(bgy, 10)
        );
      } else {
        var bg = $(self.settings.canvasSelector).css("background-position").split(" ");
        return Array(
            self._cssToNum(bg[0], 10),
            self._cssToNum(bg[1], 10)
        );
      }
    };
    this._setBgPosition = function (xoffset, yoffset) {
      if($.browser.msie) {
        $(self.settings.canvasSelector).css("background-position-x", xoffset + "px ");
        $(self.settings.canvasSelector).css("background-position-y", yoffset + "px ");
      } else {
        $(self.settings.canvasSelector).css("background-position", xoffset + "px " + yoffset + "px");
      }
    };
    this._cssToNum = function (css) {
      css = css.replace("auto", "0");
      css = css.replace("px", "");
      return parseFloat(css);
    };
    this._dragStart = function (e) {
      self.dragging = true;
      clearInterval(self.smoothScrollIntv);
      
      self.xstart = e.pageX;
      self.ystart = e.pageY;

      var lastXdrag;
      var lastYdrag;
      $(self.settings.canvasSelector).mousemove(function(e){
        if (self.dragging){
          var xdrag = parseInt(e.pageX-self.xstart, 10);
          var ydrag = parseInt(e.pageY-self.ystart, 10);
          if(lastXdrag == xdrag &&
             lastYdrag == ydrag) {
            return;
          } else { 
            lastXdrag = xdrag;
            lastYdrag = ydrag;
            self._jumpTo(
              self._getBgPosition()[0]+xdrag,
              self._getBgPosition()[1]+ydrag
            );
          }
        }
        // Periodically move start drag position to current cursor position
        var dirVec = Array(
            e.pageX - self.xstart, 
            e.pageY - self.ystart
          );
        if(!(dirVec[0] == 0 && dirVec[1] == 0)) {
          var norm = Math.sqrt(dirVec[0]*dirVec[0] + dirVec[1]*dirVec[1]);
          dirVec = Array(dirVec[0]/norm, dirVec[1]/norm);
          self.xstart += dirVec[0]*norm*0.5;
          self.ystart += dirVec[1]*norm*0.5;
        }
      });
    };
    this._dragEnd = function (e) {
      if(self.dragging) {
        self.dragging = false; 

        var speedVec = Array(
          e.pageX - self.xstart, 
          e.pageY - self.ystart
        );

        if(!(speedVec[0] == 0 && speedVec[1] == 0)) {
          var norm = Math.sqrt(speedVec[0]*speedVec[0] + speedVec[1]*speedVec[1]);
          speedVec = Array(speedVec[0]/norm, speedVec[1]/norm);
          clearInterval(self.smoothScrollIntv);
          self.smoothScrollIntv = setInterval(function() {
            norm *= 1 - self.settings.attrition;
            if(norm < 10) {
              clearInterval(self.smoothScrollIntv);
            } else {
              self._jumpTo(
                  self._getBgPosition()[0] + speedVec[0]*norm,
                  self._getBgPosition()[1] + speedVec[1]*norm
              );
            }
          }, self.delay);
        }
      }
    };
  };
 
  var methods = {
    init : function (options) {
      var selector = $(this).selector;
      return this.each(function(){
        var $this = $(this);
        var dragScroller = new DragScroller();

        if (options) { 
          $.extend(dragScroller.settings, options );
        }

        // Set a default canvas and canvas items selector
        if(!dragScroller.settings.canvasSelector) {
          dragScroller.settings.canvasSelector = selector;
        }
        if(!dragScroller.settings.canvasItemsSelector) {
          dragScroller.settings.canvasItemsSelector = selector + " > *";
        }


        $(dragScroller.settings.canvasSelector + ", " +
          dragScroller.settings.canvasItemsSelector).bind("mousedown.dragScroller", function(e){
          if(dragScroller.settings.enabled) {
            dragScroller._dragStart(e);
          }
        });

        $(":not(."+dragScroller.settings.canvasItemsSelector+")").bind("mouseup.dragScroller", function(e){
          if(dragScroller.settings.enabled) {
            dragScroller._dragEnd(e);
          }
        });
        
        $(dragScroller.settings.canvasSelector).bind("dragstart.dragScroller", function(e) {
          if(dragScroller.settings.enabled && 
             $(e.currentTarget).selector == dragScroller.settings.canvasSelector) {
            return false;
          }
        });

        $this.data('dragScroller', dragScroller);
      });
    },
    destroy : function( ) {
      return this.each(function(){
        var $this = $(this);
        $this.removeData('dragScroller');
        $(window).unbind('.dragScroller');
      })
     },
    position : function(position, relative) {
      var $this = $(this);
      var dragScroller = $this.data('dragScroller');
      if(typeof(position) == "undefined") {
        return [dragScroller.xoffset, dragScroller.yoffset];
      } else {
        if(relative) {
          dragScroller._jumpTo(
            position[0] + dragScroller.xoffset, 
            position[1] + dragScroller.yoffset
          );
        } else {
          // Center on origin, them move to the desired position
          dragScroller._jumpTo(
            position[0], 
            position[1]
          );
        }
        $this.data('dragScroller', dragScroller);
      }
    },
    selector : function(selector) {
      var $this = $(this);
      var dragScroller = $this.data('dragScroller');
      if(typeof(selector) == "undefined") {
        return dragScroller.settings.canvasItemsSelector;
      } else {
        dragScroller.settings.canvasItemsSelector = selector;
        $this.data('dragScroller', dragScroller);
      }
    },
    attrition : function(attrition) {
      var $this = $(this);
      var dragScroller = $this.data('dragScroller');
      if(typeof(attrition) == "undefined") {
        return dragScroller.settings.attrition;
      } else {
        dragScroller.settings.attrition = attrition;
        $this.data('dragScroller', dragScroller);
      }
    },
    enabled : function(enabled) {
      var $this = $(this);
      var dragScroller = $this.data('dragScroller');
      if(typeof(enabled) == "undefined") {
        return dragScroller.settings.enabled;
      } else {
        dragScroller.settings.enabled = enabled;
      }
    },
    redraw : function(redrawFunction) {
      var $this = $(this);
      var dragScroller = $this.data('dragScroller');
      if(typeof(redrawFunction) == "undefined") {
        return dragScroller.settings.redrawFunction;
      } else {
        dragScroller.settings.redrawFunction = redrawFunction;
        $this.data('dragScroller', dragScroller);
      }
    },
    update : function(updateFunction) {
      var $this = $(this);
      var dragScroller = $this.data('dragScroller');
      if(typeof(updateFunction) == "undefined") {
        return dragScroller.settings.updateFunction;
      } else {
        dragScroller.settings.updateFunction = updateFunction;
        $this.data('dragScroller', dragScroller);
      }
    }
  };

  $.fn.dragScroller = function( method ) {
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.dragScroller' );
    }    
  };

}) (jQuery);
