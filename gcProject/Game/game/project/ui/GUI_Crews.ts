class GUI_Crews extends GUI_8004 {
    constructor() {
        super();
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        this.addNumBtn.on(EventObject.CLICK, this, this.onAddButtonClick, []);
    }
    //------------------------------------------------------------------------------------------------------
    // 事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 当界面显示时事件
     */
    private onDisplay() {
    }

    private onAddButtonClick() {
        alert('添加船员的按钮被点击了！');
    }

    /**
     * 当项目点击时
     */
    private onItemClick() {
    }

    private refreshItems(state: number) {
    }
}