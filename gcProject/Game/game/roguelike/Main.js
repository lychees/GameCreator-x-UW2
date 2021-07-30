var Roguelike;
(function (Roguelike) {
    Roguelike.firstblood = false;
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
            this.display = new ROT.Display({
                width: 100,
                height: 100,
                fontSize: 26,
                spacing: 1.08,
                fontFamily: 'Verdana'
            });
            document.body.insertBefore(this.display.getContainer(), document.getElementById('the3Container'));
            document.getElementById("gcCanvas").style.position = "relative";
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
        }
    };
    function command_line(cmd) {
        alert(cmd);
        if (cmd == "+") {
            Game.currentScene.camera.scaleX += 0.1;
            Game.currentScene.camera.scaleY += 0.1;
        }
        else if (cmd == "-") {
            Game.currentScene.camera.scaleX -= 0.1;
            Game.currentScene.camera.scaleY -= 0.1;
        }
    }
    Roguelike.command_line = command_line;
})(Roguelike || (Roguelike = {}));
//# sourceMappingURL=Main.js.map