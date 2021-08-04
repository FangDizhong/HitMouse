(function () {
    'use strict';

    class Hammer extends Laya.Script {
        // 在此声明给父组件内所有要绑定值的子组件(所有要展示值的组件都要)
        // Hammer没有子组件所以不用声明

        constructor() {
            super();


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

    let GameConfig = {
        // 树洞坐标数组
        arrPosMouse: [
            {x: -250, y:-10}, {x:0, y:-10}, {x:250, y:-10},
            {x: -250, y:120}, {x:0, y:120}, {x:250, y:120},
            {x: -250, y:260}, {x:0, y:260}, {x:250, y:260},
        ],
    };

    let WordsList = {
        // 测试单词库
        arrWordsList: [
            {roma: "akai", arrRoma:["a","ka","i"], arrKana:["あ","か","い"], type:"hira"}, 
            {roma: "ike", arrRoma:["i","ke"], arrKana:["い","け"], type:"hira"}, 
            {roma: "uea", arrRoma:["u","e","a"], arrKana:["ウ","エ","ア"], type:"kata"}, 
            {roma: "otoko", arrRoma:["o","to","ko"], arrKana:["お","と","こ"], type:"hira"}, 
            {roma: "kisu", arrRoma:["ki","su"], arrKana:["キ","ス"], type:"kata"}, 
            {roma: "tsukue", arrRoma:["tsu","ku","e"], arrKana:["つ","く","え"], type:"hira"}, 
            {roma: "sakana", arrRoma:["sa","ka","na"], arrKana:["さ","か","な"], type:"hira"}, 
            {roma: "sushi", arrRoma:["su","shi"], arrKana:["す","し"], type:"hira"}, 
            {roma: "sofuto", arrRoma:["so","fu","to"], arrKana:["ソ","フ","ト"], type:"kata"}, 
            {roma: "tanoshii", arrRoma:["ta","no","shi","i"], arrKana:["た","の","し","い"], type:"hira"}, 
        ],
    };

    class Mouse extends Laya.Script {
        // 在此声明给父组件内所有要绑定值的子组件(所有要展示值的组件都要)
        // Mouse没有子组件所以不用声明

        constructor() {
            super();

        // 在此声明值给代码(所有要展示值的组件都要)
            this.xxx = null;
        }

        // 通常用于声明成员变量
        onAwake() {
            this.timeLine = null ;
            this.gameManager =null; //声明一个本脚本用的gameManager空对象
            this.typeMouse = 0;
            this.indexPosMouse = -1;

            this.isHitted = false;
        }

        // 每一帧函数执行之前执行，一般用于初始化
        onStart() {}

        onDisable() {}

        onUpdate() {}

        onClick(e) {
            if (this.isHitted) {
                return;
            }
            this.isHitted = true;
            
            console.log("打到了老鼠："+this.indexPosMouse);

            this.owner.skin = "res/mouse_hitted0"+this.typeMouse+".png";

            // 销毁播放中的发大动画
            if(this.timeLine){
                this.timeLine.destroy();
                this.timeLine = null;
            }
            //创建击中时的时间轴动画(地鼠花300毫秒变小回0)
            this.timeLine = Laya.TimeLine.to(this.owner, {scaleX:0,scaleY:0}, 300, null, 1000);
            this.timeLine.play(0,false); // 播放动画
            
            // 监听动画播放完事件后，执行函数删除
            this.timeLine.on(Laya.Event.COMPLETE, this, function() {
                this.owner.removeSelf();

                // 把传进来的gameManager里的老鼠数组[位置index]赋值为空
                this.gameManager.arrMouse[this.indexPosMouse] = null;
            });

            // 把地鼠位置index，和地鼠类型传进来。前者判断打中的地鼠位置，后者判断打中的地鼠类型
            this.gameManager.onMouseHitted(this.indexPosMouse, this.typeMouse);

        }

        // 自定义方法
        //定义三个变量，从外部传进来(typeMouse为了切换地鼠png; 
        // 而gameManager，indexPosMouse只为了最后清空地鼠数组)
        show(gameManager,typeMouse,indexPosMouse) {
            this.gameManager = gameManager; 
            this.typeMouse = typeMouse;
            this.indexPosMouse = indexPosMouse;

            this.owner.skin = "res/mouse0"+this.typeMouse+".png";

            //owner指向脚本绑定的节点对象，先设置初始大小为0
            this.owner.scaleX = 0;
            this.owner.scaleY = 0;

            //创建时间轴动画(地鼠花300毫秒变大为1,在1000毫秒后，变小回0)
            this.timeLine = Laya.TimeLine.to(this.owner,{scaleX:1,scaleY:1},300)
                                        .to(this.owner,{scaleX:0,scaleY:0},300, null, 2000);
            this.timeLine.play(0,false); // 播放动画
            
            // 监听动画播放完事件后，执行函数删除
            this.timeLine.on(Laya.Event.COMPLETE, this, function() {
                this.owner.removeSelf();

                // 把传进来的gameManager里的老鼠数组[位置index]赋值为空
                this.gameManager.arrMouse[this.indexPosMouse] = null;
            });
        }

    }

    class ScoreFloat extends Laya.Script {
        // 在此声明给父组件内所有要绑定值的子组件(所有要展示值的组件都要)

        constructor() {
            super();

        // 在此声明值给代码(所有要展示值的组件都要)
        this.xxx = null;
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

    class LblWords extends Laya.Script {
        // 在此声明给父组件内所有要绑定值的子组件(所有要展示值的组件都要)

        constructor() {
            super();

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

    class MouseCard extends Laya.Script {
        // 在此声明给父组件内所有要绑定值的子组件(所有要展示值的组件都要)
        /** @prop {name:lblKana, tips:"假名", type:Node, default:null}*/

        constructor() {
            super();

        // 在此声明值给代码(所有要展示值的组件都要)
        this.lblKana = null;
        
        }

        // 通常用于声明成员变量
        onAwake() {
            this.timeLine = null ;
            this.gameManager =null; //声明一个本脚本用的gameManager空对象
            this.typeMouse = 0;
            this.indexPosMouse = -1;
            this.lblKana.text = null;

            this.isHitted = false;

            this.hole = null;
        }

        // 每一帧函数执行之前执行，一般用于初始化
        onStart() {}

        onDisable() {}

        onUpdate() {}

        // 自定义方法
        onClick(e) {
            if (this.isHitted) {
                return;
            }
            this.isHitted = true;
            
            // console.log("打到了老鼠："+this.lblKana.text);
            // console.log("打到了老鼠："+this.hole.x,this.hole.y);


            this.owner.skin = "res/mouse_hitted0"+this.typeMouse+".png";

            // 销毁播放中的发大动画
            if(this.timeLine){
                this.timeLine.destroy();
                this.timeLine = null;
            }
            //创建击中时的时间轴动画(地鼠花300毫秒变小回0)
            this.timeLine = Laya.TimeLine.to(this.owner, {scaleX:0,scaleY:0}, 300, null, 1000);
            this.timeLine.play(0,false); // 播放动画
            
            // 监听动画播放完事件后，执行函数删除
            this.timeLine.on(Laya.Event.COMPLETE, this, function() {
                this.owner.removeSelf();

                // 把传进来的gameManager里的老鼠数组[位置index]赋值为空
                // this.gameManager.arrMouse[this.indexPosMouse] = null;
            });

            // 把地鼠位置hole，和地鼠假名传回gameManager.js
            this.gameManager.onMouseHitted(this.hole,this.lblKana.text);

        }

        // 自定义方法
        //定义三个变量，从外部传进来(typeMouse为了切换地鼠png; 
        // 而gameManager，indexPosMouse只为了最后清空地鼠数组)
        show(gameManager,typeMouse,hole) {
            this.gameManager = gameManager; 
            this.typeMouse = typeMouse;
            this.hole = hole;

            // this.indexPosMouse = indexPosMouse;

            this.owner.skin = "res/mouse0"+this.typeMouse+".png";

            //owner指向脚本绑定的节点对象，先设置初始大小为0
            this.owner.scaleX = 0;
            this.owner.scaleY = 0;

            //创建时间轴动画(地鼠花300毫秒变大为1,在1000毫秒后，变小回0)
            this.timeLine = Laya.TimeLine.to(this.owner,{scaleX:1,scaleY:1},300)
                                        .to(this.owner,{scaleX:0,scaleY:0},300, null, 2000);
            this.timeLine.play(0,false); // 播放动画
            
            // 监听动画播放完事件后，执行函数删除
            this.timeLine.on(Laya.Event.COMPLETE, this, function() {
                this.owner.removeSelf();

                // 把传进来的gameManager里的老鼠数组[位置index]赋值为空
                // this.gameManager.arrMouse[this.indexPosMouse] = null;
            });
        }

    }

    let KanaList = {
        // 测试单词库
        arrKana: [
            {col:"a", roma: "a", hira:"あ",kata:"ア"}, 
            {col:"a", roma: "i", hira:"い",kata:"イ"}, 
            {col:"a", roma: "u", hira:"う",kata:"ウ"}, 
            {col:"a", roma: "e", hira:"え",kata:"エ"}, 
            {col:"a", roma: "o", hira:"お",kata:"オ"},

            {col:"ka", roma: "ka", hira:"か",kata:"カ"}, 
            {col:"ka", roma: "ki", hira:"き",kata:"キ"}, 
            {col:"ka", roma: "ku", hira:"く",kata:"ク"}, 
            {col:"ka", roma: "ke", hira:"け",kata:"ケ"}, 
            {col:"ka", roma: "ko", hira:"こ",kata:"コ"}, 

            {col:"sa", roma: "sa", hira:"さ",kata:"サ"}, 
            {col:"sa", roma: "shi", hira:"し",kata:"シ"}, 
            {col:"sa", roma: "su", hira:"す",kata:"ス"}, 
            {col:"sa", roma: "se", hira:"せ",kata:"セ"}, 
            {col:"sa", roma: "so", hira:"そ",kata:"ソ"}, 

            {col:"ta", roma: "ta", hira:"た",kata:"タ"}, 
            {col:"ta", roma: "ti", hira:"ち",kata:"チ"}, 
            {col:"ta", roma: "tsu", hira:"つ",kata:"ツ"}, 
            {col:"ta", roma: "te", hira:"て",kata:"テ"}, 
            {col:"ta", roma: "to", hira:"と",kata:"ト"}, 

            {col:"ha", roma: "ha", hira:"は",kata:"ハ"}, 
            {col:"ha", roma: "hi", hira:"ひ",kata:"ヒ"}, 
            {col:"ha", roma: "hu", hira:"ふ",kata:"フ"}, 
            {col:"ha", roma: "he", hira:"へ",kata:"ヘ"}, 
            {col:"ha", roma: "ho", hira:"ほ",kata:"ホ"}, 

            {col:"ma", roma: "ma", hira:"ま",kata:"マ"}, 
            {col:"ma", roma: "mi", hira:"み",kata:"ミ"}, 
            {col:"ma", roma: "mu", hira:"む",kata:"ム"}, 
            {col:"ma", roma: "me", hira:"め",kata:"メ"}, 
            {col:"ma", roma: "mo", hira:"も",kata:"モ"}, 

            {col:"ya", roma: "ya", hira:"や",kata:"ヤ"}, 
            // {col:"ya", roma: "yi", hira:"い",kata:"イ"}, 
            {col:"ya", roma: "yu", hira:"ゆ",kata:"ユ"}, 
            // {col:"ya", roma: "ye", hira:"え",kata:"エ"}, 
            {col:"ya", roma: "yo", hira:"よ",kata:"ヨ"}, 

            {col:"ra", roma: "ra", hira:"ら",kata:"ラ"}, 
            {col:"ra", roma: "ri", hira:"り",kata:"リ"}, 
            {col:"ra", roma: "ru", hira:"る",kata:"ル"}, 
            {col:"ra", roma: "re", hira:"れ",kata:"レ"}, 
            {col:"ra", roma: "ro", hira:"ろ",kata:"ロ"}, 

            {col:"wa", roma: "wa", hira:"わ",kata:"ワ"}, 
            // {col:"wa", roma: "wi", hira:"ゐ",kata:"ヰ"}, 
            {col:"wa", roma: "wu", hira:"う",kata:"ウ"}, 
            // {col:"wa", roma: "we", hira:"ゑ",kata:"ヱ"}, 
            {col:"wa", roma: "wo", hira:"を",kata:"ヲ"}, 
        ],
    };

    //定义window.localStorage键值对中的key
    let keyScoreHighest = "keyScoreHighest"; 


    class GameManager extends Laya.Script {
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
            super();

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
            // this.hole = null;
            this.arrMouse = [];
            this.compMouse = null;

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
        onMouseHitted(posHole,hittedKana) {
            // 如果游戏不在进行中，则不给砸
            if (!this.isPlaying) {
                return;
            }
            // let posMouse = GameConfig.arrPosMouse[indexPosMouse]; //拿到老鼠坐标
            // this.hammer.pos(posMouse.x + 120, posMouse.y - 60); //赋予锤子的坐标+偏移量
            this.hammer.pos(posHole.x + 120, posHole.y - 60); //赋予锤子的坐标+偏移量

            let compHammer = this.hammer.getComponent(Hammer); //获取hammer组件的Hammer.js脚本
            compHammer.show();

            //调用预制体的create方法创造浮动分数赋值给ScoreFloat对象
            let scoreFloat = this.prefabScoreFloat.create();
            this.containerScoreFloat.addChild(scoreFloat); //把创造出来的浮动分数放进容器里
            scoreFloat.pos(posHole.x,posHole.y);

            //判断是不是钢盔地鼠2，是则+100，否则-100
            // this.isPlusScore = typeMouse == 2 ? true : false; 

            //判断this.Word.arrKana里包不包括this.lblKana.text，是则+100，否则-100
            this.isPlusScore = this.Word.arrKana.indexOf(hittedKana) > -1 ? true : false; 

            console.log("打到了老鼠：",hittedKana,"此时单词为",this.Word.arrKana);

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
            this.CardKana = this.Word.arrKana.slice(); //
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
                // this.hole = this.arrPosMouse.splice(indexPosMouse, 1)[0];
                let hole = this.arrPosMouse.splice(indexPosMouse, 1)[0];
                // console.log("此时剩下鼠洞",this.arrPosMouse.length);

                let mouse = this.prefabMouseCard.create(); //调用预制体的create方法创造地鼠赋值给mouse对象
                this.containerMouse.addChild(mouse); //把创造出来的老鼠放进容器里

                // let posMouse = GameConfig.arrPosMouse[indexPosMouse]; //拿到老鼠坐标
                // mouse.pos(this.hole.x,this.hole.y);
                mouse.pos(hole.x,hole.y);

                // 解决同一个洞出两种不同地鼠的问题
                // this.arrMouse[indexPosMouse] = mouse;

                //拿到Mouse组件(Mouse.js脚本已经绑定了Mouse组件，import完getComponent就可以拿到)
                this.compMouse = mouse.getComponent(MouseCard); 
                let typeMouse = this.getRandomInt(1,2); //随机1或2
                this.compMouse.lblKana.text = this.CardKana.splice(0,1)[0];   // 更新UI里的值

                // 在show时，
                //把this(整个GameManager)传到Mouse.js里方便onclick修改onMouseHitted，
                // 把typeMouse传过去方方便切换01.png，02.png的皮肤,
                //把hole坐标传过去，方便onClick修改onMouseHitted的斧头坐标
                this.compMouse.show(this,typeMouse,hole); 
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

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig$1 {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("game/Hammer.js",Hammer);
    		reg("game/GameManager.js",GameManager);
    		reg("game/Mouse.js",Mouse);
    		reg("game/MouseCard.js",MouseCard);
    		reg("game/ScoreFloat.js",ScoreFloat);
        }
    }
    GameConfig$1.width = 960;
    GameConfig$1.height = 640;
    GameConfig$1.scaleMode ="fixedheight";
    GameConfig$1.screenMode = "horizontal";
    GameConfig$1.alignV = "middle";
    GameConfig$1.alignH = "center";
    GameConfig$1.startScene = "GameScene.scene";
    GameConfig$1.sceneRoot = "";
    GameConfig$1.debug = false;
    GameConfig$1.stat = false;
    GameConfig$1.physicsDebug = false;
    GameConfig$1.exportSceneToJson = true;

    GameConfig$1.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig$1.width, GameConfig$1.height);
    		else Laya.init(GameConfig$1.width, GameConfig$1.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig$1.scaleMode;
    		Laya.stage.screenMode = GameConfig$1.screenMode;
    		Laya.stage.alignV = GameConfig$1.alignV;
    		Laya.stage.alignH = GameConfig$1.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig$1.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig$1.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig$1.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig$1.stat) Laya.Stat.show();
    		Laya.alertGlobalError(true);

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig$1.startScene && Laya.Scene.open(GameConfig$1.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
