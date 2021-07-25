




var Roguelike;
(function (Roguelike) {
    var Tile = (function () {
        function Tile(_x, _y, _ch, _color) {
            if (_x === void 0) { _x = 0; }
            if (_y === void 0) { _y = 0; }
            if (_ch === void 0) { _ch = "  "; }
            if (_color === void 0) { _color = "#fff"; }
            this.x = _x;
            this.y = _y;
            this.ch = _ch;
            this.color = _color;
            this.passable = true;
            this.lightpass = true;
        }
        Tile.prototype.enter = function () {
        };
        Tile.prototype.touch = function () {
        };
        Tile.prototype.draw = function () {
            Roguelike.Main.display.draw(this.x, this.y, this.ch, this.color);
        };
        Tile.prototype.draw_with_shadow = function (shadow) {
            Roguelike.Main.display.draw(this.x, this.y, this.ch, Roguelike.mix(this.color, shadow));
        };
        return Tile;
    }());
    Roguelike.Tile = Tile;
    var Wall = (function (_super) {
        __extends(Wall, _super);
        function Wall(_x, _y, _ch, _color) {
            if (_x === void 0) { _x = 0; }
            if (_y === void 0) { _y = 0; }
            if (_ch === void 0) { _ch = "墻"; }
            if (_color === void 0) { _color = "#fff"; }
            _super.call(this, _x, _y, _ch, _color);
            this.passable = false;
            this.lightpass = false;
        }
        return Wall;
    }(Tile));
    Roguelike.Wall = Wall;
    var Exit = (function (_super) {
        __extends(Exit, _super);
        function Exit(_x, _y, _ch, _color) {
            if (_x === void 0) { _x = 0; }
            if (_y === void 0) { _y = 0; }
            if (_ch === void 0) { _ch = "門"; }
            if (_color === void 0) { _color = "#aaf"; }
            _super.call(this, _x, _y, _ch, _color);
            this.needKey = false;
        }
        Exit.prototype.enter = function (who) {
            if (!this.needKey || who.hasKey) {
                alert("你找到了出口!");
                Roguelike.Main.engine.lock();
                Roguelike.Main.back_to_title();
            }
            else {
                alert("锁上了!");
            }
        };
        return Exit;
    }(Tile));
    Roguelike.Exit = Exit;
    var Box = (function (_super) {
        __extends(Box, _super);
        function Box(_x, _y, _ch, _color) {
            if (_x === void 0) { _x = 0; }
            if (_y === void 0) { _y = 0; }
            if (_ch === void 0) { _ch = "箱"; }
            if (_color === void 0) { _color = "#ffa"; }
            _super.call(this, _x, _y, _ch, _color);
            this.hasKey = false;
        }
        Box.prototype.enter = function (p) {
            if (this.hasKey == true) {
                alert("你发现了钥匙！");
                this.hasKey = false;
                p.hasKey = true;
                this.color = "#aaa";
            }
            else {
                alert("这个箱子是空的");
                this.color = "#aaa";
            }
        };
        return Box;
    }(Tile));
    Roguelike.Box = Box;
})(Roguelike || (Roguelike = {}));
//# sourceMappingURL=Tiles.js.map