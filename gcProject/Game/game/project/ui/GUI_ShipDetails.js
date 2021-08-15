




var GUI_ShipDetails = (function (_super) {
    __extends(GUI_ShipDetails, _super);
    function GUI_ShipDetails() {
        _super.call(this);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
    }
    GUI_ShipDetails.prototype.onDisplay = function () {
        console.log(Roguelike.selected_ship);
        this.icon.image = Roguelike.selected_ship.icon;
        this.shipName.text = Roguelike.selected_ship.itemName;
    };
    return GUI_ShipDetails;
}(GUI_8002));
//# sourceMappingURL=GUI_ShipDetails.js.map