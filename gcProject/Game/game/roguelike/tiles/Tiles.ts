namespace Roguelike {
    export class Tile {
        x: number;
        y: number;
        ch: string;
        color: string;
        passable: boolean;
        lightpass: boolean;

        constructor(_x:number=0, _y:number=0, _ch:string="  ", _color="#fff") {
            this.x = _x;
            this.y = _y;
            this.ch = _ch;
            this.color = _color;  
            this.passable = true;
            this.lightpass = true;
        }
        enter() {
        }
        touch() {        
        }
        draw() {
            Main.display.draw(this.x, this.y, this.ch, this.color);
        }
        draw_with_shadow(shadow: number) {
            Main.display.draw(this.x, this.y, this.ch, mix(this.color, shadow));
        }
    }

    export class Wall extends Tile {
        constructor(_x:number=0, _y:number=0, _ch:string="墻", _color="#fff") {
            super(_x,_y,_ch,_color);
            this.passable = false;
            this.lightpass = false;
        }
    }

    export class Exit extends Tile {
        x: number;
        y: number;
        needKey: boolean;
        constructor(_x:number=0, _y:number=0, _ch:string="門", _color="#aaf") {
            super(_x,_y,_ch,_color);
            this.needKey = false;
        }

        enter(who: any) {
            if (!this.needKey || who.hasKey) {
                alert("你找到了出口!");
                Main.engine.lock();
                Main.back_to_title();
            } else {
                alert("锁上了!");
            }
        }
    }

    export class Box extends Tile {
        hasKey: boolean;
        constructor(_x:number=0, _y:number=0, _ch:string="箱", _color="#ffa") {
            super(_x,_y,_ch,_color);
            this.hasKey = false;        
        }
        enter(p: any) {
            if (this.hasKey == true) {
                alert("你发现了钥匙！");
                this.hasKey = false;
                p.hasKey = true;
                this.color = "#aaa";
            } else {
                alert("这个箱子是空的");
                this.color = "#aaa";
            }
        }
    }
}