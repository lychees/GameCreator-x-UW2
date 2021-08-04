




var Roguelike;
(function (Roguelike) {
    var Creature = (function (_super) {
        __extends(Creature, _super);
        function Creature(_x, _y, _ch, _color) {
            if (_x === void 0) { _x = 0; }
            if (_y === void 0) { _y = 0; }
            if (_ch === void 0) { _ch = "c"; }
            if (_color === void 0) { _color = "#fff"; }
            _super.call(this, _x, _y, _ch, _color);
            this.d = 0;
            this.fv = 6;
            this.hp = 0;
            this.HP = 0;
            this.mp = 0;
            this.MP = 0;
            this.sp = 0;
            this.SP = 0;
            this.str = 0;
            this.dex = 0;
            this.con = 0;
            this.int = 0;
            this.wis = 0;
            this.cha = 0;
        }
        Creature.prototype.getSpeed = function () {
            return 100;
        };
        Creature.prototype.set_shadow = function (s, angle) {
            if (s === void 0) { s = 0; }
            if (angle === void 0) { angle = 90; }
            var fov = new ROT.FOV.RecursiveShadowcasting(function (x, y) {
                return Roguelike.Main.map.canLightPass(x, y);
            });
            if (angle == 90) {
                fov.compute90(this.x, this.y, this.fv, this.d, function (x, y, r, visibility) {
                    if (Roguelike.Main.map.shadow[x][y] != s) {
                        Roguelike.Main.map.shadow[x][y] = s;
                        Roguelike.Main.update_shadow(x, y, s);
                    }
                });
            }
            else {
                fov.compute(this.x, this.y, this.fv, function (x, y, r, visibility) {
                    if (Roguelike.Main.map.shadow[x][y] != s) {
                        Roguelike.Main.map.shadow[x][y] = s;
                        Roguelike.Main.update_shadow(x, y, s);
                    }
                });
            }
        };
        Creature.prototype.draw = function () {
            Roguelike.Main.display.draw(this.x, this.y, this.ch, this.color);
        };
        return Creature;
    }(Roguelike.Tile));
    Roguelike.Creature = Creature;
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(_x, _y, _ch, _color) {
            if (_x === void 0) { _x = 0; }
            if (_y === void 0) { _y = 0; }
            if (_ch === void 0) { _ch = "我"; }
            if (_color === void 0) { _color = "#ff0"; }
            _super.call(this, _x, _y, _ch, _color);
        }
        Player.prototype.act = function () {
            Roguelike.Main.engine.lock();
            document.addEventListener("keydown", this);
        };
        Player.prototype.handleEvent = function (e) {
            var code = e.keyCode;
            if (code == ROT.KEYS.VK_SPACE || code == ROT.KEYS.VK_ENTER) {
                Roguelike.Main.map.enter(this);
                document.removeEventListener("keydown", this);
                Roguelike.Main.engine.unlock();
                return;
            }
            var keyMap = {};
            keyMap[ROT.KEYS.VK_UP] = keyMap[ROT.KEYS.VK_W] = 0;
            keyMap[ROT.KEYS.VK_RIGHT] = keyMap[ROT.KEYS.VK_D] = 2;
            keyMap[ROT.KEYS.VK_DOWN] = keyMap[ROT.KEYS.VK_S] = 4;
            keyMap[ROT.KEYS.VK_LEFT] = keyMap[ROT.KEYS.VK_A] = 6;
            if (!(code in keyMap)) {
                return;
            }
            var d = keyMap[code];
            var dx = ROT.DIRS[8][d][0];
            var dy = ROT.DIRS[8][d][1];
            var x = this.x;
            var y = this.y;
            var xx = x + dx;
            var yy = y + dy;
            this.set_shadow(0.5);
            this.d = d;
            if (e.shiftKey) {
            }
            else {
                if (Roguelike.Main.map.isPassable(xx, yy)) {
                    this.x = xx;
                    this.y = yy;
                }
            }
            this.set_shadow();
            Roguelike.Main.map.draw();
            document.removeEventListener("keydown", this);
            Roguelike.Main.engine.unlock();
        };
        return Player;
    }(Creature));
    Roguelike.Player = Player;
    var Guard = (function (_super) {
        __extends(Guard, _super);
        function Guard(_x, _y, _ch, _color) {
            if (_x === void 0) { _x = 0; }
            if (_y === void 0) { _y = 0; }
            if (_ch === void 0) { _ch = "衛"; }
            if (_color === void 0) { _color = "#f00"; }
            _super.call(this, _x, _y, _ch, _color);
        }
        Guard.prototype.act = function () {
            var astar = new ROT.Path.AStar(Roguelike.Main.player.x, Roguelike.Main.player.y, function (x, y) {
                return Roguelike.Main.map.isPassable(x, y);
            }, {
                topology: 4
            });
            var path = [];
            astar.compute(this.x, this.y, function (x, y) {
                path.push([x, y]);
            });
            path.shift();
            if (path.length <= 1) {
                Roguelike.Main.engine.lock();
                alert("你被捉住了！");
                Roguelike.Main.back_to_title();
            }
            else {
                this.x = path[0][0];
                this.y = path[0][1];
                Roguelike.Main.map.draw();
            }
        };
        return Guard;
    }(Creature));
    Roguelike.Guard = Guard;
})(Roguelike || (Roguelike = {}));
//# sourceMappingURL=Creature.js.map