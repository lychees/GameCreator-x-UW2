class GUI_Ships extends GUI_8001 {
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
        // 打开8002号界面
        // 额嗯，为了知道你打开了哪艘船，所以需要一个临时变量。
        // 这里暂且用到了这个，到时候你可以改。
        const selectedItem = this.list.selectedItem;                
        Roguelike.selected_ship_id = Number(selectedItem.no);
        GameAudio.playSE(ClientWorld.data.selectSE);
        GameUI.show(8002);
        if (Roguelike.in_crew_menu == true) {

        } else {
            GameUI.show(8003);
        }
    }

    // static onDiscoveredItem(ui: GUI_1011, data: ListItem_1011, index: number) {
    //     AssetManager.loadImage('asset/image/_uw2/discoveries/discoveries_and_items.png', Callback.New((tex: Texture) => {
    //         // 取样从图中的0,0中取得50x50尺寸的切图
    //         const meta = Roguelike.villages_json[parseInt(data.no)];
    //         const g = new Graphics();
    //         g.fillTexture(tex, 0, 0, 50, 50, 'repeat', new Point(-49*(meta.image_x-1), -49*(meta.image_y-1)));
            
    //         const sp = new Sprite();
    //         sp.graphics = g;
    //         ui.icon.addChild(sp);
    //     }
    // }

    private refreshItems(state: number) {
        if (state != 0) return;
        // 遍历玩家自定义数据-背包
        
        const arr = Roguelike.ships.map((ship: any, index: number) => {
            // 创建对应的背包物品项数据，该项数据由系统自动生成
            const d = new ListItem_1011;
            d.no = index.toString();
            d.dateStr = "----/----";
            d.icon = `asset/image/_uw2/ships/${ship.type.toLowerCase()}.png`;            
            d.itemName = i18n.chinese[ship.name]; // 设置名称
            d.description = `\n价格：${ship.price}`;
            return d;
        });
        // 如果没有道具的话：追加一个空项
        if (Object.keys(Roguelike.discoveries).length === 0) {
            const emptyItem = new ListItem_1011;
            emptyItem.itemName = "还没有船只";
            emptyItem.no = "0";
            emptyItem.dateStr = "----/----";
        }
        // 刷新列表
        this.list.items = arr;
    }
}