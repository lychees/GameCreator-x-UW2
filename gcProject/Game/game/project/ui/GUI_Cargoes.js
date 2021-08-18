




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
        Roguelike.selected_cargo = this.list.selectedItem.info;
        GameAudio.playSE(ClientWorld.data.selectSE);
        GameUI.show(8006);
    };
    GUI_Cargoes.prototype.refreshItems = function (state) {
        if (state != 0)
            return;
        var index = 0;
        var cargoes = JSON.parse(JSON.stringify(Roguelike.standby_cargoes));
        for (var name in Roguelike.ships[Roguelike.selected_ship_id].cargoes) {
            if (cargoes[name] == null) {
                cargoes[name] = JSON.parse(JSON.stringify(Roguelike.ships[Roguelike.selected_ship_id].cargoes[name]));
                cargoes[name].ship_count = cargoes[name].count;
                cargoes[name].count = 0;
            }
            else {
                cargoes[name].ship_count = Roguelike.ships[Roguelike.selected_ship_id].cargoes[name].count;
            }
        }
        var arr = [];
        for (var name in cargoes) {
            if (name == 'Total')
                continue;
            var cargo = cargoes[name];
            if (cargo.ship_count == null)
                cargo.ship_count = 0;
            var i = new ListItem_1011;
            index += 1;
            i.no = index.toString();
            i.itemName = i18n.chinese[name];
            i.dateStr = "库存:" + cargo.count + "  ";
            i.dateStr += "在舰:" + cargo.ship_count;
            i.description = "";
            cargo.name = name;
            i.info = cargo;
            arr.push(i);
        }
        ;
        this.list.items = arr;
    };
    return GUI_Cargoes;
}(GUI_8005));
//# sourceMappingURL=GUI_Cargoes.js.map