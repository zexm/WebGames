/**
 * @author floyd
 */

//障碍物类
var Wall = function(){
	//障碍物dom元素
	this.dom = null;
	
	this.init();
}
Wall.prototype = {
	//游戏背景
	gamePanel : null,
	//移动速度
	movepx : 10,
	//移动频率
	movesp : 40,
	//障碍物类型，可自定义多种
	wallType : {
		1:{width:100,height:80},
		2:{width:80,height:120},
		3:{width:80,height:160},
		4:{width:80,height:210},
		5:{width:150,height:140},
		6:{width:300,height:180},
		7:{width:200,height:120},
		8:{width:250,height:200}
	},
	//初始化
	init : function(){
		//创建障碍物对应的dom元素
		this.dom = document.createElement('div');
		this.dom.className = 'wall';
	},
	//设置障碍物的位置
	/*
	 * gamePanel:游戏背景dom
	 * type:障碍物类型
	 * direction:方向，up或down
	 */
	setPosition : function(gamePanel,type,direction){
		
		if(!this.gamePanel)this.gamePanel = gamePanel;
		//计算出障碍物初始的坐标
		var left = this.gamePanel.clientWidth,
			top = direction=='up'?0:this.gamePanel.clientHeight-this.wallType[type].height;
		
		this.dom.style.left = left + 'px';
		this.dom.style.top = top + 'px';
		this.dom.style.width = this.wallType[type].width + 'px';
		this.dom.style.height = this.wallType[type].height + 'px';
		//将障碍物dom添加到游戏背景
		this.gamePanel.appendChild(this.dom);
	},
	//动画，移动
	animation : function(){
		
		var _this = this;
		//移动函数
		var move = function(){
			//判断游戏是否结束
			if(_this.onCheckGame())return;
			//计算出此次移动的X坐标
			var left = _this.dom.offsetLeft - _this.movepx;
			
			_this.dom.style.left = left + 'px';
			//判断障碍物是否移动出显示区域，以及是否撞到飞鸟玩家
			if(left+_this.dom.clientWidth > 0 && !_this.onCheckCrash()){
				//继续移动
				setTimeout(move,_this.movesp);
			}
			//飞出显示区域
			else if(left+_this.dom.clientWidth <= 0) {
				//障碍物移除
				_this.end();
			}
		}
		//开始移动
		setTimeout(move,_this.movesp);
	},
	//外部接口，目的是传参回调checkCrash，检测是否撞到飞鸟
	onCheckCrash : function(){},
	//检测是否撞到飞鸟
	checkCrash : function(flyer){
		//碰撞判断原理：飞鸟的起点或者终点，其中有一点落在障碍物范围内
		if((flyer.dom.offsetLeft >= this.dom.offsetLeft && flyer.dom.offsetLeft <= this.dom.offsetLeft+this.dom.clientWidth)
		   ||(flyer.dom.offsetLeft+flyer.dom.clientWidth >= this.dom.offsetLeft && flyer.dom.offsetLeft+flyer.dom.clientWidth <= this.dom.offsetLeft+this.dom.clientWidth)){
		   	
			if((flyer.dom.offsetTop >= this.dom.offsetTop && flyer.dom.offsetTop <= this.dom.offsetTop+this.dom.clientHeight)
		   ||(flyer.dom.offsetTop+flyer.dom.clientHeight >= this.dom.offsetTop && flyer.dom.offsetTop+flyer.dom.clientHeight <= this.dom.offsetTop+this.dom.clientHeight)){
		   		//飞鸟死亡
				flyer.wasDead();
				return true;
		   	}
		  }
		  return false;
	},
	//障碍物移除
	end : function(){
		this.gamePanel.removeChild(this.dom);
	},
	//判断游戏是否结束，外部接口
	onCheckGame : function(){}
}
