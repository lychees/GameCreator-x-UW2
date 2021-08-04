var Roguelike;
(function (Roguelike) {
    var Auto = (function () {
        function Auto() {
            this.ox = 0;
            this.oy = 0;
            this.a = new Array(16);
            for (var i = 0; i < 16; ++i) {
                this.a[i] = new Array(2);
                for (var x = 0; x < 2; ++x) {
                    this.a[i][x] = new Array(2);
                    for (var y = 0; y < 2; ++y) {
                        this.a[i][x][y] = {
                            "x": 0,
                            "y": 0,
                        };
                    }
                }
            }
            this.a[15][0][0] = {
                "x": 1,
                "y": 3,
            };
            this.a[15][0][1] = {
                "x": 1,
                "y": 4,
            };
            this.a[15][1][0] = {
                "x": 2,
                "y": 3,
            };
            this.a[15][1][1] = {
                "x": 2,
                "y": 4,
            };
            this.a[0][0][0] = {
                "x": 0,
                "y": 0,
            };
            this.a[0][0][1] = {
                "x": 0,
                "y": 1,
            };
            this.a[0][1][0] = {
                "x": 1,
                "y": 0,
            };
            this.a[0][1][1] = {
                "x": 1,
                "y": 1,
            };
            for (var i = 1; i < 16; ++i) {
                for (var x = 0; x < 2; ++x) {
                    for (var y = 0; y < 2; ++y) {
                        this.a[i][x][y] = {
                            "x": this.a[15][x][y].x,
                            "y": this.a[15][x][y].y,
                        };
                    }
                }
            }
            var rt = 1;
            var lt = 2;
            var dn = 4;
            var up = 8;
            var idx;
            idx = 15 - rt;
            this.a[idx][0][0].x += 1;
            this.a[idx][0][1].x += 1;
            this.a[idx][1][0].x += 1;
            this.a[idx][1][1].x += 1;
            idx = 15 - lt;
            this.a[idx][0][0].x -= 1;
            this.a[idx][0][1].x -= 1;
            this.a[idx][1][0].x -= 1;
            this.a[idx][1][1].x -= 1;
            this.a[15 - dn][0][0].y += 1;
            this.a[15 - dn][0][1].y += 1;
            this.a[15 - dn][1][0].y += 1;
            this.a[15 - dn][1][1].y += 1;
            this.a[15 - up][0][0].y -= 1;
            this.a[15 - up][0][1].y -= 1;
            this.a[15 - up][1][0].y -= 1;
            this.a[15 - up][1][1].y -= 1;
            idx = 15 - rt - dn;
            this.a[idx][0][0].x += 1;
            this.a[idx][0][1].x += 1;
            this.a[idx][1][0].x += 1;
            this.a[idx][1][1].x += 1;
            this.a[idx][0][0].y += 1;
            this.a[idx][0][1].y += 1;
            this.a[idx][1][0].y += 1;
            this.a[idx][1][1].y += 1;
            idx = 15 - rt - up;
            this.a[idx][0][0].x += 1;
            this.a[idx][0][1].x += 1;
            this.a[idx][1][0].x += 1;
            this.a[idx][1][1].x += 1;
            this.a[idx][0][0].y -= 1;
            this.a[idx][0][1].y -= 1;
            this.a[idx][1][0].y -= 1;
            this.a[idx][1][1].y -= 1;
            idx = 15 - lt - dn;
            this.a[idx][0][0].x -= 1;
            this.a[idx][0][1].x -= 1;
            this.a[idx][1][0].x -= 1;
            this.a[idx][1][1].x -= 1;
            this.a[idx][0][0].y += 1;
            this.a[idx][0][1].y += 1;
            this.a[idx][1][0].y += 1;
            this.a[idx][1][1].y += 1;
            idx = 15 - lt - up;
            this.a[idx][0][0].x -= 1;
            this.a[idx][0][1].x -= 1;
            this.a[idx][1][0].x -= 1;
            this.a[idx][1][1].x -= 1;
            this.a[idx][0][0].y -= 1;
            this.a[idx][0][1].y -= 1;
            this.a[idx][1][0].y -= 1;
            this.a[idx][1][1].y -= 1;
            idx = 15 - dn - up;
            this.a[idx][0][0].y -= 1;
            this.a[idx][0][1].y += 1;
            this.a[idx][1][0].y -= 1;
            this.a[idx][1][1].y += 1;
            idx = 15 - lt - rt;
            this.a[idx][0][0].x -= 1;
            this.a[idx][0][1].x -= 1;
            this.a[idx][1][0].x += 1;
            this.a[idx][1][1].x += 1;
            this.a[1][0][0] = {
                "x": 0,
                "y": 2,
            };
            this.a[1][0][1] = {
                "x": 0,
                "y": 5,
            };
            this.a[1][1][0] = {
                "x": 1,
                "y": 2,
            };
            this.a[1][1][1] = {
                "x": 1,
                "y": 5,
            };
            this.a[2][0][0] = {
                "x": 2,
                "y": 2,
            };
            this.a[2][0][1] = {
                "x": 2,
                "y": 5,
            };
            this.a[2][1][0] = {
                "x": 3,
                "y": 2,
            };
            this.a[2][1][1] = {
                "x": 3,
                "y": 5,
            };
            this.a[4][0][0] = {
                "x": 0,
                "y": 2,
            };
            this.a[4][0][1] = {
                "x": 0,
                "y": 3,
            };
            this.a[4][1][0] = {
                "x": 3,
                "y": 2,
            };
            this.a[4][1][1] = {
                "x": 3,
                "y": 3,
            };
            this.a[8][0][0] = {
                "x": 0,
                "y": 4,
            };
            this.a[8][0][1] = {
                "x": 0,
                "y": 5,
            };
            this.a[8][1][0] = {
                "x": 3,
                "y": 4,
            };
            this.a[8][1][1] = {
                "x": 3,
                "y": 5,
            };
        }
        Auto.prototype.fill = function (a, g, x, y) {
            if (a == null)
                a = [];
            for (var ox = 0; ox < 2; ++ox) {
                var xx = x + x + ox;
                if (a[xx] == null)
                    a[xx] = [];
                for (var oy = 0; oy < 2; ++oy) {
                    var yy = y + y + oy;
                    if (a[xx][yy] == null)
                        a[xx][yy] = {};
                }
            }
            var i = 0;
            var up = g[x][y - 1] != null && g[x][y] == g[x][y - 1];
            var dn = g[x][y - 1] != null && g[x][y] == g[x][y + 1];
            var lt = g[x - 1] != null && g[x][y] == g[x - 1][y];
            var rt = g[x + 1] != null && g[x][y] == g[x + 1][y];
            i *= 2;
            if (up)
                i += 1;
            i *= 2;
            if (dn)
                i += 1;
            i *= 2;
            if (lt)
                i += 1;
            i *= 2;
            if (rt)
                i += 1;
            for (var ox = 0; ox < 2; ++ox) {
                for (var oy = 0; oy < 2; ++oy) {
                    var xx = x + x + ox;
                    var yy = y + y + oy;
                    a[xx][yy].x = this.a[i][ox][oy].x + this.ox;
                    a[xx][yy].y = this.a[i][ox][oy].y + this.oy;
                    a[xx][yy].texID = this.texID;
                }
            }
            if (up && lt) {
                var xx = x + x + 0, yy = y + y + 0;
                if (g[x - 1] != null && g[x - 1][y - 1] != null && g[x - 1][y - 1] != g[x][y]) {
                    a[xx][yy].x = 2 + this.ox;
                    a[xx][yy].y = 0 + this.oy;
                }
            }
            if (up && rt) {
                var xx = x + x + 1, yy = y + y + 0;
                if (g[x + 1] != null && g[x + 1][y - 1] != null && g[x + 1][y - 1] != g[x][y]) {
                    a[xx][yy].x = 3 + this.ox;
                    a[xx][yy].y = 0 + this.oy;
                }
            }
            if (dn && lt) {
                var xx = x + x + 0, yy = y + y + 1;
                if (g[x - 1] != null && g[x - 1][y + 1] != null && g[x - 1][y + 1] != g[x][y]) {
                    a[xx][yy].x = 2 + this.ox;
                    a[xx][yy].y = 1 + this.oy;
                }
            }
            if (dn && rt) {
                var xx = x + x + 1, yy = y + y + 1;
                if (g[x + 1] != null && g[x + 1][y + 1] != null && g[x + 1][y + 1] != g[x][y]) {
                    a[xx][yy].x = 3 + this.ox;
                    a[xx][yy].y = 1 + this.oy;
                }
            }
        };
        return Auto;
    }());
    var RMVA_ocean_tiles_texture_manager = (function () {
        function RMVA_ocean_tiles_texture_manager() {
            this.GRID_SIZE = 16;
        }
        RMVA_ocean_tiles_texture_manager.prototype.parse_from_01_matrix = function (scene, g) {
            var a = scene.LayerDatas[0].tileData;
            var w = g.length;
            var h = g[0].length;
            var Grass = new Auto();
            Grass.texID = 42;
            var Ocean = new Auto();
            Ocean.texID = 41;
            for (var x = 0; x < w; ++x) {
                for (var y = 0; y < h; ++y) {
                    if (g[x][y] == 1) {
                        Grass.fill(a, g, x, y);
                    }
                    else {
                        Ocean.fill(a, g, x, y);
                    }
                }
            }
            for (var x = 0; x < 2 * w; ++x) {
                for (var y = 0; y < 2 * h; ++y) {
                    a[x][y].x *= this.GRID_SIZE;
                    a[x][y].y *= this.GRID_SIZE;
                }
            }
        };
        return RMVA_ocean_tiles_texture_manager;
    }());
    Roguelike.RMVA_ocean_tiles_texture_manager = RMVA_ocean_tiles_texture_manager;
    var RMVA_cave_tiles_texture_manager = (function () {
        function RMVA_cave_tiles_texture_manager() {
            this.GRID_SIZE = 16;
        }
        RMVA_cave_tiles_texture_manager.prototype.reset = function (a, w, h) {
            if (a == null)
                a = [];
            for (var x = 0; x < w; ++x) {
                if (a[x] == null)
                    a[x] = [];
                for (var y = 0; y < h; ++y) {
                    if (a[x][y] == null)
                        a[x][y] = {};
                }
            }
        };
        RMVA_cave_tiles_texture_manager.prototype.parse_from_01_matrix = function (scene, g) {
            var a = scene.LayerDatas[0].tileData;
            var a1 = scene.LayerDatas[1].tileData;
            var w = g.length;
            var h = g[0].length;
            var Soil = new Auto();
            Soil.texID = 62;
            Soil.ox = 0;
            Soil.oy = 6;
            var Abyss = new Auto();
            Abyss.texID = 62;
            Abyss.ox = 20;
            Abyss.oy = 12;
            this.reset(a1, w * 2, h * 2);
            for (var x = 0; x < w; ++x) {
                for (var y = 0; y < h; ++y) {
                    Soil.fill(a, g, x, y);
                    if (g[x][y] == 1) {
                    }
                    else {
                        Abyss.fill(a1, g, x, y);
                    }
                }
            }
            for (var x = 0; x < 2 * w; ++x) {
                for (var y = 0; y < 2 * h; ++y) {
                    a[x][y].x *= this.GRID_SIZE;
                    a[x][y].y *= this.GRID_SIZE;
                    a1[x][y].x *= this.GRID_SIZE;
                    a1[x][y].y *= this.GRID_SIZE;
                }
            }
        };
        return RMVA_cave_tiles_texture_manager;
    }());
    Roguelike.RMVA_cave_tiles_texture_manager = RMVA_cave_tiles_texture_manager;
})(Roguelike || (Roguelike = {}));
//# sourceMappingURL=RMVA_tiles_texture_manager.js.map