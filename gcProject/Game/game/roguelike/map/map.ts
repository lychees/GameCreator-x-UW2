namespace Roguelike {
    export class Map {
        
        width: number;
        height: number;
        name: string;

        layer: any[][][];
        shadow: number[][];
        agents: any[];
        player: any;

        isFov: boolean;

        constructor(w: number, h: number) {   
                  
            this.width = w;
            this.height = h;        
            this.layer = new Array<any>(w);
            this.shadow = new Array<any>(w);
                  
            for (let x=0;x<w;++x) {
                this.layer[x] = new Array<any>(h);
                this.shadow[x] = new Array<any>(h);
                for (let y=0;y<h;++y) {         
                    this.layer[x][y] = new Array<any>();
                    this.shadow[x][y] = 1;
                }
            }
            this.agents = new Array<any>();
        }
        // 交互
        enter(p:any) {
            let x = p.x;
            let y = p.y;
            for (let t of this.layer[x][y]) {
                t.enter(p);
            }
        }
        // 触碰
        touch(p:any) {
            let x = p.x;
            let y = p.y;
            for (let t of this.layer[x][y]) {
                t.touch(p);
            }
        }
        // 是否在地图内部
        inMap(x: number, y:number): boolean {
            let w = this.width; let h = this.height;
            return 0 <= x && x < w && 0 <= y && y < h;
        }
        // 通行检测
        isPassable(x: number, y:number): boolean {
            if (!this.inMap(x, y)) return false;            
            for (let t of this.layer[x][y]) {     
                if (!t.passable) return false; 
            }
            return true;        
        }
        // 光线检测
        canLightPass(x: number, y:number): boolean {
            if (!this.inMap(x, y)) return false;            
            for (let t of this.layer[x][y]) {     
                if (!t.lightpass) return false; 
            }
            return true;  
        }

        // 画某个位置的地块
        draw_tile_at(x: number, y:number) {
            Main.display.draw(x, y, null);
            let a = this.layer[x][y];
            if (a !== null) {            
                let n = a.length;
                if (this.shadow[x][y] !== 0 && this.isFov) {
                    a[n-1].draw_with_shadow(this.shadow[x][y]);
                } else {
                    a[n-1].draw();
                }
            }
        }
        // To do list(minakokojima): 大地图卷动
        // 画整个地图
        draw() {
            let w = this.width;
            let h = this.height;
            for (let x=0;x<w;++x) {
                for (let y=0;y<h;++y) {
                    this.draw_tile_at(x, y);
                }
            }
            for (let a of this.agents) {            
                a.draw();
            }
        }
        // 生成地图相关
        createTileFromSpaces(tile, spaces) {        
            var pos = spaces.splice(Math.floor(ROT.RNG.getUniform() * spaces.length), 1)[0].split(",");
            var x = parseInt(pos[0]);
            var y = parseInt(pos[1]);        
            return new tile(x, y);
        }

        gen_cave(g: any) {
            let w = this.width;
            let h = this.height;        
            let digger = new ROT.Map.Digger(w, h);
            
            let spaces = [];
            let digCallback = function(x, y, v) {
                if (v) {
                    this.layer[x][y].push(new Roguelike.Wall(x, y));
                } else {           
                    g[x][y] = 1;     
                    this.layer[x][y].push(new Roguelike.Tile(x, y));                
                    spaces.push(x+","+y);
                }
            }
            digger.create(digCallback.bind(this));

        
            
            // 生成玩家
            let player = this.createTileFromSpaces(Roguelike.Player, spaces);  
            this.agents.push(player);
            this.player = player;            
            Roguelike.Main.player = player;
            player.set_shadow(0.5, 360);
            player.set_shadow();
            Game.player.toScene(6, player.x * 32 + 16, player.y * 32 + 16);
            
                        
            // 生成出口
            let exit = this.createTileFromSpaces(Roguelike.Exit, spaces);            
            this.layer[exit.x][exit.y].push(exit);        
            // 生成箱子与钥匙        
            this.isFov = true;
            let isBox = true;
            let isGuard = true;
            
            if (isBox) {
                for (var i=0;i<60;i++) {
                    let box = this.createTileFromSpaces(Roguelike.Box, spaces);                
                    box.hasKey = !i;
                    this.layer[box.x][box.y].push(box);
                }
                exit.needKey = true;
            }                    
            /*
            if (isGuard) {
                let guard = this.createTileFromSpaces(Guard, spaces);  
                this.agents.push(guard);
            } */
        }

        gen(level: number) {
            let w = this.width;
            let h = this.height;        
            let digger;
            if (level == 0) {
                digger = new ROT.Map.EllerMaze(w, h);
            } else if (level == 1) {
                digger = new ROT.Map.Digger(w, h);
            } else {
                digger = new ROT.Map.Digger(w, h);
            }

            let spaces = [];
            let digCallback = function(x, y, v) {
                if (v) {
                    this.layer[x][y].push(new Wall(x, y));
                } else {                
                    this.layer[x][y].push(new Tile(x, y));                
                    spaces.push(x+","+y);
                }
            }
            digger.create(digCallback.bind(this));
            
            // 生成玩家
            let player = this.createTileFromSpaces(Player, spaces);  
            this.agents.push(player);
            this.player = player;            
            Main.player = player;
            player.set_shadow(0.5, 360);
            player.set_shadow();

            // 生成出口
            let exit = this.createTileFromSpaces(Exit, spaces);
            this.layer[exit.x][exit.y].push(exit);        
            // 生成箱子与钥匙        

            /*let ui1 = GameUI.get(1);        
            this.isFov = !ui1.isFov.selected;
            let isBox = ui1.isBox.selected;
            let isGuard = ui1.isGuard.selected;*/

            this.isFov = true;
            let isBox = true;
            let isGuard = true;
            
            if (isBox) {
                for (var i=0;i<190;i++) {
                    let box = this.createTileFromSpaces(Box, spaces);                
                    box.hasKey = !i;
                    this.layer[box.x][box.y].push(box);
                }
                exit.needKey = true;
            }                    
            if (isGuard) {
                let guard = this.createTileFromSpaces(Guard, spaces);  
                this.agents.push(guard);
            }
        }
    }
}