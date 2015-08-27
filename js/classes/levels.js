﻿var Levels = createClass({
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
        start1.place(10, app.drawArea.h / 2);
        start1.finish.place(app.drawArea.w - 30, app.drawArea.h / 2);
        start1.limit = 500;
        start1.limitPerMap = 1;
        start1.sprayY = 500;
        start1.sprayX = 1;
        start1.intervalTime = 10;
        start1.limitPerMapIncrements = [];

        //app.starts.push(start1);

        var start2 = new Start(app);
        start2.init();
        start2.place(app.drawArea.w / 2, 10);
        start2.finish.place(app.drawArea.w / 2, app.drawArea.h - 30);
        start2.limit = 500;
        start2.limitPerMap = 10;
        start2.sprayY = 1;
        start2.sprayX = 500;
        start2.intervalTime = 10;
        start2.limitPerMapIncrements = [];

        app.starts.push(start2);

        //soldiers
        //slow aand fat
        start1.genome = {
            health: 30,
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
        app.levelStartDelay = 30000;

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
        start1.place(10, app.drawArea.h / 2);
        start1.finish.place(app.drawArea.w - 30, app.drawArea.h / 2);
        start1.limit = 500;
        start1.limitPerMap = 1;
        start1.sprayY = 600;
        start1.sprayX = 1;
        start1.intervalTime = 1000;
        start1.limitPerMapIncrements = [5, 10, 25, 50, 100, 200, 300, 400, 450, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460];

        app.starts.push(start1);

        var start2 = new Start(app);
        start2.init();
        start2.place(app.drawArea.w / 2, 10);
        start2.finish.place(app.drawArea.w / 2, app.drawArea.h - 30);
        start2.limit = 500;
        start2.limitPerMap = 1;
        start2.sprayY = 1;
        start2.sprayX = 600;
        start2.intervalTime = 1000;
        start2.limitPerMapIncrements = [10, 20, 30, 40, 50, 100, 200, 300, 400, 500];

        app.starts.push(start2);

        //soldiers
        //slow aand fat
        start1.genome = {
            health: 30,
            speed: 1,
            slow: 5,
            radius: 15,
            rotationSpeed: 0.5,
            attributePoints: 1,
            attributePointsIncrement: 3,
            maxRadius: 20,
            maxSpeed: 20,
            stupidPercent: 0.03,
            thresholdPassability: 10
        }
        //speedy
        start2.genome = {
            health: 1,
            speed: 1,
            slow: 1,
            radius: 6,
            rotationSpeed: 0.3,
            attributePoints: 0,
            attributePointsIncrement: 0.5,
            maxRadius: 12,
            maxSpeed: 30,
            stupidPercent: 0.05,
            thresholdPassability: 30
        }
      
        
        //T
        var tower;
        var tx = 700;
        var ty = 650;
        var tprev = null;
        for (var i = 0; i < 10; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 5 + Math.sin(i) * 5;
            tower.y = (tprev ? (tprev.y + tprev.r*1.7) : ty);
            tower.x = tx + 50;
            app.towers.push(tower);
            tprev = tower;
        }
        tprev = null;
        for (var i = 0; i < 10; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 5 + Math.sin(i) * 5;
            tower.y = ty;
            tower.x = (tprev ? (tprev.x + tprev.r * 1.7) : tx);
            app.towers.push(tower);
            tprev = tower;
        }
        //A
        tprev = null;
        for (var i = 0; i < 10; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 5 + Math.sin(i) * 5;
            tower.y = (tprev ? (tprev.y + tprev.r * 1.7) : ty);
            tower.x = (tprev ? (tprev.x + tprev.r * 1.7) : tx + 150);
            app.towers.push(tower);
            tprev = tower;
        }
        tprev = null;
        for (var i = 0; i < 10; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 3 + Math.sin(i) * 3;
            tower.y = ty + 70;
            tower.x = (tprev ? (tprev.x + tprev.r * 1.7) : tx + 150);
            app.towers.push(tower);
            tprev = tower;
        }
        tprev = null;
        for (var i = 0; i < 10; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 5 + Math.sin(i) * 5;
            tower.y = (tprev ? (tprev.y + tprev.r * 1.7) : ty);
            tower.x = tx + 150;
            app.towers.push(tower);
            tprev = tower;
        }
        //N
        tprev = null;
        for (var i = 0; i < 10; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 5 + Math.sin(i) * 5;
            tower.y = (tprev ? (tprev.y + tprev.r * 1.7) : ty);
            tower.x = tx + 300;
            app.towers.push(tower);
            tprev = tower;
        }
        tprev = null;
        for (var i = 0; i < 10; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 5 + Math.sin(i) * 5;
            tower.y = (tprev ? (tprev.y + tprev.r * 1.7) : ty);
            tower.x = tx + 400;
            app.towers.push(tower);
            tprev = tower;
        }
        tprev = null;
        for (var i = 0; i < 20; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 3 + Math.sin(i) * 3;
            tower.y = (tprev ? (tprev.y + tprev.r * 1.7) : ty);
            tower.x = (tprev ? (tprev.x + tprev.r * 1.7) : tx + 300);
            app.towers.push(tower);
            tprev = tower;
        }
        //K
        tprev = null;
        for (var i = 0; i < 10; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 5 + Math.sin(i) * 5;
            tower.y = (tprev ? (tprev.y + tprev.r * 1.7) : ty);
            tower.x = tx + 450;
            app.towers.push(tower);
            tprev = tower;
        }
        tprev = null;
        for (var i = 0; i < 7; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 5 + Math.cos(i) * 3;
            tower.y = (tprev ? (tprev.y + tprev.r * 1.7) : ty + 40);
            tower.x = (tprev ? (tprev.x + tprev.r * 1.8) : tx + 450);
            app.towers.push(tower);
            tprev = tower;
        }
        tprev = null;
        for (var i = 0; i < 7; i++) {
            tower = new Tower(app.drawArea);
            tower.r = 5 + Math.cos(i) * 3;
            tower.y = (tprev ? (tprev.y - tprev.r * 1.7) : ty + 50);
            tower.x = (tprev ? (tprev.x + tprev.r * 1.8) : tx + 450);
            app.towers.push(tower);
            tprev = tower;
        }
        //S
        tprev = null;
        for (var i = 0; i < 15; i++) {
            tower = new Tower(app.drawArea, $.proxy(app.getMap, app), {hasShooter: false});
            tower.r = 20 + Math.cos(i) * 3;
            tower.y = (tprev ? (tprev.y + tprev.r * 1) : ty - 150);
            tower.x = tx + 600 + Math.sin(i / 2 + 3) * 100;
            app.towers.push(tower);
            tprev = tower;
        }
        for (var i = 0; i < 10; i++) {
            tower = new Tower(app.drawArea, $.proxy(app.getMap, app), { hasShooter: false, isRandomTree: true });
            tower.r = 20 + Math.cos(i) * 30;
            tower.y = 50 + Math.cos(i) * (50 - i) ;
            tower.x = i * 50;
            tower.transparent = true;
            app.towers.push(tower);

            tower = new Tower(app.drawArea, $.proxy(app.getMap, app), { hasShooter: false, isRandomTree: true });
            tower.r = 20 + Math.cos(i) * 10;
            tower.x = Math.cos(i) * (50 - i);
            tower.y = i * 5 + Math.random() * 10;
            tower.transparent = true;
            app.towers.push(tower);
        }
        for (var i = 0; i < 20; i++) {
            tower = new Tower(app.drawArea, $.proxy(app.getMap, app), { hasShooter: false, isRandomTree: true });
            tower.r = 30 + Math.cos(i) * 5;
            tower.y = app.drawArea.h - 30 - 30 * Math.cos(i);
            tower.x = 400 + i * 20 + 30 * Math.cos(i);
            tower.transparent = true;
            app.towers.push(tower);
            
            tower = new Tower(app.drawArea, $.proxy(app.getMap, app), { hasShooter: false, isRandomTree: true });
            tower.r = 30 + Math.cos(i) * 5;
            tower.x = app.drawArea.w + 30 * Math.cos(i) - 30;
            tower.y = 200 + i * 15 + 10 * Math.cos(i);
            tower.transparent = true;
            app.towers.push(tower);
        }

        for (var i = 0; i < 37; i++) {
            var sprite = new AppSprite(app.map);
            sprite.createRoad(i * 40, app.drawArea.h - 21, 25);

            sprite = new AppSprite(app.map);
            sprite.createRoad(app.drawArea.w - 21, i * 40, 25);

            sprite = new AppSprite(app.map);
            sprite.createRoad(21, i * 40, 25);

            sprite = new AppSprite(app.map);
            sprite.createRoad(i * 40, 21, 25);
        }
    }
});