




var GUI_ShipDetails = (function (_super) {
    __extends(GUI_ShipDetails, _super);
    function GUI_ShipDetails() {
        _super.call(this);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
    }
    GUI_ShipDetails.prototype.onDisplay = function () {
        this.icon.image = Roguelike.selected_ship.icon;
        this.ship_name.text = Roguelike.selected_ship.info.name;
        this.type.text = i18n.chinese[Roguelike.selected_ship.info.type];
        this.price.text = Roguelike.selected_ship.info.price;
        this.durability.text = Roguelike.selected_ship.info.durability + '/' + Roguelike.selected_ship.info.max_durability;
        this.crew.text = Roguelike.selected_ship.info.crew + '/' + Roguelike.selected_ship.info.max_crew;
        this.capacity.text = Roguelike.selected_ship.info.cargoes.total + '/' + Roguelike.selected_ship.info.capacity;
        this.sailing_power.text = Roguelike.selected_ship.info.sailing_power;
    };
    return GUI_ShipDetails;
}(GUI_8002));
//# sourceMappingURL=GUI_ShipDetails.js.map