export default class template extends Laya.Script {
    // 在此声明给开发界面(所有要展示值的组件都要)
    /** @prop {name:xxx, tips:"xxx", type:Node, default:null}*/

    constructor() {
        super()

    // 在此声明值给代码(所有要展示值的组件都要)
    this.xxx = null
    }

    // 通常用于声明成员变量
    onAwake() {}

    // 每一帧函数执行之前执行，一般用于初始化
    onStart() {}

    onDisable() {}

    onUpdate() {}

    // 自定义方法

}