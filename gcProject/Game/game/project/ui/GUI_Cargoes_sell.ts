class GUI_Cargoes_sell extends GUI_8008 {
    constructor() {
        super();
        this.on(EventObject.DISPLAY, this, this.onDisplay);        
        this.subNumBtn.on(EventObject.CLICK, this, this.onSubButtonClick);
        this.addNumBtn.on(EventObject.CLICK, this, this.onAddButtonClick);
        this.maxNumBtn.on(EventObject.CLICK, this, this.onMaxButtonClick);
        this.sureBtn.on(EventObject.CLICK, this, this.onSureButtonClick);
        this.cancelBtn.on(EventObject.CLICK, this, this.onCancelButtonClick);
    }

    private uplimit() {
        let standby = Roguelike.standby_cargoes[Roguelike.selected_cargo_name];        
        return standby.count;
    }

    private downlimit() {
        return 0;
    }

    //------------------------------------------------------------------------------------------------------
    // 事件
    //------------------------------------------------------------------------------------------------------
    
    private onDisplay() {
        let standby = Roguelike.standby_cargoes[Roguelike.selected_cargo_name];
        this.standby.text = standby.count;
    }

    private onAddButtonClick() {
        let delta: number = Number(this.delta.text);        
        let limit = this.uplimit();

        if (delta >= limit) {
            GameAudio.playSE(WorldData.disalbeSE);
            delta = limit;
            this.delta.text = delta;
        } else {        
            GameAudio.playSE(WorldData.selectSE);        
            delta = delta + 1;
            this.delta.text = delta;
        }
    }

    private onSubButtonClick() {        
        let delta: number = Number(this.delta.text);
        let limit = this.downlimit();

        if (delta <= limit) {
            GameAudio.playSE(WorldData.disalbeSE);
            delta = limit;
            this.delta.text = delta;
        } else {
            GameAudio.playSE(WorldData.selectSE);        
            delta = delta - 1;
            this.delta.text = delta;
        }
    }

    private onMaxButtonClick() {
        GameAudio.playSE(WorldData.selectSE);        
        this.delta.text = this.uplimit();
    }

    private onSureButtonClick() {
        let delta: number = Math.floor(Number(this.delta.text));
        let name = Roguelike.selected_cargo_name;
        let standby = Roguelike.standby_cargoes[name];
        
        let up_limit = this.uplimit(); if (delta > up_limit) delta = up_limit;
        let down_limit = this.downlimit(); if (delta < down_limit) delta = down_limit;

        standby.count -= delta;
        Roguelike.standby_cargoes.Total -= delta;

        //Game.player.increaseGold(standby.price * delta);
        ProjectPlayer.increaseGold(standby.price * delta);

        this.delta.text = 0;
        GameCommand.startCommonCommand(15001);
        GameUI.get(8005).onDisplay();
    }

    private onCancelButtonClick() {
        GameCommand.startCommonCommand(15001);
    }
}