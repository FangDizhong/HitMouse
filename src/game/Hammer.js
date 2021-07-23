export default class Hammer extends Laya.Script {
    // 在此声明给父组件内所有要绑定值的子组件(所有要展示值的组件都要)
    // Hammer没有子组件所以不用声明

    constructor() {
        super()


    }

    // 通常用于声明成员变量
    onAwake() {
        this.timeLine = null ;

    }

    // 每一帧函数执行之前执行，一般用于初始化
    onStart() {}

    onDisable() {}

    onUpdate() {}

    // 自定义方法
    show() {
        //显示锤子
        // this.owner.alpha = 1;
        this.owner.rotation = 0; // 恢复锤子角度

        // 销毁播放中的发大动画
        if(this.timeLine){
            this.timeLine.destroy();
            this.timeLine = null;
        }

        //创建时间轴动画(锤子花90毫秒向上抬10,花180毫秒向下砸-10，再延迟150毫秒花100毫秒变透明隐藏锤子)
        this.timeLine = Laya.TimeLine.to(this.owner,{rotation:10,alpha:1}, 90)
                                    .to(this.owner,{rotation:-10}, 90 * 2,)
                                    .to(this.owner,{alpha:0}, 100, null, 150);

        this.timeLine.play(0,false); // 播放动画
        
        // 监听动画播放完事件后，执行函数隐藏锤子
        // this.timeLine.on(Laya.Event.COMPLETE, this, function() {
        //     this.owner.alpha = 0; 
        //  })
    }

}