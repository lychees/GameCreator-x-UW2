var Roguelike;
(function (Roguelike) {
    Roguelike.current_map = "";
    Roguelike.port_id = 0;
    Roguelike.port_time = "";
    Roguelike.discoveries = [];
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
    Roguelike.villages_json = {};
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
                var suffix = ["  day.png", "  dawn.png", "  dusk.png", "  night.png"];
                for (var _i = 0, suffix_1 = suffix; _i < suffix_1.length; _i++) {
                    var s = suffix_1[_i];
                    AssetManager.loadImage("asset/image/_uw2/ports/" + file_name + s);
                }
            }
            var url = "Game/game/roguelike/uw2/villages.json";
            FileUtils.loadJsonFile(url, new Callback(function (json) {
                Roguelike.villages_json = json;
            }, this));
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
        get_port_chip: function (id, t) {
            if (id === void 0) { id = 0; }
            if (t === void 0) { t = "day"; }
            var i = hash_ports_meta_data[id + 1].tileset;
            var f = "PORTCHIP.";
            var a = '0';
            var b = Math.floor((i * 2) / 10);
            var c = (i * 2) % 10;
            f += a;
            f += b;
            f += c;
            f += '  ';
            return "asset/image/_uw2/ports/" + f + t + ".png";
        },
        gen_port: function (id) {
            if (id === void 0) { id = 0; }
            var t = Roguelike.port_time;
            if (t == 'random') {
                var tt = ["day", "dusk", "dawn", "night"];
                t = tt[Math.floor(Math.random() * 4)];
            }
            var x = id;
            var c = x % 10;
            x = Math.floor(x / 10);
            var b = x % 10;
            x = Math.floor(x / 10);
            var a = x % 10;
            var url = "asset/image/_uw2/ports/PORTMAP" + a + b + c + ".json";
            FileUtils.loadFile(url, new Callback(function (raw) {
                if (Game.currentScene == null)
                    return;
                var layer = Game.currentScene.getLayerByPreset(1);
                var port = Uint8Array.from(raw.split(','));
                var a = Game.currentScene.LayerDatas[1].tileData;
                Game.currentScene.reset_2Darray(a, 96, 96);
                AssetManager.loadImage(this.get_port_chip(id, t), Callback.New(function (tex) {
                    for (var x_1 = 0; x_1 < 96; ++x_1) {
                        for (var y = 0; y < 96; ++y) {
                            var idx = Number(port[x_1 * 96 + y]);
                            var t_1 = {
                                "tex": tex,
                                "y": Math.floor(idx / 16) * 16,
                                "x": (idx % 16) * 16,
                                "w": 16,
                                "h": 16,
                            };
                            layer.drawTile(y, x_1, t_1);
                        }
                    }
                    layer.flushTile();
                }));
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
    Roguelike.world_map_ox = 0;
    Roguelike.world_map_oy = 0;
    Roguelike.story = "启航";
    function toWorldMap(x, y) {
        Roguelike.current_map = "world_map";
        Roguelike.world_map_ox = x - 360;
        if (Roguelike.world_map_ox < 0)
            Roguelike.world_map_ox = 0;
        Roguelike.world_map_oy = y - 270;
        if (Roguelike.world_map_oy < 0)
            Roguelike.world_map_oy = 0;
        Game.player.toScene(5, (x - Roguelike.world_map_ox) * 16, (y - Roguelike.world_map_oy) * 16);
        var bgm_url = "asset/audio/_uwol/sea/Mediterranean.mp3";
        if (Roguelike.port_id != null) {
            var id = Roguelike.port_id;
            var meta = hash_ports_meta_data[id + 1];
            var region = hash_ports_meta_data.regions[meta.regionId];
            var economy = hash_ports_meta_data.markets[meta.economyId];
            if (region == 'Europe') {
                if (economy == "Northern Europe") {
                    bgm_url = "asset/audio/_uwol/sea/North Sea.mp3";
                }
            }
            else if (region == 'New World') {
                bgm_url = "asset/audio/_uwol/sea/American Sea.mp3";
            }
            else if (region == "West Africa") {
                bgm_url = "asset/audio/_uwol/sea/African Sea.mp3";
            }
            else if (region == "East Africa") {
                bgm_url = "asset/audio/_uwol/sea/African Sea.mp3";
            }
            else if (region == "Middle East") {
            }
            else if (region == 'India') {
                bgm_url = "asset/audio/_uwol/sea/Indian Ocean.mp3";
            }
            else if (region == 'Southeast Asia') {
                bgm_url = "asset/audio/_uwol/sea/Southeast Asian Sea.ogg";
            }
            else if (region == 'Far East') {
                bgm_url = "asset/audio/_uwol/sea/East Asia Sea.mp3";
            }
        }
        GameAudio.playBGM(bgm_url);
        if (Roguelike.story == "启航") {
            GameCommand.startCommonCommand(8001);
            Roguelike.story = "谒见公爵";
        }
    }
    Roguelike.toWorldMap = toWorldMap;
    function toPort(id, t) {
        if (t === void 0) { t = "random"; }
        var meta = hash_ports_meta_data[id + 1];
        Game.player.variable.setString(1, "你发现了 " + i18n.chinese[meta.name]);
        GameCommand.startCommonCommand(1);
        Roguelike.current_map = "port";
        Roguelike.port_id = id;
        Roguelike.port_time = t;
        Game.player.toScene(7, meta.buildings[4].x * 16 + 16, meta.buildings[4].y * 16 + 16);
        var bgm_url = "asset/audio/_uwol/port/Southern Europe Town.mp3";
        if (["Lisbon", "Seville", "London", "Marseille", "Amsterdam", "Venice"].includes(meta.name)) {
            bgm_url = "asset/audio/_uwol/port/" + meta.name + ".mp3";
        }
        else {
            var region = hash_ports_meta_data.regions[meta.regionId];
            var economy = hash_ports_meta_data.markets[meta.economyId];
            if (region == 'Europe') {
                if (economy == "Ottoman Empire") {
                    bgm_url = "asset/audio/_uwol/port/Middle Eastern Town.mp3";
                }
                if (economy == "Northern Europe") {
                    bgm_url = "asset/audio/_uwol/port/Northern Europe Town.mp3";
                }
                else {
                    bgm_url = "asset/audio/_uwol/port/Southern Europe Town.mp3";
                }
            }
            else if (region == 'New World') {
                if (economy == "Central America") {
                    bgm_url = "asset/audio/_uwol/port/Central America Town.mp3";
                }
                else {
                    bgm_url = "asset/audio/_uwol/port/South America Town.mp3";
                }
            }
            else if (region == "West Africa") {
                bgm_url = "asset/audio/_uwol/port/African Town.mp3";
            }
            else if (region == "East Africa") {
                bgm_url = "asset/audio/_uwol/port/African Town.mp3";
            }
            else if (region == "Middle East") {
                bgm_url = "asset/audio/_uwol/port/Middle Eastern Town.mp3";
            }
            else if (region == 'India') {
                bgm_url = "asset/audio/_uwol/port/Indian Town.mp3";
            }
            else if (region == 'Southeast Asia') {
                bgm_url = "asset/audio/_uwol/port/Southeast Asian Town.ogg";
            }
            else if (region == 'Far East') {
                bgm_url = "asset/audio/_uwol/port/China Town.mp3";
            }
        }
        GameAudio.playBGM(bgm_url);
    }
    Roguelike.toPort = toPort;
})(Roguelike || (Roguelike = {}));
//# sourceMappingURL=Main.js.map