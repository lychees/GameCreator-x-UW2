class GUI_Cargoes extends GUI_8005 {
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
    private onDisplay() {
        // 设置焦点为道具列表
        UIList.focus = this.list;
        // 刷新道具列表
        this.refreshItems(0);
    }

    /**
     * 当项目点击时
     */
    private onItemClick() {        
        Roguelike.selected_cargo = this.list.selectedItem.info;
        GameAudio.playSE(ClientWorld.data.selectSE);
        GameUI.show(8006);        
    }

    private refreshItems(state: number) {
        if (state != 0) return;
        // 遍历货物
        let index = 0;

        // 浅拷贝
        // let cargoes = Object.assign({}, Roguelike.standby_cargoes);
        // 深拷贝
        let cargoes = JSON.parse(JSON.stringify(Roguelike.standby_cargoes));
        
        for (let name in Roguelike.ships[Roguelike.selected_ship_id].cargoes) {
            if (cargoes[name] == null) {
                cargoes[name] = JSON.parse(JSON.stringify(Roguelike.ships[Roguelike.selected_ship_id].cargoes[name]));
                cargoes[name].ship_count = cargoes[name].count;
                cargoes[name].count = 0 ;
            } else {
                cargoes[name].ship_count = Roguelike.ships[Roguelike.selected_ship_id].cargoes[name].count;
            }
        }

        let arr = [];
         
        for (let name in cargoes) {
            if (name == 'Total') continue;
            let cargo = cargoes[name];        
            if (cargo.ship_count == null) cargo.ship_count = 0;
            
            const i = new ListItem_1011;            
            index += 1;
            i.no = index.toString();
                        
            i.itemName = i18n.chinese[name];
            i.dateStr = "库存:" + cargo.count + "  ";
            i.dateStr += "在舰:" + cargo.ship_count;

            i.description = "";
            cargo.name = name;
            i.info = cargo;
            arr.push(i); // 居然直接 push 不行？
        });

        this.list.items = arr;

        /*
        const arr = Roguelike.standby_cargoes.map((cargo: any, key: number) => {
            // 创建对应的背包物品项数据，该项数据由系统自动生成
            const d = new ListItem_1011;
            index++;
            d.no = index.toString();
            d.dateStr = "库存:" + cargo.count;
            //d.icon = `asset/image/_uw2/ships/${ship.type.toLowerCase()}.png`;            
            d.itemName = i18n.chinese[key]; // 设置名称
            d.description = `\n买入价：${cargo.buy_price}`;
            d.cargo = cargo;
            return d;
        });*/
        /*
        // 如果没有道具的话：追加一个空项
        if (Object.keys(Roguelike.discoveries).length === 0) {
            const emptyItem = new ListItem_1011;
            emptyItem.itemName = "还没有货物";
            emptyItem.no = "0";
            emptyItem.dateStr = "----/----";
        }
        */
        // 刷新列表
        // this.list.items = arr;
    }
}