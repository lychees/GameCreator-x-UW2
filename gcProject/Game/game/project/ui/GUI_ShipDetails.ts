/**
 * 存档界面
 * Created by 黑暗之神KDS on 2020-09-15 14:01:31.
 */
class GUI_ShipDetails extends GUI_8002 {
    constructor() {
        super();
        // 事件监听：当界面显示时
        this.on(EventObject.DISPLAY, this, this.onDisplay);
    }
    //------------------------------------------------------------------------------------------------------
    // 事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 当界面显示时事件
     */
    private onDisplay() {
        console.log(Roguelike.selected_ship);
        this.icon.image = Roguelike.selected_ship.icon;
        this.shipName.text = Roguelike.selected_ship.itemName;
    }
}