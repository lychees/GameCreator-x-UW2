




var ProjectSceneObject_1 = (function (_super) {
    __extends(ProjectSceneObject_1, _super);
    function ProjectSceneObject_1(soData, scene) {
        var _this = this;
        _super.call(this, soData, scene);
        this.pos = new Point();
        this.posGrid = new Point(-1, -1);
        this.posRect = new Rectangle();
        this.behaviors = [];
        this.myLastTouchObjects = [];
        this.tempGridPosHelper = new Point();
        if (!this.root)
            return;
        if (WorldData.rectObsDebug && os.inGC()) {
            var size = WorldData.sceneObjectCollisionSize;
            var rect = new Rectangle(-size / 2, -size / 2, size - 1, size - 1);
            this.root.graphics.drawLines(0, 0, [rect.x, rect.y, rect.right, rect.y, rect.right, rect.bottom, rect.x, rect.bottom, rect.x, rect.y], "#FF0000", 1);
        }
        if (GameGate.gateState >= GameGate.STATE_3_IN_SCENE_COMPLETE) {
            this.init();
        }
        else {
            var initCB = Callback.New(function () {
                if (GameGate.gateState == GameGate.STATE_3_IN_SCENE_COMPLETE) {
                    _this.init();
                    EventUtils.removeEventListener(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, initCB);
                }
            }, this);
            EventUtils.addEventListener(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, initCB);
        }
    }
    ProjectSceneObject_1.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    ProjectSceneObject_1.prototype.getSaveData = function () {
        var o = { myLastTouchObjects: [], moveState: null, recordMoveRoadInfo: this.recordMoveRoadInfo, eventStartWaitInfo: this.eventStartWaitInfo };
        for (var i = 0; i < this.myLastTouchObjects.length; i++) {
            var myLastTouchSo = this.myLastTouchObjects[i];
            if (myLastTouchSo)
                o.myLastTouchObjects[i] = myLastTouchSo.index;
        }
        o.moveState = this.getRecordMoveState();
        if (this.isJumping) {
            o.jumpState = {
                jumpTo: [this.jumpToPoint.x, this.jumpToPoint.y],
                currentJumpFrame: this.currentJumpFrame
            };
        }
        return o;
    };
    ProjectSceneObject_1.prototype.retorySaveData = function (o) {
        this.isFromRecorySaveData = true;
        for (var i = 0; i < o.myLastTouchObjects.length; i++) {
            var myLastTouchSoIndex = o.myLastTouchObjects[i];
            if (myLastTouchSoIndex != null) {
                var myLastTouchSo = Game.currentScene.sceneObjects[myLastTouchSoIndex];
                if (myLastTouchSo)
                    this.myLastTouchObjects.push(myLastTouchSo);
            }
        }
        this.restoryMove(o.moveState, true);
        this.recordMoveRoadInfo = o.recordMoveRoadInfo;
        this.eventStartWaitInfo = o.eventStartWaitInfo;
        if (o.jumpState) {
            this.jumpTo(o.jumpState.jumpTo[0], o.jumpState.jumpTo[1], o.jumpState.currentJumpFrame);
        }
    };
    ProjectSceneObject_1.prototype.update = function (nowTime) {
        if (this.isMoving)
            this.updateCoordinate(nowTime);
        this.updateBehavior();
        this.parallelEventUpdate();
    };
    ProjectSceneObject_1.prototype.addBehavior = function (behaviorData, loop, targetSceneObject, onOver, cover, startIndex, Immediate, forceStopLastBehavior, delayFrame, executor) {
        var _this = this;
        if (startIndex === void 0) { startIndex = 0; }
        if (Immediate === void 0) { Immediate = true; }
        if (forceStopLastBehavior === void 0) { forceStopLastBehavior = false; }
        if (delayFrame === void 0) { delayFrame = 0; }
        if (executor === void 0) { executor = null; }
        if (this == Game.player.sceneObject) {
            CommandPage.startTriggerFragmentEvent(WorldData.beforePlaySceneObjectBehaviorHandle1, Game.player.sceneObject, Game.player.sceneObject);
        }
        var soBehavior = new ProjectSceneObjectBehaviors(this, loop, targetSceneObject, Callback.New(function (onOver, soBehavior) {
            var idx = _this.behaviors.indexOf(soBehavior);
            if (idx != -1)
                _this.behaviors.splice(idx, 1);
            onOver && onOver.run();
            _this.updateBehavior();
        }, this, [onOver]), startIndex, executor);
        soBehavior.setBehaviors(behaviorData, delayFrame);
        if (forceStopLastBehavior) {
            this.stopBehavior();
        }
        if (cover)
            this.behaviors.length = 0;
        this.behaviors.push(soBehavior);
        if (Immediate)
            this.updateBehavior();
        return soBehavior;
    };
    ProjectSceneObject_1.prototype.stopBehavior = function () {
        if (this._isMoving) {
            this.stopMove();
        }
    };
    ProjectSceneObject_1.prototype.getBehaviorLayer = function () {
        return this.behaviors.length;
    };
    ProjectSceneObject_1.prototype.setTo = function (x, y, stopMove, integer, alreadySetTempPosHelper, alreadySetRect, clacTouchEvent) {
        if (stopMove === void 0) { stopMove = true; }
        if (integer === void 0) { integer = true; }
        if (alreadySetTempPosHelper === void 0) { alreadySetTempPosHelper = false; }
        if (alreadySetRect === void 0) { alreadySetRect = false; }
        if (clacTouchEvent === void 0) { clacTouchEvent = true; }
        if (this.isJumping)
            return;
        if (stopMove)
            this.isMoving = false;
        if (integer) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        this._x = x;
        this._y = y;
        this.root.pos(x, y);
        this.refreshCoordinate(alreadySetTempPosHelper, alreadySetRect, clacTouchEvent);
    };
    ProjectSceneObject_1.prototype.autoFindRoadMove = function (toX, toY, ifObstacleHandleMode, costTime, useAstar, whenCantMoveRetry, useGridObstacle, forceDir4, fromAutoRetry) {
        if (ifObstacleHandleMode === void 0) { ifObstacleHandleMode = 0; }
        if (costTime === void 0) { costTime = 0; }
        if (useAstar === void 0) { useAstar = true; }
        if (whenCantMoveRetry === void 0) { whenCantMoveRetry = false; }
        if (useGridObstacle === void 0) { useGridObstacle = true; }
        if (forceDir4 === void 0) { forceDir4 = false; }
        if (fromAutoRetry === void 0) { fromAutoRetry = false; }
        if (this.isJumping)
            return;
        var currentScene = Game.currentScene;
        var realLineArr;
        var toP = new Point(toX, toY);
        currentScene.sceneUtils.limitInside(toP);
        if (ClientWorld.data.moveToGridCenter) {
            GameUtils.getGridCenter(toP, toP);
        }
        if (toP.x == this.x && toP.y == this.y)
            return;
        var moveDir4 = forceDir4 ? true : WorldData.moveDir4;
        this.clearRetryAutoFindRoadMove();
        if (this.through && !moveDir4) {
            realLineArr = [[toP.x, toP.y]];
        }
        else {
            if (ifObstacleHandleMode != 2) {
                if (currentScene.sceneUtils.isObstacle(toP, this)) {
                    if (ifObstacleHandleMode == 0) {
                        if (whenCantMoveRetry)
                            this.retryAutoFindRoadMove(toX, toY, ifObstacleHandleMode, costTime, useAstar, whenCantMoveRetry, useGridObstacle);
                        return;
                    }
                    var gridP = GameUtils.getGridPostion(toP);
                    var myGridP = GameUtils.getGridPostion(new Point(this.x, this.y));
                    gridP = SceneUtils.getNearThroughGrid(gridP, myGridP);
                    if (!gridP) {
                        if (whenCantMoveRetry)
                            this.retryAutoFindRoadMove(toX, toY, ifObstacleHandleMode, costTime, useAstar, whenCantMoveRetry, useGridObstacle);
                        return;
                    }
                    gridP.x *= Config.SCENE_GRID_SIZE;
                    gridP.y *= Config.SCENE_GRID_SIZE;
                    toP = GameUtils.getGridCenter(gridP, toP);
                }
            }
            if (useAstar && (SceneUtils.twoPointHasObstacle(this.x, this.y, toP.x, toP.y, Game.currentScene, this, ifObstacleHandleMode == 2) || moveDir4)) {
                realLineArr = AstarUtils.moveTo(this.x, this.y, toP.x, toP.y, Game.currentScene.gridWidth, Game.currentScene.gridHeight, Game.currentScene, moveDir4, ifObstacleHandleMode == 2);
                if (!realLineArr) {
                    if (whenCantMoveRetry) {
                        this.retryAutoFindRoadMove(toX, toY, ifObstacleHandleMode, costTime, useAstar, whenCantMoveRetry, useGridObstacle);
                    }
                    return;
                }
            }
            else {
                realLineArr = [[toP.x, toP.y]];
            }
        }
        if (whenCantMoveRetry) {
            this.off(ProjectSceneObject_1.COLLISION, this, this.retryAutoFindRoadMove);
            this.once(ProjectSceneObject_1.COLLISION, this, this.retryAutoFindRoadMove, [toX, toY, ifObstacleHandleMode, costTime, useAstar, whenCantMoveRetry, useGridObstacle]);
        }
        this.doStartMove(realLineArr, costTime, useGridObstacle, fromAutoRetry);
    };
    ProjectSceneObject_1.prototype.startMove = function (movePath, costTime, useGridObstacle, onMoveOver) {
        if (costTime === void 0) { costTime = 0; }
        if (useGridObstacle === void 0) { useGridObstacle = false; }
        if (onMoveOver === void 0) { onMoveOver = null; }
        if (this.isJumping)
            return;
        this.onMoveOver = onMoveOver;
        this.clearRetryAutoFindRoadMove();
        this.doStartMove.apply(this, arguments);
    };
    ProjectSceneObject_1.prototype.stopMove = function () {
        this.isMoving = false;
        this.clearRetryAutoFindRoadMove();
    };
    ProjectSceneObject_1.prototype.jumpTo = function (x, y, costFrame) {
        var _this = this;
        if (costFrame === void 0) { costFrame = 0; }
        if (this.isJumping)
            return;
        this.isMoving = false;
        this.isJumping = true;
        this.jumpToPoint = new Point(x, y);
        this.event(ProjectSceneObject_1.JUMP_START);
        var oldX = this.x;
        var oldY = this.y;
        var toJumpUpY = -ClientWorld.data.jumpHeight;
        var toJumpDownY = 0;
        var oldJumpY = this.jumpY;
        this.currentJumpFrame = costFrame;
        if (!this.fixOri) {
            if (this.x != x || this.y != y) {
                var dir = GameUtils.getOriByAngle(MathUtils.direction360(this.x, this.y, x, y));
                this.avatarOri = dir;
            }
        }
        var frameTotal = Math.ceil(ClientWorld.data.jumpTimeCost * 1000 / Game.oneFrame);
        var frameHalf = frameTotal / 2;
        os.add_ENTERFRAME(function () {
            if (_this.isDisposed) {
                os.remove_ENTERFRAME(arguments.callee, _this);
                return;
            }
            if (Game.pause)
                return;
            _this.currentJumpFrame++;
            if (_this.currentJumpFrame > frameTotal) {
                os.remove_ENTERFRAME(arguments.callee, _this);
                _this.isJumping = false;
                if (_this.inScene) {
                    _this.refreshCoordinate();
                    _this.event(ProjectSceneObject_1.JUMP_OVER);
                }
                return;
            }
            var per1 = _this.currentJumpFrame / frameTotal;
            var func1 = Ease.linearNone;
            _this.x = func1(per1, oldX, x - oldX, 1);
            _this.y = func1(per1, oldY, y - oldY, 1);
            if (_this.currentJumpFrame <= frameHalf) {
                var per2 = _this.currentJumpFrame / frameHalf;
                var func2 = Ease.quintOut;
                var toJumpY = toJumpUpY;
            }
            else {
                per2 = (_this.currentJumpFrame - frameHalf) / frameHalf;
                func2 = Ease.quintIn;
                toJumpY = toJumpDownY;
                oldJumpY = toJumpUpY;
            }
            var jumpY = func2(per2, oldJumpY, toJumpY - oldJumpY, 1);
            _this.jumpY = jumpY;
        }, this);
    };
    ProjectSceneObject_1.prototype.getRecordMoveState = function () {
        if (!this._isMoving)
            return null;
        return {
            useGridObstacle: this.useGridObstacle,
            roadsArr: ObjectUtils.depthClone(this.roadsArr),
            roadMax: this.roadMax,
            nowRoad: this.nowRoad,
            nowRoadStartDate: this.nowRoadStartDate,
            nowRoadTime: this.nowRoadTime,
            thisRoadS: this.thisRoadS,
            recordNow: Game.now,
            moveSpeed: this.moveSpeed
        };
    };
    ProjectSceneObject_1.prototype.restoryMove = function (recordMoveStateInfo, force) {
        if (force === void 0) { force = false; }
        if (!recordMoveStateInfo)
            return;
        if (force || !this._isMoving) {
            this.useGridObstacle = recordMoveStateInfo.useGridObstacle;
            this.roadsArr = recordMoveStateInfo.roadsArr;
            this.nowRoad = recordMoveStateInfo.nowRoad;
            this.nowRoadStartDate = recordMoveStateInfo.nowRoadStartDate + (Game.now - recordMoveStateInfo.recordNow);
            this.nowRoadTime = recordMoveStateInfo.nowRoadTime;
            this.thisRoadS = recordMoveStateInfo.thisRoadS;
            if (this.moveSpeed != recordMoveStateInfo.moveSpeed) {
                var t = Game.now - this.nowRoadStartDate;
                var s = t * recordMoveStateInfo.moveSpeed;
                var roadArr = [];
                for (var i = this.nowRoad + 1; i < this.roadsArr.length; i++) {
                    var p = this.roadsArr[i];
                    roadArr.push([p.x, p.y]);
                }
                this.startMove(roadArr, 0, this.useGridObstacle);
            }
            else {
                for (var rs in this.roadsArr) {
                    var pointClone = this.roadsArr[rs];
                    this.roadsArr[rs] = new Point(pointClone.x, pointClone.y);
                }
                this.changeMoveAction(true);
                this._isMoving = true;
            }
        }
    };
    ProjectSceneObject_1.prototype.refreshCoordinate = function (alreadySetTempPosHelper, alreadySetRect, clacTouchEvent) {
        if (alreadySetTempPosHelper === void 0) { alreadySetTempPosHelper = false; }
        if (alreadySetRect === void 0) { alreadySetRect = false; }
        if (clacTouchEvent === void 0) { clacTouchEvent = true; }
        if (!this.inScene)
            return;
        var scene = this.scene;
        if (!scene || scene.isDisposed)
            return;
        if (scene.camera.sceneObject == this) {
            scene.updateCamera();
        }
        this.updateShadow();
        this.pos.x = this.x;
        this.pos.y = this.y;
        if (!alreadySetTempPosHelper)
            GameUtils.getGridPostion(this.pos, this.tempGridPosHelper);
        if (!alreadySetRect) {
            this.posRect.x = this.x;
            this.posRect.y = this.y;
            this.posRect.width = this.posRect.height = WorldData.sceneObjectCollisionSize - 1;
        }
        if (this.posGrid.x != this.tempGridPosHelper.x || this.posGrid.y != this.tempGridPosHelper.y) {
            this.posGrid.x = this.tempGridPosHelper.x;
            this.posGrid.y = this.tempGridPosHelper.y;
            scene.sceneUtils.updateDynamicObsAndBridge(this, true, this.posGrid);
            this.root.alpha = scene.sceneUtils.isMaskGrid(this.posGrid) ? 0.5 : 1;
        }
        if (clacTouchEvent) {
            var touchRes = scene.sceneUtils.touchCheck(this, false, this.pos, this.tempGridPosHelper, this.pos, this.tempGridPosHelper);
            this.touchEventHandle(touchRes);
        }
    };
    ProjectSceneObject_1.prototype.eventStartWait = function (trigger, faceToTrigger) {
        if (faceToTrigger === void 0) { faceToTrigger = true; }
        if (this.eventStartWaitInfo)
            return false;
        if (this.fixOri)
            faceToTrigger = false;
        this.eventStartWaitInfo = {
            faceToTrigger: faceToTrigger,
            oldOri: this.avatar.orientation,
            moveState: this.getRecordMoveState()
        };
        this.lockBehaviorLayer = this.getBehaviorLayer();
        if (this.isMoving)
            this.stopMove();
        if (faceToTrigger) {
            this.addBehavior([[25, 1]], false, trigger, null, false);
            this.once(ProjectSceneObject_1.CHANGE_ORI, this, this.onExecuteWaitEventChangeOri);
            this.once(ProjectSceneObject_1.MOVE_START, this, this.onExecuteWaitEventNewMove);
        }
        return true;
    };
    ProjectSceneObject_1.prototype.eventCompleteContinue = function () {
        if (!this.eventStartWaitInfo)
            return false;
        this.off(ProjectSceneObject_1.CHANGE_ORI, this, this.onExecuteWaitEventChangeOri);
        this.off(ProjectSceneObject_1.MOVE_START, this, this.onExecuteWaitEventNewMove);
        this.lockBehaviorLayer = 0;
        if (this.eventStartWaitInfo.faceToTrigger)
            this.avatarOri = this.eventStartWaitInfo.oldOri;
        this.restoryMove(this.eventStartWaitInfo.moveState, true);
        this.eventStartWaitInfo = null;
        return true;
    };
    ProjectSceneObject_1.prototype.clearMyTouchRecord = function (targetSo) {
        if (targetSo === void 0) { targetSo = null; }
        if (targetSo) {
            ArrayUtils.remove(this.myLastTouchObjects, targetSo);
        }
        else {
            this.myLastTouchObjects.length = 0;
        }
    };
    ProjectSceneObject_1.prototype.clearTouchMeRecord = function () {
        for (var i = 0; i < Game.currentScene.sceneObjects.length; i++) {
            var targetSo = Game.currentScene.sceneObjects[i];
            if (targetSo instanceof ProjectSceneObject_1)
                targetSo.clearMyTouchRecord(this);
        }
    };
    Object.defineProperty(ProjectSceneObject_1.prototype, "touchEnabled", {
        get: function () {
            return this.inScene && this.scene.sceneObjects[this.index] == this && !this.isJumping;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProjectSceneObject_1.prototype, "lastTouchObjects", {
        get: function () {
            return this.myLastTouchObjects;
        },
        enumerable: true,
        configurable: true
    });
    ProjectSceneObject_1.prototype.isInMyTouchList = function (targetSo) {
        return this.myLastTouchObjects.indexOf(targetSo) != -1;
    };
    ProjectSceneObject_1.prototype.doStartMove = function (movePath, costTime, useGridObstacle, fromAutoRetry) {
        if (costTime === void 0) { costTime = 0; }
        if (useGridObstacle === void 0) { useGridObstacle = false; }
        if (fromAutoRetry === void 0) { fromAutoRetry = false; }
        var roadsArr = [new Point(this.x, this.y)];
        for (var i in movePath) {
            roadsArr.push(new Point(movePath[i][0], movePath[i][1]));
        }
        var lastPoint = roadsArr[roadsArr.length - 1];
        if (roadsArr.length == 2 && lastPoint.x == this.x && lastPoint.y == this.y) {
            return;
        }
        this.useGridObstacle = useGridObstacle;
        var now = Game.now;
        if (this._isMoving)
            this.updateCoordinate(now);
        this.roadMax = roadsArr.length;
        if (movePath && this.roadMax > 1) {
            this.nowRoadStartDate = now;
            this.nowRoadStartDate -= costTime;
            this.roadsArr = roadsArr;
            this.isMoving = true;
            this.event(ProjectSceneObject_1.MOVE_START, [fromAutoRetry]);
        }
    };
    Object.defineProperty(ProjectSceneObject_1.prototype, "isMoving", {
        get: function () { return this._isMoving; },
        set: function (isMove) {
            if (isMove) {
                this.changeMoveAction(true);
                this.nowRoad = 0;
                this.nowRoadTime = 0;
                this._isMoving = isMove;
                var now = Game.now;
                this.updateCoordinate(now);
            }
            else {
                this.changeMoveAction(false);
                this._isMoving = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    ProjectSceneObject_1.prototype.changeMoveAction = function (isMove) {
        if (isMove) {
            if (this.moveAutoChangeAction) {
                var moveAct = WorldData.sceneObjectMoveStartAct;
                if (WorldData.useSceneObjectMoveStartAct2 && this.moveSpeed >= WorldData.sceneObjectMoveStartAct2Speed &&
                    ArrayUtils.matchAttributes(this.avatar.actionList, { id: WorldData.sceneObjectMoveStartAct2 }, true)) {
                    moveAct = WorldData.sceneObjectMoveStartAct2;
                }
                this.avatarAct = moveAct;
            }
        }
        else {
            if (this.moveAutoChangeAction) {
                this.avatarAct = 1;
            }
        }
    };
    ProjectSceneObject_1.prototype.updateCoordinate = function (_nowTime) {
        var per;
        var isChangeDir = false;
        var isMoveOver = false;
        var thisRoadP = this.roadsArr[this.nowRoad];
        var nextRoadP = this.roadsArr[this.nowRoad + 1];
        if (this.nowRoadTime == 0) {
            var thisRoadS = this.thisRoadS = thisRoadP.distance(nextRoadP.x, nextRoadP.y);
            this.nowRoadTime = thisRoadS * 1000 / this.moveSpeed;
            isChangeDir = true;
        }
        var nowRoadEndDate = this.nowRoadStartDate + this.nowRoadTime;
        if (_nowTime > nowRoadEndDate) {
            this.nowRoad++;
            if (this.nowRoad < this.roadMax - 1) {
                this.nowRoadStartDate += this.nowRoadTime;
                this.nowRoadTime = 0;
                this.updateCoordinate(_nowTime);
                return;
            }
            else {
                per = 1;
                this.isMoving = false;
                isMoveOver = true;
            }
        }
        else {
            per = (_nowTime - this.nowRoadStartDate) / this.nowRoadTime;
        }
        if (isChangeDir && !this.fixOri) {
            var dir = GameUtils.getOriByAngle(MathUtils.direction360(this.x, this.y, nextRoadP.x, nextRoadP.y));
            this.avatarOri = dir;
        }
        var nowP = Point.interpolate(nextRoadP, thisRoadP, per);
        var isMoved = this.x != nowP.x || this.y != nowP.y;
        var trendP = new Point(nowP.x, nowP.y);
        var dx = nextRoadP.x - thisRoadP.x;
        var dy = nextRoadP.y - thisRoadP.y;
        var absDx = Math.abs(dx);
        var absDy = Math.abs(dy);
        if (absDx > absDy) {
            trendP.x += dx < 0 ? -1 : 1;
            trendP.y += (nextRoadP.y - thisRoadP.y) * 1 / absDx;
        }
        else {
            trendP.x += (nextRoadP.x - thisRoadP.x) * 1 / absDy;
            trendP.y += dy < 0 ? -1 : 1;
        }
        GameUtils.getGridPostion(nowP, this.tempGridPosHelper);
        if (!this.useGridObstacle) {
            var lastRectX = this.posRect.x;
            var lastRectY = this.posRect.y;
        }
        var touchRes = this.scene.sceneUtils.touchCheck(this, this.useGridObstacle, nowP, this.tempGridPosHelper, trendP, null);
        if (touchRes.isObstacle) {
            if (touchRes.alreadyCalcPosRect) {
                this.posRect.x = lastRectX;
                this.posRect.y = lastRectY;
            }
            if (this.ignoreCantMove) {
                if (this.keepMoveActWhenCollsionObstacleAndIgnoreCantMove) {
                    this._isMoving = false;
                }
                else {
                    this.isMoving = false;
                }
            }
            else {
                this.nowRoadStartDate += Game.oneFrame;
            }
            if (isMoved) {
                var myLastX = this.x;
                var myLastY = this.y;
                var hasTouchEvent = this.touchEventHandle(touchRes);
                if (hasTouchEvent && myLastX == this.x && myLastY == this.y && this._isMoving) {
                    var touchResAgain = this.scene.sceneUtils.touchCheck(this, this.useGridObstacle, nowP, this.tempGridPosHelper, trendP, null);
                    if (!touchResAgain.isObstacle) {
                        this.setTo(nowP.x, nowP.y, false, true, true, touchRes.alreadyCalcPosRect, false);
                    }
                }
            }
            this.event(ProjectSceneObject_1.COLLISION, [touchRes]);
        }
        else {
            this.setTo(nowP.x, nowP.y, false, true, true, touchRes.alreadyCalcPosRect, false);
            if (isMoved)
                this.touchEventHandle(touchRes);
        }
        if (isMoveOver) {
            if (this.onMoveOver)
                this.onMoveOver.run();
            this.event(ProjectSceneObject_1.MOVE_OVER);
        }
    };
    Object.defineProperty(ProjectSceneObject_1.prototype, "jumpY", {
        get: function () {
            return this.avatar ? this.avatar.y : 0;
        },
        set: function (v) {
            if (this.isDisposed)
                return;
            this.avatar.y = v;
            var scale = 1 - (this.avatar.y / -ClientWorld.data.jumpHeight) * 0.5;
            this.drawShadow(scale);
        },
        enumerable: true,
        configurable: true
    });
    ProjectSceneObject_1.prototype.touchEventHandle = function (touchRes) {
        if (this.isFromRecorySaveData && this.fromRecorySaveDataGameFrame == __fCount)
            return false;
        var hasTouchEvent = false;
        for (var t in touchRes.touchSceneObjects) {
            var targetSo = touchRes.touchSceneObjects[t];
            if (!targetSo || targetSo == this)
                continue;
            var canExecuteTargetTouchEvent = true;
            if (!targetSo.repeatedTouchEnabled) {
                var index = this.myLastTouchObjects.indexOf(targetSo);
                if (index != -1) {
                    canExecuteTargetTouchEvent = false;
                }
            }
            if (canExecuteTargetTouchEvent) {
                var hasTouchTargetEvent = Controller.startSceneObjectTouchEvent(this, targetSo);
                if (hasTouchTargetEvent)
                    hasTouchEvent = true;
            }
            var canExecuteMyTouchEvent = true;
            if (!this.repeatedTouchEnabled) {
                var index = targetSo.myLastTouchObjects.indexOf(this);
                if (index != -1) {
                    canExecuteMyTouchEvent = false;
                }
            }
            if (canExecuteMyTouchEvent) {
                var hasTouchMyEvent = Controller.startSceneObjectTouchEvent(targetSo, this);
                if (hasTouchMyEvent)
                    hasTouchEvent = true;
            }
            if (targetSo.myLastTouchObjects.indexOf(this) == -1) {
                targetSo.myLastTouchObjects.push(this);
            }
        }
        var subtractList = ArrayUtils.compare(touchRes.touchSceneObjects, this.myLastTouchObjects).subtract;
        for (var i = 0; i < subtractList.length; i++) {
            var subtractSo = subtractList[i];
            if (subtractSo != this) {
                if (subtractSo.isInMyTouchList(this)) {
                    subtractSo.clearMyTouchRecord(this);
                    var hasTouchTargetOutEvent = Controller.startSceneObjectTouchOutEvent(this, subtractSo);
                    if (hasTouchTargetOutEvent)
                        hasTouchEvent = true;
                }
                var hasTouchMyOutEvent = Controller.startSceneObjectTouchOutEvent(subtractSo, this);
                if (hasTouchMyOutEvent)
                    hasTouchEvent = true;
            }
        }
        this.myLastTouchObjects = touchRes.touchSceneObjects;
        return hasTouchEvent;
    };
    ProjectSceneObject_1.prototype.parallelEventUpdate = function () {
        if (Config.BEHAVIOR_EDIT_MODE)
            return;
        if (GameGate.gateState < GameGate.STATE_4_PLAYER_CONTROL_START)
            return;
        var updateCmdPage = this.customCommandPages[2];
        if (updateCmdPage && updateCmdPage.commands.length != 0) {
            var updateTrigger = this.getCommandTrigger(1, 2, Game.currentScene, this);
            if (updateTrigger) {
                updateCmdPage.startTriggerEvent(updateTrigger);
            }
        }
    };
    ProjectSceneObject_1.prototype.appearEventHandle = function () {
        if (this.hasCommand[3]) {
            GameCommand.startSceneObjectCommand(this.index, 3, null, null, this);
        }
    };
    ProjectSceneObject_1.prototype.init = function () {
        var _this = this;
        this.refreshCoordinate(false, false, false);
        EventUtils.addEventListener(this, SceneObjectEntity.EVENT_CHANGE_STATUS_PAGE_FOR_INSTANCE, Callback.New(this.onStausPageChange, this, [false]));
        EventUtils.addEventListener(Game, Game.EVENT_PAUSE_CHANGE, Callback.New(this.onGamePauseChangeHandle, this));
        if (this.inScene && this.scene && this.scene.sceneObjects[this.index] == this) {
            this.onStausPageChange(true);
        }
        else {
            this.once(EventObject.ADDED, this, function () {
                _this.onStausPageChange(true);
            });
        }
    };
    ProjectSceneObject_1.prototype.onStausPageChange = function (isFirst) {
        var _this = this;
        if (!this.inScene)
            return;
        if (Game.pause) {
            EventUtils.addEventListener(Game, Game.EVENT_PAUSE_CHANGE, Callback.New(this.onStausPageChange, this, []), true);
            return;
        }
        if (!this.isFromRecorySaveData) {
            if (!isFirst) {
                this.clearMyTouchRecord();
                this.clearTouchMeRecord();
            }
            this.startDefBehavior();
            Callback.CallLaterBeforeRender(this.appearEventHandle, this);
            if (!isFirst) {
                Callback.CallLaterBeforeRender(this.refreshCoordinate, this);
            }
        }
        else {
            this.fromRecorySaveDataGameFrame = __fCount;
            Callback.CallLaterBeforeRender(function () { _this.isFromRecorySaveData = false; }, this);
            this.onGamePauseChangeHandle();
        }
    };
    ProjectSceneObject_1.prototype.startDefBehavior = function () {
        this.stopBehavior();
        this.clearBehaviors();
        var beData = SceneObjectBehaviors.toBehaviorData(this.defBehavior);
        if (beData.behaviorData.length > 0) {
            this.addBehavior(beData.behaviorData, beData.loop, this, null, beData.cover, 0, false, beData.forceStopLastBehavior, 0, this);
        }
    };
    ProjectSceneObject_1.prototype.updateBehavior = function () {
        if (Config.BEHAVIOR_EDIT_MODE)
            return;
        if (Game.pause)
            return;
        if (!this.inScene || GameGate.gateState < GameGate.STATE_3_IN_SCENE_COMPLETE || Game.currentScene.sceneObjects[this.index] != this)
            return;
        if (this.behaviors.length > 0) {
            var layer = this.behaviors.length - 1;
            if (layer < this.lockBehaviorLayer)
                return;
            var newestBehavior = this.behaviors[this.behaviors.length - 1];
            newestBehavior.update();
        }
    };
    ProjectSceneObject_1.prototype.retryAutoFindRoadMove = function (toX, toY, ifObstacleHandleMode, costTime, useAstar, whenCantMoveRetry, useGridObstacle, touchRes) {
        var _this = this;
        if (ifObstacleHandleMode === void 0) { ifObstacleHandleMode = 0; }
        if (costTime === void 0) { costTime = 0; }
        if (useAstar === void 0) { useAstar = true; }
        if (whenCantMoveRetry === void 0) { whenCantMoveRetry = false; }
        if (useGridObstacle === void 0) { useGridObstacle = true; }
        if (touchRes === void 0) { touchRes = null; }
        if (touchRes && !touchRes.isObstacle)
            return;
        this.clearRetryAutoFindRoadMove(false);
        this.needRetryAutoFindRoadMoveSign = setFrameout(function () {
            if (_this.isDisposed || !_this.inScene)
                return;
            _this.autoFindRoadMove(toX, toY, ifObstacleHandleMode, costTime, useAstar, whenCantMoveRetry, useGridObstacle, false, true);
        }, 16);
    };
    ProjectSceneObject_1.prototype.clearRetryAutoFindRoadMove = function (offCollisionEvent) {
        if (offCollisionEvent === void 0) { offCollisionEvent = true; }
        if (Game.player.sceneObject == this)
            this.off(ProjectSceneObject_1.COLLISION, this, this.retryAutoFindRoadMove);
        if (this.needRetryAutoFindRoadMoveSign)
            clearFrameout(this.needRetryAutoFindRoadMoveSign);
        this.needRetryAutoFindRoadMoveSign = null;
    };
    ProjectSceneObject_1.prototype.onSystemCommandStart = function (mode) {
        if (this == Game.player.sceneObject)
            this.stopMove();
    };
    ProjectSceneObject_1.prototype.onExecuteWaitEventChangeOri = function () {
        if (this.eventStartWaitInfo)
            this.eventStartWaitInfo.faceToTrigger = false;
    };
    ProjectSceneObject_1.prototype.onExecuteWaitEventNewMove = function () {
        if (this.eventStartWaitInfo) {
            this.eventStartWaitInfo.moveState = null;
        }
    };
    ProjectSceneObject_1.prototype.onGamePauseChangeHandle = function () {
        for (var i in this.triggerLines) {
            var trigger = this.triggerLines[i];
            if (trigger && trigger.mainType == CommandTrigger.COMMAND_MAIN_TYPE_SCENE_OBJECT)
                trigger.delayPause = Game.pause;
        }
    };
    ProjectSceneObject_1.CHANGE_ORI = "so_1CHANGE_ORI";
    ProjectSceneObject_1.MOVE_START = "so_1MOVE_START";
    ProjectSceneObject_1.MOVE_OVER = "so_1MOVE_OVER";
    ProjectSceneObject_1.JUMP_START = "so_1JUMP_START";
    ProjectSceneObject_1.JUMP_OVER = "so_1JUMP_OVER";
    ProjectSceneObject_1.COLLISION = "so_1COLLISION";
    return ProjectSceneObject_1;
}(ClientSceneObject_1));
ObjectUtils.reDefineGetSet("ProjectSceneObject_1.prototype", {
    avatarOri: function (v) {
        if (this.avatar) {
            if (this.avatar.orientation != v)
                this.avatar.orientation = v;
            this.event(ProjectSceneObject_1.CHANGE_ORI);
        }
    }
});
//# sourceMappingURL=ProjectSceneObject_1.js.map