




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
        var up_limit = Math.min(Roguelike.selected_ship.info.max_crew - Roguelike.selected_ship.info.crew, Roguelike.standby_crews);
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
        var up_limit = -Roguelike.selected_ship.info.crew;
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
        var delta = Number(this.delta.text);
        delta = Math.min(Roguelike.selected_ship.info.max_crew - Roguelike.selected_ship.info.crew, Roguelike.standby_crews);
        this.delta.text = delta;
    };
    GUI_Crews.prototype.onSureButtonClick = function () {
        GameAudio.playSE(WorldData.selectSE);
        var delta = Number(this.delta.text);
        Roguelike.standby_crews -= delta;
        Roguelike.selected_ship.info.crew += delta;
        this.delta.text = 0;
        GameCommand.startCommonCommand(15001);
        GameUI.get(8002).onDisplay();
    };
    GUI_Crews.prototype.onCancelButtonClick = function () {
        GameCommand.startCommonCommand(15001);
    };
    return GUI_Crews;
}(GUI_8004));
//# sourceMappingURL=GUI_Crews.js.map