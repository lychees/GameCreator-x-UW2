namespace Roguelike {
    export class Creature extends Roguelike.Tile {
        d: number; // direction  
        fv: number; // field_of_vision

        hp: number; HP: number;
        mp: number; MP: number;
        sp: number; SP: number;

        str: number; dex: number; con: number;
        int: number; wis: number; cha: number;

        constructor(_x:number=0, _y:number=0, _ch:string="c", _color="#fff") {
            super(_x,_y,_ch,_color);
            this.d = 0; this.fv = 6; 
            
            this.hp = 0; this.HP = 0;
            this.mp = 0; this.MP = 0;
            this.sp = 0; this.SP = 0;

            this.str = 0; this.dex = 0; this.con = 0;
            this.int = 0; this.wis = 0; this.cha = 0;
        }

        getSpeed() {
            return 100;
        }
    
        set_shadow(s:number=0, angle:number=90) {
            let fov = new ROT.FOV.RecursiveShadowcasting(function(x, y) {
                return Roguelike.Main.map.canLightPass(x, y);
            });
            if (angle == 90) {
                fov.compute90(this.x, this.y, this.fv, this.d, function(x, y, r, visibility) {
                    Roguelike.Main.map.shadow[x][y] = s;
                });
            } else {
                fov.compute(this.x, this.y, this.fv, function(x, y, r, visibility) {
                    Roguelike.Main.map.shadow[x][y] = s;
                });
            }
        }
        draw() {
            //if (Roguelike.Main.map.shadow[this.x][this.y] == 0) {        
            Roguelike.Main.display.draw(this.x, this.y, this.ch, this.color);
            //}
        }    
    }

    export class Player extends Creature {

        constructor(_x:number=0, _y:number=0, _ch:string="我", _color="#ff0") {
            super(_x,_y,_ch,_color);
        }

        act() {
            Roguelike.Main.engine.lock();
            document.addEventListener("keydown", this);
        }
        handleEvent(e) {
            
            var code = e.keyCode;

            // Enter
            if (code == ROT.KEYS.VK_SPACE || code == ROT.KEYS.VK_ENTER) {            
                Roguelike.Main.map.enter(this);
                document.removeEventListener("keydown", this);
                Roguelike.Main.engine.unlock();        
                return;
            }

            // Move
            var keyMap = {};
            keyMap[ROT.KEYS.VK_UP] = keyMap[ROT.KEYS.VK_W] = 0;     
            keyMap[ROT.KEYS.VK_RIGHT] = keyMap[ROT.KEYS.VK_D] = 2;      
            keyMap[ROT.KEYS.VK_DOWN] = keyMap[ROT.KEYS.VK_S] = 4;        
            keyMap[ROT.KEYS.VK_LEFT] = keyMap[ROT.KEYS.VK_A] = 6;    
            if (!(code in keyMap)) { return; }
            
            let d = keyMap[code];  
            let dx = ROT.DIRS[8][d][0];
            let dy = ROT.DIRS[8][d][1];
            let x = this.x;
            let y = this.y;
            let xx = x + dx;
            let yy = y + dy;

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
        }
    }

    export class Guard extends Creature {
        constructor(_x:number=0, _y:number=0, _ch:string="衛", _color="#f00") {
            super(_x,_y,_ch,_color);
        }
        act() {

            var astar = new ROT.Path.AStar(Roguelike.Main.player.x, Roguelike.Main.player.y, function(x, y) {
                return Roguelike.Main.map.isPassable(x, y); 
            }, {
                topology:4
            });

            var path = [];
            astar.compute(this.x, this.y, function(x, y) {
                path.push([x, y]);
            });
            
            path.shift();
            if (path.length <= 1) {
                Roguelike.Main.engine.lock();
                alert("你被捉住了！");                        
                Roguelike.Main.back_to_title();
            } else {
                this.x = path[0][0];
                this.y = path[0][1];
                Roguelike.Main.map.draw();
            }     
        }
    }
}