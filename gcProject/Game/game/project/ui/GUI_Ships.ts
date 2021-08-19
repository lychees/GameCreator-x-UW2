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
        this.update();
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
        Roguelike.selected_ship = selectedItem.ship;
        GameAudio.playSE(ClientWorld.data.selectSE);
        GameUI.show(8002);
        if (Roguelike.ships_ui_type == "buy") {
            GameCommand.startCommonCommand(0005);
        } else {
            GameUI.show(8003);
        }
    }

    private update() {
        let arr = [];
        if (Roguelike.ships_ui_type == "buy") {            
            for (let name in Roguelike.hash_ship_name_to_attributes_json) {                
                let ship = new Roguelike.Ship(name);
                arr.push(ship.list_item());
            }
        } else {        
            for (let ship of Roguelike.ships) {
                arr.push(ship.list_item());
            }
        }

        arr.sort(function(a, b){
            return a.price - b.price;
        });
        
        this.list.items = arr;
    }
}