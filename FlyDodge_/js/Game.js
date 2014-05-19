/**
 * @author floyd
 */

//游戏控制对象
var Game = {
	//游戏背景dom元素
	gamePanel : null,
	//飞鸟对象
	flyer:null,
	//目前障碍物方向
	nowDirection : 'down',
	//目前分数
	score : 0,
	//开始按钮dom
	startBtn : null,
	//游戏结束标志
	isOver : false,
	//最后的障碍物生成ID
	theLastWall : null,
	//初始化
	init : function(){
		//获取游戏背景
		this.gamePanel = document.getElementById('gamePanel');
		this.gamePanel.focus();
		//启动飞鸟跟障碍物
		this.startFlyer();
		this.startWall();
		//绑定事件
		document.body.onkeydown = function(e){Game.keydown(e);};
		document.body.onkeyup = function(e){Game.keyup(e);};
		//开始计分
		this.startScore();
	},
	//启动飞鸟
	startFlyer : function(){
		//新建一个飞鸟对象
		this.flyer = new Flyer();
		//添加飞鸟dom进游戏背景
		this.gamePanel.appendChild(this.flyer.dom);
		//设置飞鸟位置
		this.flyer.setPosition(this.gamePanel);
		//重写飞鸟游戏结束方法
		this.flyer.gameOver = function(){Game.gameOver();};
		//飞鸟起飞
		this.flyer.start();
	},
	//启动障碍物
	startWall : function(){
		//判断游戏结束，停止生成障碍物
		if(this.isOver)return;
		//新建一个障碍物
		var wall = new Wall(),_this = this;
		//随机一个障碍物类型
		var random = parseInt(Math.random()*8+1,10);
		//设置障碍物位置
		wall.setPosition(this.gamePanel,random,this.nowDirection);
		//重写判断撞击飞鸟
		wall.onCheckCrash = function(){return this.checkCrash(_this.flyer);}
		//重写判断游戏结束
		wall.onCheckGame = function(){return _this.isOver;}
		//移动
		wall.animation();
		//修改障碍物目前方向
		this.nowDirection = this.nowDirection=='down'?'up':'down';
		//启动
		
		var time = parseInt(1300 * (parseInt(parseInt(wall.dom.style.width)/150,10)/2+1),10);
		
		this.theLastWall = setTimeout(function(){_this.startWall();},time);
	},
	//键盘按下事件
	keydown : function(e){
		e = e || window.event;
		
		//阻止浏览器默认事件
		if(e.keyCode != 32)return;
		if(e.preventDefault)e.preventDefault();
		else e.returnValue = false;
		//调用飞鸟的键盘按下事件
		this.flyer.keydown(e);
	},
	//键盘释放事件
	keyup : function(e){
		e = e || window.event;
		//调用飞鸟的键盘释放事件
		this.flyer.keyup(e);
	},
	//计分
	startScore : function(){
		
		var _this = this;
		//计分处理函数
		var process = function(){
			
			if(_this.isOver)return;
			
			_this.score += 50;
			document.getElementById('score').innerHTML = _this.score;
			
			setTimeout(process,1000);
		}
		//开始计分
		setTimeout(process,1000);
	},
	//游戏结束
	gameOver : function(){
		this.isOver = true;
		
		document.body.onkeydown = null;
		document.body.onkeyup = null;
		
		this.startBtn.style.display = '';
	},
	//重置游戏数据
	reset : function(){
		
		this.gamePanel.removeChild(this.flyer.dom);
		
		var divs = this.gamePanel.getElementsByTagName('div'),walls = [];
		for(var i=0,l=divs.length;i<l;i++){
			if(divs[i].className == 'wall'){
				walls.push(divs[i]);
			}
		}
		while(walls.length){
			this.gamePanel.removeChild(walls.pop());
		}
		
		this.flyer = null;
		this.gamePanel = null;
		this.score = 0;
		
		Game.isOver = false;
		
		clearInterval(this.theLastWall);
	}
}

//游戏开始入口
function Start(btn){
	
	if(Game.isOver){
		Game.reset();
	}
	Game.init();
	if(!Game.startBtn)Game.startBtn = btn;
	Game.startBtn.style.display = 'none';
}
