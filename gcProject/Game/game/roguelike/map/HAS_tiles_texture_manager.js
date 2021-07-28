var Roguelike;
(function (Roguelike) {
    var HAS_tiles_texture_manager = (function () {
        function HAS_tiles_texture_manager() {
            this.GRID_SIZE = 16;
        }
        HAS_tiles_texture_manager.prototype.parse_from_01_matrix = function (scene, g) {
            var a = scene.LayerDatas[0].tileData;
            var w = g.length;
            var h = g[0].length;
            for (var x = 0; x < w; ++x) {
                for (var y = 0; y < h; ++y) {
                    if (g[x][y] == 0) {
                        a[x][y].x = 1;
                        a[x][y].y = 1;
                    }
                    else {
                        a[x][y].x = 2;
                        a[x][y].y = 3;
                    }
                    a[x][y].texID = 15;
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
                    var upl = Boolean(y > 0 && x > 0 && g[x - 1][y - 1] == 1);
                    var upr = Boolean(y > 0 && x < w - 1 && g[x + 1][y - 1] == 1);
                    var dnl = Boolean(y < h - 1 && x > 0 && g[x - 1][y + 1] == 1);
                    var dnr = Boolean(y < h - 1 && x < w - 1 && g[x + 1][y + 1] == 1);
                    if (up && dn) {
                        a[x][y].x = 1;
                        a[x][y].y = 19;
                    }
                    if (up) {
                        a[x][y].x = 2;
                        a[x][y].y = 4;
                    }
                    else if (dn) {
                        a[x][y].x = 2;
                        a[x][y].y = 2;
                    }
                    if (rt && lt) {
                        a[x][y].x = 0;
                        a[x][y].y = 19;
                    }
                    else if (rt) {
                        a[x][y].x = 1;
                        a[x][y].y = 3;
                    }
                    else if (lt) {
                        a[x][y].x = 3;
                        a[x][y].y = 3;
                    }
                    if (up && rt) {
                        a[x][y].x = 5;
                        a[x][y].y = 3;
                    }
                    else if (up && lt) {
                        a[x][y].x = 4;
                        a[x][y].y = 3;
                    }
                    if (dn && rt) {
                        a[x][y].x = 5;
                        a[x][y].y = 4;
                    }
                    else if (dn && lt) {
                        a[x][y].x = 4;
                        a[x][y].y = 4;
                    }
                    if (up && rt && lt) {
                        a[x][y].x = 1;
                        a[x][y].y = 1;
                    }
                    if (dn && rt && lt) {
                        a[x][y].x = 1;
                        a[x][y].y = 1;
                    }
                    if (lt && up && dn) {
                        a[x][y].x = 1;
                        a[x][y].y = 1;
                    }
                    if (rt && up && dn) {
                        a[x][y].x = 1;
                        a[x][y].y = 1;
                    }
                    if (upl && !up && !lt) {
                        a[x][y].x = 3;
                        a[x][y].y = 4;
                    }
                    if (upr && !up && !rt) {
                        a[x][y].x = 1;
                        a[x][y].y = 4;
                    }
                    if (dnl && !dn && !lt) {
                        a[x][y].x = 3;
                        a[x][y].y = 2;
                    }
                    if (dnr && !dn && !rt) {
                        a[x][y].x = 1;
                        a[x][y].y = 2;
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
        return HAS_tiles_texture_manager;
    }());
    Roguelike.HAS_tiles_texture_manager = HAS_tiles_texture_manager;
})(Roguelike || (Roguelike = {}));
//# sourceMappingURL=HAS_tiles_texture_manager.js.map