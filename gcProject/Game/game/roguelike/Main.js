var Roguelike;
(function (Roguelike) {
    Roguelike.current_map = "";
    function colorHex(colorArr) {
        var strHex = "#";
        var colorArr;
        for (var i = 0; i < colorArr.length; i++) {
            var hex = Number(colorArr[i]).toString(16);
            if (hex.length == "1") {
                hex = "0" + hex;
            }
            strHex += hex;
        }
        return strHex;
    }
    function colorRgb(data) {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var color = data.toLowerCase();
        if (reg.test(color)) {
            if (color.length === 4) {
                var colorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
                }
                color = colorNew;
            }
            var colorChange = [];
            for (var i = 1; i < 7; i += 2) {
                colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
            }
            return colorChange;
        }
        else {
            return color;
        }
    }
    function mix(data, shadow) {
        var c = colorRgb(data);
        for (var i = 0; i < c.length; ++i) {
            c[i] = Math.floor(c[i] * (1 - shadow));
        }
        return colorHex(c);
    }
    Roguelike.mix = mix;
    Roguelike.Main = {
        display: null,
        map: null,
        engine: null,
        level: null,
        player: null,
        exit: null,
        pedro: null,
        back_to_title: function () {
            document.removeEventListener("keydown", Roguelike.Main.player);
            document.body.removeChild(this.display.getContainer());
            GameUI.show(1);
        },
        init: function () {
            for (var i = 0; i < 7; ++i) {
                var file_name = "PORTCHIP.";
                var a = '0';
                var b = Math.floor((i * 2) / 10);
                var c = (i * 2) % 10;
                file_name += a;
                file_name += b;
                file_name += c;
                var suffix = ["  day.png", "  dawn.png", "  dust.png", "  nignt.png"];
                for (var _i = 0, suffix_1 = suffix; _i < suffix_1.length; _i++) {
                    var s = suffix_1[_i];
                    console.log(file_name + s);
                    AssetManager.loadImages("asset/image/_uw2/ports/" + file_name + s);
                }
            }
        },
        start_level: function (level) {
            var w = 25;
            var h = 20;
            if (this.level == null) {
                this.init();
            }
            this.map = new Roguelike.Map(w, h);
            this.level = level;
            this.map.gen(level);
            this.map.draw();
            var scheduler = new ROT.Scheduler.Simple();
            for (var _i = 0, _a = this.map.agents; _i < _a.length; _i++) {
                var a = _a[_i];
                console.log(a);
                scheduler.add(a, true);
            }
            this.engine = new ROT.Engine(scheduler);
            this.engine.start();
        },
        gen_cave: function (g) {
            var w = Number(g.length);
            var h = Number(g[0].length);
            this.map = new Roguelike.Map(w, h);
            this.map.gen_cave(g);
        },
        update_shadow: function (x, y, s) {
            if (Game.currentScene == null)
                return;
            var layer = Game.currentScene.getLayerByPreset(3);
            var shadow = {
                "tex": AssetManager.getImage(TileData.getTileData(20).url),
                "x": 0,
                "y": 0,
                "w": 16,
                "h": 16,
                "texID": 20
            };
            if (s != 0) {
                for (var ox = 0; ox < 2; ++ox) {
                    for (var oy = 0; oy < 2; ++oy) {
                        layer.drawTile(x + x + ox, y + y + oy, shadow);
                    }
                }
            }
            else {
                for (var ox = 0; ox < 2; ++ox) {
                    for (var oy = 0; oy < 2; ++oy) {
                        layer.drawTile(x + x + ox, y + y + oy, null);
                    }
                }
            }
        },
        turn_and_refresh_shadow: function (dd) {
            this.player.set_shadow(0.5);
            this.player.d = dd;
            this.player.set_shadow();
            var layer = Game.currentScene.getLayerByPreset(3);
            layer.flushTile();
        },
        refresh_shadow: function () {
            var p = GameUtils.getGridPostion(Game.player.sceneObject.pos);
            var xx = Math.floor(p.x / 2);
            var yy = Math.floor(p.y / 2);
            if (xx == this.player.x && yy == this.player.y) {
                return;
            }
            this.player.set_shadow(0.5);
            this.player.x = xx;
            this.player.y = yy;
            this.player.set_shadow();
            var layer = Game.currentScene.getLayerByPreset(3);
            layer.flushTile();
        },
        gen_port: function () {
            return;
            var url = "asset/image/_uw2/ports/PORTMAP008.json";
            FileUtils.loadFile(url, new Callback(function (raw) {
                if (Game.currentScene == null)
                    return;
                var layer = Game.currentScene.getLayerByPreset(0);
                var port = Uint8Array.from(raw.split(','));
                var a = Game.currentScene.LayerDatas[0].tileData;
                Game.currentScene.reset_2Darray(a, 96, 96);
                for (var x = 0; x < 96; ++x) {
                    for (var y = 0; y < 96; ++y) {
                        var idx = Number(port[x * 96 + y]);
                        var t = {
                            "tex": AssetManager.getImage("asset/image/_uw2/ports/PORTCHIP.000  day.png"),
                            "y": Math.floor(idx / 16) * 16,
                            "x": (idx % 16) * 16,
                            "w": 16,
                            "h": 16,
                            "texID": 21,
                        };
                        layer.drawTile(y, x, t);
                    }
                }
            }, this));
        }
    };
    function command_line(cmd) {
        if (cmd == "+") {
            Game.currentScene.camera.scaleX += 0.1;
            Game.currentScene.camera.scaleY += 0.1;
        }
        else if (cmd == "-") {
            Game.currentScene.camera.scaleX -= 0.1;
            Game.currentScene.camera.scaleY -= 0.1;
        }
        else if (cmd[0] == 't') {
            var a = cmd.split(' ');
            Game.player.toScene(a[1], a[2], a[3]);
        }
    }
    Roguelike.command_line = command_line;
})(Roguelike || (Roguelike = {}));
//# sourceMappingURL=Main.js.map