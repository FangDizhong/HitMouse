export default class ScoreFloat extends Laya.Script {
    // 在此声明给父组件内所有要绑定值的子组件(所有要展示值的组件都要)

    constructor() {
        super()

    // 在此声明值给代码(所有要展示值的组件都要)
    this.xxx = null
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
    show(isPlusScore) {
        //显示锤子
        // this.owner.alpha = 1;
        // this.owner.rotation = 0; // 恢复锤子角度

        // 销毁播放中的发大动画
        // if(this.timeLine){
        //     this.timeLine.destroy();
        //     this.timeLine = null;
        // }

        // 根据带钢盔坏人和不带钢盔好人动态更新不同分值
        this.owner.skin = isPlusScore ? "res/score_100_2.png" : "res/score_100_1.png";

        //创建时间轴动画(分数花300毫秒从当前位置向上浮动100,抖一下
        //              再延迟300毫秒花400毫秒再向上浮动100到-200)
        this.timeLine = Laya.TimeLine.to(this.owner,{y:this.owner.y - 100,alpha:1}, 300, Laya.Ease.backOut)
                                    .to(this.owner,{y:this.owner.y - 200,alpha:0}, 400, null, 300);

        this.timeLine.play(0,false); // 播放动画
        
        // 监听动画播放完事件后，执行函数隐藏锤子
        // this.timeLine.on(Laya.Event.COMPLETE, this, function() {
        //     this.owner.alpha = 0; 
        //  })
    }
}