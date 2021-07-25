/**
 * 游戏总控制器
 * -- 管理其他控制器
 * -- 场景对象的操作
 * -- 场景对象相关事件触发
 * -- 进入场景事件完毕后才会开启控制器
 * 
 * Created by 黑暗之神KDS on 2018-10-07 16:18:25.
 */
class Controller {
    /** 控制器开启事件 */
    static EVENT_CONTROLLER_START: string = "ControllerEVENT_CONTROLLER_START";
    /** 控制器关闭事件 */
    static EVENT_CONTROLLER_STOP: string = "ControllerEVENT_CONTROLLER_STOP";
    /** 点击事件的命令 true=开始 false=结束 */
    static EVENT_SCENE_OBJECT_CLICK_COMMAND: string = "GameCommand_EVENT_SCENE_OBJECT_CLICK_COMMAND";
    /** 碰触事件的命令 true=开始 false=结束 */
    static EVENT_SCENE_OBJECT_TOUCH_COMMAND: string = "GameCommand_EVENT_SCENE_OBJECT_TOUCH_COMMAND";
    /** 控制器启动状态 */
    static ctrlStart: boolean;
    /** 控制可用状态：点击事件执行中 */
    private static ENABLED_COMMAND_SCENE_OBJECT_CLICK_EXECUTE: number = 0;
    /** 控制可用状态：碰触事件执行中 */
    private static ENABLED_COMMAND_SCENE_OBJECT_TOUCH_EXECUTE: number = 1;
    /** 控制可用状态是否可控，需要条件全满足才可控制 */
    private static enabledMapping = {
        0: true,
        1: true
    }
    /**
     * 输入状态：0-无 1-键盘输入 2-手柄输入 3-虚拟按键 4-其他
     */
    static inputState: number = 0;
    /**
     * 启动控制器
     */
    static start(): void {
        // 调用一次清理
        this.stop();
        // 控制器启动状态
        Controller.ctrlStart = true;
        // 监听场景对象点击事件和场景进入事件的执行，以便禁止玩家控制
        this.startEvent();
        // 鼠标控制器启动
        MouseControl.start();
        // 键盘控制器启动
        KeyboardControl.start();
        // 派发事件
        EventUtils.happen(Controller, Controller.EVENT_CONTROLLER_START);
    }
    /**
     * 停止控制
     */
    static stop(): void {
        // 控制器关闭状态
        Controller.ctrlStart = false;
        // 取消监听相关事件
        this.clearEvent();
        // 鼠标控制器关闭
        MouseControl.stop();
        // 键盘控制器关闭
        KeyboardControl.stop();
    }
    //------------------------------------------------------------------------------------------------------
    // 控制器是否有效
    //------------------------------------------------------------------------------------------------------
    /**
     * 在场景中是否可控制
     */
    static get inSceneEnabled() {
        // 暂停、禁用操作、控制关闭时无法控制
        if (Game.pause || !WorldData.playCtrlEnabled || !Controller.ctrlStart) return false;
        // 战斗中且打开了相关界面时:14、15、17号
        if (GameBattleHelper.isInBattle && (GameDialog.isInDialog || (GameUI.get(14) && GameUI.get(14).stage) || (GameUI.get(15) && GameUI.get(15).stage) || (GameUI.get(17) && GameUI.get(17).stage) || (GameUI.get(19) && GameUI.get(19).stage))) {
            return false;
        }

        // 检测是否未满足全部可控状态，未满足则无法控制
        if (!GameBattleHelper.isInBattle) {
            for (var i in Controller.enabledMapping) {
                if (!Controller.enabledMapping[i]) return false;
            }
        }
        return true;
    }
    //------------------------------------------------------------------------------------------------------
    // 点击事件：触发者=玩家的对象 执行者=被点击的对象
    // -- 玩家鼠标点击对象时候如果在远处则会移动到对象身边再触发，如果对象也在移动中，此时会进入自动追逐状态，追逐完成则触发
    // -- 玩家通过键位会对当前朝向方向的对象进行触发点击事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 开始触发场景对象的点击事件
     * @param target 目标对象
     * @param playerFaceToTarget [可选] 默认值=false 是否执行事件时玩家面向对象
     */
    static startSceneObjectClickEvent(target: ProjectSceneObject_1, playerFaceToTarget: boolean = false) {
        // 战斗时忽略
        if (GameBattleHelper.isInBattle) return;
        // 如果处于暂停阶段或战斗中的话忽略
        if (Game.pause) return;
        if (target) {
            // 不在场景上或处于跳跃中则忽略
            if (!target.inScene || target.scene != Game.currentScene || target.isJumping) return;
            // 存在点击事件的话
            if (target.hasCommand[0]) {
                // 执行该事件时需要执行者等待，未能成功等待时说明有其他需要等待的事件正在执行，则忽略该事件
                var bool = target.eventStartWait(Game.player.sceneObject);
                if (!bool) return;
                // 玩家停止移动
                Game.player.sceneObject.stopMove();
                // 面向目标
                if (playerFaceToTarget && !Game.player.sceneObject.fixOri) {
                    Game.player.sceneObject.addBehavior([[25, 2]], false, Game.player.sceneObject, null, false, 0, true, false, 0, target);
                }
                // 不允许控制：来源-点击事件
                EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_CLICK_COMMAND, [true]);
                // 调用「点击事件」前的处理
                CommandPage.startTriggerFragmentEvent(WorldData.beforeSceneObjectClickHandle, Game.player.sceneObject, target, Callback.New(() => {
                    // 执行点击事件
                    GameCommand.startSceneObjectCommand(target.index, 0, null, Callback.New((target: ProjectSceneObject_1) => {
                        target.eventCompleteContinue();
                        // 恢复控制：来源-点击事件
                        EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_CLICK_COMMAND, [false]);
                    }, this, [target]), Game.player.sceneObject);
                }, this));
            }
        }
    }
    /**
     * 移动至目标场景对象附近后出发点击事件
     * @param targetSceneObject 目标场景对象
     */
    static moveToNearTargetSceneObjectAndTriggerClickEvent(targetSceneObject: ProjectSceneObject_1) {
        // 战斗时忽略
        if (GameBattleHelper.isInBattle) return;
        // 无事件或战斗中时则忽略
        if (!targetSceneObject.hasCommand[0]) return;
        // 清理移动至目标场景对象附近后出发点击事件的命令
        Controller.clearNearTargetSceneObjectAndTriggerClickEvent();
        // 如果已距离1.5个格子以下则直接开始执行
        var dis2 = Math.pow(Config.SCENE_GRID_SIZE * 1.5, 2);
        if (Point.distanceSquare(targetSceneObject.pos, Game.player.sceneObject.pos) <= dis2) {
            Controller.startSceneObjectClickEvent(targetSceneObject, true);
        }
        // 否则移动至其附近
        else {
            // 监听移动结束后再尝试触发点击事件
            Game.player.sceneObject.once(ProjectSceneObject_1.MOVE_OVER, Controller, Controller.moveToNearTargetSceneObjectAndTriggerClickEvent, [targetSceneObject]);
            // 移动至目标对象附近（如果遇到障碍则自动重试）
            Game.player.sceneObject.autoFindRoadMove(targetSceneObject.x, targetSceneObject.y, 1, 0, true, true, true);
            // 如果目标出现了新的移动则清理掉（而非自动重试的话）
            Game.player.sceneObject.on(ProjectSceneObject_1.MOVE_START, Controller, this.clearNearTargetSceneObjectAndTriggerClickEvent);
        }
    }
    /**
     * 清理移动至目标场景对象附近后出发点击事件的命令
     * @param fromAutoRetry [可选] 默认值=false 来自自动重试
     */
    static clearNearTargetSceneObjectAndTriggerClickEvent(fromAutoRetry: boolean = false) {
        if (fromAutoRetry) return;
        Game.player.sceneObject.off(ProjectSceneObject_1.MOVE_START, Controller, Controller.clearNearTargetSceneObjectAndTriggerClickEvent);
        Game.player.sceneObject.off(ProjectSceneObject_1.MOVE_OVER, Controller, Controller.moveToNearTargetSceneObjectAndTriggerClickEvent);
    }
    //------------------------------------------------------------------------------------------------------
    // 碰触事件：触发者=主动碰触别人的对象 执行者=被碰触的对象
    // -- 由A对象主动碰到B对象，触发B对象的碰触事件（只有被触发的对象才会执行触发事件）
    //------------------------------------------------------------------------------------------------------
    /**
     * 开始触发碰触事件
     * @param trigger 碰触者
     * @param executor 执行者
     * @param onCommandExecuteOver [可选] 默认值=null 执行事件完成后回调
     * @return [boolean] 是否成功
     */
    static startSceneObjectTouchEvent(trigger: ProjectSceneObject_1, executor: ProjectSceneObject_1, onCommandExecuteOver: Callback = null): boolean {
        // 如果还未真正登陆场景则忽略（即预先摆放接触的对象不会触发碰触事件）
        if (GameGate.gateState < GameGate.STATE_4_PLAYER_CONTROL_START) {
            Callback.New(Controller.startSceneObjectTouchEvent, Controller, [trigger, executor, onCommandExecuteOver]).delayRun(0);
            return false;
        }
        // 战斗时忽略
        if (GameBattleHelper.isInBattle) return;
        // 如果处于暂停阶段的话监听游戏暂停状态改变后再重新开始
        if (Game.pause) {
            EventUtils.addEventListener(Game, Game.EVENT_PAUSE_CHANGE, Callback.New(Controller.startSceneObjectTouchEvent, this, [trigger, executor, onCommandExecuteOver]), true);
            return false;
        }
        // 不在场景上时忽略
        if (!executor.inScene || !trigger.inScene || trigger.scene != Game.currentScene || executor.scene != Game.currentScene) return false;
        // 跳跃中时忽略
        if (executor.isJumping || trigger.isJumping) return false;
        // 没有事件时忽略
        if (!executor.hasCommand[1]) return false;
        // 不允许非玩家以外的对象执行时则忽略
        if (executor.onlyPlayerTouch && trigger != Game.player.sceneObject) return false;
        // 如果需要玩家等待的场合
        if (executor.waitTouchEvent && trigger == Game.player.sceneObject) {
            // 执行该事件时需要执行者等待，未能成功等待时说明有其他需要等待的事件正在执行，则忽略该事件
            var bool = executor.eventStartWait(trigger);
            if (!bool) return false;
            // 玩家停止移动
            trigger.stopMove();
            // 面向目标
            if (!Game.player.sceneObject.fixOri) {
                Game.player.sceneObject.addBehavior([[25, 2]], false, trigger, null, false, 0, true, false, 0, executor);
            }
            // 不允许控制：来源-碰触事件
            EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_TOUCH_COMMAND, [true]);
            // 调用「点击事件」前的处理
            CommandPage.startTriggerFragmentEvent(WorldData.beforeSceneObjectTouchHandle, trigger, executor);
            // 执行碰触事件
            return GameCommand.startSceneObjectCommand(executor.index, 1, null, Callback.New(() => {
                executor.eventCompleteContinue();
                // 恢复控制：来源-碰触事件
                EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_TOUCH_COMMAND, [false]);
                onCommandExecuteOver && onCommandExecuteOver.run();
            }, this), trigger);
        }
        else {
            // 调用「点击事件」前的处理
            CommandPage.startTriggerFragmentEvent(WorldData.beforeSceneObjectTouchHandle, trigger, executor);
            return GameCommand.startSceneObjectCommand(executor.index, 1, null, onCommandExecuteOver, trigger);
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 离开碰触的事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 开始离开碰触的事件：当已碰触该对象的对象不再碰触该对象时触发
     * @param trigger 触发者
     * @param executor 执行者
     * @param onCommandExecuteOver [可选] 默认值=null 当执行完成时回调
     * @return [boolean] 是否执行成功
     */
    static startSceneObjectTouchOutEvent(trigger: ProjectSceneObject_1, executor: ProjectSceneObject_1, onCommandExecuteOver: Callback = null): boolean {
        // 如果处于暂停阶段的话监听游戏暂停状态改变后再重新开始
        if (Game.pause) {
            EventUtils.addEventListener(Game, Game.EVENT_PAUSE_CHANGE, Callback.New(Controller.startSceneObjectTouchEvent, this, [trigger, executor, onCommandExecuteOver]), true);
            return false;
        }
        // 不在场景上时忽略
        if (!executor.inScene || !trigger.inScene || trigger.scene != Game.currentScene || executor.scene != Game.currentScene) return false;
        // 没有事件时忽略
        if (!executor.hasCommand[4]) return false;
        // 不允许非玩家以外的对象执行时则忽略
        if (executor.onlyPlayerTouch && trigger != Game.player.sceneObject) return false;
        return GameCommand.startSceneObjectCommand(executor.index, 4, null, onCommandExecuteOver, trigger);
    }
    //------------------------------------------------------------------------------------------------------
    // 内部-事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 开始事件
     */
    private static startEvent() {
        this.clearEvent();
        EventUtils.addEventListener(Controller, Controller.EVENT_SCENE_OBJECT_CLICK_COMMAND, Callback.New(this.onCommandStart, this, [Controller.ENABLED_COMMAND_SCENE_OBJECT_CLICK_EXECUTE]));
        EventUtils.addEventListener(Controller, Controller.EVENT_SCENE_OBJECT_TOUCH_COMMAND, Callback.New(this.onCommandStart, this, [Controller.ENABLED_COMMAND_SCENE_OBJECT_TOUCH_EXECUTE]));
    }
    /**
     * 清理事件
     */
    private static clearEvent() {
        EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_CLICK_COMMAND, [false]);
        EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_TOUCH_COMMAND, [false]);
    }
    //------------------------------------------------------------------------------------------------------
    // 内部
    //------------------------------------------------------------------------------------------------------
    /**
     * 当命令开始时
     * @param enabledID 命令编号
     * @param isStart 是否开始
     */
    private static onCommandStart(enabledID: number, isStart: boolean) {
        Controller.enabledMapping[enabledID] = !isStart;
    }
}