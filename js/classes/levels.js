var Levels = createClass({
    construct: function () {
        this.loaders = [];

        this.initLevels();
    },

    initLevels: function () {
        var self = this;

        this.loaders.push(function (app) { self.getLevelTest1(app) });
        this.loaders.push(function (app) { self.getLevelTest2(app) });
        this.loaders.push(function (app) { self.getLevelTest3(app) });
    },

    getLevelTest1: function (app) {
        //screen size
        app.canvas.width = 1200;
        app.canvas.height = 700;
        app.drawArea.w = 1200;
        app.drawArea.h = 660;
        app.drawArea.ox = 5;
        app.drawArea.oy = 20;

        //background
        app.backgroundImage = 'bg7.jpg';
        app.backgroundScaleX = .9;
        app.backgroundScaleY = .9;
        app.backgroundPositionX = -10;
        app.backgroundPositionY = -20;

        //limits
        app.towerPoints = 0;
        app.shooterPoints = 0;

        //starts
        var start1 = new Start(app);
        start1.init();
        start1.place(10, app.drawArea.h / 2);
        start1.finish.place(app.drawArea.w - 30, app.drawArea.h / 2);
        start1.limit = 100;
        start1.limitPerMap = 1;
        start1.sprayY = 1;
        start1.sprayX = 1;
        start1.intervalTime = 10;

        app.starts.push(start1);

        //soldiers
        start1.genome = {
            health: 100,
            speed: 3,
            slow: 5,
            radius: 10,
            rotationSpeed: 0.3,
            attributePoints: 0,
            attributePointsIncrement: 0.00,
            maxRadius: 15,
            maxSpeed: 70
        }
        
        var tower;
        var sign = 1;
        for (var i = 0; i < 1; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 10; //20 + Math.sin(i) * 10;
            tower.y = start1.y;
            tower.x = 400 + i * 10;
            tower.shooter = new Shooter(app.drawArea, $.proxy(app.getMap, app));
            tower.shooter.x = tower.x;
            tower.shooter.y = tower.y;
            tower.shooter.r = 15; //5+ tower.r;
            tower.shooter.bulletSize = 2;
            tower.shooter.bulletSpeed = 10;
            tower.shooter.bulletPoints = 1;
            tower.shooter.shootDelayMs = 5000;
            tower.shooter.rotationSpeed = 0.05;
            tower.shooter.distance = 300;
            tower.shooter.leveupIncrement = 0;
            app.towers.push(tower);
            sign *= -1;
        }
        

    },

    getLevelTest2: function (app) {
        //screen size
        app.canvas.width = 800;
        app.canvas.height = 700;
        app.drawArea.w = 700;
        app.drawArea.h = 640;
        app.drawArea.ox = 50;
        app.drawArea.oy = 30;

        //background
        app.backgroundImage = 'bg1.jpg';
        app.backgroundScaleX = 1.6;
        app.backgroundScaleY = 1.6;
        app.backgroundPositionX = -10;
        app.backgroundPositionY = -20;

        //starts
        var start1 = new Start(app);
        start1.init();
        start1.place(30, app.drawArea.h / 2);
        start1.finish.place(app.drawArea.w - 30, app.drawArea.h / 2);
        start1.limit = 100;
        start1.limitPerMap = 50;
        start1.intervalTime = 2000;
        app.starts.push(start1);

        //soldiers
        start1.genome = {
            health: 16,
            speed: 1,
            slow: 3,
            radius: 16,
            rotationSpeed: 0.1
        }

        //towers
        var tower;
        tower = new Tower(app.drawArea);
        tower.x = 300;
        tower.y = start1.y;
        tower.r = 40;
        app.towers.push(tower);
        tower = new Tower(app.drawArea);
        tower.x = 600;
        tower.y = start1.y;
        tower.r = 38;
        app.towers.push(tower);
        for (var i = 0; i < 24; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 10;
            tower.x = 80;
            tower.y = 80 + tower.r * i * 2;
            app.towers.push(tower);
        }
        for (var i = 0; i < 24; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 10;
            tower.y = 80;
            tower.x = 80 + tower.r * i * 2;
            app.towers.push(tower);
        }
        for (var i = 0; i < 24; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 10;
            tower.y = 560;
            tower.x = 80 + tower.r * i * 2;
            app.towers.push(tower);
        }
        for (var i = 0; i < 11; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 10;
            tower.y = start1.y;
            tower.x = 351 + tower.r * i * 2;
            app.towers.push(tower);
        }
        
        //shooter
        var shooter;
        shooter = new Shooter(app.drawArea);
        shooter.x = 600;
        shooter.y = start1.y;
        shooter.r = 5;

    },

    getLevelTest3: function (app) {
        //screen size
        app.canvas.width = 1200;
        app.canvas.height = 700;
        app.drawArea.w = 1200;
        app.drawArea.h = 660;
        app.drawArea.ox = 5;
        app.drawArea.oy = 20;

        //background
        app.backgroundImage = 'bg7.jpg';
        app.backgroundScaleX = .9;
        app.backgroundScaleY = .9;
        app.backgroundPositionX = -10;
        app.backgroundPositionY = -20;

        //limits
        app.towerPoints = 100;
        app.shooterPoints = 100;

        //starts
        var start1 = new Start(app);
        start1.init();
        start1.place(10, app.drawArea.h / 2);
        start1.finish.place(app.drawArea.w - 30, app.drawArea.h / 2);
        start1.limit = 10000;
        start1.limitPerMap = 10;
        start1.sprayY = 300;
        start1.sprayX = 1;
        start1.intervalTime = 20;

        app.starts.push(start1);

        var start2 = new Start(app);
        start2.init();
        start2.place(app.drawArea.w / 2, 10);
        start2.finish.place(app.drawArea.w / 2, app.drawArea.h - 30);
        start2.limit = 10000;
        start2.limitPerMap = 10;
        start2.sprayY = 1;
        start2.sprayX = 300;
        start2.intervalTime = 20;

        app.starts.push(start2);

        //soldiers
        start1.genome = {
            health: 15,
            speed: 1,
            slow: 3,
            radius: 10,
            rotationSpeed: 0.1,
            attributePoints: 0,
            attributePointsIncrement: 0.5,
            maxRadius: 20,
            maxSpeed: 30
        }

        start2.genome = {
            health: 2,
            speed: 2,
            slow: 2,
            radius: 8,
            rotationSpeed: 0.3,
            attributePoints: 0,
            attributePointsIncrement: 0.2,
            maxRadius: 15,
            maxSpeed: 50
        }

        var tower = new Tower(app.drawArea);
        tower.x = app.canvas.width / 2;
        tower.y = app.canvas.height / 2;
        tower.r = 10;
        //shooter
        tower.shooter = new Shooter(app.drawArea, $.proxy(app.getMap, app));
        tower.shooter.x = tower.x;
        tower.shooter.y = tower.y;
        tower.shooter.r = 10;
        tower.shooter.bulletSpeed = 10;
        tower.shooter.bulletSize = 1;
        tower.shooter.bulletPoints = 1;
        tower.shooter.shootDelayMs = 1000;
        tower.shooter.rotationSpeed = 0.05;
        tower.shooter.leveupIncrement = 0.6;
        app.towers.push(tower);

        //tower    
        /*
        var tower = new Tower(app.drawArea);
        tower.x = app.canvas.width / 2 + 150;
        tower.y = start1.y;
        tower.r = 20;
        //shooter
        tower.shooter = new Shooter(app.drawArea, $.proxy(app.getMap, app));
        tower.shooter.x = tower.x;
        tower.shooter.y = start1.y;
        tower.shooter.r = 20;
        tower.shooter.bulletSpeed = 10;
        tower.shooter.bulletSize = 1;
        tower.shooter.bulletPoints = 1;
        tower.shooter.shootDelayMs = 1000;
        tower.shooter.rotationSpeed = 0.05;
        tower.shooter.leveupIncrement = 0.6;
        app.towers.push(tower);
        */
        /*
        for (var i = 0; i < 5; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 10; //20 + Math.sin(i) * 10;
            tower.y = start1.y + Math.sin(i) * 200;
            tower.x = 100 + tower.r * i * 5;
            tower.shooter = new Shooter(app.drawArea, $.proxy(app.getMap, app));
            tower.shooter.x = tower.x;
            tower.shooter.y = tower.y;
            tower.shooter.r = 15; //5+ tower.r;
            tower.shooter.bulletSize = 3;
            tower.shooter.bulletSpeed = 20;
            tower.shooter.bulletPoints = 5;
            tower.shooter.shootDelayMs = 1000;
            app.towers.push(tower);
        }
        */
    }
});