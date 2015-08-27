var Bullet = createClass({
    extend: AppObject,

    construct: function (drawArea, getMapCallback, shooter) {
        AppObject.call(this);
        this.type = 'bullet';
        this.drawArea = drawArea;
        this.getMap = getMapCallback;

        this.speed = 10;
        this.slow = 1;
        this.r = 1;
        this.shootPoints = 1;

        this.interval = undefined;
        this.intervalTime = 20;

        this.vectorX = 0;
        this.vectorY = 0;

        this.texture = 'shooter01.png';
        this.textureSizeX = 64;
        this.textureSizeY = 64;
        this.movieAssets = 'Explosion';

        this.target = undefined;

        //console.log('Created bullet: xyr=' + this.x + '-' + this.y + ': ' + this.r);

        this.rotationInterval = undefined;
        this.rotationIntervalTime = 10;
        this.rotationSpeed = 0.02;

        this.loop = true;
        this.animationSpeed = 0.1;

        this.rotationInitCorrection = Math.PI;

        this.shooter = shooter;
    },

    setTarget: function (obj) {
        var map = this.getMap.call();
        //new position calculation
        var deltaX = obj.x - this.x;
        var deltaY = obj.y - this.y;

        var absSum = Math.abs(deltaX) + Math.abs(deltaY);

        var px = (deltaX / (absSum)) * this.speed / this.slow;
        var py = (deltaY / (absSum)) * this.speed / this.slow;

        this.vectorX = px;
        this.vectorY = py;
    },

    run: function () {
        this.map = this.getMap.call();
        this.interval = setInterval($.proxy(this.doOne, this), this.intervalTime);
    },

    doOne: function () {
        this.move();
    },

    move: function () {
        //check bounds

        if (((this.x - this.r) < this.drawArea.ox) || ((this.y - this.r) < this.drawArea.oy) || (this.x + this.r > this.drawArea.w) || (this.y + this.r > this.drawArea.h)) {
            this.die();
            return;
        }

        //check for busy, OHH!! It is target!
        //smart checking with Map busy map
        //if (this.map.isBusyPosition(this.x + this.vectorX, this.y + this.vectorY, this.r)) {
            var targets = this.map.getSoldiersByPoint(this.x, this.y, this.r);
            if (targets.length) {
                for (var i = 0; i < targets.length; i++) {
                    targets[i].item.shoot(this.shootPoints, $.proxy(this.targetDie, this), this);
                }
                this.die();
            }
        //}

        this.x += this.vectorX;
        this.y += this.vectorY;

        this.place(this.x, this.y);
    },

    targetDie: function (target) {
        this.shooter.levelup();
        this.map.core.totalScore++;
    },

    die: function () {
        clearInterval(this.interval);
        this.target = null;
        this.shooter = null;
        this.map.register(this);
    }
});