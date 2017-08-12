/**
 * The AnimationCanvasLayer is used to provide an svg canvas upon the 
 *  Slipstream map widget.  Furthermore, it implements game loop
 *
 * @module AnimationCanvasLayer
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['leaflet_canvas_layer', 'canvasv5'], function(){
  var AnimationCanvasLayer = L.CanvasLayer.extend({
      sprites : [],

      /**
       * Add a sprite on the canvas.
       *
       * @param {Object} sprite - required.  This parameter is the sprite to be added to the game loop.  
       *      The sprite is expected to have a color to be applied to the sprite and a source and desitination objects that each have latitude and longitude attributes.
       */
      addSprite: function(sprite){
          this.sprites.push(sprite);
      },

      /**
        * Draw a sprite on the canvas.
        *
        * @param {Object} sprite - required.  This parameter is the sprite to draw.
        */
      drawSprite: function(sprite){
          var canvas = this.getCanvas();
          var ctx = canvas.getContext('2d');
          ctx.globalAlpha = 1;
          if ( sprite.pathComplete ) {
            if(sprite.getBlastRadius() === 0 ){
              sprite.stopAnimation = true;
              return;
            }
            ctx.beginPath();
            ctx.arc(sprite.x_pos, sprite.y_pos, sprite.getBlastRadius(), 0, Math.PI * 2.0, true, true);
            ctx.lineWidth = sprite.getBlastLineWidth();
            ctx.closePath();
            ctx.strokeStyle = sprite.getColor();
            ctx.globalAlpha = 1 - (sprite.getBlastRadius() / sprite.getMaxBlastRadius());   
            ctx.stroke();
            sprite.incrementRadius();
          } else {
            ctx.fillStyle = sprite.getColor();
            var obj = new Path2D();
            obj.arc(sprite.x_pos, sprite.y_pos, sprite.getProjectileRadius(), 0, Math.PI * 2.0, true);
            ctx.fill(obj);
            var trailLength = sprite.trail.length;
            for(var i = 0; i < trailLength; i++){
                if((40-i) >= 0){
                  var progressiveRadius = sprite.getProjectileRadius()-(i*.05);
                  if(progressiveRadius <= 0){
                    break;
                  }
                  ctx.fillStyle = sprite.getColor();
                  var obj2 = new Path2D();
                  obj2.arc( sprite.trail[(trailLength-1) - i]['x'], sprite.trail[(trailLength-1) - i]['y'], progressiveRadius, 0, Math.PI * 2.0, true);
                  ctx.globalAlpha = progressiveRadius / sprite.getProjectileRadius();   
                  ctx.fill(obj2);
                }
            }
            
          }
      },

      /**
        * Render the layer.  This method implements the game loop.
        *
        */
      render: function() {
        // clear canvas
        this._reset();

        // for each sprite and draw it on the canvas.
        for (var x = 0; x < this.sprites.length; x++){
            if(this.sprites[x].stopAnimation){
                this.sprites[x].destroy();
                this.sprites.splice(x, 1);
                x--;
            }else{
              this.drawSprite(this.sprites[x]);
              this.sprites[x].update();
            }

        }
        this.redraw();
      }
  });

  return AnimationCanvasLayer;

});



