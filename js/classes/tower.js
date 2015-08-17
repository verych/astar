var Tower = createClass({
    extend: AppObject,

    construct: function (drawArea, getMapCallback, options) {
        AppObject.call(this);
        this.type = 'tower';
        this.drawArea = drawArea;
        this.getMap = getMapCallback;

        this.speed = 0;
        this.power = 1;
        this.distance = 10;

        this.r = 10;
        this.rotation = Math.random() * 3.14159;

        this.interval = undefined;
        this.intervalTime = 5000;

        this.texture = 'rock004.png';
        this.textureForShooter = 'tower1s.png';
        this.texturesForTree = ['tree001.png', 'tree002.png', 'tree003.png', 'tree004.png', 'tree005.png'];
        this.textureSizeX = 400;
        this.textureSizeY = 400;
        this.textureForShooterX = 32;
        this.textureForShooterY = 32;
        this.scale = 2;
        this.transparent = false;

        this.shooter = undefined;
        this.hasShooter = options && options.hasShooter;
        this.isTree = options && options.isTree;
        this.isRandomTree = options && options.isRandomTree;
        if (this.hasShooter) {
            this.texture = this.textureForShooter;
            this.textureSizeX = this.textureForShooterX;
            this.textureSizeY = this.textureForShooterY;
            this.scale = 1;
        }
        if (this.isTree) {
            this.texture = this.texturesForTree[0];
            this.scale = 1.5;
        }
        if (this.isRandomTree) {
            this.texture = this.texturesForTree[Math.round(Math.random() * this.texturesForTree.length)];
            this.scale = 1.5;
        }
        this.setPositionCenter();
        this.run();
    },

    run: function () {
        //this.interval = setInterval($.proxy(this.doOne, this), this.intervalTime);
        if (this.shooter) {
            this.shooter.place(this.x, this, y);
            this.shooter.run();
        }
    },

    doOne: function () {
        //var map = this.getMap.call();
        log('piu-piu!!!');
    },

    setPositionCenter: function () {
        this.place(this.drawArea.w / 2, this.drawArea.h / 2);
    }
});