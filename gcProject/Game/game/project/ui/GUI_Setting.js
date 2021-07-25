




var GUI_Setting = (function (_super) {
    __extends(GUI_Setting, _super);
    function GUI_Setting() {
        _super.call(this);
    }
    GUI_Setting.getSystemKeyDesc = function (key) {
        if (ProjectUtils.lastControl <= 1) {
            var keyInfo = GUI_Setting.KEY_BOARD[key];
            if (!GUI_Setting.KEY_BOARD)
                return "";
            return Keyboard.getKeyName(keyInfo.keys[0]);
        }
        else {
            return key;
        }
    };
    GUI_Setting.initHotKeySetting = function () {
        var settingData = SinglePlayerGame.getSaveCustomGlobalData("Setting");
        if (settingData) {
            GameAudio.bgmVolume = settingData.bgmVolume;
            GameAudio.bgsVolume = settingData.bgsVolume;
            GameAudio.seVolume = settingData.seVolume;
            GameAudio.tsVolume = settingData.tsVolume;
        }
        this.syncListKeyDownSetting();
        SinglePlayerGame.regSaveCustomGlobalData("Setting", Callback.New(this.getGlobalData, this));
    };
    GUI_Setting.getGlobalData = function () {
        return {
            bgmVolume: GameAudio.bgmVolume,
            bgsVolume: GameAudio.bgsVolume,
            seVolume: GameAudio.seVolume,
            tsVolume: GameAudio.tsVolume
        };
    };
    GUI_Setting.IS_KEY = function (keyCode, keyInfo) {
        return keyInfo.keys.indexOf(keyCode) != -1;
    };
    Object.defineProperty(GUI_Setting, "IS_KEY_DOWN_DirectionKey", {
        get: function () {
            if (!ProjectUtils.keyboardEvent)
                return;
            var keyCode = ProjectUtils.keyboardEvent.keyCode;
            if (GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.UP) ||
                GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.DOWN) ||
                GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.LEFT) ||
                GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.RIGHT)) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    GUI_Setting.syncListKeyDownSetting = function () {
        UIList.KEY_UP = GUI_Setting.KEY_BOARD.UP.keys;
        UIList.KEY_DOWN = GUI_Setting.KEY_BOARD.DOWN.keys;
        UIList.KEY_LEFT = GUI_Setting.KEY_BOARD.LEFT.keys;
        UIList.KEY_RIGHT = GUI_Setting.KEY_BOARD.RIGHT.keys;
        UIList.KEY_ENTER = GUI_Setting.KEY_BOARD.A.keys;
    };
    GUI_Setting.EVENT_CHANGE_HOT_KEY = "GUI_SettingEVENT_CHANGE_HOT_KEY";
    GUI_Setting.SYSTEM_KEYS = ["UP", "DOWN", "LEFT", "RIGHT", "A", "B", "X", "Y", "START", "BACK", "L1", "L2", "R1", "R2"];
    GUI_Setting.KEY_BOARD = {
        "UP": { index: 1, name: "上方向键", keys: [Keyboard.W, Keyboard.UP] },
        "DOWN": { index: 2, name: "下方向键", keys: [Keyboard.S, Keyboard.DOWN] },
        "LEFT": { index: 3, name: "左方向键", keys: [Keyboard.A, Keyboard.LEFT] },
        "RIGHT": { index: 4, name: "右方向键", keys: [Keyboard.D, Keyboard.RIGHT] },
        "A": { index: 5, name: "确定", keys: [Keyboard.K, Keyboard.Z, Keyboard.ENTER, Keyboard.SPACE] },
        "B": { index: 17, name: "取消", keys: [Keyboard.L, Keyboard.X, Keyboard.ESCAPE, Keyboard.NUMPAD_0] },
        "X": { index: 18, name: "X", keys: [Keyboard.H, Keyboard.C] },
        "Y": { index: 19, name: "Y", keys: [Keyboard.J, Keyboard.V] },
        "START": { index: 20, name: "开始", keys: [Keyboard.ENTER, Keyboard.SPACE] },
        "BACK": { index: 21, name: "退出", keys: [Keyboard.ESCAPE, Keyboard.NUMPAD_0] },
        "L1": { index: 22, name: "L1", keys: [Keyboard.Q, Keyboard.O] },
        "L2": { index: 23, name: "L2", keys: [Keyboard.R, Keyboard.U] },
        "R1": { index: 24, name: "R1", keys: [Keyboard.E, Keyboard.P] },
        "R2": { index: 25, name: "R2", keys: [Keyboard.T, Keyboard.I] }
    };
    GUI_Setting.KEY_BOARD_DEFAULT = ObjectUtils.depthClone(GUI_Setting.KEY_BOARD);
    return GUI_Setting;
}(GUI_6));
//# sourceMappingURL=GUI_Setting.js.map