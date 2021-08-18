




var GUI_Cargoes_buy = (function (_super) {
    __extends(GUI_Cargoes_buy, _super);
    function GUI_Cargoes_buy() {
        _super.call(this);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        this.subNumBtn.on(EventObject.CLICK, this, this.onSubButtonClick);
        this.addNumBtn.on(EventObject.CLICK, this, this.onAddButtonClick);
        this.maxNumBtn.on(EventObject.CLICK, this, this.onMaxButtonClick);
        this.sureBtn.on(EventObject.CLICK, this, this.onSureButtonClick);
        this.cancelBtn.on(EventObject.CLICK, this, this.onCancelButtonClick);
    }
    GUI_Cargoes_buy.prototype.uplimit = function () {
        var standby = Roguelike.standby_cargoes[Roguelike.selected_cargo_name];
        var ship = Roguelike.ships[Roguelike.selected_ship_id];
        return Math.min(standby.count, ship.capacity - ship.cargoes.Total);
    };
    GUI_Cargoes_buy.prototype.downlimit = function () {
        var ship = Roguelike.ships[Roguelike.selected_ship_id];
        return -ship.cargoes[Roguelike.selected_cargo_name].count;
    };
    GUI_Cargoes_buy.prototype.onDisplay = function () {
        var standby = Roguelike.standby_cargoes[Roguelike.selected_cargo_name];
        this.standby.text = standby.count;
    };
    GUI_Cargoes_buy.prototype.onAddButtonClick = function () {
        var delta = Number(this.delta.text);
        var limit = this.uplimit();
        if (delta >= limit) {
            GameAudio.playSE(WorldData.disalbeSE);
            delta = limit;
            this.delta.text = delta;
        }
        else {
            GameAudio.playSE(WorldData.selectSE);
            delta = delta + 1;
            this.delta.text = delta;
        }
    };
    GUI_Cargoes_buy.prototype.onSubButtonClick = function () {
        var delta = Number(this.delta.text);
        var limit = this.downlimit();
        if (delta <= limit) {
            GameAudio.playSE(WorldData.disalbeSE);
            delta = limit;
            this.delta.text = delta;
        }
        else {
            GameAudio.playSE(WorldData.selectSE);
            delta = delta - 1;
            this.delta.text = delta;
        }
    };
    GUI_Cargoes_buy.prototype.onMaxButtonClick = function () {
        GameAudio.playSE(WorldData.selectSE);
        this.delta.text = this.uplimit();
    };
    GUI_Cargoes_buy.prototype.onSureButtonClick = function () {
        var delta = Math.floor(Number(this.delta.text));
        var name = Roguelike.selected_cargo_name;
        var standby = Roguelike.standby_cargoes[Roguelike.selected_cargo_name];
        var ship = Roguelike.ships[Roguelike.selected_ship_id];
        var up_limit = this.uplimit();
        if (delta > up_limit)
            delta = up_limit;
        var down_limit = this.downlimit();
        if (delta < down_limit)
            delta = down_limit;
        standby.count -= delta;
        ship.cargoes[name].count += delta;
        Roguelike.standby_cargoes.Total -= delta;
        ship.cargoes.Total += delta;
        this.delta.text = 0;
        GameCommand.startCommonCommand(15001);
        GameUI.get(8005).onDisplay();
    };
    GUI_Cargoes_buy.prototype.onCancelButtonClick = function () {
        GameCommand.startCommonCommand(15001);
    };
    return GUI_Cargoes_buy;
}(GUI_8007));
//# sourceMappingURL=GUI_Cargoes_buy.js.map