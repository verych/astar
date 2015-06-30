﻿var SoldierSapience = createClass({
    extend: Soldier,

    construct: function (start, name, getMapCallback, completeCallback) {
        Soldier.call(this, start, name, getMapCallback, completeCallback);

        this.movieAssets = 'TankV2';
        this.queue = [];
        this.actions = {
            go: 'go',
            sleep: 'sleep',
            repath: 'repath',
            rotate: 'rotate',
        };
        this.currentAction = '';
        this.stopTimeDuration = 0;
        this.deepDebug = false;
        this.fallbackDistance = 3;

        if (start.genome) {
            this.genome = $.extend({}, start.genome);
        }
        else {
            this.genome = {
                health: 16,
                speed: 1,
                slow: 3,
                radius: 8,
                rotationSpeed: 0.2
            }
        }
        //test
        //this.genome.radius = Math.round(16 + 8 * Math.random());
        //this.genome.speed = this.genome.radius / 4;

        this.type = 'soldiersapience';

        this.attributePoints = 4;
        this.initAttributes();
        this.gridCellSize = this.r;
        this.debugGraphics = new PIXI.Graphics();
        this.debugGraphicsShowed = false;
        this.prevHealth = this.health;
        
        this.loop = true;
        this.animationSpeed = this.speed / 15;
    },

    getDebugInfo: function () {
        var oldDebug = Soldier.fn.getDebugInfo.call(this)
        var debug = 'SoldierSapience<br />';
        debug += 'stopTimeDuration: ' + this.stopTimeDuration + '<br />';
        var finish = this.getNodeFinish();
        if (!!finish) {
            debug += 'finishNodeX: ' + finish.x + '<br />';
            debug += 'finishNodeY: ' + finish.y + '<br />';
        }

        return oldDebug + '<div class="debug-item">' + debug + '</div>';
    },



    addAction: function (actionType, params) {
        this.currentAction = { type: actionType, params: params };
        this.queue.push(this.currentAction);
        log("Action added for " + this.name + '" - ' + actionType);
    },

    removeActionFallbacks: function (actionTypeForRemove) {
        for (var i = this.queue.length - 1; i >= 0 ; i--)
        {
            if (this.queue[i].params && this.queue[i].params.fallback)
            {
                this.queue.splice(i, 1);
            }
        }
    },

    removeAction: function (actionTypeForRemove) {
        var action = this.queue.pop();
        if (actionTypeForRemove == action.type) {
            if (this.queue.length > 0) {
                this.currentAction = this.queue[this.queue.length - 1];
                if (actionTypeForRemove == this.actions.go) {
                    this.addAction(this.actions.repath);
                }
                log("Action removed for " + this.name + '" - ' + action.type);
            }
            else {
                this.die();
            }
            return;
        }
        this.queue.push(action);
    },

    getFirstAction: function (actionType) {
        for (var i = this.queue.length - 1; i >= 0 ; i--)
        {
            if (this.queue[i].type == actionType) {
                return this.queue[i];
            }
        }
        return null;
    },

    run: function () {
        //debugger;
        var map = this.getMap.call();
        this.updateNodesHomo();
        this.goto(this.start.finish.x, this.start.finish.y);
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.interval = setInterval($.proxy(this.doOne, this), this.intervalTime);
    },

    goto: function (x, y, params) {
        params = params ? params : {};
        var finish = this.getNodeFinish(x, y);
        if (finish && finish.isWall()) {
            log("Wrong coords (wall) for " + this.name + '": ' + x + "-" + y);
            return;
        }
        if (!!finish) {
            if (params && params.fallback) {
                //debugger;
                if (this.deepDebug && this.selected) {
                    debugger;
                }

                this.removeActionFallbacks();
            }
            params.x = x;
            params.y = y;
            this.addAction(this.actions.go, params);
            this.rePath = true;
        }
        else {
            log("Wrong coords for " + this.name + '": ' + x + "-" + y );
        }
    },

    doOne: function () {
        if (this.deepDebug && this.selected) {
            //debugger;
        }

        //clearInterval(this.interval);
        //debugger;
        switch (this.currentAction.type) {
            case this.actions.rotate:
                this.calcNewRotation(this.currentAction.params.a);
                break;
            case this.actions.go:
                this.calcNewAStarPosition(this.currentAction.params.x, this.currentAction.params.y);
                break;
            case this.actions.sleep:
                this.sleep();
                this.removeAction(this.actions.sleep);
                return;
                break;
            case this.actions.repath:
                this.updateNodesHomo();
                this.updateAStar();
                //this.rePath = false;
                this.removeAction(this.actions.repath);
                if (this.selected) {
                    //show debug data
                    this.drawDebugData();
                }
                break;
        }
        //log(this.currentAction);
        if (this.enabled) {
            //this.interval = setInterval($.proxy(this.doOne, this), this.intervalTime);
        }

        if (this.selected) {
            if (!this.debugGraphicsShowed) {
                this.drawDebugData();
                this.debugGraphicsShowed = true;
            }
            //show debug data
            //this.drawDebugData();
        }
        else {
            this.debugGraphics.clear();
            this.debugGraphicsShowed = false;
        }
    },

    drawDebugData: function () {
        this.debugGraphics.clear();
        this.debugGraphics.lineStyle(4, 0xffd900, 1);
        //this.debugGraphics.drawCircle(this.x + this.drawArea.ox, this.y + +this.drawArea.oy, this.r);


        //debug path
        this.debugGraphics.lineStyle(1, 0xFFFF00, 0.1);
        this.debug.path = 100;
        for (var nx = this.nodeX - this.debug.path; nx <= this.nodeX + this.debug.path; nx++) {
            for (var ny = this.nodeY - this.debug.path; ny <= this.nodeY + this.debug.path; ny++) {
                if (this.mapNodes[nx] && this.mapNodes[nx][ny]) {
                    var n = this.mapNodes[nx][ny];
                    //debugger;
                    //color
                    if (n.type != MapNodeTypes.OPEN) {
                        this.debugGraphics.beginFill(0xFF00BB, 0.3);
                    }
                    else {
                        this.debugGraphics.beginFill(0x00FF00, 0);
                    }

                        //position
                        var subR = n.r;
                        var subX = n.x; // +subR * (this.nodeX - nx);
                        var subY = n.y; // +subR * (this.nodeY - ny);

                        this.debugGraphics.drawRoundedRect(Math.round(subX - subR + this.drawArea.ox + 1), Math.round(subY - subR + this.drawArea.oy + 1), Math.round(subR * 2) - 2, Math.round(subR * 2) - 2, 3);
                        this.debugGraphics.endFill();
                }
            }
        }
        //drawing path
        for (var i = 0; i < this.path.length; i++) {
            if (this.mapNodes[this.path[i].x] && this.mapNodes[this.path[i].x][this.path[i].y]) {
                var n = this.mapNodes[this.path[i].x][this.path[i].y];
                //position
                var subR = n.r;
                var subX = n.x; // +subR * (this.nodeX - nx);
                var subY = n.y; // +subR * (this.nodeY - ny);

                this.debugGraphics.beginFill(0xFFFFFF, 0.3);
                this.debugGraphics.drawRoundedRect(Math.round(subX - subR + this.drawArea.ox + 1), Math.round(subY - subR + this.drawArea.oy + 1), Math.round(subR * 2) - 2, Math.round(subR * 2) - 2, 3);
                this.debugGraphics.endFill();
            }
        }

        console.log('drawing debug data', this.x, this.y, this.r);
        //this.debugGraphics.lineStyle(4, 0xffd900, 1);
    },

    getFinishCoords: function () {
            //getting first goto action
            var go = this.getFirstAction(this.actions.go);
            if (!!go) {
                return { x: go.params.x, y: go.params.y};
            }
            var map = this.getMap.call();
            return { x: this.start.finish.x, y: this.start.finish.y };
    },

    getNodeFinish: function (x, y) {
        if (!this.graph.nodes) {
            this.graph = new GraphFromNodes(this.mapNodes);
        }

        if (x == undefined && y == undefined) {
            //getting first goto action
            var go = this.getFirstAction(this.actions.go);
            if (!!go) {
                x = go.params.x;
                y = go.params.y; 
            }
            else {
                var map = this.getMap.call();
                x = this.start.finish.x;
                y = this.start.finish.y;
            }
        }
        var d = this.gridCellSize * 2.0;
        var nX = Math.floor(x / d);
        var nY = Math.floor(y / d);
        if (this.graph.nodes && this.graph.nodes[nX] && this.graph.nodes[nX][nY]) {
            return this.graph.nodes[nX][nY];
        }
        return null;
    },

    sleep: function () {
        return;
        log("Sleep for " + this.sleepTime + 'sec. "' + this.name + '"');
        clearInterval(this.interval);
        this.interval = setInterval($.proxy(this.doOne, this), this.sleepTime);
    },
    /*
    wakeup: function () {
        log("Wakeup " + this.name + '"');
        setTimeout($.proxy(this.wakeup, this), this.sleepTime);
    },
    */
    calcNewAStarPosition: function (x, y) {
        /*** pre-checking additional actions ***/
        if (this.rePath) {
            this.rePath = false;
            this.addAction(this.actions.repath);
            return;
        }
        /*** end pre-checking additional actions ***/

        if (this.path && this.path.length > 0) {
            if (this.path.length == 1) {
                var map = this.getMap.call();
                this.calcNewSimplePosition(this.x, this.y, x, y);
            }
            else {
                var n = this.mapNodes[this.path[0].x][this.path[0].y];
                if (this.x == n.x && this.y == n.y) {
                    this.rePath = false;
                    this.addAction(this.actions.repath);
                    return;
                }
                this.calcNewSimplePosition(this.x, this.y, n.x, n.y);
            }
        }
        else {
            //something strage, lets sleep for a long time
            this.addAction(this.actions.sleep);
            return;
        }
    },

    updateNodesHomo: function () {
        if (this.mapNodes.length == 0) {
            this.mapNodes = this.initNodes();
        }
        this.updateNodeCurrent();
        this.updateNodes();
    },

    fallbackRnd: function(){
        this.goto(this.x + (Math.floor((Math.random() * 2 * this.fallbackDistance * this.r) - this.r * this.fallbackDistance)), this.y + (Math.floor((Math.random() * 2 * this.fallbackDistance * this.r) - this.r * this.fallbackDistance)), { fallback: true });
    },

    calcNewSimplePosition: function (x1, y1, x2, y2) {
        var map = this.getMap.call();
        //new position calculation
        var deltaX = x2 - x1;
        var deltaY = y2 - y1;

        var px = 0;
        var py = 0;
        var absSum = Math.abs(deltaX) + Math.abs(deltaY);
        if (absSum) {
            px = (deltaX / (absSum)) * this.speed / this.slow;
            py = (deltaY / (absSum)) * this.speed / this.slow;
        }
        else {
            this.finished = true;
        }

        //checking for jump over finish
        if (Math.abs(px) > Math.abs(deltaX)) {
            px = deltaX;
        }
        if (Math.abs(py) > Math.abs(deltaY)) {
            py = deltaY;
        }
        if (px == deltaX && py == deltaY) {
            if (this.path.length > 1) {
                this.oldNodes.push(this.path[0]);
                this.path = this.path.slice(1, this.path.length);
                this.updateNodeCurrent();
            }
        }

        this.vectorX = px;
        this.vectorY = py;

        if (!this.checkRotation()) {
            return;
        }
        this.updateRotation();

        //busy checking
        if (this.isBusyPath()) {
            if (!this.isStoped) { //if just stoped
                this.moveChanged(false);
                this.isStoped = true;
                this.stopDate = new Date();
            }
            this.stopTimeDuration = (new Date() - this.stopDate);
            //hold for several seconds
            if (this.stopTimeDuration > this.stopTime * 10) {
                this.fallbackRnd();
                return;
            }
            if (this.stopTimeDuration > this.stopTime) {
                //this.stopDate = new Date();
                if (this.path[0]) {
                    this.tempWalls.push(this.path[0]);
                    this.addAction(this.actions.repath);
                    return;
                }
            }
            return;
        }
        this.moveChanged(true);
        this.isStoped = false;

        this.x += px;
        this.y += py;

        this.place(this.x, this.y);

        if (!this.x && this.x != 0) {
            debugger;
        }
        if (!this.y && this.y != 0) {
            debugger;
        }

        if (this.finished) //finished flag sets from Map
        {
            this.finished = false;
            this.removeAction(this.actions.go);
        }
        map.updateBusyPositions(this);
    },

    moveChanged: function (moveState) {
        if (this.movie) {
            if (moveState) {
                this.movie.play();
            }
            else {
                this.movie.stop();
            }
        }
    },

    checkRotation: function () {
        var newRotation = Number((this.rotationInitCorrection - Math.atan2(this.vectorX, this.vectorY)).toFixed(2))

        var delta = Math.abs(this.rotation - newRotation);
        if (delta > this.genome.rotationSpeed) {
            //debugger;
            this.rotate(newRotation);
            return false;
        }
        return true;
    },

    rotate: function (a) {
        this.addAction(this.actions.rotate, {a: a});
    },

    calcNewRotation: function (a) {
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
        if (delta <= this.genome.rotationSpeed) {
            this.rotation = a;
            if (this.rotation < 0) {
                this.rotation = this.rotation + (360 / (180 / Math.PI));
            }
            this.removeAction(this.actions.rotate);
            return;
        }

        //rotation
        if (this.rotation > a) {
            this.rotation -= this.genome.rotationSpeed;
        }
        else {
            this.rotation += this.genome.rotationSpeed;
        }

        
        this.place(this.x, this.y);
    },

    prePlace: function (draw, x, y) {
        if (this.prevHealth != this.health) {
            this.prevHealth = this.health;
            var colorMatrix = new PIXI.filters.ColorMatrixFilter();
            colorMatrix.saturate(20, 1);
            (draw.filters == null) ? draw.filters = [colorMatrix] : draw.filters.push(colorMatrix);
            setTimeout(function () { draw.filters = null; }, 100);
        }

        return; //disabled
        var colorMatrix = new PIXI.filters.ColorMatrixFilter();
        draw.filters = null;
        if (this.selected) {
            colorMatrix.negative();
        }
        if (!this.isStoped) {
            colorMatrix.saturate(5, 1);
        }
        if (this.isFallBack) {
            colorMatrix.saturate(3, 1);
        }
        
        (draw.filters == null) ? draw.filters = [colorMatrix] : draw.filters.push(colorMatrix);
    },

    die: function () {
        clearInterval(this.interval);
        this.enabled = false;
        var map = this.getMap.call();
        map.updateBusyPositions(this);
        this.complete.call(undefined, this);
    },

    explosion: function () {
        var explosion = new Explosion(this.drawArea, $.proxy(this.getMap, this));
        explosion.r = this.r;
        explosion.x = this.x;
        explosion.y = this.y;
        explosion.place(explosion.x, explosion.y);
        var map = this.getMap.call();
        map.register(explosion);
        var sprite = explosion.pixiGetSprite();
        sprite.loop = false;
        
    }
});