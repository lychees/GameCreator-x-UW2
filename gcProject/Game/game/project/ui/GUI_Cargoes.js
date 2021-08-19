




var GUI_Cargoes = (function (_super) {
    __extends(GUI_Cargoes, _super);
    function GUI_Cargoes() {
        _super.call(this);
        this.type = "";
        GUI_Manager.standardList(this.list, false);
        this.list.on(UIList.ITEM_CLICK, this, this.onItemClick);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
    }
    GUI_Cargoes.prototype.onDisplay = function () {
        UIList.focus = this.list;
        if (Roguelike.cargoes_ui_type == "adjust") {
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
            this.update(standby);
        }
        else if (Roguelike.cargoes_ui_type == "buy") {
            var standby = Roguelike.standby_cargoes;
            for (var name in Roguelike.city_cargoes) {
                if (standby[name] == null) {
                    standby[name] = JSON.parse(JSON.stringify(Roguelike.city_cargoes[name]));
                    standby[name].count = 0;
                }
            }
            this.update(Roguelike.city_cargoes);
        }
        else if (Roguelike.cargoes_ui_type == "sell") {
            var standby = Roguelike.standby_cargoes;
            var ships = Roguelike.ships;
            for (var _i = 0, ships_1 = ships; _i < ships_1.length; _i++) {
                var ship = ships_1[_i];
                for (var name in ship.cargoes) {
                    if (name == 'Total') {
                        standby.Total += ship.cargoes.Total;
                        ship.cargoes.Total = 0;
                    }
                    else {
                        if (standby[name] == null) {
                            standby[name] = JSON.parse(JSON.stringify(ship.cargoes[name]));
                            standby[name].count = 0;
                        }
                        standby[name].count += ship.cargoes[name].count;
                        ship.cargoes[name].count = 0;
                    }
                }
            }
            this.update(standby);
        }
    };
    GUI_Cargoes.prototype.onItemClick = function () {
        Roguelike.selected_cargo_name = this.list.selectedItem.name;
        GameAudio.playSE(ClientWorld.data.selectSE);
        if (Roguelike.cargoes_ui_type == "adjust") {
            GameUI.show(8006);
        }
        else if (Roguelike.cargoes_ui_type == "buy") {
            GameUI.show(8007);
        }
        else if (Roguelike.cargoes_ui_type == "sell") {
            GameUI.show(8008);
        }
    };
    GUI_Cargoes.prototype.update = function (cargoes) {
        console.log(Game.player.data);
        var index = 0;
        var standby = Roguelike.standby_cargoes;
        var ship = Roguelike.ships[Roguelike.selected_ship_id].cargoes;
        var arr = [];
        for (var name in cargoes) {
            if (name == 'Total')
                continue;
            var i = new ListItem_1011;
            index += 1;
            i.no = index.toString();
            i.itemName = i18n.chinese[name];
            if (Roguelike.cargoes_ui_type == "adjust") {
                if (ship[name].count == 0 && cargoes[name].count == 0)
                    continue;
                i.dateStr = "库存:" + standby[name].count + "  ";
                i.dateStr += "在舰:" + ship[name].count;
                i.description = "";
            }
            else if (Roguelike.cargoes_ui_type == "buy") {
                i.dateStr = "库存:" + cargoes[name].count + "  ";
                i.dateStr += "已采购:" + standby[name].count + " ";
                i.dateStr += "价格:" + cargoes[name].price + " ";
                i.description = "";
            }
            else if (Roguelike.cargoes_ui_type == "sell") {
                i.dateStr = "库存:" + cargoes[name].count + "  ";
                i.dateStr += "价格:" + (cargoes[name].price+10) + " ";
                i.description = "";
            }
            i.name = name;
            arr.push(i);
        }
        ;
        this.list.items = arr;
    };
    return GUI_Cargoes;
}(GUI_8005));
//# sourceMappingURL=GUI_Cargoes.js.map