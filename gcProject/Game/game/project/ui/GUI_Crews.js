




var GUI_Crews = (function (_super) {
    __extends(GUI_Crews, _super);
    function GUI_Crews() {
        _super.call(this);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        this.addNumBtn.on(EventObject.CLICK, this, this.onAddButtonClick, []);
    }
    GUI_Crews.prototype.onDisplay = function () {
    };
    GUI_Crews.prototype.onAddButtonClick = function () {
        alert('添加船员的按钮被点击了！');
    };
    GUI_Crews.prototype.onItemClick = function () {
    };
    GUI_Crews.prototype.refreshItems = function (state) {
    };
    return GUI_Crews;
}(GUI_8004));
//# sourceMappingURL=GUI_Crews.js.map