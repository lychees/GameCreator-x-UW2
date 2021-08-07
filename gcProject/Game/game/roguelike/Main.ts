namespace Roguelike{

    export let current_map = "";
    export let port_id = 0;
    
    // 地块
    /**
         * 转化为RGB 为 HEX
         * @param {string} data 如：rgb(0,0,0)
         */
    function colorHex(colorArr) {
        let strHex = "#" 
        let colorArr
        // 转成16进制 
        for (let i = 0; i < colorArr.length; i++) {
            let hex = Number(colorArr[i]).toString(16);
            if (hex.length == "1") { hex = "0" + hex; }
            strHex += hex;
        }
        return strHex;
    }

    /**
     * 转化为HEX 为RGB
     * @param {string} data 如：#ffffff、#fff
     */
    function colorRgb(data) {
        // 16进制颜色值的正则 
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 把颜色值变成小写 
        let color = data.toLowerCase();
        if (reg.test(color)) {
            // 如果只有三位的值，需变成六位，如：#fff => #ffffff 
            if (color.length === 4) {
                let colorNew = "#";
                for (let i = 1; i < 4; i += 1) {
                    colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
                }
                color = colorNew;
            }
            // 处理六位的颜色值，转为RGB 
            let colorChange = [];
            for (let i = 1; i < 7; i += 2) {
                colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
            }
            return colorChange;
        } else { return color; }
    }

    export function mix(data: string, shadow: number) {
        let c = colorRgb(data);
        for (let i=0;i<c.length;++i) {
            c[i] = Math.floor(c[i] * (1 - shadow));
        }
        return colorHex(c);
    }

    export let villages_json = {};

    export var Main = {
        display: null,
        map: null,
        engine: null,
        level: null,
        player: null,
        exit: null,
        pedro: null,

        // 返回主菜单
        back_to_title: function() {
            document.removeEventListener("keydown", Main.player);        
            document.body.removeChild(this.display.getContainer());        
            GameUI.show(1);
        },
        
        init: function() {
            /*
            this.display = new ROT.Display({
                width: 100,
                height: 100,
                fontSize: 26,
                spacing: 1.08,
                fontFamily: 'Verdana' //Arial //'sans-serif',
            });

            document.body.insertBefore(this.display.getContainer(), document.getElementById('the3Container'));
            document.getElementById("gcCanvas").style.position = "relative";
            //document.getElementById("gcCanvas").style.position = "relative";      
            */ 
            for (let i=0;i<7;++i) {
                let file_name = "PORTCHIP.";
                let a = '0';
                let b = Math.floor((i*2) / 10);
                let c = (i*2) % 10;
                file_name += a;
                file_name += b;
                file_name += c;

                let suffix = ["  day.png", "  dawn.png", "  dust.png", "  nignt.png"];
                for (let s of suffix) {
                    console.log(file_name + s);
                    AssetManager.loadImage("asset/image/_uw2/ports/" + file_name + s);                    
                }
            }


            let url = "Game/game/roguelike/uw2/villages.json";

            FileUtils.loadJsonFile(url, new Callback(function (json) {                
                Roguelike.villages_json = json;
            }, this));

        },

        start_level: function(level) {
            
            //let ui1 = GameUI.get(1);
            //let w = ui1.width.text;
            //let h = ui1.height.text;
            let w = 25;
            let h = 20;

            // GameUI.hideAll();      
            
            if (this.level == null) {
                this.init();
            }
            this.map = new Map(w, h);

            this.level = level;
            this.map.gen(level);
            this.map.draw();
                    
            var scheduler = new ROT.Scheduler.Simple();
                
            for (let a of this.map.agents) {
                console.log(a);            
                scheduler.add(a, true);
            }        
            this.engine = new ROT.Engine(scheduler);
            this.engine.start();     
        },

        gen_cave: function(g: any) {
            let w = Number(g.length);
            let h = Number(g[0].length);
            this.map = new Roguelike.Map(w, h); 
            this.map.gen_cave(g);
        },

        update_shadow(x,y,s) {
            if (Game.currentScene == null) return;
            let layer = Game.currentScene.getLayerByPreset(3);
            
            let shadow = {
                "tex": AssetManager.getImage(TileData.getTileData(20).url),
                "x": 0,
                "y": 0,
                "w": 16,
                "h": 16,
                "texID": 20
            };

            if (s != 0) {
                for (let ox=0;ox<2;++ox) {
                    for (let oy=0;oy<2;++oy) {
                        layer.drawTile(x+x+ox, y+y+oy, shadow);
                    }          
                }                                            
            } else {
                for (let ox=0;ox<2;++ox) {
                    for (let oy=0;oy<2;++oy) {
                        layer.drawTile(x+x+ox, y+y+oy, null);
                    }          
                }
            }
        },  

        turn_and_refresh_shadow: function(dd: number) {                        
            this.player.set_shadow(0.5);
            this.player.d = dd;
            this.player.set_shadow();   
            let layer = Game.currentScene.getLayerByPreset(3);
            layer.flushTile();       
        },

        refresh_shadow: function() {
            let p = GameUtils.getGridPostion(Game.player.sceneObject.pos);
            let xx = Math.floor(p.x/2);
            let yy = Math.floor(p.y/2);
                        
            if (xx == this.player.x && yy == this.player.y)  {
                return;
            }

            this.player.set_shadow(0.5);
            this.player.x = xx;
            this.player.y = yy;
            this.player.set_shadow();
            let layer = Game.currentScene.getLayerByPreset(3);
            layer.flushTile();
        },

        get_port_chip: function(id = 0, t = "day") {

            let i = hash_ports_meta_data[id+1].tileset;
            let f = "PORTCHIP.";
            let a = '0';
            let b = Math.floor((i * 2) / 10);
            let c = (i * 2) % 10;
            f += a; f += b; f += c; f += '  ';
            return "asset/image/_uw2/ports/" + f + t + ".png";
        },

        gen_port: function(id = 0, t = "random") {

            if (t == 'random') {
                let tt = ["day","dusk","dawn","night"];
                t = tt[Math.floor(Math.random()*4)];
            }

            let x = id;
            let c = x % 10; x = Math.floor(x/10); 
            let b = x % 10; x = Math.floor(x/10);
            let a = x % 10;
                     
            let url = "asset/image/_uw2/ports/PORTMAP" + a+b+c + ".json";

            FileUtils.loadFile(url, new Callback(function (raw) {
                if (Game.currentScene == null) return;
                let layer = Game.currentScene.getLayerByPreset(1);

                let port = Uint8Array.from(raw.split(','));
                let a = Game.currentScene.LayerDatas[1].tileData;

                Game.currentScene.reset_2Darray(a, 96, 96);

                AssetManager.loadImage(this.get_port_chip(id, t), Callback.New((tex: Texture) => {
                    
                    for (let x=0;x<96;++x) {
                        for (let y=0;y<96;++y) {
                            let idx = Number(port[x*96+y]);
                            let t = {
                                "tex": tex,
                                "y": Math.floor(idx/16) * 16,
                                "x": (idx%16) * 16,                            
                                "w": 16,
                                "h": 16,
                            };
                            layer.drawTile(y, x, t);
                        }                        
                    }
                    layer.flushTile();
                });
                
            }, this));
        }
    };

    export function command_line(cmd: string) {
        if (cmd == "+") {
            Game.currentScene.camera.scaleX += 0.1;
            Game.currentScene.camera.scaleY += 0.1;
        } else if (cmd == "-") {
            Game.currentScene.camera.scaleX -= 0.1;
            Game.currentScene.camera.scaleY -= 0.1;
        } else if (cmd[0] == 't') {
            let a = cmd.split(' ');
            Game.player.toScene(a[1],a[2],a[3]);
        }
    }

    export let world_map_ox = 0;
    export let world_map_oy = 0;
    export let story = "启航";

    export function toWorldMap(x:number, y:number) {
        current_map = "world_map";
        world_map_ox = x-360; if (world_map_ox<0) world_map_ox=0;
        world_map_oy = y-270; if (world_map_oy<0) world_map_oy=0;
        Game.player.toScene(5,(x-world_map_ox)*16,(y-world_map_oy)*16);

        if (story == "启航") {
            GameCommand.startCommonCommand(8001);
            story = "谒见公爵"            
        }
    }
}
