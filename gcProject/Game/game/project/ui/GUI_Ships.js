




var GUI_Ships = (function (_super) {
    __extends(GUI_Ships, _super);
    function GUI_Ships() {
        _super.call(this);
        GUI_Manager.standardList(this.list, false);
        this.list.on(UIList.ITEM_CLICK, this, this.onItemClick);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
    }
    GUI_Ships.prototype.onDisplay = function () {
        UIList.focus = this.list;
        this.update();
    };
    GUI_Ships.prototype.onItemClick = function () {
        var selectedItem = this.list.selectedItem;
        Roguelike.selected_ship_id = Number(selectedItem.no);
        GameAudio.playSE(ClientWorld.data.selectSE);
        GameUI.show(8002);
        if (Roguelike.in_crew_menu == true) {
        }
        else {
            GameUI.show(8003);
        }
    };
    GUI_Ships.prototype.update = function () {
        var arr = Roguelike.ships.map(function (ship, index) {
            var d = new ListItem_1011;
            d.no = index.toString();
            d.dateStr = "----/----";
            d.icon = "asset/image/_uw2/ships/" + ship.type.toLowerCase() + ".png";
            d.itemName = i18n.chinese[ship.name];
            d.description = "\n\u4EF7\u683C\uFF1A" + ship.price;
            return d;
        });
        if (Object.keys(Roguelike.discoveries).length === 0) {
            var emptyItem = new ListItem_1011;
            emptyItem.itemName = "还没有船只";
            emptyItem.no = "0";
            emptyItem.dateStr = "----/----";
        }
        this.list.items = arr;
    };
    return GUI_Ships;
}(GUI_8001));
//# sourceMappingURL=GUI_Ships.js.map