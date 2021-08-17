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
        this.icon.image = Roguelike.selected_ship.icon;
        this.ship_name.text = Roguelike.selected_ship.info.name;
        this.type.text = i18n.chinese[Roguelike.selected_ship.info.type];
        this.price.text = Roguelike.selected_ship.info.price;

        this.durability.text = Roguelike.selected_ship.info.durability + '/' + Roguelike.selected_ship.info.max_durability;
        this.crew.text = Roguelike.selected_ship.info.crew + '/' + Roguelike.selected_ship.info.max_crew;
        this.capacity.text = Roguelike.selected_ship.info.cargoes.total + '/' + Roguelike.selected_ship.info.capacity;

        this.sailing_power.text = Roguelike.selected_ship.info.sailing_power;
    }
}