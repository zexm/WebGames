/**
 * @author floyd
 */

//飞鸟类--玩家
var Flyer = function(){
	//飞鸟Dom元素
	this.dom = null;
	//目前的移动速度
	this.movepx = 0;
	//移动频率
	this.movesp = 38;
	//是否在移动
	this.isMove = false;
	//移动Id
	this.moveId = null;
	
	this.init();
}
Flyer.prototype = {
	//游戏背景Dom
	gamePanel : null,
	//默认移动速度
	cMovepx : 5,
	//初始化
	init : function(){
		//创建对应的dom元素
		this.dom = document.createElement('div');
		this.dom.className = 'flyer';
	},
	//设置初始位置,gamePanel为游戏背景Dom元素
	setPosition : function(gamePanel){
		
		this.dom.style.left = '150px';
		this.dom.style.top = (gamePanel.clientHeight - this.dom.clientHeight)/2 + 'px';
		
		this.gamePanel = gamePanel;
	},
	//飞鸟开始移动(默认向下)
	start : function(){
		var _this = this;
		this.moveId = setInterval(function(){_this.move('down');},this.movesp);
	},
	//键盘按下事件
	keydown : function(e){
		//判断飞鸟不在移动
		if(!this.isMove){
			//清除之前的移动
			this.clearMove();
			
			var _this = this;
			//向上移动
			this.isMove = true;
			this.moveId = setInterval(function(){_this.move('up');},this.movesp);
		}
	},
	//键盘释放事件
	keyup : function(e){
		
		this.isMove = false;
		//清除之前呃移动
		this.clearMove();
		//向下移动
		this.start();
	},
	//清除移动
	clearMove : function(){
		clearInterval(this.moveId);
		this.movepx = this.cMovepx;
	},
	//移动
	move : function(direction){
		
		var top = this.dom.offsetTop + this.movepx*(direction=='up'?-1:1);
		
		top = top <0?0:top>this.gamePanel.clientHeight-this.dom.clientHeight?this.gamePanel.clientHeight-this.dom.clientHeight:top;
		
		this.dom.style.top = top + 'px';
		//目前速度+1，加速度移动
		this.movepx += 1;
		//判断撞到上下墙壁
		if(this.checkCrashWall()){
			//飞鸟死了
			this.wasDead();
		}
	},
	//检测是否撞到上下墙壁
	checkCrashWall : function(){
		var top = this.dom.offsetTop;
		
		if(top <= 0 || top >= this.gamePanel.clientHeight-this.dom.clientHeight)return true;
		return false;
	},
	//死亡事件
	wasDead : function(){
		this.clearMove();
		this.dom.className = 'dead';
		this.gameOver();
	},
	//外部游戏结束接口
	gameOver : function(){}
}
