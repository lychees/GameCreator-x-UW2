




var Roguelike;
(function (Roguelike) {
    var tiles_texture_manager = (function () {
        function tiles_texture_manager() {
        }
        return tiles_texture_manager;
    }());
    Roguelike.tiles_texture_manager = tiles_texture_manager;
    var uw2_tiles_texture_manager = (function (_super) {
        __extends(uw2_tiles_texture_manager, _super);
        function uw2_tiles_texture_manager() {
            _super.call(this);
            this.GRID_SIZE = 16;
        }
        uw2_tiles_texture_manager.prototype.parse_from_01_matrix = function (scene, g) {
            var a = scene.LayerDatas[0].tileData;
            var w = g.length;
            var h = g[0].length;
            for (var x = 0; x < w; ++x) {
                for (var y = 0; y < h; ++y) {
                    if (g[x][y] == 0) {
                        a[x][y].x = 0;
                        a[x][y].y = 0;
                    }
                    else {
                        a[x][y].x = 1;
                        a[x][y].y = 4;
                    }
                    a[x][y].texID = 12;
                }
            }
            for (var x = 0; x < w; ++x) {
                for (var y = 0; y < h; ++y) {
                    if (g[x][y] != 0)
                        continue;
                    var up = Boolean(y > 0 && g[x][y - 1] == 1);
                    var dn = Boolean(y < h - 1 && g[x][y + 1] == 1);
                    var lt = Boolean(x > 0 && g[x - 1][y] == 1);
                    var rt = Boolean(x < w - 1 && g[x + 1][y] == 1);
                    if (up && dn) {
                        a[x][y].x = 2;
                        a[x][y].y = 4;
                    }
                    if (up) {
                        a[x][y].x = 2;
                        a[x][y].y = 0;
                    }
                    else if (dn) {
                        a[x][y].x = 7;
                        a[x][y].y = 0;
                    }
                    if (rt && lt) {
                        a[x][y].x = 3;
                        a[x][y].y = 4;
                    }
                    else if (rt) {
                        a[x][y].x = 5;
                        a[x][y].y = 0;
                    }
                    else if (lt) {
                        a[x][y].x = 4;
                        a[x][y].y = 0;
                    }
                    if (up && rt) {
                        a[x][y].x = 3;
                        a[x][y].y = 0;
                    }
                    else if (up && lt) {
                        a[x][y].x = 1;
                        a[x][y].y = 0;
                    }
                    if (dn && rt) {
                        a[x][y].x = 8;
                        a[x][y].y = 0;
                    }
                    else if (dn && lt) {
                        a[x][y].x = 6;
                        a[x][y].y = 0;
                    }
                    if (up && rt && lt) {
                        a[x][y].x = 6;
                        a[x][y].y = 4;
                    }
                    if (dn && rt && lt) {
                        a[x][y].x = 7;
                        a[x][y].y = 4;
                    }
                    if (lt && up && dn) {
                        a[x][y].x = 4;
                        a[x][y].y = 4;
                    }
                    if (rt && up && dn) {
                        a[x][y].x = 5;
                        a[x][y].y = 4;
                    }
                }
            }
            for (var x = 0; x < w; ++x) {
                for (var y = 0; y < h; ++y) {
                    a[x][y].x *= this.GRID_SIZE;
                    a[x][y].y *= this.GRID_SIZE;
                }
            }
        };
        return uw2_tiles_texture_manager;
    }(tiles_texture_manager));
    Roguelike.uw2_tiles_texture_manager = uw2_tiles_texture_manager;
})(Roguelike || (Roguelike = {}));
//# sourceMappingURL=uw2_tiles_texture_manager.js.map