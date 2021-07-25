var Roguelike;
(function (Roguelike) {
    var Map = (function () {
        function Map(w, h) {
            this.width = w;
            this.height = h;
            this.layer = new Array(w);
            this.shadow = new Array(w);
            for (var x = 0; x < w; ++x) {
                this.layer[x] = new Array(h);
                this.shadow[x] = new Array(h);
                for (var y = 0; y < h; ++y) {
                    this.layer[x][y] = new Array();
                    this.shadow[x][y] = 1;
                }
            }
            this.agents = new Array();
        }
        Map.prototype.enter = function (p) {
            var x = p.x;
            var y = p.y;
            for (var _i = 0, _a = this.layer[x][y]; _i < _a.length; _i++) {
                var t = _a[_i];
                t.enter(p);
            }
        };
        Map.prototype.touch = function (p) {
            var x = p.x;
            var y = p.y;
            for (var _i = 0, _a = this.layer[x][y]; _i < _a.length; _i++) {
                var t = _a[_i];
                t.touch(p);
            }
        };
        Map.prototype.inMap = function (x, y) {
            var w = this.width;
            var h = this.height;
            return 0 <= x && x < w && 0 <= y && y < h;
        };
        Map.prototype.isPassable = function (x, y) {
            if (!this.inMap(x, y))
                return false;
            for (var _i = 0, _a = this.layer[x][y]; _i < _a.length; _i++) {
                var t = _a[_i];
                if (!t.passable)
                    return false;
            }
            return true;
        };
        Map.prototype.canLightPass = function (x, y) {
            if (!this.inMap(x, y))
                return false;
            for (var _i = 0, _a = this.layer[x][y]; _i < _a.length; _i++) {
                var t = _a[_i];
                if (!t.lightpass)
                    return false;
            }
            return true;
        };
        Map.prototype.draw_tile_at = function (x, y) {
            Roguelike.Main.display.draw(x, y, null);
            var a = this.layer[x][y];
            if (a !== null) {
                var n = a.length;
                if (this.shadow[x][y] !== 0 && this.isFov) {
                    a[n - 1].draw_with_shadow(this.shadow[x][y]);
                }
                else {
                    a[n - 1].draw();
                }
            }
        };
        Map.prototype.draw = function () {
            var w = this.width;
            var h = this.height;
            for (var x = 0; x < w; ++x) {
                for (var y = 0; y < h; ++y) {
                    this.draw_tile_at(x, y);
                }
            }
            for (var _i = 0, _a = this.agents; _i < _a.length; _i++) {
                var a = _a[_i];
                a.draw();
            }
        };
        Map.prototype.createTileFromSpaces = function (tile, spaces) {
            var pos = spaces.splice(Math.floor(ROT.RNG.getUniform() * spaces.length), 1)[0].split(",");
            var x = parseInt(pos[0]);
            var y = parseInt(pos[1]);
            return new tile(x, y);
        };
        Map.prototype.gen = function (level) {
            var w = this.width;
            var h = this.height;
            var digger;
            if (level == 0) {
                digger = new ROT.Map.EllerMaze(w, h);
            }
            else if (level == 1) {
                digger = new ROT.Map.Digger(w, h);
            }
            else {
                digger = new ROT.Map.Digger(w, h);
            }
            var spaces = [];
            var digCallback = function (x, y, v) {
                if (v) {
                    this.layer[x][y].push(new Roguelike.Wall(x, y));
                }
                else {
                    this.layer[x][y].push(new Roguelike.Tile(x, y));
                    spaces.push(x + "," + y);
                }
            };
            digger.create(digCallback.bind(this));
            var player = this.createTileFromSpaces(Roguelike.Player, spaces);
            this.agents.push(player);
            this.player = player;
            Roguelike.Main.player = player;
            player.set_shadow(0.5, 360);
            player.set_shadow();
            var exit = this.createTileFromSpaces(Roguelike.Exit, spaces);
            this.layer[exit.x][exit.y].push(exit);
            this.isFov = true;
            var isBox = true;
            var isGuard = true;
            if (isBox) {
                for (var i = 0; i < 3; i++) {
                    var box = this.createTileFromSpaces(Roguelike.Box, spaces);
                    box.hasKey = !i;
                    this.layer[box.x][box.y].push(box);
                }
                exit.needKey = true;
            }
            if (isGuard) {
                var guard = this.createTileFromSpaces(Roguelike.Guard, spaces);
                this.agents.push(guard);
            }
        };
        return Map;
    }());
    Roguelike.Map = Map;
})(Roguelike || (Roguelike = {}));
//# sourceMappingURL=map.js.map