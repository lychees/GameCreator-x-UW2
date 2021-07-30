namespace Roguelike {

    class Auto {
        a: any;
        ox: number;
        oy: number;
        texID: number;

        constructor() {
            this.a = new Array(16);
            for (let i=0;i<16;++i) {
                this.a[i] = new Array(2);
                for (let x=0;x<2;++x) {
                    this.a[i][x] = new Array(2);
                    for (let y=0;y<2;++y) {
                        this.a[i][x][y] = {
                            "x": 0,
                            "y": 0,
                        }
                    }
                }
            }

            this.a[15][0][0] = {
                "x": 1,
                "y": 3,
            } 
            this.a[15][0][1] = {
                "x": 1,
                "y": 4,
            }
            this.a[15][1][0] = {
                "x": 2,
                "y": 3,
            }
            this.a[15][1][1] = {
                "x": 2,
                "y": 4,
            }  

            this.a[0][0][0] = {
                "x": 0,
                "y": 0,
            } 
            this.a[0][0][1] = {
                "x": 0,
                "y": 1,
            }
            this.a[0][1][0] = {
                "x": 1,
                "y": 0,
            }
            this.a[0][1][1] = {
                "x": 1,
                "y": 1,
            }
            
            for (let i=1;i<16;++i) {
                for (let x=0;x<2;++x) {
                    for (let y=0;y<2;++y) {
                        this.a[i][x][y] = {
                            "x": this.a[15][x][y].x,
                            "y": this.a[15][x][y].y,
                        }
                    }
                }
            }           

            let rt = 1;
            let lt = 2;
            let dn = 4;
            let up = 8;

            let idx;
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

            this.a[15-dn][0][0].y += 1;
            this.a[15-dn][0][1].y += 1;
            this.a[15-dn][1][0].y += 1;
            this.a[15-dn][1][1].y += 1;

            this.a[15-up][0][0].y -= 1;
            this.a[15-up][0][1].y -= 1;
            this.a[15-up][1][0].y -= 1;
            this.a[15-up][1][1].y -= 1;

            idx = 15-rt-dn;
            this.a[idx][0][0].x += 1;
            this.a[idx][0][1].x += 1;
            this.a[idx][1][0].x += 1;
            this.a[idx][1][1].x += 1;    
            this.a[idx][0][0].y += 1;
            this.a[idx][0][1].y += 1;
            this.a[idx][1][0].y += 1;
            this.a[idx][1][1].y += 1;

            idx = 15-rt-up;
            this.a[idx][0][0].x += 1;
            this.a[idx][0][1].x += 1;
            this.a[idx][1][0].x += 1;
            this.a[idx][1][1].x += 1;    
            this.a[idx][0][0].y -= 1;
            this.a[idx][0][1].y -= 1;
            this.a[idx][1][0].y -= 1;
            this.a[idx][1][1].y -= 1;

            idx = 15-lt-dn;
            this.a[idx][0][0].x -= 1;
            this.a[idx][0][1].x -= 1;
            this.a[idx][1][0].x -= 1;
            this.a[idx][1][1].x -= 1;    
            this.a[idx][0][0].y += 1;
            this.a[idx][0][1].y += 1;
            this.a[idx][1][0].y += 1;     
            this.a[idx][1][1].y += 1;

            idx = 15-lt-up;
            this.a[idx][0][0].x -= 1;
            this.a[idx][0][1].x -= 1;
            this.a[idx][1][0].x -= 1;
            this.a[idx][1][1].x -= 1;    
            this.a[idx][0][0].y -= 1;
            this.a[idx][0][1].y -= 1;
            this.a[idx][1][0].y -= 1;     
            this.a[idx][1][1].y -= 1;           

            idx = 15-dn-up;
            this.a[idx][0][0].y -= 1;
            this.a[idx][0][1].y += 1;
            this.a[idx][1][0].y -= 1;
            this.a[idx][1][1].y += 1;   

            idx = 15-lt-rt;
            this.a[idx][0][0].x -= 1;
            this.a[idx][0][1].x -= 1;
            this.a[idx][1][0].x += 1;
            this.a[idx][1][1].x += 1;

            this.a[1][0][0] = {
                "x": 0,
                "y": 2,
            }
            this.a[1][0][1] = {
                "x": 0,
                "y": 5,
            }
            this.a[1][1][0] = {
                "x": 1,
                "y": 2,
            }
            this.a[1][1][1] = {
                "x": 1,
                "y": 5,
            }

            this.a[2][0][0] = {
                "x": 2,
                "y": 2,
            }
            this.a[2][0][1] = {
                "x": 2,
                "y": 5,
            }
            this.a[2][1][0] = {
                "x": 3,
                "y": 2,
            }
            this.a[2][1][1] = {
                "x": 3,
                "y": 5,
            }

            this.a[4][0][0] = {
                "x": 0,
                "y": 2,
            }
            this.a[4][0][1] = {
                "x": 0,
                "y": 3,
            }
            this.a[4][1][0] = {
                "x": 3,
                "y": 2,
            }
            this.a[4][1][1] = {
                "x": 3,
                "y": 3,
            }

            this.a[8][0][0] = {
                "x": 0,
                "y": 4,
            }
            this.a[8][0][1] = {
                "x": 0,
                "y": 5,
            }
            this.a[8][1][0] = {
                "x": 3,
                "y": 4,
            }
            this.a[8][1][1] = {
                "x": 3,
                "y": 5,
            }   
        }

        fill(a:any, g:any, x: number, y: number) {

            let i = 0;
            let up = g[x][y-1] != null && g[x][y] == g[x][y-1];
            let dn = g[x][y-1] != null && g[x][y] == g[x][y+1];
            let lt = g[x-1] != null && g[x][y] == g[x-1][y];
            let rt = g[x+1] != null && g[x][y] == g[x+1][y];

            i *= 2; if (up) i += 1;
            i *= 2; if (dn) i += 1;
            i *= 2; if (lt) i += 1;
            i *= 2; if (rt) i += 1;      
            // i = 15;

            for (let ox=0;ox<2;++ox) {
                for (let oy=0;oy<2;++oy) {
                    let xx = x+x+ox;
                    let yy = y+y+oy;
                    a[xx][yy].x = this.a[i][ox][oy].x;
                    a[xx][yy].y = this.a[i][ox][oy].y;
                    a[xx][yy].texID = this.texID;
                }
            }
            
            
            if (up && lt) {
                let xx = x+x+0, yy = y+y+0;
                if (g[x-1] != null && g[x-1][y-1] != null && g[x-1][y-1] != g[x][y]) {
                    a[xx][yy].x = 2;
                    a[xx][yy].y = 0;
                }
            }
            if (up && rt) {
                let xx = x+x+1, yy = y+y+0;
                if (g[x+1] != null && g[x+1][y-1] != null && g[x+1][y-1] != g[x][y]) {
                    a[xx][yy].x = 3;
                    a[xx][yy].y = 0;
                }
            } 
            
            if (dn && lt) {
                let xx = x+x+0, yy = y+y+1;
                if (g[x-1] != null && g[x-1][y+1] != null && g[x-1][y+1] != g[x][y]) {
                    a[xx][yy].x = 2;
                    a[xx][yy].y = 1;
                }
            }
            if (dn && rt) {
                let xx = x+x+1, yy = y+y+1;
                if (g[x+1] != null && g[x+1][y+1] != null && g[x+1][y+1] != g[x][y]) {
                    a[xx][yy].x = 3;
                    a[xx][yy].y = 1;
                }
            }
            

        }
    }

    export class RMVA_tiles_texture_manager {

        GRID_SIZE: number;
        constructor() {
            this.GRID_SIZE = 16;
        }

        parse_from_01_matrix(scene: any, g: any) {



            let a = scene.LayerDatas[0].tileData;
            let w = g.length;
            let h = g[0].length;

            let Grass = new Auto();
            Grass.texID = 42;
            let Ocean = new Auto();
            Ocean.texID = 41;


            // 需要保证当前 texID 已经加载
            // 否则是黑屏
            for (let x=0;x<w;++x) {
                for (let y=0;y<h;++y) {
                    if (g[x][y] == 1) {
                        Grass.fill(a, g, x, y);

                    } else {
                        Ocean.fill(a, g, x, y);
                    }                                    
                }
            }

            for (let x=0;x<2*w;++x) {
                for (let y=0;y<2*h;++y) {
                    a[x][y].x *= this.GRID_SIZE;
                    a[x][y].y *= this.GRID_SIZE;
                }
            }
        }
    }

}