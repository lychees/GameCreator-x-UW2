




var GUI_Cargoes_adjustment = (function (_super) {
    __extends(GUI_Cargoes_adjustment, _super);
    function GUI_Cargoes_adjustment() {
        _super.call(this);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        this.subNumBtn.on(EventObject.CLICK, this, this.onSubButtonClick);
        this.addNumBtn.on(EventObject.CLICK, this, this.onAddButtonClick);
        this.maxNumBtn.on(EventObject.CLICK, this, this.onMaxButtonClick);
        this.sureBtn.on(EventObject.CLICK, this, this.onSureButtonClick);
        this.cancelBtn.on(EventObject.CLICK, this, this.onCancelButtonClick);
        stage.on(EventObject.RIGHT_MOUSE_DOWN, this, this.onRightMouseDown);
    }
    GUI_Cargoes_adjustment.prototype.onDisplay = function () {
        this.standby.text = Roguelike.selected_cargo.count;
    };
    GUI_Cargoes_adjustment.prototype.onAddButtonClick = function () {
        var delta = Number(this.delta.text);
        var limit = Roguelike.selected_cargo.count;
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
    GUI_Cargoes_adjustment.prototype.onSubButtonClick = function () {
        var delta = Number(this.delta.text);
        var limit = -Roguelike.selected_cargo.ship_count;
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
    GUI_Cargoes_adjustment.prototype.onMaxButtonClick = function () {
        GameAudio.playSE(WorldData.selectSE);
        var delta = Number(this.delta.text);
        delta = Roguelike.selected_cargo.count;
        this.delta.text = delta;
    };
    GUI_Cargoes_adjustment.prototype.onSureButtonClick = function () {
        var delta = Math.floor(Number(this.delta.text));
        var up_limit = Roguelike.selected_cargo.count;
        if (delta > up_limit)
            delta = up_limit;
        var down_limit = -Roguelike.selected_cargo.ship_count;
        if (delta < down_limit)
            delta = down_limit;
        console.log(Roguelike.selected_cargo);
        var name = Roguelike.selected_cargo.name;
        console.log(name);
        var standby = Roguelike.standby_cargoes[name];
        var ship = Roguelike.ships[Roguelike.selected_ship_id].cargoes[name];
        console.log(standby);
        console.log(ship);
        if (standby == null) {
            standby = JSON.parse(JSON.stringify(ship));
            standby.count = 0;
        }
        if (ship == null) {
            ship = JSON.parse(JSON.stringify(standby));
            ship.count = 0;
        }
        standby.count -= delta;
        ship.count += delta;
        Roguelike.standby_cargoes.Total -= delta;
        Roguelike.ships[Roguelike.selected_ship_id].cargoes.Total += delta;
        console.log(Roguelike.selected_ship_id);
        this.delta.text = 0;
        GameCommand.startCommonCommand(15001);
        GameUI.get(8005).onDisplay();
    };
    GUI_Cargoes_adjustment.prototype.onCancelButtonClick = function () {
        GameCommand.startCommonCommand(15001);
    };
    return GUI_Cargoes_adjustment;
}(GUI_8006));
//# sourceMappingURL=GUI_Cargoes_adjustment.js.map