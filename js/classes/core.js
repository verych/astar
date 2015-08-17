var Core = createClass({

    construct: function (canvas) {

        var w = 180.0;
        var h = 300.0;

        w = $(document).width();
        h = $(document).height();

        //canvas
        canvas.width = w;
        canvas.height = h;

        //current canvas
        this.canvas = canvas;

        this.canvasOffsetLeft = 20;
        this.canvasOffsetTop = 20;

        this.drawArea = { ox: this.canvasOffsetLeft, oy: this.canvasOffsetTop, w: w - this.canvasOffsetLeft * 2, h: h - this.canvasOffsetTop * 2 };

        //log('screen: ' + this.drawArea.w + ' * ' + this.drawArea.h);

        this.context = this.canvas.getContext('2d');
        this.intervalDraw = undefined;
        this.intervalDrawTime = 20;
        this.drawFramesCountLast = 0;
        this.drawFramesCount = 0;
        this.drawFramesTime = new Date();
        this.fpsValue = 0;
        this.fpsInterval = undefined;
        this.fpsIntervalTime = 100;
        this.calcAstarCount = 0;
        this.assetsLoaded = false;

        this.totalScore = 0;
        this.totalSkipped = 0;
        this.towerPoints = 0;
        this.shooterPoints = 0;

        //map
        this.map = undefined;
        this.info = undefined;
        this.towers = [];
        this.starts = [];

        //debug
        this.isDebug = true;

        //renderer
        //this.renderer = 'default';
        this.renderer = 'pixi';

        this.currentUniqueID = 0;

        //levels
        //debugger;
        this.levels = new Levels();
        this.levelNumber = 2;
        this.levelLoader = this.levels.loaders[this.levelNumber];

        this.backgroundContainer = new PIXI.Container(); //z = 0
        this.soldiersContainer = new PIXI.Container(); //z = 1
        this.treesContainer = new PIXI.Container(); // z = 2
        this.infoContainer = new PIXI.Container(); // z = 2
        this.debugContainer = new PIXI.Container(); // z = 2
        this.backgroundImage = null;
        this.backgroundScaleX = 1;
        this.backgroundScaleY = 1;
        this.backgroundPositionX = 1;
        this.backgroundPositionY = 1;

        this.isDrawMap = false;
        this.drawMapInterval = false;
        this.drawMapIntervalTime = 100;
        this.drawMapGraphics = new PIXI.Graphics();
    },

    getUid: function(){
        return this.currentUniqueID++;
    },

    init: function () {
        //debugger;
        //console.log("core init");

        if (this.renderer == 'pixi') {
            //load assets
            if (!this.assetsLoaded) {
                this.loadAssets();
                this.assetsLoaded = true;
                return;
            }
        }

        this.levelLoader(this);

        this.map = new Map(this);
        this.info = new Info(this.drawArea, this.starts);

        this.pixiStage = new PIXI.Container();
        this.pixiRenderer = new PIXI.autoDetectRenderer(this.canvas.width, this.canvas.height, { antialias: true, backgroundColor: 0x648975 });
        // add the renderer view element to the DOM
        $('body canvas').hide();
        $('body form').append(this.pixiRenderer.view);

        //background
        this.pixiStage.addChild(this.backgroundContainer);
        if (this.backgroundImage) {
            this.backgroundSprite = PIXI.Sprite.fromImage('./assets/' + this.backgroundImage);
            this.backgroundSprite.scale.x = this.backgroundScaleX;
            this.backgroundSprite.scale.y = this.backgroundScaleY;
            this.backgroundSprite.position.x = this.backgroundPositionX;
            this.backgroundSprite.position.y = this.backgroundPositionY;
            //events
            this.backgroundSprite.interactive = true;
            this.backgroundSprite.on('mousedown', $.proxy(this.click, this));
            this.backgroundSprite.on('touchstart', $.proxy(this.click, this));

            this.backgroundContainer.addChild(this.backgroundSprite);
        }
        this.pixiStage.addChild(this.soldiersContainer);
        this.pixiStage.addChild(this.treesContainer);
        this.pixiStage.addChild(this.infoContainer);
        this.pixiStage.addChild(this.debugContainer);

        //init objects
        for (var i = 0; i < this.starts.length; i++) {
            this.backgroundContainer.addChild(this.starts[i].pixiGetSprite());
            this.backgroundContainer.addChild(this.starts[i].finish.pixiGetSprite());
        }
        this.infoContainer.addChild(this.info.pixiGetText());

        for (var i = 0; i < this.towers.length; i++) {
            this.register(this.towers[i]);
            if (this.towers[i].shooter) {
                this.register(this.towers[i].shooter);
            }
        }

        //busy map debug
        this.debugContainer.addChild(this.drawMapGraphics);

        //events
        this.addEventListeners(); 

        //instead of draw interval
        requestAnimationFrame($.proxy(this.draw, this));

        this.fpsInterval = setInterval($.proxy(this.updateFps, this), this.fpsIntervalTime);

        this.showDebug();
        this.run();
    },

    loadAssets: function () {
        var loader = PIXI.loader; // pixi exposes a premade instance for you to use.
        loader.add('tank', './js/assets/tank.json');
        loader.add('tankV2', './js/assets/tankV2.json');
        loader.add('cannonV2', './js/assets/cannonV2.json');
        loader.add('explosion', './js/assets/explosion.json');
        loader.once('complete', $.proxy(this.init, this));
        loader.load();
    },

    register: function (regObject, container) {
        container = container ? container : this.treesContainer;
        if (this.renderer == 'pixi') {
            if (!regObject.registered)
            {
                container.addChild(regObject.pixiGetSprite());
                regObject.registered = true;
                if (regObject.debugGraphics != null) {
                    container.addChild(regObject.debugGraphics);
                }
                regObject.place(regObject.x, regObject.y);
            }
            else {
                if (regObject.sprite) {
                    container.removeChild(regObject.sprite);
                }
                if (regObject.movie) {
                    container.removeChild(regObject.movie);
                }
                if (regObject.debugGraphics != null) {
                    container.removeChild(regObject.debugGraphics);
                }
                regObject.registered = false;
            }
        }
    },

    registerSoldier: function (regObject) {
        this.register(regObject, this.soldiersContainer);
    },

    addEventListeners: function () {
        $(window).bind('keydown', $.proxy(this.onKeyDown, this));
    },

    onKeyDown: function (e) {
        
        var keyCode = e.keyCode;
        if (!e.ctrlKey && keyCode == 13) { //Enter
            e.preventDefault();
            this.run();
        }
        if (e.ctrlKey && keyCode == 68) { //ctrl+d
            e.preventDefault();
            this.showDebug();
        }
        if (e.ctrlKey && keyCode == 13) { //ctrl+enter
            e.preventDefault();
            this.deepDebug();
        }
        if (e.ctrlKey && keyCode == 46) { //ctrl+delete
            e.preventDefault();
            this.markAsFinished();
        }
        if (e.ctrlKey && keyCode == 77) { //ctrl+m
            e.preventDefault();
            this.drawMap();
        }
        if (keyCode == 39) { //right
            e.preventDefault();
            this.moveSelection(1);
        }
        if (keyCode == 37) { //left
            e.preventDefault();
            this.moveSelection(-1);
        }
    },

    drawMap: function () {
        this.isDrawMap = !this.isDrawMap;
        if (this.isDrawMap) {
            //enable interval
            clearInterval(this.drawMapInterval);
            this.drawMapInterval = setInterval($.proxy(this.drawMapData, this), this.drawMapIntervalTime);
        }
        else {
            clearInterval(this.drawMapInterval);
            this.drawMapGraphics.clear();
        }
    },

    drawMapData: function () {
        this.drawMapGraphics.clear();
        this.drawMapGraphics.lineStyle(1, 0xFFFFFF, 0.1);
        for (var ix = 0; ix < this.map.busyMap.length; ix++) {
            for (var iy = 0; iy < this.map.busyMap[ix].length; iy++) {

                if (this.map.busyMap[ix][iy].count) {
                    this.drawMapGraphics.beginFill(0x000000, 0.3);
                    var subX = ix * this.map.mapCellSize;
                    var subY = iy * this.map.mapCellSize;
                    this.drawMapGraphics.drawRoundedRect(Math.round(subX + this.drawArea.ox ), Math.round(subY + this.drawArea.oy ), this.map.mapCellSize - 1, this.map.mapCellSize - 1, 3);
                    this.drawMapGraphics.endFill();
                }
            }
        }
    },

    deepDebug: function () {
        for (var s = 0; s < this.starts.length; s++) {
            for (var i = 0; i < this.starts[s].soldiers.length; i++) {
                if (this.starts[s].soldiers[i].selected) {
                    this.starts[s].soldiers[i].deepDebug = true;
                }
            }
        }
    },

    markAsFinished: function () {
        for (var s = 0; s < this.starts.length; s++) {
            for (var i = 0; i < this.starts[s].soldiers.length; i++) {
                if (this.starts[s].soldiers[i].selected) {
                    this.starts[s].soldiers[i].finished = true;
                }
            }
        }
    },

    getAllSoldiers: function () {
        var res = [];
        for (var s = 0; s < this.starts.length; s++) {
            res = res.concat(this.starts[s].soldiers);
        }
        return res;
    },

    moveSelection: function (offset) {
        var index = 0;
        var soldiers = this.getAllSoldiers();
        
        for (var i = 0; i < soldiers.length; i++) {
            if (soldiers[i].selected) {
                index = i + offset;;
            }
            if (index < 0) {
                index = soldiers.length - 1;
            }
            if (index > (soldiers - 1)) {
                index = 0;
            }
            soldiers[i].selected = false;
        }
        soldiers[index].selected = true;
        console.log("selection ", soldiers.length, index);
    },

    click: function (e) {
        if (!e.data.originalEvent.ctrlKey && this.shooterPoints <= 0) {
            return;
        }
        if (e.data.originalEvent.ctrlKey && this.towerPoints <= 0) {
            return;
        }

        var tower = new Tower(this.drawArea, $.proxy(this.getMap, this), { hasShooter: !e.data.originalEvent.ctrlKey });
        tower.r = (!e.data.originalEvent.ctrlKey) ? 10 : (5 + Math.random() * 10);
        tower.x = e.data.global.x - this.drawArea.ox;//e.pageX - e.currentTarget.offsetLeft - this.drawArea.ox;
        tower.y = e.data.global.y - this.drawArea.oy;//e.pageY - e.currentTarget.offsetTop - this.drawArea.oy;
        tower.place(tower.x, tower.y);
        this.towers.push(tower);
        this.register(tower);

        if (!e.data.originalEvent.ctrlKey) {
            tower.shooter = new Shooter(this.drawArea, $.proxy(this.getMap, this));
            tower.shooter.x = tower.x;
            tower.shooter.y = tower.y;
            tower.shooter.leveupIncrement = 1;
            this.register(tower.shooter);
            this.shooterPoints--;
        }
        else {
            this.towerPoints--;
        }

        this.repathSoldiers();
    },

    showDebug: function () {
        //debugger;
        var debug = $('.debug');
        if (debug.length) {
            debug.toggle();
        }
        else {
            debug = $('<div class="debug">');
            debug.appendTo('body');
            this.isDebug = true;
        }
    },

    repathSoldiers: function () {
        var soldiers = this.getAllSoldiers();
        for (var i = 0; i < soldiers.length; i++) {
            soldiers[i].rePath = true;
        }
    },

    updateFps: function () {
        var date = new Date();
        var msecs = date - this.drawFramesTime;
        var frames = this.drawFramesCount - this.drawFramesCountLast;
        var astars = window.astarCounter - this.calcAstarCount;
        this.fpsValue = Math.round(frames / (msecs / 1000));
        this.cpsValue = Math.round(astars / (msecs / 1000));
        this.calcAstarCount = window.astarCounter;
        this.info.updateInfo(this.fpsValue, this.cpsValue);
        this.drawFramesTime = date;
        this.drawFramesCountLast = this.drawFramesCount;
    },

    getMap: function () {
        return this.map;
    },

    run: function () {
        //this.starts[0].run();
        //log('game has been started');
        for (var s = 0; s < this.starts.length; s++) {
            this.starts[s].run();
        }
    },

    createTowers: function () {
        var tower;
        tower = new Tower(this.drawArea);
        tower.x -= 0;
        tower.y -= 50;
        tower.r = 20;
        this.towers.push(tower);
        tower = new Tower(this.drawArea);
        tower.x = this.starts[0].finish.x - 50;
        tower.y -= 10;
        tower.r = 10;
        this.towers.push(tower);
        tower = new Tower(this.drawArea);
        tower.x += 0;
        tower.y += 50;
        tower.r = 20;
        this.towers.push(tower);
    },

    draw: function () {
        this.pixiRenderer.render(this.pixiStage);
        requestAnimationFrame($.proxy(this.draw, this));

        if (this.isDebug) {
            this.drawDebug();
        }
        this.drawFramesCount++;
    },

    drawDebug: function () {
        var debug = $('.debug');
        var content = '';
        var soldiers = this.getAllSoldiers();
        for (var name in soldiers) {
            if (soldiers[name].selected) {
                content += soldiers[name].getDebugInfo();
            }
        }
        debug.html(content);
    }
});