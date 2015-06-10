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
            radius: 16
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
        var debug = 'Soldier<br />';
        debug += 'name: ' + this.name + '<br />';
        debug += 'enabled: ' + this.enabled + '<br />';
        debug += 'speed: ' + this.genome.speed + '<br />';
        debug += 'slow: ' + this.genome.slow + '<br />';
        debug += 'health: ' + this.genome.health + '<br />';
        debug += 'radius: ' + this.genome.radius + '<br />';
        debug += 'r: ' + this.genome.r + '<br />';
        debug += 'isStoped: ' + this.isStoped + '<br />';
        debug += 'stopDate: ' + this.stopDate + '<br />';
        debug += 'isFallBack: ' + this.isFallBack + '<br />';
        debug += 'isFallBackProgress: ' + this.isFallBackProgress + '<br />';
        debug += 'rePath: ' + this.rePath + '<br />';
        debug += 'path: ' + this.path.length + '<br />';
        debug += 'vectorX: ' + this.vectorX + '<br />';
        debug += 'vectorY: ' + this.vectorY + '<br />';
        debug += 'oldNodes: ' + this.oldNodes + '<br />';

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
        this.speed = this.genome.speed;// + this.allocRandomPoints();
        this.genome.radius = this.genome.radius + this.allocRandomPoints();
        this.health = this.genome.health;
        this.r = this.genome.radius;
        this.speed = this.speed + this.r / 2;
        this.slow = this.genome.slow;

        var map = this.getMap.call();
        if (this.speed > map.mapCellSize)
        {
            //this.speed = map.mapCellSize;
        }
        //this.stopTime = this.health * 1000;
        /*
        this.r = 20;
        this.speed = 10;
        */
        //this.slow = 1;
       
        //this.stopTime = 1000;
        
    },

    run: function () {
        //log("Run for " + this.name + '"');
        //log(this.rePath);
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
            /*if (this.isFallBackProgress)
            {
                this.isFallBackProgress = false;
            }*/
        }
        //debugger;
        //log("fallback: " + this.isFallBackProgress + " " + this.name);
        //calc new position to the next path node or finish
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

        for (var x = 0; x < map.w; x += this.gridCellSize * 2) {
            var nodeRow = [];
            for (var y = 0; y < map.h; y += this.gridCellSize * 2) {
                var n = new MapNode(i, j, x + this.gridCellSize, y + this.gridCellSize, this.gridCellSize, MapNodeTypes.OPEN, 0);
                nodeRow.push(n);
                j++;
            }
            nodes.push(nodeRow);
            i++;
        }

        return nodes;
    },

    updateNodes: function () {
        //debugger;
        var map = this.getMap.call();
        this.mapNodes = this.initNodes();
        var towers = map.towers;
        var d = this.gridCellSize * 2.0;
        for (var n = 0; n < towers.length; n++) {
            var tower = towers[n];
            //calculating i and j for tower corners
            var i1 = Math.floor((tower.x - tower.r) / d);
            var j1 = Math.floor((tower.y - tower.r) / d);
            var i2 = Math.floor((tower.x + tower.r) / d);
            var j2 = Math.floor((tower.y + tower.r) / d);

            for (var i = i1; i <= i2; i++) {
                for (var j = j1; j <= j2; j++) {
                    if (this.mapNodes && this.mapNodes[i] && this.mapNodes[i][j]) {
                        this.mapNodes[i][j].type = MapNodeTypes.TOWER;
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

    draw: function (context) {
        context.save();
        /*
        context.fillStyle = "rgba(255,0,0," + this.a + ")";
        context.fillRect(Math.round(this.x - this.r + this.drawArea.ox), Math.round(this.y - this.r + this.drawArea.oy), Math.round(this.r * 2), Math.round(this.r * 2));
        */

        context.beginPath();

        context.arc(this.x + this.drawArea.ox, this.y + this.drawArea.oy, this.r, 0, 2 * Math.PI, false);

        if (this.path.length == 0) {
            context.fillStyle = 'grey';
        }
        else if (this.isStoped) {
            context.fillStyle = 'rgb(100,150,100)';
        }
        else if (this.rePath) {
            context.fillStyle = 'rgb(200,200,0)';
        }
        else {
            context.fillStyle = 'rgb(100,200,100)';
        }

        if (this.isFallBack || this.isFallBackProgress) {
            context.fillStyle = 'rgb(1,1,255)';
        }

        context.fill();

        if (this.selected) {
            context.fillStyle = "rgb(0,0,0)";
            context.fillRect(Math.round(this.x - this.r / 2 + 1 + this.drawArea.ox), Math.round(this.y - this.r / 2 + 1 + this.drawArea.oy), Math.round(this.r) - 2, Math.round(this.r) - 2);
        }


        if (this.debug.grid || this.selected) {
            context.fillStyle = "rgba(200,200,200,0.8)";
            for (var i = 0; i < this.mapNodes.length; i++) {
                for (var j = 0; j < this.mapNodes[i].length; j++) {
                    var n = this.mapNodes[i][j];
                    if (n.type == MapNodeTypes.OPEN) {
                        /*
                        context.fillStyle = "rgba(0,0,150,0.1)";
                        context.fillRect(Math.round(n.x - n.r + 1 + this.drawArea.ox), Math.round(n.y - n.r + 1 + this.drawArea.oy), Math.round(n.r * 2) - 2, Math.round(n.r * 2) - 2);
                        */
                    }

                    context.fillStyle = "rgba(0,0,0,1)";
                    context.font = 'italic 8px Calibri';
                    /*
                    var aNode = this.graph.nodes[i][j];
                    context.fillText(Math.round(aNode.f, 2), n.x + this.drawArea.ox, n.y + this.drawArea.oy);
                    context.fillText(Math.round(aNode.g, 2), n.x + this.drawArea.ox, n.y + this.drawArea.oy + 8);
                    context.fillText(Math.round(aNode.h, 2), n.x + this.drawArea.ox, n.y + this.drawArea.oy + 16);
                    */

                }
            }

            //path
            
            for (i = 0; i < this.path.length; i++) {
            var n = this.mapNodes[this.path[i].x][this.path[i].y];
            }
            
            //next busy indicator

            if (this.path.length > 0) {
                var n = this.mapNodes[this.path[0].x][this.path[0].y];
                if (this.isBusyPath()) {
                    context.fillStyle = "rgba(0,0,200,0.03)";
                    context.fillRect(Math.round(n.x - n.r + 1 + this.drawArea.ox), Math.round(n.y - n.r + 1 + this.drawArea.oy), Math.round(n.r * 2) - 2, Math.round(n.r * 2) - 2);
                }
                else {
                    //context.fillStyle = "rgba(0,200,0,0.1)";
                    //context.fillRect(Math.round(n.x - n.r + 1 + this.drawArea.ox), Math.round(n.y - n.r + 1 + this.drawArea.oy), Math.round(n.r * 2) - 2, Math.round(n.r * 2) - 2);
                }
            }



        }

        //var this.debug.path = 0;
        if (this.selected) {
            this.debug.path = 10;
        }
        else {
            this.debug.path = 0;
        }
        if (this.mapNodes && this.debug.path > 0) {

            for (var nx = this.nodeX - this.debug.path; nx <= this.nodeX + this.debug.path; nx++) {
                for (var ny = this.nodeY - this.debug.path; ny <= this.nodeY + this.debug.path; ny++) {
                    if (this.mapNodes[nx] && this.mapNodes[nx][ny]) {
                        var n = this.mapNodes[nx][ny];
                        //color
                        var fillStyle = "rgba(0,200,0,0.03)";
                        if (n.type != MapNodeTypes.OPEN) {
                            fillStyle = "rgba(200,0,0,0.03)";
                        }
                        context.fillStyle = fillStyle;
                        //position
                        var subR = this.r;
                        var subX = n.x; // +subR * (this.nodeX - nx);
                        var subY = n.y; // +subR * (this.nodeY - ny);
                        context.fillRect(Math.round(subX - subR + this.drawArea.ox + 1), Math.round(subY - subR + this.drawArea.oy + 1), Math.round(subR * 2) - 2, Math.round(subR * 2) - 2);
                    }
                }
            }
        }

        //var showVector = true;
        if (this.debug.vector || this.selected)
        {
            var a = Math.atan2(this.vectorX, this.vectorY);

            context.beginPath()
            var start = 1.57; // 90 degree
            for (var offset = -start; offset <= start; offset += 1.57/3)
            {
                var px = this.r * Math.sin(a + offset);
                var py = this.r * Math.cos(a + offset);
                context.moveTo(this.x + this.drawArea.ox + px, this.y + this.drawArea.oy + py);
                context.lineTo(this.x + this.drawArea.ox + px + this.vectorX, this.y + this.drawArea.oy + py + this.vectorY);

            }
            context.stroke();
        }

        context.restore();
    },

    calcNewSimplePosition: function (x1, y1, x2, y2) {
        var map = this.getMap.call();
        //new position calculation
        var deltaX = x2 - x1;
        var deltaY = y2 - y1;

        var absSum = Math.abs(deltaX) + Math.abs(deltaY);

//        if (absSum == 0 || (x1 == NaN || x2 == NaN || y1 == NaN || y2 == NaN))
  //      {
    //        debugger;
      //  }

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
    }
});
