var Explosion = createClass({
    extend: AppObject,

    construct: function (drawArea, getMapCallback) {
        AppObject.call(this);
        this.type = 'explosion';
        this.drawArea = drawArea;
        this.getMap = getMapCallback;

        this.interval = undefined;
        this.intervalTime = 50;

 
        this.texture = 'shooter01.png';
        this.textureSizeX = 32;
        this.textureSizeY = 32;
        this.movieAssets = 'Explosion';

        this.animationSpeed = 0.5;

        this.loop = false;
    },

    run: function () {
        this.map = this.getMap.call();
        this.map.register(this);
        this.interval = setInterval($.proxy(this.doOne, this), this.intervalTime);
    },

    doOne: function () {
        //checking for die
        if (this.movie && !this.movie.playing) {
            this.die();
        }
    },

    die: function () {
        clearInterval(this.interval);
        this.map.register(this);
    }
});