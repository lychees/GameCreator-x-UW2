class GUI_Cargoes extends GUI_8005 {

    type: string = "";

    constructor() {
        super();
        // 标准化列表
        GUI_Manager.standardList(this.list, false);
        // 事件监听：当界面显示时
        // this.list.onCreateItem = Callback.New(GUI_Ships.onDiscoveredItem, GUI_Ships, []);
        // 事件监听：当项选中时
        this.list.on(UIList.ITEM_CLICK, this, this.onItemClick);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
    }
    //------------------------------------------------------------------------------------------------------
    // 事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 当界面显示时事件
     */

    private buyPrice(name: string) {      
        let id = Roguelike.port_id;
        let meta = hash_ports_meta_data[id+1];                        
        let market = Roguelike.hash_markets_price_details_json[meta.regionId];
        if (market[name] == null) return 0;
        return market[name][0];
    }

    private sellPrice(name: string) {
        let id = Roguelike.port_id;
        let meta = hash_ports_meta_data[id+1];                        
        let market = Roguelike.hash_markets_price_details_json[meta.regionId];
        if (market[name] == null) return 0;
        return market[name][1];
    }

    private onDisplay() {
        // 设置焦点为道具列表
        UIList.focus = this.list;
        // 刷新道具列表

        if (Roguelike.cargoes_ui_type == "adjust") {

            let standby = Roguelike.standby_cargoes;
            let ship = Roguelike.ships[Roguelike.selected_ship_id].cargoes;
                        
            for (let name in ship) {
                if (standby[name] == null) {
                    standby[name] = JSON.parse(JSON.stringify(ship[name]));                
                    standby[name].count = 0;
                }
            }
    
            for (let name in standby) {
                if (ship[name] == null) {
                    ship[name] = JSON.parse(JSON.stringify(standby[name]));                
                    ship[name].count = 0;
                }
            }

            this.update(standby);
        } else if (Roguelike.cargoes_ui_type == "buy") {
            
            let id = Roguelike.port_id;
            let meta = hash_ports_meta_data[id+1];                        
            let market = Roguelike.hash_markets_price_details_json[meta.regionId];
            
            let cargoes = Roguelike.city_cargoes;
            
            for (let name in market.Available_items) {
                cargoes[name] = {};
                cargoes[name].count = 100;
                cargoes[name].price = this.buyPrice(name);
            }
            let standby = Roguelike.standby_cargoes;

            for (let name in cargoes) {
                if (standby[name] == null) {
                    standby[name] = JSON.parse(JSON.stringify(cargoes[name]));
                    standby[name].count = 0;
                }
            }

            this.update(cargoes);
        } else if (Roguelike.cargoes_ui_type == "sell") {

            let standby = Roguelike.standby_cargoes;
            let ships = Roguelike.ships;

            for (let ship of ships) {
                for (let name in ship.cargoes) {
                    if (name == 'Total') {
                        standby.Total += ship.cargoes.Total;
                        ship.cargoes.Total = 0;
                    } else {                        
                        if (standby[name] == null) {
                            standby[name] = JSON.parse(JSON.stringify(ship.cargoes[name]));
                            standby[name].count = 0;                    
                        } 
                        standby[name].count += ship.cargoes[name].count;
                        ship.cargoes[name].count = 0;
                    }
                }
            }

            for (let name in standby) {
                if (standby[name].count == 0) {
                    delete standby[name];
                }
            }

            this.update(standby);
        }
    }

    /**
     * 当项目点击时
     */
    private onItemClick() {        
        Roguelike.selected_cargo_name = this.list.selectedItem.name;
        GameAudio.playSE(ClientWorld.data.selectSE);
        
        if (Roguelike.cargoes_ui_type == "adjust") {
            GameUI.show(8006);        
        } else if (Roguelike.cargoes_ui_type == "buy") {
            GameUI.show(8007);
        } else if (Roguelike.cargoes_ui_type == "sell") {
            GameUI.show(8008);
        }
    }

    private update(cargoes: any) {

        //console.log(Game.player);
        //console.log(ProjectPlayer);
        
        // 遍历货物
        let index = 0;
        
        let standby = Roguelike.standby_cargoes;
        let ship = Roguelike.ships[Roguelike.selected_ship_id].cargoes;
        
        let arr = [];
         
        for (let name in cargoes) {
            
            if (name == 'Total') continue;            
                        
            const i = new ListItem_1011;                        
            index += 1;
            i.no = index.toString();                        
            i.itemName = i18n.chinese[name];

            i.icon = `asset/image/_uwol/cargo/${name.toLowerCase()}.png`;
            i.price = cargoes.price;

            if (Roguelike.cargoes_ui_type == "adjust") {
                if (ship[name].count == 0 && cargoes[name].count == 0) continue;
                i.dateStr = "库存:" + standby[name].count + "  ";
                i.dateStr += "在舰:" + ship[name].count;
                i.description = "";
            } else if (Roguelike.cargoes_ui_type == "buy") {
                i.dateStr = "库存:" + cargoes[name].count + "  ";
                i.dateStr += "已采购:" + standby[name].count + " ";
                i.dateStr += "价格:" + this.buyPrice(name) + " ";
                i.description = "";
            } else if (Roguelike.cargoes_ui_type == "sell") {
                i.dateStr = "库存:" + cargoes[name].count + "  ";                
                i.dateStr += "价格:" + this.sellPrice(name) + " ";
                i.description = "";
            }
            
            i.name = name;
            arr.push(i); // 居然直接 push 不行？
        });

        arr.sort(function(a, b){
            return a.price - b.price;
        }); 

        this.list.items = arr;
    }
}