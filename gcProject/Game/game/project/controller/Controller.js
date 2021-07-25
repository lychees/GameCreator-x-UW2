var Controller = (function () {
    function Controller() {
    }
    Controller.start = function () {
        this.stop();
        Controller.ctrlStart = true;
        this.startEvent();
        MouseControl.start();
        KeyboardControl.start();
        EventUtils.happen(Controller, Controller.EVENT_CONTROLLER_START);
    };
    Controller.stop = function () {
        Controller.ctrlStart = false;
        this.clearEvent();
        MouseControl.stop();
        KeyboardControl.stop();
    };
    Object.defineProperty(Controller, "inSceneEnabled", {
        get: function () {
            if (Game.pause || !WorldData.playCtrlEnabled || !Controller.ctrlStart)
                return false;
            if (GameBattleHelper.isInBattle && (GameDialog.isInDialog || (GameUI.get(14) && GameUI.get(14).stage) || (GameUI.get(15) && GameUI.get(15).stage) || (GameUI.get(17) && GameUI.get(17).stage) || (GameUI.get(19) && GameUI.get(19).stage))) {
                return false;
            }
            if (!GameBattleHelper.isInBattle) {
                for (var i in Controller.enabledMapping) {
                    if (!Controller.enabledMapping[i])
                        return false;
                }
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Controller.startSceneObjectClickEvent = function (target, playerFaceToTarget) {
        var _this = this;
        if (playerFaceToTarget === void 0) { playerFaceToTarget = false; }
        if (GameBattleHelper.isInBattle)
            return;
        if (Game.pause)
            return;
        if (target) {
            if (!target.inScene || target.scene != Game.currentScene || target.isJumping)
                return;
            if (target.hasCommand[0]) {
                var bool = target.eventStartWait(Game.player.sceneObject);
                if (!bool)
                    return;
                Game.player.sceneObject.stopMove();
                if (playerFaceToTarget && !Game.player.sceneObject.fixOri) {
                    Game.player.sceneObject.addBehavior([[25, 2]], false, Game.player.sceneObject, null, false, 0, true, false, 0, target);
                }
                EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_CLICK_COMMAND, [true]);
                CommandPage.startTriggerFragmentEvent(WorldData.beforeSceneObjectClickHandle, Game.player.sceneObject, target, Callback.New(function () {
                    GameCommand.startSceneObjectCommand(target.index, 0, null, Callback.New(function (target) {
                        target.eventCompleteContinue();
                        EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_CLICK_COMMAND, [false]);
                    }, _this, [target]), Game.player.sceneObject);
                }, this));
            }
        }
    };
    Controller.moveToNearTargetSceneObjectAndTriggerClickEvent = function (targetSceneObject) {
        if (GameBattleHelper.isInBattle)
            return;
        if (!targetSceneObject.hasCommand[0])
            return;
        Controller.clearNearTargetSceneObjectAndTriggerClickEvent();
        var dis2 = Math.pow(Config.SCENE_GRID_SIZE * 1.5, 2);
        if (Point.distanceSquare(targetSceneObject.pos, Game.player.sceneObject.pos) <= dis2) {
            Controller.startSceneObjectClickEvent(targetSceneObject, true);
        }
        else {
            Game.player.sceneObject.once(ProjectSceneObject_1.MOVE_OVER, Controller, Controller.moveToNearTargetSceneObjectAndTriggerClickEvent, [targetSceneObject]);
            Game.player.sceneObject.autoFindRoadMove(targetSceneObject.x, targetSceneObject.y, 1, 0, true, true, true);
            Game.player.sceneObject.on(ProjectSceneObject_1.MOVE_START, Controller, this.clearNearTargetSceneObjectAndTriggerClickEvent);
        }
    };
    Controller.clearNearTargetSceneObjectAndTriggerClickEvent = function (fromAutoRetry) {
        if (fromAutoRetry === void 0) { fromAutoRetry = false; }
        if (fromAutoRetry)
            return;
        Game.player.sceneObject.off(ProjectSceneObject_1.MOVE_START, Controller, Controller.clearNearTargetSceneObjectAndTriggerClickEvent);
        Game.player.sceneObject.off(ProjectSceneObject_1.MOVE_OVER, Controller, Controller.moveToNearTargetSceneObjectAndTriggerClickEvent);
    };
    Controller.startSceneObjectTouchEvent = function (trigger, executor, onCommandExecuteOver) {
        if (onCommandExecuteOver === void 0) { onCommandExecuteOver = null; }
        if (GameGate.gateState < GameGate.STATE_4_PLAYER_CONTROL_START) {
            Callback.New(Controller.startSceneObjectTouchEvent, Controller, [trigger, executor, onCommandExecuteOver]).delayRun(0);
            return false;
        }
        if (GameBattleHelper.isInBattle)
            return;
        if (Game.pause) {
            EventUtils.addEventListener(Game, Game.EVENT_PAUSE_CHANGE, Callback.New(Controller.startSceneObjectTouchEvent, this, [trigger, executor, onCommandExecuteOver]), true);
            return false;
        }
        if (!executor.inScene || !trigger.inScene || trigger.scene != Game.currentScene || executor.scene != Game.currentScene)
            return false;
        if (executor.isJumping || trigger.isJumping)
            return false;
        if (!executor.hasCommand[1])
            return false;
        if (executor.onlyPlayerTouch && trigger != Game.player.sceneObject)
            return false;
        if (executor.waitTouchEvent && trigger == Game.player.sceneObject) {
            var bool = executor.eventStartWait(trigger);
            if (!bool)
                return false;
            trigger.stopMove();
            if (!Game.player.sceneObject.fixOri) {
                Game.player.sceneObject.addBehavior([[25, 2]], false, trigger, null, false, 0, true, false, 0, executor);
            }
            EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_TOUCH_COMMAND, [true]);
            CommandPage.startTriggerFragmentEvent(WorldData.beforeSceneObjectTouchHandle, trigger, executor);
            return GameCommand.startSceneObjectCommand(executor.index, 1, null, Callback.New(function () {
                executor.eventCompleteContinue();
                EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_TOUCH_COMMAND, [false]);
                onCommandExecuteOver && onCommandExecuteOver.run();
            }, this), trigger);
        }
        else {
            CommandPage.startTriggerFragmentEvent(WorldData.beforeSceneObjectTouchHandle, trigger, executor);
            return GameCommand.startSceneObjectCommand(executor.index, 1, null, onCommandExecuteOver, trigger);
        }
    };
    Controller.startSceneObjectTouchOutEvent = function (trigger, executor, onCommandExecuteOver) {
        if (onCommandExecuteOver === void 0) { onCommandExecuteOver = null; }
        if (Game.pause) {
            EventUtils.addEventListener(Game, Game.EVENT_PAUSE_CHANGE, Callback.New(Controller.startSceneObjectTouchEvent, this, [trigger, executor, onCommandExecuteOver]), true);
            return false;
        }
        if (!executor.inScene || !trigger.inScene || trigger.scene != Game.currentScene || executor.scene != Game.currentScene)
            return false;
        if (!executor.hasCommand[4])
            return false;
        if (executor.onlyPlayerTouch && trigger != Game.player.sceneObject)
            return false;
        return GameCommand.startSceneObjectCommand(executor.index, 4, null, onCommandExecuteOver, trigger);
    };
    Controller.startEvent = function () {
        this.clearEvent();
        EventUtils.addEventListener(Controller, Controller.EVENT_SCENE_OBJECT_CLICK_COMMAND, Callback.New(this.onCommandStart, this, [Controller.ENABLED_COMMAND_SCENE_OBJECT_CLICK_EXECUTE]));
        EventUtils.addEventListener(Controller, Controller.EVENT_SCENE_OBJECT_TOUCH_COMMAND, Callback.New(this.onCommandStart, this, [Controller.ENABLED_COMMAND_SCENE_OBJECT_TOUCH_EXECUTE]));
    };
    Controller.clearEvent = function () {
        EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_CLICK_COMMAND, [false]);
        EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_TOUCH_COMMAND, [false]);
    };
    Controller.onCommandStart = function (enabledID, isStart) {
        Controller.enabledMapping[enabledID] = !isStart;
    };
    Controller.EVENT_CONTROLLER_START = "ControllerEVENT_CONTROLLER_START";
    Controller.EVENT_CONTROLLER_STOP = "ControllerEVENT_CONTROLLER_STOP";
    Controller.EVENT_SCENE_OBJECT_CLICK_COMMAND = "GameCommand_EVENT_SCENE_OBJECT_CLICK_COMMAND";
    Controller.EVENT_SCENE_OBJECT_TOUCH_COMMAND = "GameCommand_EVENT_SCENE_OBJECT_TOUCH_COMMAND";
    Controller.ENABLED_COMMAND_SCENE_OBJECT_CLICK_EXECUTE = 0;
    Controller.ENABLED_COMMAND_SCENE_OBJECT_TOUCH_EXECUTE = 1;
    Controller.enabledMapping = {
        0: true,
        1: true
    };
    Controller.inputState = 0;
    return Controller;
}());
//# sourceMappingURL=Controller.js.map