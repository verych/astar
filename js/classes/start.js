var Start = createClass({
    extend: Object,

    construct: function (core) {
        Object.call(this);
        this.core = core;
        this.uid = this.core.getUid();
        this.drawArea = this.core.drawArea;

        this.getMap = $.proxy(core.getMap, core);

        this.r = 16;
        this.level = 1;
        this.limit = 500;
        this.limitPerMap = 50;
        this.interval = undefined;
        this.intervalTime = 3000;
        this.debugSoldiers = false;

        //time for test
        this.timeStartGeneration = undefined;
        this.timeEndGeneration = undefined;

        this.soldiers = [];
        this.finish = new Finish();
        this.finish.init(core.drawArea);

        this.texture = 'start.png';
    },

    run: function () {
        if (this.debugSoldiers)
        {
            var soldier1 = new SoldierSapience(this.drawArea, 'Soldier #1', this.getMap, $.proxy(this.removeDisabledSoldiers, this));
            this.soldiers.push(soldier1);
            soldier1.place(0, this.y + 80);
            soldier1.speed = 5;
            soldier1.health = 15;
            soldier1.r = 15;
            soldier1.run();

            var soldier2 = new SoldierSapience(this.drawArea, 'Soldier #2', this.getMap, $.proxy(this.removeDisabledSoldiers, this));
            this.soldiers.push(soldier2);
            soldier2.place(0, this.y - 80);
            soldier2.speed = 5;
            soldier2.health = 15;
            soldier2.r = 15;
            soldier2.run();
        }
        else
        {
            log('soldiers generation enabled: ' + this.intervalTime + 'ms');
            this.timeStartGeneration = new Date();
            this.interval = setInterval($.proxy(this.doOne, this), this.intervalTime);
        }
    },

    stop: function () {
        clearInterval(this.interval);
        log('Generation disabled');
    },

    doOne: function () {
        //log('do soldier');
        if (this.limit <= 0) {
            clearInterval(this.interval);
            this.timeEndGeneration = new Date();
            log(this.timeEndGeneration - this.timeStartGeneration);
            return;
        }
        if (this.soldiers.length < this.limitPerMap) {
            this.limit--;
            var map = this.getMap.call();
            var soldier = new SoldierSapience(this, 'Soldier #' + this.limit + ' s:' + this.uid, this.getMap, $.proxy(this.removeDisabledSoldiers, this));
            soldier.place(this.x, this.y);
            this.soldiers.push(soldier);
            map.register(soldier);
            soldier.run();
        }
        //log('Created "' + soldier.name + '"');
    },

    removeDisabledSoldiers: function (soldier) {
        //log('delete: ' + soldier);
        var i = this.soldiers.indexOf(soldier);
        this.soldiers.splice(i, 1);
        if (soldier.registered) {
            var map = this.getMap.call();
            map.register(soldier);
        }
        //this.soldiers.count--;
    },

    init: function () {
        this.x = parseFloat(this.r * 2 + 1);
        this.y = parseFloat(this.drawArea.h / 2);
    }
});