var Core = createClass({

    construct: function (canvas) {

        var w = 180.0;
        var h = 300.0;

        w = $(document).width() * 0.95;
        h = $(document).height() * 0.97;

        //canvas
        canvas.width = w;
        canvas.height = h;

        //current canvas
        this.canvas = canvas;

        this.canvasOffsetLeft = 5;
        this.canvasOffsetTop = 20;

        this.drawArea = { ox: this.canvasOffsetLeft, oy: this.canvasOffsetTop, w: w - this.canvasOffsetLeft * 2, h: h - this.canvasOffsetTop * 2 };

        log('screen: ' + this.drawArea.w + ' * ' + this.drawArea.h);

        this.context = this.canvas.getContext('2d');
        this.intervalDraw = undefined;
        this.intervalDrawTime = 20;
        this.drawFramesCountLast = 0;
        this.drawFramesCount = 0;
        this.drawFramesTime = new Date();
        this.fpsValue = 0;
        this.fpsInterval = undefined;
        this.fpsIntervalTime = 1000;
        this.assetsLoaded = false;

        //map
        this.map = undefined;
        this.info = undefined;
        this.towers = [];

        //debug
        this.isDebug = false;

        //renderer
        //this.renderer = 'default';
        this.renderer = 'pixi';

    },

    init: function () {
        //debugger;
        this.addEventListeners();

        if (this.renderer == 'pixi') {
            //load assets
            if (!this.assetsLoaded) {
                this.loadAssets();
                this.assetsLoaded = true;
                return;
            }
        }

        //game basic objects
        this.start = new Start($.proxy(this.getMap, this));
        this.finish = new Finish();


        this.start.init(this.drawArea);
        this.finish.init(this.drawArea);
        this.createTowers();

        this.map = new Map(this.drawArea, this.start, this.finish, this.start.soldiers, this.towers, $.proxy(this.register, this));
        this.info = new Info(this.drawArea, this.start.soldiers);


        if (this.renderer == 'default') {
            if (this.intervalDraw != undefined) {
                clearInterval(this.intervalDraw);
            }
            //log('interval draw creating...');
            this.intervalDraw = setInterval($.proxy(this.draw, this), this.intervalDrawTime);
        }
        if (this.renderer == 'pixi') {

            this.pixiStage = new PIXI.Stage(0x648975);
            this.pixiRenderer = new PIXI.autoDetectRenderer(this.canvas.width, this.canvas.height);
            // add the renderer view element to the DOM
            $('body canvas').hide();
            $('body form').append(this.pixiRenderer.view);

            //init objects
            this.pixiStage.addChild(this.start.pixiGetSprite());
            this.pixiStage.addChild(this.finish.pixiGetSprite());
            this.pixiStage.addChild(this.info.pixiGetText());

            for (var i = 0; i < this.towers.length; i++) {
                this.register(this.towers[i]);
            }

            //instead of draw interval
            requestAnimFrame($.proxy(this.draw, this));
        }

        this.fpsInterval = setInterval($.proxy(this.updateFps, this), this.fpsIntervalTime);

        this.showDebug();

        this.run();
    },

    loadAssets: function () {
        var assetsToLoader = ['./js/assets/tank.json'];
        loader = new PIXI.AssetLoader(assetsToLoader);
        loader.onComplete = $.proxy(this.init, this);
        loader.load();
    },

    register: function (object) {
        if (this.renderer == 'pixi') {
            if (!object.registered)
            {
                this.pixiStage.addChild(object.pixiGetSprite());
                object.registered = true;
                object.place(object.x, object.y);
            }
            else {
                if (object.sprite)
                    this.pixiStage.removeChild(object.sprite);
                if (object.movie)
                this.pixiStage.removeChild(object.movie);
                object.registered = false;
            }
        }
    },

    addEventListeners: function () {
        $('body').bind('mousedown', $.proxy(this.onCanvasClick, this));
        $(window).bind('keydown', $.proxy(this.onKeyDown, this));
    },

    onKeyDown: function (e) {
        var keyCode = e.keyCode;
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
        if (keyCode == 39) { //right
            e.preventDefault();
            this.moveSelection(1);
        }
        if (keyCode == 37) { //left
            e.preventDefault();
            this.moveSelection(-1);
        }
    },

    deepDebug: function () {
        for (var i = 0; i < this.start.soldiers.length; i++) {
            if (this.start.soldiers[i].selected) {
                this.start.soldiers[i].deepDebug = true;
            }
        }
    },

    markAsFinished: function () {
        for (var i = 0; i < this.start.soldiers.length; i++) {
            if (this.start.soldiers[i].selected) {
                this.start.soldiers[i].finished = true;
            }
        }
    },

    moveSelection: function (offset) {
        var index = 0;
        for (var i = 0; i < this.start.soldiers.length; i++) {
            if (this.start.soldiers[i].selected) {
                index = i + offset;;
            }
            if (index < 0) {
                index = this.start.soldiers.length - 1;
            }
            if (index > (this.start.soldiers - 1)) {
                index = 0;
            }
            this.start.soldiers[i].selected = false;
        }
        this.start.soldiers[index].selected = true;
    },

    onCanvasClick: function (e) {
        log('Event: click ' + (e.pageX - e.currentTarget.offsetLeft) + ' ' + (e.pageY - e.currentTarget.offsetTop));
        var tower = new Tower(this.drawArea);
        tower.x = e.pageX - e.currentTarget.offsetLeft - tower.r * 4;
        tower.y = e.pageY - e.currentTarget.offsetTop - tower.r * 2;
        tower.place(tower.x, tower.y);
        this.towers.push(tower);
        this.register(tower);
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
        for (var i = 0; i < this.map.soldiers.length; i++) {
            this.map.soldiers[i].rePath = true;
        }
    },

    updateFps: function () {
        var date = new Date();
        var msecs = date - this.drawFramesTime;
        var frames = this.drawFramesCount - this.drawFramesCountLast;
        this.fpsValue = Math.round(frames / (msecs / 1000));
        this.info.updateInfo(this.fpsValue);
        this.drawFramesTime = date;
        this.drawFramesCountLast = this.drawFramesCount;
    },

    getMap: function () {
        return this.map;
    },

    run: function () {
        //log('game has been started');
        this.start.run();
    },

    createTowers: function () {
        var tower;
        tower = new Tower(this.drawArea);
        tower.x -= 0;
        tower.y -= 50;
        tower.r = 20;
        this.towers.push(tower);
        tower = new Tower(this.drawArea);
        tower.x = this.finish.x - 50;
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
        if (this.renderer == 'default') {
            //log('drawing tik');
            //clear for redrawing
            //this.context.clearRect(this.drawArea.ox, this.drawArea.oy, this.drawArea.w, this.drawArea.h);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            //start and finish
            this.start.draw(this.context);
            this.finish.draw(this.context);

            //soldiers
            /*for (var i = 0; i < this.start.soldiers.length; i++) {
            if (this.start.soldiers[i].enabled) {
            this.start.soldiers[i].draw(this.context);
            }
            }*/
            for (var name in this.start.soldiers) {
                if (this.start.soldiers[name].enabled) {
                    this.start.soldiers[name].draw(this.context);
                }
            }
            //debugger;
            //towers
            for (var towerNum in this.towers) {
                this.towers[towerNum].draw(this.context);
            }

            //map info
            this.map.draw(this.context);

            //info
            this.info.draw(this.context);

            //debug
            if (this.isDebug) {
                this.drawDebug();
            }

            //---------
        }
        else if (this.renderer == 'pixi') {
            this.pixiRenderer.render(this.pixiStage);
            requestAnimFrame($.proxy(this.draw, this));

            if (this.isDebug) {
                this.drawDebug();
            }
        }

        this.drawFramesCount++;
    },

    drawDebug: function () {
        var debug = $('.debug');
        var content = '';
        for (var name in this.start.soldiers) {
            if (this.start.soldiers[name].selected) {
                content += this.start.soldiers[name].getDebugInfo();
            }
        }
        debug.html(content);
    }
});