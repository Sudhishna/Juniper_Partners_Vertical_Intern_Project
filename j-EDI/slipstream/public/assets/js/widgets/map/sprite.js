/**
 * The Sprite is used to represent an object that will be processed in a game loop.
 *
 * @module Sprite
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function(){
var Sprite = function(colr, src, dst, vnt){



        var NEXT_CONST              = 3.7;
        if(!!document.msFullscreenEnabled) {
            NEXT_CONST             = 5;
        }
        var MAX_RADIUS_CONST        = 100,
            PROJECTILE_RADIUS_CONST = 2.5,
            BLAST_RADIUS_WIDTH      = 5,
            radius                  = .01,
            source                  = src,
            destination             = dst,
            vent                    = vnt,
            color                   = colr;

          return {
              'x_pos'                 : src.x,
              'y_pos'                 : src.y,
              'pathComplete'          : false,
              'trajectoryCalculated'  : false,
              'stopAnimation'         : false,
              'trail'                 : [],

              incrementRadius : function(){
                radius += 2;
              },
              getBlastRadius : function(){
                if (radius >= MAX_RADIUS_CONST) {
                  return 0;
                }
                return radius;
              },

              getMaxBlastRadius : function(){
                return MAX_RADIUS_CONST;
              },

              getProjectileRadius : function(){
                return PROJECTILE_RADIUS_CONST;
              },

              getColor : function(){
                return color;
              },

              getBlastLineWidth : function(){
                return BLAST_RADIUS_WIDTH;
              },

              destroy : function(){
                vent = null;
                source = null;
                destination = null;
              },

              update : function(){
                if(!this.trajectoryCalculated){
                    var m_denominator = destination.x - source.x;
                    var m_numerator = destination.y - source.y;
                    var m = m_numerator / m_denominator;

                    // if(!this.srcMarker){
                    //     this.srcMarker = self.addMarker(src.marker, [src['lat'], src['lng']]);
                    //     this.dstMarker = self.addMarker(dst.marker, [dst['lat'], dst['lng']]);
                    // }

                    var b = destination.y - (m*destination.x);

                    this.getNext = function(current_x, current_y){
                        var xStep = null;
                        if ( m_denominator < 0 ){
                            xStep = (-1 * NEXT_CONST);
                        } else{
                            xStep = NEXT_CONST;
                        }
                        var y = ((m*(current_x + xStep)) + b);

                        var yStep = null;
                        if( m_numerator < 0){
                            yStep = (-1 * NEXT_CONST);
                        } else {
                            yStep = NEXT_CONST;
                        }

                        var x = ((current_y + yStep) - b) / m;
                        var delta_x = destination.x - source.x;
                        var delta_y = destination.y - source.y;
                        if ( Math.abs(delta_x) < Math.abs(delta_y) ) {
                            return [x, (current_y + yStep)];
                        } else if ( Math.abs(delta_x) > Math.abs(delta_y) ){
                            return [(current_x + xStep),y];
                        } else {
                            return [(current_x + xStep),(current_y + yStep)];
                        }
                    };

                    this.trajectoryCalculated = true;
                }

                var next = this.getNext(this.x_pos, this.y_pos);
                var delta_x = destination.x - source.x;
                var delta_y = destination.y - source.y;

                var previous_xy = {};

                if (!this.x_isDone) {
                    if (delta_x < 0) { //negative step for x
                        if (Math.floor(next[0]) <= (destination.x)) {
                            this.x_isDone = true;
                            this.x_pos = Math.floor(next[0]);
                        }else{
                            this.x_isDone = false;
                        }

                    } else {  // positive step for x
                        if(Math.floor(next[0]) >= destination.x){
                            this.x_isDone = true;
                            this.x_pos = Math.ceil(next[0]);
                        }else{
                            this.x_isDone = false;
                        }
                    }
                }
                if (!this.y_isDone) {
                    if (delta_y < 0) { // negative step for y
                        if (Math.floor(next[1]) <= destination.y) {
                            this.y_isDone = true;
                            this.y_pos = Math.floor(next[1]);
                        }else{
                            this.y_isDone = false;
                        }
                    } else { // positive step for y
                        if (Math.floor(next[1]) >= destination.y) {
                            this.y_isDone = true;
                            this.y_pos = Math.ceil(next[1]);
                        }else{
                            this.y_isDone = false;
                        }
                    }
                }

                if (this.y_isDone && this.x_isDone) {
                    this.pathComplete = true;

                    // begin ripple animation at dst marker.
                    vent.trigger('animation:removeMarker', source._marker);
                    vent.trigger('animation:removeMarker', destination._marker);
                }else{
                    previous_xy['x'] = this.x_pos;
                    previous_xy['y'] = this.y_pos;
                    this.trail.push(previous_xy);
                    if(!this.x_isDone){
                        this.x_pos = Math.floor(next[0]);
                    }
                    if(!this.y_isDone){
                        this.y_pos = Math.floor(next[1]);
                    }

                }
          }
      }
  };
  return Sprite;
});