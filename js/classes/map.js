var Map = createClass({
    construct: function (core) {
        //game area
        this.drawArea = core.drawArea;
        //busy map
        this.mapCellSize = 16;
        this.busyMap = []; 

        //towers
        this.towers = core.towers;

        this.starts = core.starts;
        this.register = $.proxy(core.register, core);
        this.core = core;
        //init
        this.initBusyMap();
    },

    initBusyMap: function () {
        this.busyMap = [];
        //debugger;
        for (var i = 0; i < this.core.drawArea.w; i += this.mapCellSize)
        {
            var line = [];
            for (var j = 0; j < this.core.drawArea.h; j += this.mapCellSize) {
                var item = {
                    x: i,
                    y: j,
                    cx: i + this.mapCellSize / 2,
                    cy: j + this.mapCellSize / 2,
                    r: this.mapCellSize / 2,
                    i: this.coordToIndex(i),
                    j: this.coordToIndex(j),
                    size: this.mapCellSize,
                    count: 0,
                    objects: {},
                    die: 0
                };
                line.push(item);
            }
            this.busyMap.push(line);
        }
    },

    isBusyPosition: function (px, py, r, id) {
        for (var x = px - r; x <= (px + r + this.mapCellSize) ; x += this.mapCellSize) {
            for (var y = py - r; y <= (py + r + this.mapCellSize) ; y += this.mapCellSize) {
                var i = this.coordToIndex(x);
                var j = this.coordToIndex(y);
                if (i >= 0 && i < this.busyMap.length) {
                    if (j >= 0 && j < this.busyMap[i].length) {
                        var cell = this.busyMap[i][j];
                        var d = Math.sqrt(Math.pow(cell.cx - px, 2) + Math.pow(cell.cy - py, 2));
                        if (d <= (cell.r + r)) {
                            if ((cell.count > 0) && (!cell.objects[id])){
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    },

    updateBusyPositions: function (soldier) {
        //clear or init
        if (soldier['mapBusyPositions'] instanceof Array) {
            for (var i = 0; i < soldier['mapBusyPositions'].length; i++) {
                this.busyMap[soldier['mapBusyPositions'][i].i][soldier['mapBusyPositions'][i].j].count--;
                this.busyMap[soldier['mapBusyPositions'][i].i][soldier['mapBusyPositions'][i].j].objects[soldier.name] = null;
            }
        }
        soldier['mapBusyPositions'] = [];

        //calc new busy
        if (!soldier.enabled) {
            return;
        }

        var soldierCoords = soldier.getFinishCoords();
        soldierCoords.i = this.coordToIndex(soldierCoords.x);
        soldierCoords.j = this.coordToIndex(soldierCoords.y);

        for (var x = soldier.x - soldier.r; x <= (soldier.x + soldier.r + this.mapCellSize) ; x += this.mapCellSize)
        {
            for (var y = soldier.y - soldier.r; y <= (soldier.y + soldier.r + this.mapCellSize) ; y += this.mapCellSize)
            {
                var i = this.coordToIndex(x);
                var j = this.coordToIndex(y);
                if (i >= 0 && i < this.busyMap.length)
                {
                    if (j >= 0 && j < this.busyMap[i].length)
                    {
                        var cell = this.busyMap[i][j];
                        var d = Math.sqrt(Math.pow(cell.cx - soldier.x, 2) + Math.pow(cell.cy - soldier.y, 2));
                        if (d <= (cell.r + soldier.r)) {
                            
                            if (soldierCoords.i == i && soldierCoords.j == j)
                            {
                                soldier.finished = true;
                            }
                            //mark as busy
                            soldier['mapBusyPositions'].push(cell);
                            cell.count++;
                            cell.objects[soldier.name] = soldier;
                        }
                    }
                }
            }
        }
    },

    updateDiePositions: function (soldier) {
        var coordI = this.coordToIndex(soldier.x);
        var coordj = this.coordToIndex(soldier.y);
        var cell = this.busyMap[coordI][coordj];
        cell.die++;
    },

    coordToIndex: function (coord)
    {
        return Math.floor(coord / this.mapCellSize);
    },

    //without Soldier radius
    getSoldiersInArea: function (x, y, radius) {
        var results = [];
        for (var s = 0; s < this.starts.length; s++) {
            for (var i = 0; i < this.starts[s].soldiers.length; i++) {
                var distance = Math.sqrt(Math.pow(this.starts[s].soldiers[i].x - x, 2) + Math.pow(this.starts[s].soldiers[i].y - y, 2));
                if (distance <= radius) {
                    results.push({
                        distance: distance,
                        item: this.starts[s].soldiers[i]
                    });
                }
            }
        }
        return results;
    },

    //with Soldier radius
    getSoldiersByPoint: function(x, y, r) {
        var results = [];
        for (var s = 0; s < this.starts.length; s++) {
            for (var i = 0; i < this.starts[s].soldiers.length; i++) {
                var distance = Math.sqrt(Math.pow(this.starts[s].soldiers[i].x - x, 2) + Math.pow(this.starts[s].soldiers[i].y - y, 2));
                if (distance <= this.starts[s].soldiers[i].r + r) {
                    results.push({
                        distance: distance,
                        item: this.starts[s].soldiers[i]
                    });
                }
            }
        }
        return results;
    }

});

var MapNode = createClass({
    construct: function (i, j, x, y, r, type, passability, thresholdPassability) {
        //game area
        this.x = x;
        this.y = y;
        this.r = r;
        this.type = type;
        this.i = i;
        this.j = j;
        this.passability = passability;
        this.thresholdPassability = thresholdPassability;
    }
});

var MapNodeTypes = new (createClass({
    construct: function() {
        this.UNDEFINED = -1;
        this.WALL = 0;
        this.OPEN = 1;
        this.CUSTOM = 2;
        this.TOWER = 0;
    }
}))();

//var NodeTypes = new MapNodeType();