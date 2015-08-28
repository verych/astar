var Soldier = createClass({
    extend: AppObject,

    construct: function (start, name, getMapCallback, completeCallback) {
        AppObject.call(this);
        this.start = start;

        this.drawArea = start.drawArea;
        this.getMap = getMapCallback;
        this.complete = completeCallback;

        this.name = name;
        this.health = 0;
        this.speed = 0;
        this.slow = 1;
        this.enabled = true;

        this.interval = undefined;
        this.intervalTime = 30;

        //attributes
        this.type = 'soldier';
        this.genome = {
            health: 10,
            speed: 5,
            slow: 1,
            radius: 16,
            stupidPercent: 0.1,
            thresholdPassability: 10
        };
        this.attributePoints = 10;
        this.initAttributes();

        //pathfinding
        this.gridCellSize = this.r;
        this.mapNodes = [];
        this.graph = {};
        this.path = {};
        this.oldNodes = [];
        this.rePath = true;
        this.tempWalls = [];
        this.nodeX = 0;
        this.nodeY = 0;

        this.stopDate = undefined;
        this.isStoped = false;
        this.stopTime = 1000; //depends on health
        this.stopMemorySize = 10;
        this.stopMultipler = 1.1;
        this.sleepTime = 10;
        this.finished = false;

        //fall back
        this.fallBackTime = 5000;
        this.fallBackStopDate = undefined;
        this.isFallBack = false;
        this.isFallBackProgress = false;

        //moving vector
        this.vectorX = 0;
        this.vectorY = 0;

        this.rotationInitCorrection = 180/57.3;

        this.log = [];

        //debug
        this.debug = {
            grid: false,
            path: 0,
            vector: false
        };

        this.texture = 'tank.png';
        this.textureSizeX = 32;
        this.textureSizeY = 32;
    },

    updateRotation: function () {
        this.rotation = this.rotationInitCorrection - Math.atan2(this.vectorX, this.vectorY);
    },

    getDebugInfo: function () {
        var oldDebug = AppObject.fn.getDebugInfo.call(this)
        var debug = '';
        //queue
        var queueDebug = 'queue: <br />';
        for (var i = 0; i < this.queue.length; i++) {
            queueDebug += i + ': ' + this.queue[i].type + '<br />';
        }

        return oldDebug + '<div class="debug-item">' + debug + '</div>' + '<div class="debug-item">' + queueDebug + '</div>';
    },


    allocRandomPoints: function (allocAllPoint) {
        var alloc;
        if (allocAllPoint != undefined && allocAllPoint == true) {
            alloc = this.attributePoints;
        }
        else {
            alloc = Math.round(Math.random() * this.attributePoints);
        }
        this.attributePoints -= alloc;
        return alloc;
    },

    initAttributes: function () {
        //debugger;
        this.speed = this.genome.speed + this.allocRandomPoints();
        this.genome.radius = this.genome.radius;// + this.allocRandomPoints();
        this.health = this.genome.health + this.allocRandomPoints();
        this.r = this.genome.radius;
        this.speed = this.speed + this.r / 4;
        this.slow = this.genome.slow;

        var map = this.getMap.call();
    },

    run: function () {
        this.updateNodeCurrent();
        clearInterval(this.interval);
        this.interval = setInterval($.proxy(this.doOne, this), this.intervalTime);
    },

    doOne: function () {
        this.calcNewAStarPosition();
    },

    calcNewAStarPosition: function () {

        if (this.mapNodes.length == 0) {
            this.mapNodes = this.initNodes();
        }

        if (this.rePath) {
            this.updateNodes();
            this.updateAStar();
        }

        if (this.path && this.path.length > 0) {
            if (this.path.length == 1 && !this.isFallBackProgress) {
                var map = this.getMap.call();
                log("To finish " + this.name);
                this.calcNewSimplePosition(this.x, this.y, this.start.finish.x, this.start.finish.y);
            }
            else {
                var n = this.mapNodes[this.path[0].x][this.path[0].y];
                this.calcNewSimplePosition(this.x, this.y, n.x, n.y);
            }
        }
    },

    isBusyPath: function () {
        var a = Math.atan2(this.vectorX, this.vectorY);
        var px = this.r * Math.sin(a);
        var py = this.r * Math.cos(a);
        var map = this.getMap.call();
        return map.isBusyPosition(this.x + px, this.y + py, this.r, this.name);
    },

    updateAStar: function () {
        this.graph = null;
        this.graph = new GraphFromNodes(this.mapNodes);
        //debugger;
        var finish = this.getNodeFinish();
        if (this.isFallBack)
        {

            if (this.oldNodes.length > 5) {
                this.isFallBackProgress = true;
                this.isFallBack = false;

                //debugger;
                var node = this.oldNodes[this.oldNodes.length - 5];
                finish = this.graph.nodes[node.x][node.y];
                log('FallBack for ' + this.name);
                //debugger;
            }
            else {
                log("Can't do FallBack for " + this.name);
            }
        }
        
        var currentNode = this.getNodeCurrent();
        if (finish == null || currentNode == null) {
            debugger;
        }

        this.path = astar.search(this.graph.nodes, currentNode, finish, true);

        //log("Repath for " + this.name + ':: ' + this.getNodeCurrent().x + ',' + this.getNodeCurrent().y + '=>' + finish.x + ',' + finish.y + ' (' + this.path.length + ')');
        if (this.path.length == 0) {
            if (finish.x == currentNode.x && finish.y == currentNode.y) {
                //???? seems like finished
            }
            else {
                this.sleep();
                this.tempWalls = [];
                this.rePath = true;
                this.isFallBackProgress = false;
                this.isFallBack = false;
            }
        }
        else {
            this.rePath = false;
        }
        this.updateNodeCurrent();
    },

    sleep: function () {
        this.isStoped = true;
        clearInterval(this.interval);
        log("Sleep for " + this.sleepTime + 'sec. "' + this.name + '"');
        setTimeout($.proxy(this.run, this), this.sleepTime);
    },

    getNodeCurrent: function () {
        //debugger;
        if (this.graph.nodes && this.graph.nodes[this.nodeX]) {
            var node = this.graph.nodes[this.nodeX][this.nodeY];
            if (!node)
            {
                //out of area;
                this.die();
            }
            return node;
        }
        return null;
    },

    updateNodeCurrent: function () {
        var d = this.gridCellSize * 2.0;
        this.nodeX = Math.floor(this.x / d);
        this.nodeY = Math.floor(this.y / d);
        if (this.nodeX == NaN || this.nodeY == NaN) {
            log('Error expected');
            debugger;
        }
    },

    getNodeFinish: function () {
        var map = this.getMap.call();
        var d = this.gridCellSize * 2.0;
        var nX = Math.floor(this.start.finish.x / d);
        var nY = Math.floor(this.start.finish.y / d);
        return this.graph.nodes[nX][nY];
    },

    initNodes: function () {
        var map = this.getMap.call();
        var nodes = [];
        var i = 0, j = 0;

        for (var x = 0; x < map.core.drawArea.w; x += this.gridCellSize * 2) {
            var nodeRow = [];
            for (var y = 0; y < map.core.drawArea.h; y += this.gridCellSize * 2) {
                var mi = map.coordToIndex(x + this.gridCellSize);
                var mj = map.coordToIndex(y + this.gridCellSize);
                var n = new MapNode(i, j, x + this.gridCellSize, y + this.gridCellSize, this.gridCellSize, MapNodeTypes.OPEN, map.busyMap[mi][mj].die, this.genome.thresholdPassability);
                nodeRow.push(n);
                j++;
            }
            nodes.push(nodeRow);
            i++;
        }


        //dies
        /*
        if (map.busyMap) {
            for (var ix = 0; ix < map.busyMap.length; ix++) {
                for (var iy = 0; iy < map.busyMap[ix].length; iy++) {
                    var cell = map.busyMap[ix][iy];
                    if (cell.die > 0) {
                        log('marking dies');
                        var ix1 = Math.floor(cell.cx / (this.gridCellSize * 2));
                        var iy1 = Math.floor(cell.cy / (this.gridCellSize * 2));
                        //console.log(cell, ix1, iy1, this.mapNodes.length);
                        if (this.mapNodes.length < ix1 || this.mapNodes[ix1].length < iy1) {
                            log('busyMap: out of range');
                            debugger;
                        }
                        this.mapNodes[ix1][iy1].passability = map.busyMap[ix][iy].die;
                        this.mapNodes[ix1][iy1].thresholdPassability = this.genome.thresholdPassability ? this.genome.thresholdPassability : 1;
                    }
                }
            }
        }
        */
        return nodes;
    },

    updateNodes: function () {
        var map = this.getMap.call();
        this.mapNodes = this.initNodes();
        var towers = map.towers;
        var d = this.gridCellSize * 2.0;
        for (var n = 0; n < towers.length; n++) {
            var tower = towers[n];
            if (tower.transparent) {
                continue;
            }
            //calculating i and j for tower corners
            var i1 = Math.floor((tower.x - tower.r) / d);
            var j1 = Math.floor((tower.y - tower.r) / d);
            var i2 = Math.floor((tower.x + tower.r) / d);
            var j2 = Math.floor((tower.y + tower.r) / d);

            for (var i = i1; i <= i2; i++) {
                for (var j = j1; j <= j2; j++) {
                    if (this.mapNodes && this.mapNodes[i] && this.mapNodes[i][j]) {
                        if (tower.passable) {
                            this.mapNodes[i][j].type = MapNodeTypes.OPEN;
                            this.mapNodes[i][j].passability = tower.passValue;
                        }
                        else {
                            this.mapNodes[i][j].type = MapNodeTypes.TOWER;
                        }
                    }
                }
            }
        }
        //temporary walls
        var cnt = Math.min(this.tempWalls.length, this.stopMemorySize);
        for (var tw = 0; tw < cnt; tw++) {
            if (this.tempWalls[this.tempWalls.length - tw]) {
                var w = this.tempWalls[this.tempWalls.length - tw];
                this.mapNodes[w.x][w.y].type = MapNodeTypes.WALL;
            }
        }
    },
   
    calcNewSimplePosition: function (x1, y1, x2, y2) {
        var map = this.getMap.call();
        //new position calculation
        var deltaX = x2 - x1;
        var deltaY = y2 - y1;

        var absSum = Math.abs(deltaX) + Math.abs(deltaY);

        var px = (deltaX / (absSum)) * this.speed / this.slow;
        var py = (deltaY / (absSum)) * this.speed / this.slow;

        //checking for jump over finish
        if (Math.abs(px) > Math.abs(deltaX)) {
            px = deltaX;
        }
        if (Math.abs(py) > Math.abs(deltaY)) {
            py = deltaY;
        }
        if (px == deltaX && py == deltaY) {
            if (this.path.length == 1) {
                if (this.isFallBackProgress && this.path.length == 1) {
                    log("End fallback " + this.name);
                    this.rePath = true;
                    this.isFallBackProgress = false;
                    //return;
                }
            }

            if (this.path.length > 1) {
                //log("px,py==delta :: " + this.path.length + "  " + this.name);
                this.oldNodes.push(this.path[0]);
                //log(this.fallBackNode);
                this.path = this.path.slice(1, this.path.length);
                this.updateNodeCurrent();
            }
        }

        this.vectorX = px;
        this.vectorY = py;
        this.updateRotation();

        if (!!this.vectorX && !!this.vectorY) {
            debugger;
        }

        //busy checking

        if (this.isBusyPath()) {
            if (!this.isStoped) { //if just stoped
                this.isStoped = true;
                this.stopDate = new Date();
                this.fallBackStopDate = new Date();
            }

            //hold for several seconds
            if ((new Date() - this.stopDate) > this.stopTime) {
                this.stopDate = new Date();
                if (this.path[0]) {
                    this.tempWalls.push(this.path[0]);
                    this.rePath = true;
                    this.stopTime = this.stopTime * this.stopMultipler;
                    if (this.stopTime > this.health * 100) {
                        this.stopTime = 100;
                    }

                    this.stopMemorySize += 1;
                    if (this.stopMemorySize > 30) {
                        this.stopMemorySize = 0;
                    }
                }
            }
            //try to fallback
            if (!this.isFallBackProgress && !this.isFallBack && (new Date() - this.fallBackStopDate) > this.fallBackTime) {
                log("Decided to fallback " + this.name);
                this.fallBackStopDate = new Date();
                this.isFallBack = true;
            }
            return;
        }
        this.isStoped = false;

        this.x += px;
        this.y += py;

        this.place(this.x, this.y);

        if (this.finished) //finished flag sets from Map
        {
            this.die();
        }

        map.updateBusyPositions(this);
    },

    die: function () {
        clearInterval(this.interval);
        this.enabled = false;
        this.complete.call(undefined, this);
        this.graph.nodes = null;
        this.graph = null;
    }
});
