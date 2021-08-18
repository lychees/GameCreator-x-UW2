




var GUI_Cargoes = (function (_super) {
    __extends(GUI_Cargoes, _super);
    function GUI_Cargoes() {
        _super.call(this);
        GUI_Manager.standardList(this.list, false);
        this.list.on(UIList.ITEM_CLICK, this, this.onItemClick);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
    }
    GUI_Cargoes.prototype.onDisplay = function () {
        UIList.focus = this.list;
        this.refreshItems(0);
    };
    GUI_Cargoes.prototype.onItemClick = function () {
        Roguelike.selected_cargo_name = this.list.selectedItem.name;
        GameAudio.playSE(ClientWorld.data.selectSE);
        GameUI.show(8006);
    };
    GUI_Cargoes.prototype.refreshItems = function (state) {
        if (state != 0)
            return;
        var index = 0;
        var standby = Roguelike.standby_cargoes;
        var ship = Roguelike.ships[Roguelike.selected_ship_id].cargoes;
        for (var name in ship) {
            if (standby[name] == null) {
                standby[name] = JSON.parse(JSON.stringify(ship[name]));
                standby[name].count = 0;
            }
        }
        for (var name in standby) {
            if (ship[name] == null) {
                ship[name] = JSON.parse(JSON.stringify(standby[name]));
                ship[name].count = 0;
            }
        }
        var arr = [];
        for (var name in standby) {
            if (name == 'Total')
                continue;
            if (ship[name].count == 0 && standby[name].count == 0)
                continue;
            var i = new ListItem_1011;
            index += 1;
            i.no = index.toString();
            i.itemName = i18n.chinese[name];
            i.dateStr = "库存:" + standby[name].count + "  ";
            i.dateStr += "在舰:" + ship[name].count;
            i.description = "";
            i.name = name;
            arr.push(i);
        }
        ;
        this.list.items = arr;
    };
    return GUI_Cargoes;
}(GUI_8005));
//# sourceMappingURL=GUI_Cargoes.js.map