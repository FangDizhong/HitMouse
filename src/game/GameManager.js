import GameConfig from "./GameConfig"
import WordsList from "./WordsList"


import Mouse from "./Mouse"
import Hammer from "./Hammer"
import ScoreFloat from "./ScoreFloat"
import LblWords from "./LblWords"

import MouseCard from "./MouseCard"
import KanaList from "./KanaList"

//定义window.localStorage键值对中的key
let keyScoreHighest = "keyScoreHighest"; 


export default class GameManager extends Laya.Script {
    // 在此声明给父组件内所有要绑定值的子组件(所有要展示值的组件都要)
    /** @prop {name:lblCountDownValue, tips:"倒计时", type:Node, default:null}*/
    /** @prop {name:lblScoreValue, tips:"得分", type:Node, default:null}*/
    /** @prop {name:dialogGameOver, tips:"游戏结束", type:Node, default:null}*/
    /** @prop {name:lblScoreCurrentValue, tips:"当前成绩", type:Node, default:null}*/
    /** @prop {name:lblScoreHighestValue, tips:"历史最高", type:Node, default:null}*/

    /** @prop {name:prefabMouse, tips:"老鼠", type:Prefab, default:null}*/
    /** @prop {name:containerMouse, tips:"老鼠容器", type:Node, default:null}*/

    /** @prop {name:hammer, tips:"锤子", type:Node, default:null}*/

    /** @prop {name:prefabScoreFloat, tips:"漂浮分数", type:Prefab, default:null}*/
    /** @prop {name:containerScoreFloat, tips:"漂浮分数容器", type:Node, default:null}*/

    /** @prop {name:lblWords, tips:"单词", type:Node, default:null}*/

    /** @prop {name:prefabMouseCard, tips:"老鼠举牌", type:Prefab, default:null}*/


    constructor() {
        super()

        // 在此声明值给代码(所有要展示值的组件都要)
        this.lblCountDownValue = null;
        this.lblScoreValue = null;
        this.dialogGameOver = null;
        this.lblScoreCurrentValue = null;
        this.lblScoreHighestValue = null;

        this.prefabMouse = null;
        this.containerMouse = null;

        this.hammer =null;

        this.prefabScoreFloat = null;
        this.containerScoreFloat = null;

        this.lblWords = null;

        this.prefabMouseCard = null;
    }

    // 通常用于声明脚本中的临时成员变量
    onAwake() {

        this.isPlaying = false;
        this.btnPlayAgain = null;

        // 声明成员存放老鼠对象
        this.Hole = null;
        this.arrMouse = [];

         // 声明成员存放用于展示的单词对象，和用于游戏处理的单词数组
         this.Word = null;
         this.arrWordsList = [];

        // 声明成员存放用于展示的假名数组
         this.CardKana = [];

        // 声明是否是+100分or-100分
        this.isPlusScore = false;
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

    // 地鼠被打时把位置参数传进来
    onMouseHitted(indexPosMouse, typeMouse) {
        // 如果游戏不在进行中，则不给砸
        if (!this.isPlaying) {
            return;
        }
        let posMouse = GameConfig.arrPosMouse[indexPosMouse]; //拿到老鼠坐标
        this.hammer.pos(posMouse.x + 120, posMouse.y - 60); //赋予锤子的坐标+偏移量
        
        let compHammer = this.hammer.getComponent(Hammer); //获取hammer组件的Hammer.js脚本
        compHammer.show();

        //调用预制体的create方法创造浮动分数赋值给ScoreFloat对象
        let scoreFloat = this.prefabScoreFloat.create();
        this.containerScoreFloat.addChild(scoreFloat); //把创造出来的浮动分数放进容器里
        scoreFloat.pos(posMouse.x,posMouse.y);

        //判断是不是钢盔地鼠2，是则+100，否则-100
        this.isPlusScore = typeMouse == 2 ? true : false; 

        //获取ScoreFloat组件的ScoreFloat.js脚本
        let compScoreFloat = scoreFloat.getComponent(ScoreFloat); 
        compScoreFloat.show(this.isPlusScore);

        // 判断是否是加分，是则+100赋值，否则-100赋值(且如果总分小于0，赋值为0)
        if (this.isPlusScore) {
            this.nScore += 100;
        } else {
            this.nScore -= 100;

            if (this.nScore < 0) {
                this.nScore = 0;
            }
        }
        // 同步到UI显示
        this.lblScoreValue.text = ""+this.nScore;   // 更新UI里的值
    }

    gameStart() {
        this.isPlaying = true;

        this.dialogGameOver.visible = false; //把节点的visible属性改为false

        // 每次开始游戏时，重置游戏数据
        this.nCountDown = 30;
        this.nScore = 0;

        // 清空老鼠数组，放置9个空值
        this.arrMouse.length = 0;
        for (let i = 0; i < 9; i++) {
            this.arrMouse.push(null); //先放9个空值进来
        }
        

        // 复制用于生成随机单词的数组
        this.arrWordsList = WordsList.arrWordsList.slice(); //每次重新GameStart时，从WordsList.js拿到数组
        console.log("拿到初始单词列表为",this.arrWordsList);
        this.Word = null;
        console.log("清空展示单词",this.Word);

        this.lblWords.text = "";   // 更新UI里的值
        this.lblCountDownValue.text = this.nCountDown;   // 更新UI里的值
        this.lblScoreValue.text = this.nScore;   // 更新UI里的值


        // 调用定时器API，每秒执行onOneSecond函数，函数另外实现
        Laya.timer.loop(1000, this, this.onOneSecond);
        
        // 延迟0.5秒钟，启动生成单词函数（函数中自带每3秒重新生成单词的for循环），第一次传入生成单词数组index的随机数
        Laya.timer.once(300, this, this.generateWord,[this.getRandomInt(0, this.arrWordsList.length-1)]);
        // 延迟一秒钟，启动执行生成地鼠函数（函数中自带每3秒重新生成地鼠的for循环），第一次传入生成地鼠数量的随机数
        // Laya.timer.once(1000, this, this.generateMouse,[this.getRandomInt(1,this.arrMouse.length)]);        
        
        // 延迟一秒钟，启动执行生成地鼠函数（函数中自带每3秒重新生成地鼠的for循环），第一次传入生成地鼠数量的随机数
        Laya.timer.once(1000, this, this.generateMouseCard,[this.getRandomInt(5,this.arrMouse.length)]);
    }

    GameOver() {
        this.isPlaying = false;

        this.dialogGameOver.visible = true; //把节点的visible属性改为true

        Laya.timer.clear(this, this.onOneSecond);

        this.lblScoreCurrentValue.text = ""+this.nScore;// 同步当前成绩

        // 用window.localStorage保存历史最高值
        let nScoreHighest = 0; //历史最高分初始赋值为0
        if(window.localStorage[keyScoreHighest]){ //如果存在历史最高分(keyScoreHighest是键值对)，则判断
            if (window.localStorage[keyScoreHighest] > this.nScore) { //如果历史最高分缓存＞当前成绩
                nScoreHighest = window.localStorage[keyScoreHighest]; //历史最高分由缓存赋值
            } else {
                nScoreHighest = this.nScore;    //不然(历史最高分≤当前成绩)，历史最高分由当前成绩赋值
            }
        } else {    //如果缓存不存在历史最高分
            nScoreHighest = this.nScore; //历史最高分还是由当前成绩赋值
        }
        window.localStorage[keyScoreHighest] = nScoreHighest; //把赋值后的历史最高分保存到本地
        this.lblScoreHighestValue.text = ""+nScoreHighest; //更新UI里的值
    };

    // 每3秒生成单词，传入每次循环产生的随机单词index
    generateWord(wordIndex) {
        // 如果isPlaying是false，直接返回，不生成单词了
        if (!this.isPlaying) {
            return;
        }
        // 从游戏单词数组中选择随机index位置，删除1个单词，[0]表示不做替换
        this.Word = this.arrWordsList.splice(wordIndex, 1)[0];
        console.log("当前选中单词为",this.Word);

        this.lblWords.text = this.Word.arrRoma.join(" ");   // 更新UI里的值
        console.log("此时展示单词和剩下数组状态为",this.lblWords.text,this.arrWordsList);
        this.CardKana.length = 0;
        this.CardKana = this.Word.arrKana; //
        // this.CardKana.push.apply (this.CardKana,this.Word.arrKana);
        console.log("此时展示假名数组为",this.CardKana); 

        // 每3秒钟循环本函数，传入随机index
        Laya.timer.once(3000, this, this.generateWord,[this.getRandomInt(0, this.arrWordsList.length-1)]);
    }

    generateKana() {

    }

    // 传入每次生成老鼠的数量numMouse(在timer中以随机函数的形式传入)
    generateMouse(numMouse) {
        // 如果isPlaying是false，直接返回，不生成地鼠了
        if (!this.isPlaying) {
            return;
        }

        // 每次循环遍历生成numMouse只地鼠，该参数每次循环都会另外生成随机数
        for (let i=0; i < numMouse; i++) {
            let indexPosMouse = this.getRandomInt(0, this.arrMouse.length-1);//拿到[0,8]的随机位置index
            // 遍历时，如果该位置存在地鼠则继续，没有再创建
            if (this.arrMouse[indexPosMouse]) {
                continue;
            }

            let mouse = this.prefabMouse.create(); //调用预制体的create方法创造地鼠赋值给mouse对象
            this.containerMouse.addChild(mouse); //把创造出来的老鼠放进容器里

            let posMouse = GameConfig.arrPosMouse[indexPosMouse]; //拿到老鼠坐标
            mouse.pos(posMouse.x,posMouse.y);

            // 解决同一个洞出两种不同地鼠的问题
            this.arrMouse[indexPosMouse] = mouse;

            //拿到Mouse组件(Mouse.js脚本已经绑定了Mouse组件，import完getComponent就可以拿到)
            let compMouse = mouse.getComponent(Mouse); 
            let typeMouse = this.getRandomInt(1,2); //随机1或2

            //把this(整个GameManager)传到Mouse.js里方便拿到arrMouse数组，
            // 把typeMouse传过去方方便切换01.png，02.png的皮肤,
            //把index传过去，方便拿到坐标
            compMouse.show(this, typeMouse, indexPosMouse); 
        }

        Laya.timer.once(3000, this, this.generateMouse,[this.getRandomInt(1,this.arrMouse.length)]);
    }



    // 传入每次生成老鼠的数量numMouse(在timer中以随机函数的形式传入)
    generateMouseCard(numMouse) {
        // 如果isPlaying是false，直接返回，不生成地鼠了
        if (!this.isPlaying) {
            return;
        }

        // 往已有正确假名的this.CardKana加入假名干扰项，直到CardKana数量=numMouse
        for (;this.CardKana.length < numMouse;) {
            let indexDammyKana = this.getRandomInt(0, KanaList.arrKana.length-1); //拿到随机假名干扰项index

            switch (this.Word.type) {
            case "hira":
                if(this.Word.arrKana.indexOf(KanaList.arrKana[indexDammyKana].hira) < 0) {
                    this.CardKana.push(KanaList.arrKana[indexDammyKana].hira);
                };
                break;
            case "kata" :
                if(this.Word.arrKana.indexOf(KanaList.arrKana[indexDammyKana].kata) < 0) {
                    this.CardKana.push(KanaList.arrKana[indexDammyKana].kata);
                };
                break;
            }
        }

        console.log ("当前老鼠数量为",numMouse, "用于展示的假名数组为",this.CardKana);

        // 复制用于生成随机老鼠洞的数组
        this.arrPosMouse = GameConfig.arrPosMouse.slice(); //每次重新GameStart时，从GameConfig.js拿到数组
        // 每次循环遍历生成numMouse只地鼠，该参数每次循环都会另外生成随机数
        for (let i=0; i < numMouse; i++) {
            let indexPosMouse = this.getRandomInt(0, this.arrPosMouse.length - 1);//拿到[0,剩余鼠洞个数]的随机位置index
            // 遍历时，如果该位置存在地鼠则继续，没有再创建
            // if (this.arrMouse[indexPosMouse]) {
            //     console.log("该位置有老鼠");
            //     continue;
            // }

            // 从游戏老鼠(洞)数组中选择随机index位置，删除1个洞，[0]表示不做替换
            this.hole = this.arrPosMouse.splice(indexPosMouse, 1)[0];
            // console.log("此时剩下鼠洞",this.arrPosMouse.length);

            let mouse = this.prefabMouseCard.create(); //调用预制体的create方法创造地鼠赋值给mouse对象
            this.containerMouse.addChild(mouse); //把创造出来的老鼠放进容器里

            // let posMouse = GameConfig.arrPosMouse[indexPosMouse]; //拿到老鼠坐标
            mouse.pos(this.hole.x,this.hole.y);

            // 解决同一个洞出两种不同地鼠的问题
            // this.arrMouse[indexPosMouse] = mouse;

            //拿到Mouse组件(Mouse.js脚本已经绑定了Mouse组件，import完getComponent就可以拿到)
            let compMouse = mouse.getComponent(MouseCard); 
            let typeMouse = this.getRandomInt(1,2); //随机1或2

            //把this(整个GameManager)传到Mouse.js里方便拿到arrMouse数组，
            // 把typeMouse传过去方方便切换01.png，02.png的皮肤,
            //把index传过去，方便拿到坐标
            compMouse.show(typeMouse); 
        }

        Laya.timer.once(3000, this, this.generateMouseCard,[this.getRandomInt(5,GameConfig.arrPosMouse.length)]);
    }

    /**
     * 生成指定区间的整数，如[1,9]
     * @param {*} lsection 
     * @param {*} rsection 
     */
    getRandomInt(lsection,rsection) {
        if(lsection > rsection) {
            console.error("getRandomInt: can not lsection > rsection");
            return -1;
        }

        //     向下取整     生成[0,1)的随机数
        //                [0+1=1, 0.999 * (9-1+1) +1=9.999] 向下取整[1,9]
        return Math.floor(Math.random() * (rsection - lsection + 1) + lsection
        )
    }
}