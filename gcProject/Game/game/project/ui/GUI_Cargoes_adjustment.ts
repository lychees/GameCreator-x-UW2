class GUI_Cargoes_adjustment extends GUI_8006 {
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
        this.standby.text = Roguelike.selected_cargo.count;
    }

    private onAddButtonClick() {
        let delta: number = Number(this.delta.text);
        let limit = Roguelike.selected_cargo.count;
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
        let limit = -Roguelike.selected_cargo.ship_count;

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
        let delta: number = Number(this.delta.text);
        delta =  Roguelike.selected_cargo.count;
        this.delta.text = delta;
    }

    private onSureButtonClick() {
        let delta: number = Math.floor(Number(this.delta.text));
        let up_limit = Roguelike.selected_cargo.count;
        if (delta > up_limit) delta = up_limit;
        let down_limit = -Roguelike.selected_cargo.ship_count;
        if (delta < down_limit) delta = down_limit;


        console.log(Roguelike.selected_cargo);
        let name = Roguelike.selected_cargo.name;
        console.log(name);

        let standby = Roguelike.standby_cargoes[name];
        let ship = Roguelike.ships[Roguelike.selected_ship_id].cargoes[name];

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
    }

    private onCancelButtonClick() {
        GameCommand.startCommonCommand(15001);
    }
}