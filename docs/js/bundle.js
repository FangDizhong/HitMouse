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
        }

        // 通常用于声明脚本中的临时成员变量
        onAwake() {

            this.isPlaying = false;
            this.btnPlayAgain = null;

            // 声明成员存放老鼠对象
            this.arrMouse = [];

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

            // 清空老鼠对象
            this.arrMouse.length = 0;
            for (let i = 0; i < 9; i++) {
                this.arrMouse.push(null); //先放一堆空值进来

            }

            this.lblCountDownValue.text = this.nCountDown;   // 更新UI里的值
            this.lblScoreValue.text = this.nScore;   // 更新UI里的值


            // 调用定时器API，每秒执行onOneSecond函数，函数另外实现
            Laya.timer.loop(1000, this, this.onOneSecond);
            
            // 延迟一秒钟，开始生成地鼠
            Laya.timer.once(1000, this, this.generateMouse,[this.getRandomInt(1,this.arrMouse.length)]);
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

        generateMouse(numMouse) {
            // 如果isPlaying是false，直接返回，不生成地鼠了
            if (!this.isPlaying) {
                return;
            }

            for (let i=0; i < numMouse; i++) {
                let indexPosMouse = this.getRandomInt(0, this.arrMouse.length-1);//拿到[0,8]的随机index
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
