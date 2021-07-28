namespace Roguelike {

    export class tiles_texture_manager {

    }

    export class uw2_tiles_texture_manager extends tiles_texture_manager {

        GRID_SIZE: number;

        constructor() {
            super();
            this.GRID_SIZE = 16;
        }

        parse_from_01_matrix(scene: any, g: any) {
            let a = scene.LayerDatas[0].tileData;
            let w = g.length;
            let h = g[0].length;

            // 需要保证当前 texID 已经加载
            // 否则是黑屏

            for (let x=0;x<w;++x) {
                for (let y=0;y<h;++y) {
                    if (g[x][y] == 0) {
                        a[x][y].x = 0;
                        a[x][y].y = 0;
                    } else {
                        a[x][y].x = 1;
                        a[x][y].y = 4;
                    }
                    a[x][y].texID = 12;
                }
            }

            for (let x=0;x<w;++x) {
                for (let y=0;y<h;++y) {

                    if (g[x][y] != 0) continue;

                    let up = Boolean(y > 0 && g[x][y-1] == 1);
                    let dn = Boolean(y < h-1 && g[x][y+1] == 1);                                        
                    let lt = Boolean(x > 0 && g[x-1][y] == 1);
                    let rt = Boolean(x < w-1 && g[x+1][y] == 1);
                                        
                    
                    if (up && dn) {
                        a[x][y].x = 2;
                        a[x][y].y = 4;
                    } if (up) {
                        a[x][y].x = 2;
                        a[x][y].y = 0;
                    } else if (dn) {
                        a[x][y].x = 7;
                        a[x][y].y = 0;
                    }

                    if (rt && lt) {
                        a[x][y].x = 3;
                        a[x][y].y = 4;
                    } else if (rt) {
                        a[x][y].x = 5;
                        a[x][y].y = 0;
                    } else if (lt) {
                        a[x][y].x = 4;
                        a[x][y].y = 0;
                    }

                    if (up && rt) {
                        a[x][y].x = 3;
                        a[x][y].y = 0;
                    } else if (up && lt) {
                        a[x][y].x = 1;
                        a[x][y].y = 0;
                    }

                    if (dn && rt) {
                        a[x][y].x = 8;
                        a[x][y].y = 0;
                    } else if (dn && lt) {
                        a[x][y].x = 6;
                        a[x][y].y = 0;
                    }

                    if (up && rt && lt) {
                        a[x][y].x = 6;
                        a[x][y].y = 4;
                    }
                    if (dn && rt && lt) {
                        a[x][y].x = 7;
                        a[x][y].y = 4;
                    }
                    if (lt && up && dn) {
                        a[x][y].x = 4;
                        a[x][y].y = 4;
                    }
                    if (rt && up && dn) {
                        a[x][y].x = 5;
                        a[x][y].y = 4;
                    }
                }
            }

            for (let x=0;x<w;++x) {
                for (let y=0;y<h;++y) {
                    a[x][y].x *= this.GRID_SIZE;
                    a[x][y].y *= this.GRID_SIZE;
                }
            }

        }
    }

}