




var GUI_BattleSkill = (function (_super) {
    __extends(GUI_BattleSkill, _super);
    function GUI_BattleSkill() {
        _super.call(this);
        GUI_Manager.standardList(this.skillList);
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        this.skillList.on(EventObject.CHANGE, this, this.onActorSkillChange);
        this.skillList.on(UIList.ITEM_CLICK, this, this.onSkillItemClick);
        this.skillList.onCreateItem = Callback.New(this.onCreateSkillItem, this);
    }
    GUI_BattleSkill.prototype.onDisplay = function () {
        this.refreshSkillList();
        UIList.focus = this.skillList;
        this.refreshDescribe();
    };
    GUI_BattleSkill.prototype.refreshSkillList = function () {
        var battler = GameBattleController.currentOperationBattler;
        if (!battler) {
            this.skillList.items = [];
            return;
        }
        var battlerActor = battler.battlerSetting.battleActor;
        var arr = [];
        for (var i = 0; i < battlerActor.skills.length; i++) {
            var skill = battlerActor.skills[i];
            if (skill.skillType != 2) {
                var d = new ListItem_1006;
                d.icon = skill.icon;
                d.data = skill;
                arr.push(d);
            }
        }
        if (arr.length == 0) {
            var d = new ListItem_1008;
            arr.push(d);
        }
        this.skillList.items = arr;
    };
    GUI_BattleSkill.prototype.onActorSkillChange = function () {
        this.refreshDescribe();
    };
    GUI_BattleSkill.prototype.onSkillItemClick = function () {
        var battler = GameBattleController.currentOperationBattler;
        var skill = this.skillList.selectedItem ? this.skillList.selectedItem.data : null;
        if (!battler || !skill)
            return;
        var useEnabled = GameBattleHelper.canUseOneSkill(battler, skill);
        if (!useEnabled) {
            GameAudio.playSE(WorldData.disalbeSE);
            return;
        }
        GameCommand.startCommonCommand(15019);
        Callback.CallLaterBeforeRender(function () {
            EventUtils.happen(GUI_BattleSkill, GUI_BattleSkill.EVENT_SELECT_SKILL, [skill]);
        }, this);
    };
    GUI_BattleSkill.prototype.onCreateSkillItem = function (ui, data, index) {
        var skill = data.data;
        ui.icon.visible = skill ? true : false;
        if (skill) {
            var battler = GameBattleController.currentOperationBattler;
            if (!battler)
                return;
            var useEnabled = GameBattleHelper.canUseOneSkill(battler, skill);
            if (!useEnabled) {
                if (WorldData.iconDisabledAni) {
                    var disabledAni = new Animation;
                    disabledAni.id = WorldData.iconDisabledAni;
                    disabledAni.loop = true;
                    disabledAni.target = ui.icon;
                }
                else {
                    ui.icon.setTonal(0, 0, 0, 100);
                }
            }
            else {
                ui.icon.setTonal(0, 0, 0, 0);
            }
        }
    };
    GUI_BattleSkill.prototype.refreshDescribe = function () {
        var battler = GameBattleController.currentOperationBattler;
        if (!battler)
            return;
        var name = "";
        var desc = "";
        this.tipsUI.cdBox.visible = false;
        if (UIList.focus == this.skillList) {
            var itemData = this.skillList.selectedItem;
            var skill = itemData.data;
            if (skill) {
                name = skill.name;
                desc = GUI_Manager.skillDesc(skill, battler.battlerSetting.battleActor);
                var showCD = skill.currentCD != 0;
                this.tipsUI.cdBox.visible = showCD;
                if (showCD) {
                    var cd = skill.currentCD;
                    this.tipsUI.cdText.text = cd + "\u56DE\u5408";
                    this.tipsUI.cdSlider.value = (skill.totalCD - skill.currentCD) * 100 / skill.totalCD;
                }
            }
        }
        this.tipsUI.descName.text = name;
        this.tipsUI.descText.text = desc;
        this.tipsUI.descText.height = this.tipsUI.descText.textHeight;
        this.tipsUI.descTextBox.refresh();
    };
    GUI_BattleSkill.EVENT_SELECT_SKILL = "GUI_BattleSkillEVENT_SELECT_SKILL";
    return GUI_BattleSkill;
}(GUI_17));
//# sourceMappingURL=GUI_BattleSkill.js.map