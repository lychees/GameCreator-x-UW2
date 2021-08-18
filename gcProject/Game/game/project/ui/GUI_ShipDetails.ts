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
        let ship = Roguelike.ships[Roguelike.selected_ship_id];
        this.icon.image = `asset/image/_uw2/ships/${ship.type.toLowerCase()}.png`;
        this.ship_name.text = ship.name;
        this.type.text = i18n.chinese[ship.type];
        this.price.text = ship.price;

        this.durability.text = ship.durability + '/' + ship.max_durability;
        this.crew.text = ship.crew + '/' + ship.max_crew;
        this.capacity.text = ship.cargoes.Total + '/' + ship.capacity;

        this.sailing_power.text = ship.sailing_power;
    }
}