var Shooter = createClass({
    extend: AppObject,

    construct: function (drawArea, getMapCallback) {
        AppObject.call(this);
        this.type = 'shooter';
        this.drawArea = drawArea;
        this.getMap = getMapCallback;

        this.speed = 0;
        this.power = 1;

        this.r = 10;

        this.interval = undefined;
        this.intervalTime = 100;

        this.texture = 'shooter01.png';
        this.textureSizeX = 32;
        this.textureSizeY = 32;

        this.target = undefined;

        this.setPositionCenter();
        console.log('Created shooter: xyr=' + this.x + '-' + this.y + ': ' + this.r);

        this.rotationInterval = undefined;
        this.rotationIntervalTime = 10;
        this.rotationSpeed = 0.02;

        this.rotationInitCorrection = Math.PI;

        this.distance = this.r * 10;

        this.run();
    },

    run: function () {
        this.interval = setInterval($.proxy(this.doOne, this), this.intervalTime);
    },

    doOne: function () {
        if (!this.target) {
            this.checkForTarget();
        }
        else {
            this.rotateToTarget();
        }
    },

    rotateToTarget: function () {
        clearInterval(this.rotationInterval);
        this.rotationInterval = setInterval($.proxy(this.calcNewRotation, this), this.rotationIntervalTime);
    },

    calcAngleToTarget: function () {
        var deltaX = this.target.item.x - this.x;
        var deltaY = this.target.item.y - this.y;
        var result = Number((this.rotationInitCorrection - Math.atan2(deltaX, deltaY)).toFixed(2))
        return result;
    },

    calcNewRotation: function () {
        var a = this.calcAngleToTarget();
        var delta = Math.abs(this.rotation - a);

        //checking for optimal rotation direction
        if (180 < delta * (180 / Math.PI)) {
            if (a > this.rotation) {
                a = a - 360 / (180 / Math.PI);
                delta = Math.abs(this.rotation - a);
            }
            else if (a < this.rotation) {
                this.rotation = this.rotation - 360 / (180 / Math.PI);
                delta = Math.abs(this.rotation - a);
            }
        }
        //the last rotation step checking
        if (delta <= this.rotationSpeed) {
            this.rotation = a;
            if (this.rotation < 0) {
                this.rotation = this.rotation + (360 / (180 / Math.PI));
            }
            this.rotateCompleted();
            return;
        }

        //rotation
        if (this.rotation > a) {
            this.rotation -= this.rotationSpeed;
        }
        else {
            this.rotation += this.rotationSpeed;
        }

        this.place(this.x, this.y);
    },

    rotateCompleted: function () {
        clearInterval(this.rotationInterval);
        console.log('piu-piu!');
        this.target = null;
    },

    checkForTarget: function () {
        //debugger;
        var map = this.getMap.call();
        //checking all units
        //debugger;
        var targets = map.getSoldiersInArea(this.x, this.y, this.distance);
        if (targets.length) {
            this.target = targets[0];
        }
    },

    setPositionCenter: function () {
        this.place(this.drawArea.w / 2, this.drawArea.h / 2);
    }
});