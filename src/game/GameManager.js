export default class GameManager extends Laya.Script {
    // 在此声明给开发界面(所有要展示值的组件都要)
    /** @prop {name:lblCountDownValue, tips:"倒计时", type:Node, default:null}*/
    /** @prop {name:lblScoreValue, tips:"得分", type:Node, default:null}*/
    /** @prop {name:dialogGameOver, tips:"游戏结束", type:Node, default:null}*/
    /** @prop {name:lblScoreCurrentValue, tips:"当前成绩", type:Node, default:null}*/
    /** @prop {name:lblScoreHighestValue, tips:"历史最高", type:Node, default:null}*/

    constructor() {
        super()

        // 在此声明值给代码(所有要展示值的组件都要)
        this.lblCountDownValue = null;
        this.lblScoreValue = null;
        this.dialogGameOver = null;
        this.lblScoreCurrentValue = null;
        this.lblScoreHighestValue = null;
    }

    // 通常用于声明成员变量
    onAwake() {

        this.isPlaying = false;
        this.btnPlayAgain = null;

 
    }

    // 每一帧函数执行之前执行，一般用于初始化
    onStart() {
        this.btnPlayAgain = this.dialogGameOver.getChildByName("btnPlayAgain"); //获取对象
        this.btnPlayAgain.on(Laya.Event.MOUSE_DOWN,this,function(){

            this.gameStart(); //点击重新开始时，再次执行gameStart方法

        }); //监听事件(点击鼠标)

        this.gameStart(); //初始化时开始gameStart方法
    }

    onDisable() {}

    onUpdate() {}


    // 自定义方法

    // 每秒执行方法
    onOneSecond() {
        this.nCountDown--; //每秒减1
        this.lblCountDownValue.text = ""+this.nCountDown;   // 清空并更新UI里的值

        if (this.nCountDown <= 0) {
            this.GameOver();
        }

    }
    gameStart() {
        this.isPlaying = true;

        this.dialogGameOver.visible = false; //把节点的visible属性改为false

        // 每次开始游戏时，重置游戏数据
        this.nCountDown = 5;
        this.nScore = 0;

        this.lblCountDownValue.text = this.nCountDown;   // 更新UI里的值
        this.lblScoreValue.text = this.nScore;   // 更新UI里的值


        // 调用定时器API，每秒执行onOneSecond函数，函数另外实现
        Laya.timer.loop(1000, this, this.onOneSecond);
        
    }

    GameOver() {
        this.isPlaying = false;

        this.dialogGameOver.visible = true; //把节点的visible属性改为true

        Laya.timer.clear(this, this.onOneSecond);

    };

}