




var GUI_Crews = (function (_super) {
    __extends(GUI_Crews, _super);
    function GUI_Crews() {
        _super.call(this);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        this.subNumBtn.on(EventObject.CLICK, this, this.onSubButtonClick);
        this.addNumBtn.on(EventObject.CLICK, this, this.onAddButtonClick);
        this.maxNumBtn.on(EventObject.CLICK, this, this.onMaxButtonClick);
        this.sureBtn.on(EventObject.CLICK, this, this.onSureButtonClick);
        this.cancelBtn.on(EventObject.CLICK, this, this.onCancelButtonClick);
        stage.on(EventObject.RIGHT_MOUSE_DOWN, this, this.onRightMouseDown);
    }
    GUI_Crews.prototype.onDisplay = function () {
        this.standby.text = Roguelike.standby_crews;
    };
    GUI_Crews.prototype.onAddButtonClick = function () {
        var delta = Number(this.delta.text);
        var ship = Roguelike.ships[Roguelike.selected_ship_id];
        var up_limit = Math.min(ship.max_crew - ship.crew, Roguelike.standby_crews);
        if (delta == up_limit) {
            GameAudio.playSE(WorldData.disalbeSE);
        }
        else {
            GameAudio.playSE(WorldData.selectSE);
            delta = delta + 1;
            this.delta.text = delta;
        }
    };
    GUI_Crews.prototype.onSubButtonClick = function () {
        var delta = Number(this.delta.text);
        var ship = Roguelike.ships[Roguelike.selected_ship_id];
        var up_limit = -ship.crew;
        if (delta == up_limit) {
            GameAudio.playSE(WorldData.disalbeSE);
        }
        else {
            GameAudio.playSE(WorldData.selectSE);
            delta = delta - 1;
            this.delta.text = delta;
        }
    };
    GUI_Crews.prototype.onMaxButtonClick = function () {
        GameAudio.playSE(WorldData.selectSE);
        var ship = Roguelike.ships[Roguelike.selected_ship_id];
        this.delta.text = Math.min(ship.max_crew - ship.crew, Roguelike.standby_crews);
    };
    GUI_Crews.prototype.onSureButtonClick = function () {
        var delta = Math.floor(Number(this.delta.text));
        var ship = Roguelike.ships[Roguelike.selected_ship_id];
        var up_limit = Math.min(ship.max_crew - ship.crew, Roguelike.standby_crews);
        if (delta > up_limit)
            delta = up_limit;
        var down_limit = -ship.crew;
        if (delta < down_limit)
            delta = down_limit;
        Roguelike.standby_crews -= delta;
        ship.crew += delta;
        this.delta.text = 0;
        GameCommand.startCommonCommand(15001);
    };
    GUI_Crews.prototype.onCancelButtonClick = function () {
        GameCommand.startCommonCommand(15001);
    };
    return GUI_Crews;
}(GUI_8004));
//# sourceMappingURL=GUI_Crews.js.map