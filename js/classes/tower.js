var Tower = createClass({
    extend: AppObject,

    construct: function (drawArea, getMapCallback) {
        AppObject.call(this);
        this.type = 'tower';
        this.drawArea = drawArea;
        this.getMap = getMapCallback;

        this.speed = 0;
        this.power = 1;
        this.distance = 10;

        this.r = 10;

        this.interval = undefined;
        this.intervalTime = 5000;

        this.texture = 'tower.png';
        this.textureSizeX = 32;
        this.textureSizeY = 32;


        this.setPositionCenter();
        log('Created tower: xyr=' + this.x + '-' + this.y + ': ' + this.r);
    },

    run: function () {
        this.interval = setInterval($.proxy(this.doOne, this), this.intervalTime);
    },

    doOne: function () {
        //var map = this.getMap.call();
        log('piu-piu!!!');
    },

    setPositionCenter: function () {
        this.place(this.drawArea.w / 2, this.drawArea.h / 2);
    }
});