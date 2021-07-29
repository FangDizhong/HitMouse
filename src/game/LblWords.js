export default class LblWords extends Laya.Script {
    // 在此声明给父组件内所有要绑定值的子组件(所有要展示值的组件都要)

    constructor() {
        super()

    // 在此声明值给代码(所有要展示值的组件都要)
    this.timeLine = null ;
    // this.gameManager =null; //声明一个本脚本用的gameManager空对象
    // this.typeMouse = 0;
    // this.indexPosMouse = -1;
}

    // 通常用于声明成员变量
    onAwake() {}

    // 每一帧函数执行之前执行，一般用于初始化
    onStart() {}

    onDisable() {}

    onUpdate() {}

    // 自定义方法
//定义三个变量，从外部传进来(typeMouse为了切换地鼠png; 
    // 而gameManager，indexPosMouse只为了最后清空地鼠数组)
    show() {
        // this.gameManager = gameManager; 
        // this.typeMouse = typeMouse;
        // this.indexPosMouse = indexPosMouse;

        this.owner.alpha = 0;

        // //owner指向脚本绑定的节点对象，先设置初始大小为0
        // this.owner.scaleX = 0;
        // this.owner.scaleY = 0;

        //创建时间轴动画(地鼠花300毫秒变大为1,在1000毫秒后，变小回0)
        this.timeLine = Laya.TimeLine.to(this.owner,{alpha:1},300)
                                    .to(this.owner,{alpha:0},300, null, 2000);
        this.timeLine.play(0,false); // 播放动画
        
        // 监听动画播放完事件后，执行函数删除
        // this.timeLine.on(Laya.Event.COMPLETE, this, function() {
        //     this.owner.removeSelf();

        //     // 把传进来的gameManager里的老鼠数组[位置index]赋值为空
        //     // this.gameManager.arrMouse[this.indexPosMouse] = null;
        // });
    }
}