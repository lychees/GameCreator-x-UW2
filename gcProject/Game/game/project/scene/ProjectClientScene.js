




var ProjectClientScene = (function (_super) {
    __extends(ProjectClientScene, _super);
    function ProjectClientScene() {
        _super.call(this);
    }
    ProjectClientScene.init = function () {
        SinglePlayerGame.regSaveCustomData("Scene", Callback.New(this.getSaveData, this));
        EventUtils.addEventListener(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, Callback.New(this.onInSceneStateChange, this));
    };
    ProjectClientScene.getSceneObjectBySetting = function (soType, soIndex, pointSoMode, soIndexVarID, trigger) {
        if (pointSoMode === void 0) { pointSoMode = 0; }
        if (soIndexVarID === void 0) { soIndexVarID = 0; }
        if (trigger === void 0) { trigger = null; }
        var so;
        if (soType == 0) {
            so = Game.player.sceneObject;
        }
        else if (soType == 1) {
            so = trigger ? trigger.trigger : Game.player.sceneObject;
        }
        else if (soType == 2) {
            so = trigger ? trigger.executor : Game.player.sceneObject;
        }
        else if (soType == 3) {
            if (!Game.currentScene)
                return null;
            if (pointSoMode == 1) {
                soIndex = Game.player.variable.getVariable(soIndexVarID);
            }
            so = soIndex < 0 ? null : Game.currentScene.sceneObjects[soIndex];
        }
        return so;
    };
    ProjectClientScene.createSceneHelper = function (sceneID, onFin) {
        var scene = ProjectClientScene.sceneHelpers[sceneID];
        if (scene) {
            onFin.runWith([scene, true]);
            return;
        }
        if (ProjectClientScene.sceneHelperLoadings[sceneID]) {
            EventUtils.addEventListener(ProjectClientScene, "____createSceneHelper", onFin, true);
            return;
        }
        ProjectClientScene.sceneHelperLoadings[sceneID] = true;
        ClientScene.createScene(sceneID, Callback.New(function (scene) {
            ProjectClientScene.sceneHelpers[scene.id] = scene;
            delete ProjectClientScene.sceneHelperLoadings[sceneID];
            onFin.runWith([scene, false]);
            EventUtils.happen(ProjectClientScene, "____createSceneHelper", [scene, false]);
        }, this));
    };
    ProjectClientScene.disposeSceneHelper = function (sceneID) {
        var scene = ProjectClientScene.sceneHelpers[sceneID];
        if (scene) {
            scene.dispose();
            delete ProjectClientScene.sceneHelpers[sceneID];
            return true;
        }
        return false;
    };
    ProjectClientScene.prototype.parse = function (jsonObj, gameData) {
        _super.prototype.parse.call(this, jsonObj, gameData);
        this.gen();
        this.sceneUtils = new SceneUtils(this);
    };
    ProjectClientScene.prototype.gen = function () {
        if (Roguelike.firstblood == false) {
            Roguelike.firstblood = true;
        }
        else {
            var a = this.LayerDatas[0].tileData;
            var a1 = this.LayerDatas[1].tileData;
            var w = this.gridWidth;
            var h = this.gridHeight;
            var oy = 820;
            var ox = 348;
            for (var x = 0; x < w; ++x) {
                if (a[x] == null)
                    a[x] = [];
                if (a1[x] == null)
                    a1[x] = [];
            }
            for (var x = 0; x < 100; ++x) {
                for (var y = 0; y < 100; ++y) {
                    if (a[y][x] == null) {
                        a[y][x] = {
                            'texID': 12,
                            'x': 0,
                            'y': 0,
                        };
                    }
                    var idx = Roguelike.world_map[(ox + x) * Roguelike.WORLD_MAP_COLUMNS + oy + y] - 1;
                    a[y][x].texID = 12;
                    a[y][x].x = 16 * (idx % 16);
                    a[y][x].y = 16 * (Math.floor(idx / 16));
                    a[y][x].texID = 15;
                    if (58 <= idx && idx <= 61) {
                        a[y][x].x = 32;
                        a[y][x].y = 48;
                        if (a1[y][x] == null) {
                            a1[y][x] = {
                                'texID': 15,
                                'x': 0,
                                'y': 0,
                            };
                        }
                        a1[y][x].x = Roguelike.uw2_to_has[idx].x * 16;
                        a1[y][x].y = Roguelike.uw2_to_has[idx].y * 16;
                    }
                    else {
                        if (Roguelike.uw2_to_has[idx] != null) {
                            a[y][x].x = Roguelike.uw2_to_has[idx].x * 16;
                            a[y][x].y = Roguelike.uw2_to_has[idx].y * 16;
                        }
                        else {
                            a[y][x].x = 32;
                            a[y][x].y = 48;
                        }
                    }
                }
            }
        }
    };
    ProjectClientScene.prototype.onRender = function () {
        _super.prototype.onRender.apply(this, arguments);
        this.debugRender();
    };
    ProjectClientScene.prototype.addSceneObject = function (soData, isSoc, useModelClass) {
        if (isSoc === void 0) { isSoc = false; }
        if (useModelClass === void 0) { useModelClass = false; }
        var soc = _super.prototype.addSceneObject.apply(this, arguments);
        if (soc) {
            this.sceneUtils.updateDynamicObsAndBridge(soc, true);
        }
        return soc;
    };
    ProjectClientScene.prototype.removeSceneObject = function (so, removeFromList) {
        if (removeFromList === void 0) { removeFromList = true; }
        var soc = _super.prototype.removeSceneObject.apply(this, arguments);
        if (soc instanceof ProjectSceneObject_1) {
            var pSo = soc;
            pSo.clearMyTouchRecord();
            pSo.clearTouchMeRecord();
            this.sceneUtils.updateDynamicObsAndBridge(soc, false);
        }
        return soc;
    };
    ProjectClientScene.prototype.debugRender = function () {
        if (WorldData.gridObsDebug && os.inGC()) {
            if (!this.debugLayer) {
                this.debugLayer = new ClientSceneLayer(this);
                this.addLayer(this.debugLayer);
                this.debugLayer.alpha = 0.7;
            }
            this.debugLayer.graphics.clear();
            var obstacleData = this.dataLayers[0];
            for (var x = 0; x < this.gridWidth; x++) {
                for (var y = 0; y < this.gridHeight; y++) {
                    var gridStatus = this.sceneUtils.getGridDynamicObsStatus(new Point(x, y));
                    if (gridStatus == 2 && obstacleData[x] && obstacleData[x][y]) {
                        this.debugLayer.graphics.drawRect(x * Config.SCENE_GRID_SIZE, y * Config.SCENE_GRID_SIZE, Config.SCENE_GRID_SIZE, Config.SCENE_GRID_SIZE, "#FF00FF");
                    }
                    if (gridStatus == 2) {
                        this.debugLayer.graphics.drawRect(x * Config.SCENE_GRID_SIZE, y * Config.SCENE_GRID_SIZE, Config.SCENE_GRID_SIZE, Config.SCENE_GRID_SIZE, "#FF6600");
                    }
                    else if (obstacleData[x] && obstacleData[x][y]) {
                        this.debugLayer.graphics.drawRect(x * Config.SCENE_GRID_SIZE, y * Config.SCENE_GRID_SIZE, Config.SCENE_GRID_SIZE, Config.SCENE_GRID_SIZE, "#FF0000");
                    }
                }
            }
        }
    };
    ProjectClientScene.onInSceneStateChange = function (inNewSceneState) {
        if (inNewSceneState == 2) {
            if (GameGate.gateState == GameGate.STATE_1_START_LOAD_SCENE) {
                this.beforeRetorySaveData();
            }
            else if (GameGate.gateState == GameGate.STATE_2_START_EXECUTE_IN_SCENE_EVENT) {
                this.retorySceneObjectSaveData();
            }
            else if (GameGate.gateState == GameGate.STATE_3_IN_SCENE_COMPLETE) {
                this.retorySceneSaveData();
            }
        }
    };
    ProjectClientScene.getSaveData = function () {
        if (!Game.currentScene || Game.currentScene == ClientScene.EMPTY)
            return;
        var soCustomDatas = [];
        for (var i in Game.currentScene.sceneObjects) {
            var so = Game.currentScene.sceneObjects[i];
            if (!so || !(so instanceof ProjectSceneObject_1))
                continue;
            if (so.getSaveData)
                soCustomDatas[i] = so.getSaveData();
        }
        return soCustomDatas;
    };
    ProjectClientScene.beforeRetorySaveData = function () {
        var _this = this;
        EventUtils.addEventListener(SinglePlayerGame, SinglePlayerGame.EVENT_RECOVER_TRIGGER, Callback.New(function (trigger) {
            if ((trigger.mainType == CommandTrigger.COMMAND_MAIN_TYPE_SCENE && trigger.indexType == 0) ||
                (trigger.mainType == CommandTrigger.COMMAND_MAIN_TYPE_SCENE_OBJECT && trigger.indexType == 0) ||
                (trigger.mainType == CommandTrigger.COMMAND_MAIN_TYPE_SCENE_OBJECT && trigger.indexType == 1 &&
                    trigger.trigger == Game.player.sceneObject && trigger.executor.waitTouchEvent)) {
                ProjectClientScene.hasRetoryWaitEvent = true;
                EventUtils.addEventListener(trigger, CommandTrigger.EVENT_OVER, Callback.New(function (trigger) {
                    if (trigger.executor != Game.player.sceneObject)
                        trigger.executor.eventCompleteContinue();
                    Controller.start();
                }, _this, [trigger]), true);
            }
        }, this));
    };
    ProjectClientScene.retorySceneObjectSaveData = function () {
        var soCustomDatas = SinglePlayerGame.getSaveCustomData("Scene");
        for (var i in soCustomDatas) {
            var soData = soCustomDatas[i];
            var so = Game.currentScene.sceneObjects[i];
            if (so && soData && so.retorySaveData)
                so.retorySaveData(soData);
        }
    };
    ProjectClientScene.retorySceneSaveData = function () {
        if (!ProjectClientScene.hasRetoryWaitEvent) {
            Controller.start();
        }
    };
    ProjectClientScene.sceneHelpers = {};
    ProjectClientScene.sceneHelperLoadings = {};
    return ProjectClientScene;
}(ClientScene));
//# sourceMappingURL=ProjectClientScene.js.map