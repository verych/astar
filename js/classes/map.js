var Map = createClass({
    construct: function (drawArea, start, finish, soldiers, towers, register) {
        //game area
        this.drawArea = drawArea;
        this.w = drawArea.w;
        this.h = drawArea.h;
        //busy map
        this.mapCellSize = 8;
        this.busyMap = []; 

        //start position and finish position
        this.x1 = start.x;
        this.y1 = start.y;
        this.x2 = finish.x;
        this.y2 = finish.y;

        //soldiers
        this.soldiers = soldiers;
        //towers
        this.towers = towers;

        //init
        this.initBusyMap();

        this.register = register;
    },

    initBusyMap: function () {
        this.busyMap = [];
        for(var i = 0; i < this.w; i+=this.mapCellSize)
        {
            var line = [];
            for (var j = 0; j < this.h; j += this.mapCellSize) {
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
                    objects: {}
                };
                line.push(item);
            }
            this.busyMap.push(line);
        }
        //mark as finish
        var fi = this.coordToIndex(this.x2);
        var fj = this.coordToIndex(this.y2);
        //this.busyMap[fi][fj].count = 1;
        this.busyMap[fi][fj].objects['finish'] = true;

    },

    draw: function (context) {
        return;
        context.save();
        //log(this.busyMap.length);
        for (var i = 0; i < this.busyMap.length; i++) {
            for (var j = 0; j < this.busyMap[i].length; j++) {
                var item = this.busyMap[i][j];
                if (item.count > 0) {
                    context.fillStyle = "rgba(100,100,100,0.5)";
                }
                else {
                    context.fillStyle = "rgba(230,230,230,0.5)";
                }
                context.fillRect(Math.round(item.x + this.drawArea.ox + 1), Math.round(item.y + this.drawArea.oy + 1), item.size - 2, item.size - 2);
            }
        }

        context.restore();
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
                            //checking for finish
                            //if (cell.objects['finish'])
                            //{
                                //soldier.finished = true;
                            //}
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

    coordToIndex: function (coord)
    {
        return Math.floor(coord / this.mapCellSize);
    }

});

var MapNode = createClass({
    construct: function (i, j, x, y, r, type, passability) {
        //game area
        this.x = x;
        this.y = y;
        this.r = r;
        this.type = type;
        this.i = i;
        this.j = j;
        this.passability = passability;
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