class GUI_Crews extends GUI_8004 {
    constructor() {
        super();
        this.on(EventObject.DISPLAY, this, this.onDisplay);        
        // 购买/出售相关按钮
        this.subNumBtn.on(EventObject.CLICK, this, this.onSubButtonClick);
        this.addNumBtn.on(EventObject.CLICK, this, this.onAddButtonClick);
        this.maxNumBtn.on(EventObject.CLICK, this, this.onMaxButtonClick);
        this.sureBtn.on(EventObject.CLICK, this, this.onSureButtonClick);
        this.cancelBtn.on(EventObject.CLICK, this, this.onCancelButtonClick);
        // 鼠标右键
        stage.on(EventObject.RIGHT_MOUSE_DOWN, this, this.onRightMouseDown);        
    }
    //------------------------------------------------------------------------------------------------------
    // 事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 当界面显示时事件
     */
    private onDisplay() {
        this.standby.text = Roguelike.standby_crews;
    }

    private onAddButtonClick() {
        let delta: number = Number(this.delta.text);
        let up_limit = Math.min(Roguelike.selected_ship.info.max_crew - Roguelike.selected_ship.info.crew, Roguelike.standby_crews);
        if (delta == up_limit) {
            GameAudio.playSE(WorldData.disalbeSE);
        } else {        
            GameAudio.playSE(WorldData.selectSE);        
            delta = delta + 1;
            this.delta.text = delta;
        }
    }

    private onSubButtonClick() {
        
        let delta: number = Number(this.delta.text);
        let up_limit = -Roguelike.selected_ship.info.crew;

        if (delta == up_limit) {
            GameAudio.playSE(WorldData.disalbeSE);
        } else {
            GameAudio.playSE(WorldData.selectSE);        
            delta = delta - 1;
            this.delta.text = delta;
        }
    }

    private onMaxButtonClick() {
        GameAudio.playSE(WorldData.selectSE);
        let delta: number = Number(this.delta.text);
        delta = Math.min(Roguelike.selected_ship.info.max_crew - Roguelike.selected_ship.info.crew, Roguelike.standby_crews);
        this.delta.text = delta;
    }

    private onSureButtonClick() {
        GameAudio.playSE(WorldData.selectSE);
        let delta: number = Math.floor(Number(this.delta.text));
        let up_limit = Math.min(Roguelike.selected_ship.info.max_crew - Roguelike.selected_ship.info.crew, Roguelike.standby_crews);
        if (delta > up_limit) delta = up_limit;
        let down_limit = -Roguelike.selected_ship.info.crew;
        if (delta < down_limit) delta = down_limit;

        Roguelike.standby_crews -= delta;
        Roguelike.selected_ship.info.crew += delta;
        this.delta.text = 0;        
        GameCommand.startCommonCommand(15001);
        GameUI.get(8002).onDisplay();
    }

    private onCancelButtonClick() {
        GameCommand.startCommonCommand(15001);
    }
}