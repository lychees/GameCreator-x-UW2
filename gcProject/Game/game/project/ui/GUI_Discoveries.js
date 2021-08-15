




var GUI_Discoveries = (function (_super) {
    __extends(GUI_Discoveries, _super);
    function GUI_Discoveries() {
        _super.call(this);
        GUI_Manager.standardList(this.list, false);
        this.list.onCreateItem = Callback.New(GUI_Discoveries.onDiscoveredItem, GUI_Discoveries, []);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
    }
    GUI_Discoveries.prototype.onDisplay = function () {
        UIList.focus = this.list;
        this.refreshItems(0);
    };
    GUI_Discoveries.onDiscoveredItem = function (ui, data, index) {
        AssetManager.loadImage('asset/image/_uw2/ships/balsa.png', Callback.New(function (tex) {
            var g = new Graphics();
            g.fillTexture(tex, 0, 0, 50, 50, 'repeat', new Point(20, 20));
            var sp = new Sprite();
            sp.graphics = g;
            ui.icon.addChild(sp);
        }));
    };
    GUI_Discoveries.prototype.refreshItems = function (state) {
        if (state != 0)
            return;
        var arr = [];
        Object.keys(Roguelike.discoveries).forEach(function (id) {
            var d = new ListItem_1011;
            var meta = Roguelike.discoveries[id];
            d.no = id;
            d.dateStr = meta.date;
            d.itemName = i18n.chinese[meta.name];
            d.description = (i18n.chinese[meta.description]).slice(0, 43);
            if (d.description.length === 43)
                d.description += '......';
            arr.push(d);
        });
        if (Object.keys(Roguelike.discoveries).length === 0) {
            var emptyItem = new ListItem_1011;
            emptyItem.itemName = "还没有发现物";
            emptyItem.no = "0";
            emptyItem.dateStr = "----/----";
        }
        this.list.items = arr;
    };
    return GUI_Discoveries;
}(GUI_27));
//# sourceMappingURL=GUI_Discoveries.js.map