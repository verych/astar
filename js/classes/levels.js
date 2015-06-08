var Levels = createClass({
    construct: function () {
        this.loaders = [];

        this.initLevels();
    },

    initLevels: function () {
        var self = this;

        this.loaders.push(function (app) { self.getLevelTest1(app) });
        this.loaders.push(function (app) { self.getLevelTest2(app) });
    },

    getLevelTest1: function (app) {
        //screen size
        app.canvas.width = 400;
        app.canvas.height = 300;
        app.drawArea.w = 400;
        app.drawArea.h = 300;
        app.drawArea.ox = 0;
        app.drawArea.oy = 0;

        //starts
        var start1 = new Start(app);
        start1.init();
        start1.place(30, app.drawArea.h / 2);
        start1.finish.place(app.drawArea.w - 30, app.drawArea.h / 2);
        start1.limit = 100;
        start1.limitPerMap = 1;
        start1.intervalTime = 1000;
        app.starts.push(start1);

        //soldiers
        start1.genome = {
            health: 16,
            speed: 1,
            slow: 3,
            radius: 16,
            rotationSpeed: 0.2
        }

        //towers
        var tower;
        tower = new Tower(app.drawArea);
        tower.x = 200;
        tower.y = 50;
        tower.r = 10;
        app.towers.push(tower);
        tower = new Tower(app.drawArea);
        tower.x = 200;
        tower.y = 240;
        tower.r = 10;
        app.towers.push(tower);

    },

    getLevelTest2: function (app) {
        //screen size
        app.canvas.width = 800;
        app.canvas.height = 700;
        app.drawArea.w = 700;
        app.drawArea.h = 640;
        app.drawArea.ox = 50;
        app.drawArea.oy = 30;

        //starts
        var start1 = new Start(app);
        start1.init();
        start1.place(30, app.drawArea.h / 2);
        start1.finish.place(app.drawArea.w - 30, app.drawArea.h / 2);
        start1.limit = 30;
        start1.limitPerMap = 20;
        start1.intervalTime = 500;
        app.starts.push(start1);

        //soldiers
        start1.genome = {
            health: 16,
            speed: 1,
            slow: 3,
            radius: 16,
            rotationSpeed: 0.2
        }

        //towers
        var tower;
        tower = new Tower(app.drawArea);
        tower.x = 300;
        tower.y = 330;
        tower.r = 40;
        app.towers.push(tower);
        tower = new Tower(app.drawArea);
        tower.x = 500;
        tower.y = 330;
        tower.r = 40;
        app.towers.push(tower);
        tower = new Tower(app.drawArea);
        tower.x = start1.x + 20;
        tower.y = start1.y;
        tower.r = 10;
        app.towers.push(tower);
    }

});