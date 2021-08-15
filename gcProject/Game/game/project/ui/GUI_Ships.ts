/**
 * 存档界面
 * Created by 黑暗之神KDS on 2020-09-15 14:01:31.
 */
class GUI_ships extends GUI_8001 {
    constructor() {
        super();
        // 标准化列表
        GUI_Manager.standardList(this.list, false);
        // 事件监听：当界面显示时
        this.list.onCreateItem = Callback.New(GUI_ships.onDiscoveredItem, GUI_ships, []);
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

    static onDiscoveredItem(ui: GUI_1011, data: ListItem_1011, index: number) {
        AssetManager.loadImage('asset/image/_uw2/discoveries/discoveries_and_items.png', Callback.New((tex: Texture) => {
            // 取样从图中的0,0中取得50x50尺寸的切图
            const meta = Roguelike.villages_json[parseInt(data.no)];
            const g = new Graphics();
            g.fillTexture(tex, 0, 0, 50, 50, 'repeat', new Point(-49*(meta.image_x-1), -49*(meta.image_y-1)));
            
            const sp = new Sprite();
            sp.graphics = g;
            ui.icon.addChild(sp);
        }
    }

    private refreshItems(state: number) {
        if (state != 0) return;
        const arr = [];
        // 遍历玩家自定义数据-背包
        Object.keys(Roguelike.discoveries).forEach((id) => {
            // 创建对应的背包物品项数据，该项数据由系统自动生成
            const d = new ListItem_1011;
            const meta = Roguelike.discoveries[id];
            d.no = (parseInt(id) + 1).toString();
            d.dateStr = meta.date;
            d.itemName = i18n.chinese[meta.name]; // 设置名称
            d.description = (i18n.chinese[meta.description]).slice(0, 43);
            if (d.description.length === 43) d.description += '......';
            arr.push(d);
        });
        // 如果没有道具的话：追加一个空项
        if (Object.keys(Roguelike.discoveries).length === 0) {
            const emptyItem = new ListItem_1011;
            emptyItem.itemName = "还没有发现物";
            emptyItem.no = "0";
            emptyItem.dateStr = "----/----";
        }
        // 刷新列表
        this.list.items = arr;
    }
}