var AppObject = createClass({
    construct: function () {
        this.uid = '';
        this.x = 10;
        this.y = 10;
        this.r = 2;
        this.a = 0.2;
        this.rotation = 0;
        this.rotationInitCorrection = 0;
        this.drawArea = undefined;
        this.selected = false;
        
        //assets
        this.texture = '';
        this.sprite = '';
        this.text = '';
        this.movie = '';
        this.textureSizeX = 0;
        this.textureSizeY = 0;
        this.registered = false;
        this.movieAssets = '';
        //debug goals
        this.debugGraphics = null;

        this.type = 'appobject';
    },

    pixiGetFrames: function () {
        if (this.movieAssets) {
            var info = Assets[this.movieAssets];
            var result = [];

            for (var i = 0; i < info.count; i++) {
                result.push(info.name.replace('{index}', i));
            }
            return result;
        }
        
    },

    pixiGetMovie: function () {
        //debugger;
        var textures = [];
        var frames = this.pixiGetFrames();
        for (var i in this.pixiGetFrames()) {
            var name = frames[i];
            var texture = PIXI.Texture.fromFrame(name);
            textures.push(texture);
        };

        this.movie = new PIXI.extras.MovieClip(textures);
        this.movie.anchor.x = 0.5;
        this.movie.anchor.y = 0.5;

        this.movie.animationSpeed = this.speed/15;

        this.movie.play();

        return this.movie;
    },

    pixiGetSprite: function () {
        if (this.movieAssets.length) {
            return this.pixiGetMovie();
        }

        // create a texture from an image path
        var texture = PIXI.Texture.fromImage('./assets/' + this.texture);
        // create a new Sprite using the texture
        this.sprite = new PIXI.Sprite(texture);

        // center the sprites anchor point
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        // move the sprite t the center of the screen
        this.sprite.position.x = this.x;
        this.sprite.position.y = this.y;

        return this.sprite;
    },

    pixiGetText: function () {
        // center the sprites anchor point
        this.text = new PIXI.Text('', { font: "10px Arial", fill: "black" });

        this.text.anchor.x = 0;
        this.text.anchor.y = 0;

        // move the sprite t the center of the screen
        this.text.position.x = this.x;
        this.text.position.y = this.y;

        return this.text;
    },

    draw: function (context) {
        if (this.drawArea == undefined) {
            log('Draw area is not defined');
            return;
        }

        context.save();

        context.fillStyle = "rgba(255,0,0," + this.a + ")";
        //log('drawing: x=' + this.x + ', y=' + this.y + ', r=' + this.r);
        context.fillRect(Math.round(this.x - this.r + this.drawArea.ox), Math.round(this.y - this.r + this.drawArea.oy), Math.round(this.r * 2), Math.round(this.r * 2));

        context.restore();
    },

    place: function (x, y) {
        this.x = x;
        this.y = y;

        var draw = this.movie ? this.movie : this.sprite;

        this.prePlace(draw, x, y);

        if (draw) {
            draw.position.x = this.x + this.drawArea.ox;
            draw.position.y = this.y + this.drawArea.oy;
            draw.rotation = this.rotation;
            
            //scale texture
            if (this.textureSizeX && this.textureSizeY) {
                draw.scale.x = 2 * this.r / this.textureSizeX;
                draw.scale.y = 2 * this.r / this.textureSizeY;
            }
        }
        else {
            log('no sprite');
        }

        log('object moved to: ' + this.x + ':' + this.y);
    },

    prePlace: function (draw, x, y) {
        //nothing here for now
    },

    getDebugInfo: function () {
        var debug = '';
        debug += 'AppObject:<br />';
        debug += 'x: ' + this.x + '<br />';
        debug += 'y: ' + this.y + '<br />';
        debug += 'r: ' + this.r + '<br />';
        debug += 'a: ' + this.a + '<br />';
        return '<div class="debug-item">' + debug + '</div>';
    }
});