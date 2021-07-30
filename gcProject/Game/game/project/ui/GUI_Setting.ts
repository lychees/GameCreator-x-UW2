/**
 * 系统设置
 * Created by 黑暗之神KDS on 2020-03-12 13:55:53.
 */
class GUI_Setting extends GUI_6 {
    //------------------------------------------------------------------------------------------------------
    // 初始化
    //------------------------------------------------------------------------------------------------------
    constructor() {
        super();
    }
    //------------------------------------------------------------------------------------------------------
    // 静态
    //------------------------------------------------------------------------------------------------------
    /**
     * 事件：改变快捷键
     */
    static EVENT_CHANGE_HOT_KEY: string = "GUI_SettingEVENT_CHANGE_HOT_KEY";
    /**
     * 系统按键集
     */
    static SYSTEM_KEYS: string[] = ["UP", "DOWN", "LEFT", "RIGHT", "A", "B", "X", "Y", "START", "BACK", "L1", "L2", "R1", "R2"];
    /**
     * 当前键盘按键设定
     */
    static KEY_BOARD = {
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
        "R2": { index: 25, name: "R2", keys: [Keyboard.T, Keyboard.I] },
        "Console": { index: 26, name: "控制台", keys: [Keyboard.M] }
    }
    /**
     * 获取系统键位描述
     * @param key 系统键位名，对应GUI_Setting.KEY_BOARD的键
     */
    static getSystemKeyDesc(key: string) {
        if (ProjectUtils.lastControl <= 1) {
            var keyInfo = GUI_Setting.KEY_BOARD[key];
            if (!GUI_Setting.KEY_BOARD) return "";
            return Keyboard.getKeyName(keyInfo.keys[0]);
        }
        else {
            return key;
        }
    }
    /**
     * 默认键位设定
     */
    private static KEY_BOARD_DEFAULT = ObjectUtils.depthClone(GUI_Setting.KEY_BOARD);
    //------------------------------------------------------------------------------------------------------
    // 载入设定
    //------------------------------------------------------------------------------------------------------
    static initHotKeySetting() {
        // 载入配置
        var settingData = SinglePlayerGame.getSaveCustomGlobalData("Setting");
        if (settingData) {
            GameAudio.bgmVolume = settingData.bgmVolume;
            GameAudio.bgsVolume = settingData.bgsVolume;
            GameAudio.seVolume = settingData.seVolume;
            GameAudio.tsVolume = settingData.tsVolume;
        }
        // 同步LIST内置按键
        this.syncListKeyDownSetting();
        // 注册自定义储存信息
        SinglePlayerGame.regSaveCustomGlobalData("Setting", Callback.New(this.getGlobalData, this));
    }
    /**
     * 获取全局数据
     */
    static getGlobalData() {
        return {
            bgmVolume: GameAudio.bgmVolume,
            bgsVolume: GameAudio.bgsVolume,
            seVolume: GameAudio.seVolume,
            tsVolume: GameAudio.tsVolume
        };
    }
    //------------------------------------------------------------------------------------------------------
    // 功能
    //------------------------------------------------------------------------------------------------------
    /**
     * 判断系统按键是否按下
     * @param keyCode 按键值
     * @param keyInfo 对应 GUI_Setting.KEY_BOARD
     * @return [boolean] 
     */
    static IS_KEY(keyCode: number, keyInfo: { name: string, keys: number[] }): boolean {
        return keyInfo.keys.indexOf(keyCode) != -1;
    }
    /**
     * 判断系统方向键是否已按下
     * @return [boolean] 
     */
    static get IS_KEY_DOWN_DirectionKey(): boolean {
        if (!ProjectUtils.keyboardEvent) return;
        var keyCode = ProjectUtils.keyboardEvent.keyCode;
        if (GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.UP) ||
            GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.DOWN) ||
            GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.LEFT) ||
            GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.RIGHT)) {
            return true;
        }
        return false;
    }
    //------------------------------------------------------------------------------------------------------
    // 内部
    //------------------------------------------------------------------------------------------------------
    /**
     * 同步LIST内置按键
     */
    private static syncListKeyDownSetting() {
        UIList.KEY_UP = GUI_Setting.KEY_BOARD.UP.keys;
        UIList.KEY_DOWN = GUI_Setting.KEY_BOARD.DOWN.keys;
        UIList.KEY_LEFT = GUI_Setting.KEY_BOARD.LEFT.keys;
        UIList.KEY_RIGHT = GUI_Setting.KEY_BOARD.RIGHT.keys;
        UIList.KEY_ENTER = GUI_Setting.KEY_BOARD.A.keys;
    }
}