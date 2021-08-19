




var GUI_ShipDetails = (function (_super) {
    __extends(GUI_ShipDetails, _super);
    function GUI_ShipDetails() {
        _super.call(this);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
    }
    GUI_ShipDetails.prototype.onDisplay = function () {
        var ship = Roguelike.ships[Roguelike.selected_ship_id];
        if (Roguelike.ships_ui_type == "buy")
            ship = Roguelike.selected_ship;
        this.icon.image = "asset/image/_uw2/ships/" + ship.type.toLowerCase() + ".png";
        this.ship_name.text = ship.name;
        this.type.text = i18n.chinese[ship.type];
        this.price.text = ship.price;
        this.durability.text = ship.durability + '/' + ship.max_durability;
        this.crew.text = ship.crew + '/' + ship.max_crew;
        this.capacity.text = ship.cargoes_total() + '/' + ship.capacity;
        this.sailing_power.text = ship.sailing_power;
    };
    return GUI_ShipDetails;
}(GUI_8002));
//# sourceMappingURL=GUI_ShipDetails.js.map