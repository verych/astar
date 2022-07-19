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
        app.levelStartDelay = 1000;

        app.canvas.width = 1500;
        app.canvas.height = 900;
        app.drawArea.w = 1500;
        app.drawArea.h = 900;
        app.drawArea.ox = 0;
        app.drawArea.oy = 0;

        //background
        app.backgroundImage = 'bg7.jpg';
        app.backgroundScaleX = 1.1;
        app.backgroundScaleY = 1.1;
        app.backgroundPositionX = -10;
        app.backgroundPositionY = -20;

        //limits
        app.towerPoints = 100;
        app.shooterPoints = 30;

        //starts
        var start1 = new Start(app);
        start1.init();
        start1.place(30, app.drawArea.h / 2);
        start1.finish.place(app.drawArea.w - 30, app.drawArea.h / 2);
        start1.limit = 250;
        start1.limitPerMap = 1;
        start1.sprayY = 500;
        start1.sprayX = 1;
        start1.intervalTime = 10;
        start1.limitPerMapIncrements = [];

        //app.starts.push(start1);

        var start2 = new Start(app);
        start2.init();
        start2.place(app.drawArea.w / 2, 30);
        start2.finish.place(app.drawArea.w / 2, app.drawArea.h - 30);
        start2.limit = 250;
        start2.limitPerMap = 10;
        start2.sprayY = 1;
        start2.sprayX = 500;
        start2.intervalTime = 10;
        start2.limitPerMapIncrements = [];

        app.starts.push(start2);

        //soldiers
        //slow aand fat
        start1.genome = {
            health: 10,
            speed: 1,
            slow: 4,
            radius: 10,
            rotationSpeed: 0.1,
            attributePoints: 0,
            attributePointsIncrement: 1.8,
            maxRadius: 20,
            maxSpeed: 9,
            stupidPercent: 0.03,
            thresholdPassability: 20
        }
        //speedy
        start2.genome = {
            health: 50,
            speed: 5,
            slow: 2,
            radius: 16,
            rotationSpeed: 0.5,
            attributePoints: 0,
            attributePointsIncrement: 0,
            maxRadius: 14,
            maxSpeed: 30,
            stupidPercent: 0,
            thresholdPassability: 20
        }

         for (var i = 0; i < 11; i++) {
             tower = new Tower(app.drawArea, $.proxy(app.getMap, app), {hasShooter: true});
             tower.r = 10;
             tower.y = start1.y;
             tower.x = 351 + tower.r * i * 2 * 4;
             app.towers.push(tower);

             tower.shooter = new Shooter(app.drawArea, $.proxy(app.getMap, app));
             tower.shooter.x = tower.x;
             tower.shooter.y = tower.y;
             tower.shooter.shootDelayMs = 1000;
             tower.shooter.leveupIncrement = 1;
             tower.shooter.bulletPoints = 50;
             tower.shooter.bulletSpeed = 15;
             
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
        app.levelStartDelay = 15000;

        //screen size
        app.canvas.width = 1500;
        app.canvas.height = 900;
        app.drawArea.w = 1500;
        app.drawArea.h = 900;
        app.drawArea.ox = 0;
        app.drawArea.oy = 0;

        //background
        app.backgroundImage = 'bg7.jpg';
        app.backgroundScaleX = 1.1;
        app.backgroundScaleY = 1.1;
        app.backgroundPositionX = -10;
        app.backgroundPositionY = -20;

        //limits
        app.towerPoints = 100;
        app.shooterPoints = 30;

        //starts
        var start1 = new Start(app);
        start1.init();
        start1.place(10, 250);
        start1.finish.place(app.drawArea.w - 30, app.drawArea.h - 100);
        start1.limit = 500;
        start1.limitPerMap = 1;
        start1.sprayY = 500;
        start1.sprayX = 1;
        start1.intervalTime = 500;
        start1.limitPerMapIncrements = [3, 5, 10, 50, 100, 200, 300, 400, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490];

        app.starts.push(start1);

        var start2 = new Start(app);
        start2.init();
        start2.place(300, 10);
        start2.finish.place(app.drawArea.w - 100, app.drawArea.h - 30);
        start2.limit = 500;
        start2.limitPerMap = 1;
        start2.sprayY = 1;
        start2.sprayX = 600;
        start2.intervalTime = 1000;
        start2.limitPerMapIncrements = [3, 10, 20, 30, 40, 50, 51, 52, 53, 100, 200, 300, 400, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490];

        app.starts.push(start2);

        //soldiers
        //slow aand fat
        start1.genome = {
            health: 100,
            speed: 1,
            slow: 5,
            radius: 15,
            rotationSpeed: 0.5,
            attributePoints: 1,
            attributePointsIncrement: 3,
            maxRadius: 20,
            maxSpeed: 15,
            stupidPercent: 0.03,
            thresholdPassability: 1,
            passbyPercent: 0.5
        }
        //speedy
        start2.genome = {
            health: 1,
            speed: 1,
            slow: 2,
            radius: 8,
            rotationSpeed: 0.3,
            attributePoints: 0,
            attributePointsIncrement: 1,
            maxRadius: 12,
            maxSpeed: 20,
            stupidPercent: 0.05,
            thresholdPassability: 30,
            passbyPercent: 0.5
        }


        //rocks
        var prevt;
        for (var i = 0; i < 15; i++) {
            tower = new Tower(app.drawArea, $.proxy(app.getMap, app), { hasShooter: false });
            tower.r = 70 * Math.sin(i / 5) * Math.cos(i / 10);
            tower.x = 1000 + (prevt ? (prevt.r) : 0) * 7 + tower.r + i * i;
            tower.y = i * i;
            app.towers.push(tower);
            prevt = tower;
        }

        //houses
        for (var i = 0; i < 5; i++) {
            tower = new Tower(app.drawArea, $.proxy(app.getMap, app), { hasShooter: false, isHouse: true, textureIndex: i%3 });
            tower.r = 50;
            tower.x = i * 250 + 200;
            tower.y = app.drawArea.h - 30;
            app.towers.push(tower);
        }

        //roads trees up
        for (var i = 0; i < 22; i++) {
            tower = new Tower(app.drawArea, $.proxy(app.getMap, app), { hasShooter: false, isRandomTree: true });
            tower.r = 20 + 10 * Math.random() - 10 * Math.random();
            tower.y = app.drawArea.h / 2 - 50 + 200 + i*i/2.5;
            tower.x = i * 70 + 20 * Math.random() - 20 * Math.random();
            tower.transparent = true;
            app.towers.push(tower);
        }
        //roads trees down
        /*
        for (var i = 0; i < 20; i++) {
            tower = new Tower(app.drawArea, $.proxy(app.getMap, app), { hasShooter: false, isRandomTree: true });
            tower.r = 20 + 10 * Math.random() - 10 * Math.random();
            tower.x = i * 70 + 15 * Math.random() - 15 * Math.random();
            tower.y = app.drawArea.h / 2 + 50 + 200 + i*i/2.5;
            tower.transparent = true;
            app.towers.push(tower);
        }
        */
        //bushes
        for (var i = 0; i < 21; i++) {
            tower = new Tower(app.drawArea, $.proxy(app.getMap, app), { hasShooter: false, isRandomTree: true });
            tower.r = 30 + Math.cos(i) * 5;
            tower.y = app.drawArea.h - 30 - 30 * Math.cos(i);
            tower.x = 1100 + i * 20 + 30 * Math.cos(i);
            tower.transparent = true;
            app.towers.push(tower);
            
            tower = new Tower(app.drawArea, $.proxy(app.getMap, app), { hasShooter: false, isRandomTree: true });
            tower.r = 30 + Math.cos(i) * 5;
            tower.x = app.drawArea.w + 30 * Math.cos(i) - 30;
            tower.y = 600 + i * 15 + 10 * Math.cos(i);
            tower.transparent = true;
            app.towers.push(tower);
        }
        for (var i = 0; i < 30; i++) {
            tower = new Tower(app.drawArea, $.proxy(app.getMap, app), { hasShooter: false, isRandomTree: true });
            tower.r = 40 + Math.random() * 5;
            tower.y = app.drawArea.h + 30 - 50 * Math.random();
            tower.x = 100 + Math.random() * 1000;
            tower.transparent = true;
            app.towers.push(tower);
        }
        //road
        for (var i = 0; i < 40; i++) {
            var sprite = new AppSprite(app.map);
            sprite.createRoad(i * 40, app.drawArea.h / 2 + 200 + i*i/7, 17);
        }
        //small roads
        for (var i = 0; i < 108; i++) {
            var sprite = new AppSprite(app.map);
            sprite.createRoad(i * 8 + 190, app.drawArea.h / 2 + 330, 4);
        }
        //small roads
        for (var i = 0; i < 4; i++) {
            var sprite = new AppSprite(app.map);
            sprite.createRoad(190, app.drawArea.h / 2 + 340 + i * 8, 4);
            var sprite = new AppSprite(app.map);
            sprite.createRoad(450, app.drawArea.h / 2 + 340 + i * 8, 4);
            var sprite = new AppSprite(app.map);
            sprite.createRoad(700, app.drawArea.h / 2 + 340 + i * 8, 4);
            var sprite = new AppSprite(app.map);
            sprite.createRoad(950, app.drawArea.h / 2 + 340 + i * 8, 4);
        }
        for (var i = 0; i < 10; i++) {
            var sprite = new AppSprite(app.map);
            sprite.createRoad(1050, app.drawArea.h / 2 + 340 + i * 8, 4);
        }

        //Guinness
        var G = new Tower(app.drawArea, $.proxy(app.getMap, app), { isGuinness: true, textureIndex: 1});
        G.r = 50;
        G.y = app.drawArea.h - 50;
        G.x = app.drawArea.w - 50;
        app.towers.push(G);
    }
});
