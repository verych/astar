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
        this.rotation = Math.random() * Math.PI * 2;

        this.interval = undefined;
        this.intervalTime = 5000;

        this.texture = 'rock004.png';
        this.textureForShooter = 'tower1s.png';
        this.texturesForTree = ['tree001.png', 'tree002.png', 'tree003.png', 'tree004.png', 'tree005.png'];
        this.texturesForHouse = ['house001.png', 'house002.png', 'house003.png'];
        this.texturesForGuinness = ['guinness001.png', 'guinness002.png'];
        this.textureSizeX = 400;
        this.textureSizeY = 400;
        this.textureForShooterX = 32;
        this.textureForShooterY = 32;
        this.scale = 2;
        this.transparent = false;

        this.shooter = undefined;
        this.hasShooter = options && options.hasShooter;
        this.isTree = options && options.isTree;
        this.isHouse = options && options.isHouse;
        this.isGuinness = options && options.isGuinness;
        this.isRandomTree = options && options.isRandomTree;

        var index = options.textureIndex ? options.textureIndex : 0;

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
            this.texture = this.texturesForTree[Math.round(Math.random() * (this.texturesForTree.length - 1))];
            this.scale = 1.5;
        }
        if (this.isHouse) {
            this.texture = this.texturesForHouse[index];
            this.scale = 1;
            this.rotation = 0;
        }
        if (this.isGuinness) {
            this.texture = this.texturesForGuinness[index];
            this.textureSizeX = 79;
            this.textureSizeY = 79;
            this.scale = 1;
            this.rotation = 0;
        }

        //adding passability if not shooter
        this.passable = false;
        this.passValue = 10000; //very difficult to pass
        if (!this.hasShooter && !this.isHouse) {
            this.passable = true;
            this.passValue = 10000 * this.r;
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