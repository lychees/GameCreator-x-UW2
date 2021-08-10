/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */
/**
 * 场景对象模型：人物和物件
 */
class ClientSceneObject_1 extends ClientSceneObject {
    selectEnabled: boolean; // = true; 允许光标选中
    through: boolean; // = false; 穿透
    bridge: boolean; // = false; 桥属性
    fixOri: boolean; // = false; 固定朝向
    ignoreCantMove: boolean; // = false; 忽略无法移动的场合
    moveAutoChangeAction: boolean; // = true; 移动时更换动作
    lockBehaviorLayer: number; // = 0; 执行点击事件中
    keepMoveActWhenCollsionObstacleAndIgnoreCantMove: boolean; // = false; 当碰到障碍时且处于忽略无法移动的场合时保持移动动作
    behaviorDir4: boolean; // = false; 行为四方向限定
    repeatedTouchEnabled: boolean; // = true; 允许重复接触
    onlyPlayerTouch: boolean; // = false; 仅允许玩家触发碰触事件
    waitTouchEvent: boolean; // = false; 碰触事件执行时等待
    moveSpeed: number; // = 150; 移动速度
    defBehavior: string; // = ""; 默认行为
    battlerSetting: DataStructure_battlerSetting; // 战斗者设定
    constructor(soData: SceneObject, scene: ClientScene) {
        super(soData,scene);
    }
}
/**
 * 场景对象模型：装饰动画
 */
class ClientSceneObject_2 extends ClientSceneObject {
    ani: Animation;
    constructor(soData: SceneObject, scene: ClientScene) {
        super(soData,scene);
    }
}
/**
 * 场景对象模型：
 */
class ClientSceneObject_3 extends ClientSceneObject {
    constructor(soData: SceneObject, scene: ClientScene) {
        super(soData,scene);
    }
}
/**
 * 场景对象模型：
 */
class ClientSceneObject_4 extends ClientSceneObject {
    constructor(soData: SceneObject, scene: ClientScene) {
        super(soData,scene);
    }
}
/**
 * 场景对象模型：
 */
class ClientSceneObject_5 extends ClientSceneObject {
    constructor(soData: SceneObject, scene: ClientScene) {
        super(soData,scene);
    }
}
