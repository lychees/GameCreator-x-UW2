




var GUI_Cargoes_sell = (function (_super) {
    __extends(GUI_Cargoes_sell, _super);
    function GUI_Cargoes_sell() {
        _super.call(this);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        this.subNumBtn.on(EventObject.CLICK, this, this.onSubButtonClick);
        this.addNumBtn.on(EventObject.CLICK, this, this.onAddButtonClick);
        this.maxNumBtn.on(EventObject.CLICK, this, this.onMaxButtonClick);
        this.sureBtn.on(EventObject.CLICK, this, this.onSureButtonClick);
        this.cancelBtn.on(EventObject.CLICK, this, this.onCancelButtonClick);
    }
    GUI_Cargoes_sell.prototype.uplimit = function () {
        var standby = Roguelike.standby_cargoes[Roguelike.selected_cargo_name];
        return standby.count;
    };
    GUI_Cargoes_sell.prototype.downlimit = function () {
        return 0;
    };
    GUI_Cargoes_sell.prototype.onDisplay = function () {
        console.log(Roguelike.selected_cargo_name);
        var standby = Roguelike.standby_cargoes[Roguelike.selected_cargo_name];
        this.standby.text = standby.count;
    };
    GUI_Cargoes_sell.prototype.onAddButtonClick = function () {
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
    GUI_Cargoes_sell.prototype.onSubButtonClick = function () {
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
    GUI_Cargoes_sell.prototype.onMaxButtonClick = function () {
        GameAudio.playSE(WorldData.selectSE);
        this.delta.text = this.uplimit();
    };
    GUI_Cargoes_sell.prototype.onSureButtonClick = function () {
        var delta = Math.floor(Number(this.delta.text));
        var name = Roguelike.selected_cargo_name;
        var standby = Roguelike.standby_cargoes[name];
        var ship = Roguelike.ships[Roguelike.selected_ship_id];
        var up_limit = this.uplimit();
        if (delta > up_limit)
            delta = up_limit;
        var down_limit = this.downlimit();
        if (delta < down_limit)
            delta = down_limit;
        standby.count -= delta;
        Roguelike.standby_cargoes.Total -= delta;
        this.delta.text = 0;
        GameCommand.startCommonCommand(15001);
        GameUI.get(8005).onDisplay();
    };
    GUI_Cargoes_sell.prototype.onCancelButtonClick = function () {
        GameCommand.startCommonCommand(15001);
    };
    return GUI_Cargoes_sell;
}(GUI_8008));
//# sourceMappingURL=GUI_Cargoes_sell.js.map