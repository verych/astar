// javascript-astar
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Implements the astar search algorithm in javascript using a binary heap.

var astar = {
    init: function (grid) {
        for (var x = 0, xl = grid.length; x < xl; x++) {
            for (var y = 0, yl = grid[x].length; y < yl; y++) {
                var node = grid[x][y];
                node.f = 0;
                node.g = 0;
                node.h = 0;
                node.cost = node.type;
                node.visited = false;
                node.closed = false;
                node.parent = null;
            }
        }
    },
    heap: function () {
        return new BinaryHeap(function (node) {
            return node.f;
        });
    },
    search: function (grid, start, end, diagonal, heuristic) {
        window.astarCounter++;
        astar.init(grid);
        heuristic = heuristic || astar.manhattan;
        diagonal = !!diagonal;

        var openHeap = astar.heap();

        openHeap.push(start);

        while (openHeap.size() > 0) {

            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode = openHeap.pop();

            // End case -- result has been found, return the traced path.
            if (currentNode === end) {
                var curr = currentNode;
                var ret = [];
                while (curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                if (ret.length == 0) { // verych corrected
                    ret.push(curr);
                }
                return ret.reverse();
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
            var neighbors = astar.neighbors(grid, currentNode, diagonal);

            for (var direction in neighbors) {
                //debugger;
                var neighborHolder = neighbors[direction];
                var neighbor = neighborHolder.item;

                if (neighbor.closed || neighbor.isWall()) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }

                //checking for diagonal restrictions
                //debugger;
                if (direction == 'ne' && !this.isGoodDiagonal(neighbors, 'n', 'e')) {
                    continue;
                }
                if (direction == 'nw' && !this.isGoodDiagonal(neighbors, 'n', 'w')) {
                    continue;
                }
                if (direction == 'se' && !this.isGoodDiagonal(neighbors, 's', 'e')) {
                    continue;
                }
                if (direction == 'sw' && !this.isGoodDiagonal(neighbors, 's', 'w')) {
                    continue;
                }

                var rotationScore = 1;
                if (direction.length == 2)
                {
                    rotationScore = 2;
                }

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                var gScore = currentNode.g + neighbor.cost + this.pathDistance(currentNode.pos, neighbor.pos) * rotationScore;
                var beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.g) {

                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }

        // No result was found - empty array signifies failure to find path.
        return [];
    },

    isGoodDiagonal: function (neighbors, ns, ew) {
        return neighbors[ns] && neighbors[ew] && !this.isClosed(neighbors[ns]) && !this.isClosed(neighbors[ew]);
    },

    isClosed: function (node) {
        return (node.item.closed || node.item.isWall());
    },

    manhattan: function (pos0, pos1) {
        // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    },

    pathDistance: function (pos0, pos1) {
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return Math.sqrt((d1 * d1) + (d2 * d2));
    },
    neighbors: function (grid, node, diagonals) {
        var ret = {};
        var x = node.x;
        var y = node.y;

        // West
        if (grid[x - 1] && grid[x - 1][y]) {
            ret['w'] = ({ item: grid[x - 1][y] });
        }

        // East
        if (grid[x + 1] && grid[x + 1][y]) {
            ret['e'] = ({ item: grid[x + 1][y] });
        }

        // South
        if (grid[x] && grid[x][y - 1]) {
            ret['s'] = ({ item: grid[x][y - 1] });
        }

        // North
        if (grid[x] && grid[x][y + 1]) {
            ret['n'] = ({ item: grid[x][y + 1] });
        }

        if (diagonals) {

            // Southwest
            if (grid[x - 1] && grid[x - 1][y - 1]) {
                ret['sw'] = ({ item: grid[x - 1][y - 1] });
            }

            // Southeast
            if (grid[x + 1] && grid[x + 1][y - 1]) {
                ret['se'] = ({ item: grid[x + 1][y - 1] });
            }

            // Northwest
            if (grid[x - 1] && grid[x - 1][y + 1]) {
                ret['nw'] = ({ item: grid[x - 1][y + 1] });
            }

            // Northeast
            if (grid[x + 1] && grid[x + 1][y + 1]) {
                ret['ne'] = ({ item: grid[x + 1][y + 1] });
            }

        }

        return ret;
    }
};


