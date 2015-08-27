var Shooter = createClass({
    extend: AppObject,

    construct: function (drawArea, getMapCallback) {
        AppObject.call(this);
        this.type = 'shooter';
        this.drawArea = drawArea;
        this.getMap = getMapCallback;

        this.speed = 0;

        this.r = 10;

        this.interval = undefined;
        this.intervalTime = 50;

        //this.texture = 'shooter01.png';
        this.textureSizeX = 32;
        this.textureSizeY = 32;
        this.movieAssets = 'CannonV2';

        this.target = undefined;

        //this.setPositionCenter();
        //console.log('Created shooter: xyr=' + this.x + '-' + this.y + ': ' + this.r);

        this.rotationInterval = undefined;
        this.rotationIntervalTime = 30;
        this.rotationSpeed = 0.1;
        this.rotationSpeedMax = 0.5;

        this.rotationInitCorrection = Math.PI;

        this.lastShootTimeMs = Date.now();
        this.shootDelayMs = 1000;
        this.bulletSpeed = 5;
        this.bulletSpeedMax = 20;
        this.bulletSize = 1;
        this.bulletSizeMax = 10;
        this.bulletPoints = 1;

        this.loop = true;
        this.animationSpeed = 0.1;

        this.score = 0;
        this.leveupIncrement = 0.1;

        this.distance = 200;

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

    levelup: function (target) {
        this.score++;
        
        this.rotationSpeed += this.leveupIncrement/500;
        this.bulletSpeed += this.leveupIncrement;
        this.distance += this.leveupIncrement;
        this.bulletSize += this.leveupIncrement / 100;
        this.shootDelayMs -= this.leveupIncrement;

        if (this.bulletSize > this.bulletSizeMax) {
            this.bulletSize = this.bulletSizeMax;
        }
        if (this.rotationSpeed > this.rotationSpeedMax) {
            this.rotationSpeed = this.rotationSpeedMax;
        }
        if (this.bulletSpeed > this.bulletSpeedMax) {
            this.bulletSpeed = this.bulletSpeedMax;
        }

        this.bulletPoints += (this.leveupIncrement);
        this.r += (this.leveupIncrement/100);
    },

    rotateToTarget: function () {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = 0;
        }
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
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = 0;
        }
        if (Date.now() - this.lastShootTimeMs > this.shootDelayMs) {
            this.lastShootTimeMs = Date.now();
            this.fire();
            //console.log('piu-piu!');
        }
        this.target = null;
    },

    fire: function () {
        var bullet = new Bullet(this.drawArea, $.proxy(this.getMap, this), this);
        bullet.x = this.x;
        bullet.y = this.y;
        bullet.speed = this.bulletSpeed;
        bullet.setTarget(this.target.item);
        bullet.r = this.bulletSize;
        bullet.shootPoints = this.bulletPoints;
        bullet.run();
  
        var map = this.getMap.call();
        map.register(bullet);
    },

    checkForTarget: function () {
        //debugger;
        var map = this.getMap.call();
        //checking all units
        //debugger;
        //console.log(this.x, this.y, this.distance);
        var targets = map.getSoldiersInArea(this.x, this.y, this.distance);
        if (targets.length) {
            this.target = targets[0];
        }
    },

    setPositionCenter: function () {
        this.place(this.drawArea.w / 2, this.drawArea.h / 2);
    }
});