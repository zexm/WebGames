
/*	加载的图片资源字典	*/
var srcObj = {
	bg:"bg.png",
	begin:"begin.png",
	end:"end.png",
	middleBlock:"middleBlock.png",
	leftBlock:"leftBlock.png",
	rightBlock:"rightBlock.png",
	bottomBlock:"bottomBlock.png",
	topBlock:"topBlock.png",
	leftTopBlock:"leftTopBlock.png",
	rightTopBlock:"rightTopBlock.png",
	leftBottomBlock:"leftbottomBlock.png",
	rightBottomBlock:"rightBottomBlock.png",
	playerJumpRight:"playerJumpRight.png",
	playerJumpLeft:"playerJumpLeft.png",
	playerStayLeft:"playerStayLeft.png",
	playerStayRight:"playerStayRight.png",
	playerRunRight:"playerRunRight.png",
	playerRunLeft:"playerRunLeft.png",
	playerSitRight:"playerSitRight.png",
	playerSitLeft:"playerSitLeft.png",
	playerHurtLeft:"playerHurtLeft.png",
	playerHurtRight:"playerHurtRight.png",
	playerDieLeft:"playerDieLeft.png",
	playerDieRight:"playerDieRight.png",
	ghostRunLeft:"ghostRunLeft.png",
	ghostRunRight:"ghostRunRight.png",
	ghostDieRight:"ghostDieRight.png",
	ghostDieLeft:"ghostDieLeft.png",
	ghostHurtLeft:"ghostHurtLeft.png",
	ghostHurtRight:"ghostHurtRight.png",
	bulletRight:"bulletRight.png",
	bulletLeft:"bulletLeft.png",
	life:"life.png",
	line:"line.png",
	line1:"line1.png",
	tube:"tube.png"
 };
/*	背景矩阵	*/
var bgMatrix = [
					[1,1,1],
					[1,1,1],
					[1,1,1]
				];

/*	石头矩阵	*/
var blockMatrix=[
					[4,5,5,5,5,5,8,8,8,8,8,8,8,5,6],
					[4,5,8,8,5,6,0,0,0,0,0,0,0,4,6],
					[7,9,0,0,7,9,0,0,0,0,1,3,0,4,6],
					[0,0,0,0,0,0,0,0,0,1,5,6,0,4,6],
					[0,0,0,0,0,0,0,0,1,5,5,6,0,4,6],
					[2,3,0,0,1,2,2,2,5,5,5,6,0,4,6],
					[5,5,2,2,5,8,8,8,8,8,5,6,0,4,6],
					[5,8,8,8,9,0,0,0,0,0,7,9,0,4,6],
					[6,0,0,0,0,0,0,0,0,0,0,0,0,4,6],
					[6,0,0,0,0,1,3,0,0,1,2,2,2,5,9],
					[6,0,1,2,2,5,5,2,2,5,8,8,8,9,0],
					[6,0,7,5,5,5,8,8,8,9,0,0,0,0,0],
					[6,0,0,7,8,9,0,0,0,0,0,0,0,0,0],
					[6,0,0,0,0,0,0,0,0,1,2,2,2,2,2],
					[5,2,2,2,2,2,2,2,2,5,5,5,5,5,5]
				];
cnGame.init("canvas", { width:700, height: 500});//初始化框架
/*	player构造函数	*/
var player = function(options) {
    this.init(options);
	this.moveSpeed = 14;
	this.isJump=false;
	this.shootDuration=600;
	this.hurtDuration=1000;
	this.life=10;
	this.lastShootTime=(new Date()).getTime();
	this.lastHurtTime=(new Date()).getTime();

}
cnGame.core.inherit(player, cnGame.Sprite);
/*	player受伤	*/
player.prototype.hurt=function(){
	var now=(new Date()).getTime();
	var floorY=this.y+this.height;
	if(now-this.lastHurtTime>=this.hurtDuration){
		this.life--;
		
		if(isToLeft(this)){
			this.setCurrentAnimation("playerHurtLeft");	
		}
		else if(isToRight(this)){
			this.setCurrentAnimation("playerHurtRight");
		}
		this.index(0);
		this.isHurt=true;

		if(this.life<=0){
			this.die();	
		}
		this.y=floorY-this.height;
		this.lastHurtTime=now;
	}
}
/*	player恢复	*/
player.prototype.recover=function(){
	this.isHurt=false;
}
/*	player死亡	*/
player.prototype.die=function(){
	var bottomPoint=[this.x+this.width/2,this.y+this.height];
	this.setMovement({speedX:0});
	if(isToLeft(this)){
		this.setCurrentAnimation("playerDieLeft");	
	}
	else if(isToRight(this)){
		this.setCurrentAnimation("playerDieRight");	
	}


	this.isDead=true;
}
/*	射击	*/
player.prototype.shoot=function(){
	var now=(new Date()).getTime();
	if(now-this.lastShootTime>this.shootDuration){
		if(isToRight(this)){
			startX=this.x+this.width;
			startY=this.y+this.height/2;
			var newBullet=new bullet({src: srcObj.bulletRight, width:84, height: 13, x:startX-30, y:startY-25});
			newBullet.run(1);		
		}
		if(isToLeft(this)){
			startX=this.x;
			startY=this.y+this.height/2;
			var newBullet=new bullet({src: srcObj.bulletLeft, width:84, height: 13, x:startX-50, y:startY-25});
			newBullet.run(-1);
			
		}
		this.layer.addSprites(newBullet);
		this.lastShootTime=now;
	}

	
}

/*	敌人构造函数	*/
var ghost = function(options) {
    this.init(options);
	this.moveSpeed=options.moveSpeed||8;
	this.life=options.life||5;
}
cnGame.core.inherit(ghost, cnGame.Sprite);
/*	僵尸移动	*/
ghost.prototype.run=function(dir){
	var ghostSpeed=this.moveSpeed;
	var floorY=this.y+this.height;
	var bottomPoint=[this.x+this.width/2,this.y+this.height];
	if((enviroment.getPosValue(this.x+this.width,this.y)&&dir>0)||(enviroment.getPosValue(this.x,this.y)&&dir<0)){
		dir=0;
	}
	if(!enviroment.getPosValue(bottomPoint[0],bottomPoint[1])){
		if(!this.isJump){
			this.setMovement({aY:30});
			this.isJump=true;
		}
	}
	else{
		var floorY=this.y+this.height;
		floorY-=(floorY%enviroment.cellSize[1]);
		this.setMovement({aY:0,speedY:0});
		this.isJump=false;
	}
	if(dir<0){
		this.setCurrentAnimation("ghostRunLeft");
	}
	else if(dir>0){
		this.setCurrentAnimation("ghostRunRight");
	}

	this.setMovement({speedX:ghostSpeed*dir});
	this.y=floorY-this.height;
}
/*	僵尸死亡	*/
ghost.prototype.die=function(){
	var floorY=this.y+this.height;
	if(isToLeft(this)){
		this.setCurrentAnimation("ghostDieLeft");
	}
	else if(isToRight(this)){
		this.setCurrentAnimation("ghostDieRight");
	}
	this.y=floorY-this.height;
	this.isDead=true;
}
/*	僵尸被击中	*/
ghost.prototype.hurt=function(){
	var floorY=this.y+this.height;
	this.life-=1;
	if(this.life==0){
		this.die();
		return;
	}
	if(isToLeft(this)){
		this.setCurrentAnimation("ghostHurtLeft");
		this.setMovement({speedX:-this.movement/2});

	}
	else if(isToRight(this)){
		this.setCurrentAnimation("ghostHurtRight");
		this.setMovement({speedX:this.movement/2});
	}
	var bottomPoint=[this.x+this.width/2,this.y+this.height];
	if(!enviroment.getPosValue(bottomPoint[0],bottomPoint[1])){
		if(!this.isJump){
			this.setMovement({aY:30});
			this.isJump=true;
		}
	}
	this.index(0);
	this.isHurt=true;
	this.y=floorY-this.height;
}
/*	僵尸恢复	*/
ghost.prototype.recover=function(){
	var floorY=this.y+this.height;
	if(isToLeft(this)){
		this.run(-1,enviroment);
	}
	if(isToRight(this)){
		this.run(1,enviroment);
	}
	this.isHurt=false;
	this.y=floorY-this.height;
}
/*	子弹构造函数	*/
var bullet = function(options) {
    this.init(options);
	this.moveSpeed = 40;
}
cnGame.core.inherit(bullet, cnGame.Sprite);
/*	子弹飞	*/
bullet.prototype.run=function(dir){
	this.setMovement({speedX:this.moveSpeed*dir});
}


/*	是否朝向右边	*/
var isToRight=function(obj){
	if(obj instanceof player){
		return obj.isCurrentAnimation("playerStayRight")||obj.isCurrentAnimation("playerRunRight")||obj.isCurrentImage(srcObj.playerJumpRight)||obj.isCurrentImage(srcObj.playerSitRight)||obj.isCurrentAnimation("playerHurtRight");
	}
	else if(obj instanceof ghost){
		return obj.isCurrentAnimation("ghostRunRight")||obj.isCurrentAnimation("ghostHurtRight");	;	
	}
	
}
/*	是否朝向左边	*/
var isToLeft=function(obj){
	if(obj instanceof player){
		return obj.isCurrentAnimation("playerStayLeft")||obj.isCurrentAnimation("playerRunLeft")||obj.isCurrentImage(srcObj.playerJumpLeft)||obj.isCurrentImage(srcObj.playerSitLeft)||obj.isCurrentAnimation("playerHurtLeft");
	}
	else if(obj instanceof ghost){
		return obj.isCurrentAnimation("ghostRunLeft")||obj.isCurrentAnimation("ghostHurtLeft");	
	}
}
var isColiWithBlock=function(sprite){
	var leftPoint=[sprite.x,sprite.y+sprite.height/2];
	var rightPoint=[sprite.x+sprite.width,sprite.y+sprite.height/2];
	var topPoint=[sprite.x+sprite.width/2,sprite.y];
	var bottomPoint=[sprite.x+sprite.width/2,sprite.y+sprite.height];
	var coliObj={};
	if(enviroment.getPosValue(leftPoint[0],leftPoint[1])){
		coliObj["left"]=true;	
	}
	if(enviroment.getPosValue(rightPoint[0],rightPoint[1])){
		coliObj["right"]=true;	
	}
	if(enviroment.getPosValue(topPoint[0],topPoint[1])){
		coliObj["top"]=true;		
	}
	if(enviroment.getPosValue(bottomPoint[0],bottomPoint[1])){
		coliObj["bottom"]=true;	
	}
	return coliObj;
	
}
var createGhost=function(x,y){
	var newGhost=new ghost({width: 115, height: 136, x:x, y:y });
	newGhost.addAnimation(new cnGame.SpriteSheet("ghostRunLeft",srcObj.ghostRunLeft,{
		width:1265,
		height:136,
		frameSize:[115,136],
		loop:true}
		)
	);
	newGhost.addAnimation(new cnGame.SpriteSheet("ghostRunRight",srcObj.ghostRunRight,{width:1265,height:136,frameSize:[115,136],loop:true}));
	newGhost.addAnimation(new cnGame.SpriteSheet("ghostDieRight",srcObj.ghostDieRight,{width:4320,height:176,frameSize:[240,176],frameDuration:150}));
	newGhost.addAnimation(new cnGame.SpriteSheet("ghostDieLeft",srcObj.ghostDieLeft,{width:1800,height:254,frameSize:[225,254],frameDuration:150}));
	newGhost.addAnimation(new cnGame.SpriteSheet("ghostHurtLeft",srcObj.ghostHurtLeft,{width:816,height:157,frameSize:[204,157],frameDuration:150,onFinish:function(){this.relatedSprite.recover();}}));
	newGhost.addAnimation(new cnGame.SpriteSheet("ghostHurtRight",srcObj.ghostHurtRight,{width:816,height:157,frameSize:[204,157],frameDuration:150,onFinish:function(){this.relatedSprite.recover();}}));
	return newGhost;
	
	
}
/*	画出血条信息	*/
var	drawLife=function(){	
	this.lifeText.draw();
	var lifeImg=cnGame.loader.loadedImgs[srcObj.life];
	cnGame.context.drawImage(lifeImg,0,0,100,15,60,4,this.player.life*10,15);
}
var enviroment;
var gameObj = {
	initialize:function(){
		cnGame.input.preventDefault(["left", "up", "down", "right", "space"]);
		this.lifeText=cnGame.shape.Text("Life:",{x:25,y:15,style:"#FFF",font:"10px sans-serif"});
		this.map = new cnGame.Map({width:3000,height:3000});
		var newLayer=new cnGame.Layer("bg",bgMatrix, { cellSize: [1000, 1000], width: this.map.width, height: this.map.height });
		newLayer.imgsReference={ "1": { src: srcObj.bg }};
		this.map.addLayer(newLayer);
		
		newLayer=new cnGame.Layer("block",blockMatrix, { cellSize: [200, 200], width: this.map.width, height: this.map.height });
		newLayer.imgsReference={ 
			"1": { src: srcObj.leftTopBlock },
			"2": { src: srcObj.topBlock },
			"3": { src: srcObj.rightTopBlock },
			"4": { src: srcObj.leftBlock },
			"5": { src: srcObj.middleBlock },
			"6": { src: srcObj.rightBlock },
			"7": { src: srcObj.leftBottomBlock },
			"8": { src: srcObj.bottomBlock },
			"9": { src: srcObj.rightBottomBlock }
		};
		

		var newGhost=createGhost(740,1064);
		newLayer.addSprites(newGhost);
		newGhost=createGhost(1000,864);
		newLayer.addSprites(newGhost);
		newGhost=createGhost(2200,264);
		newLayer.addSprites(newGhost);
		newGhost=createGhost(2000,1664);
		newLayer.addSprites(newGhost);
		newGhost=createGhost(960,1664);
		newLayer.addSprites(newGhost);
		newGhost=createGhost(1100,1664);
		newLayer.addSprites(newGhost);
		newGhost=createGhost(1100,2664);
		newLayer.addSprites(newGhost);
		newGhost=createGhost(1400,2664);
		newLayer.addSprites(newGhost);
		newGhost=createGhost(2300,2464);
		newLayer.addSprites(newGhost);
		newGhost=createGhost(2500,2464);
		newLayer.addSprites(newGhost);
		newGhost=createGhost(2600,2464);
		newLayer.addSprites(newGhost);
		
		var tube=new cnGame.Sprite({ src: srcObj.tube, width:200, height: 1000, x:2400, y:400 });
		newLayer.addSprites(tube);	
	
		this.player = new player({ src: srcObj.player, width: 116, height: 126, x:40, y:874 });
		
		this.player.addAnimation(new cnGame.SpriteSheet("playerStayRight",srcObj.playerStayRight,{width:812,height:126,frameSize:[116,126],loop:true}));
		this.player.addAnimation(new cnGame.SpriteSheet("playerStayLeft",srcObj.playerStayLeft,{width:812,height:126,frameSize:[116,126],loop:true}));
		this.player.addAnimation(new cnGame.SpriteSheet("playerRunRight",srcObj.playerRunRight,{width:1336,height:130,frameSize:[167,130],loop:true}));
		this.player.addAnimation(new cnGame.SpriteSheet("playerRunLeft",srcObj.playerRunLeft,{width:1336,height:130,frameSize:[167,130],loop:true}));
		this.player.addAnimation(new cnGame.SpriteSheet("playerHurtLeft",srcObj.playerHurtLeft,{width:840,height:128,frameSize:[168,128],frameDuration:100,onFinish:function(){this.relatedSprite.recover();}}));
		this.player.addAnimation(new cnGame.SpriteSheet("playerHurtRight",srcObj.playerHurtRight,{width:840,height:128,frameSize:[168,128],frameDuration:100,onFinish:function(){this.relatedSprite.recover();}}));
		this.player.addAnimation(new cnGame.SpriteSheet("playerDieLeft",srcObj.playerDieLeft,{width:1701,height:167,frameSize:[189,167],frameDuration:150}));
		this.player.addAnimation(new cnGame.SpriteSheet("playerDieRight",srcObj.playerDieRight,{width:1701,height:167,frameSize:[189,167],frameDuration:150}));
		this.player.setCurrentAnimation("playerStayRight");
		newLayer.addSprites(this.player);	
		
		var begin=new cnGame.Sprite({ src: srcObj.begin, width: 57, height: 148, x:0, y:852 });
		newLayer.addSprites(begin);	
		this.end=new cnGame.Sprite({ src: srcObj.end, width: 54, height: 148, x:2946, y:2452 });
		newLayer.addSprites(this.end);	
		
		var line=new cnGame.Sprite({ src: srcObj.line, width:316, height: 96, x:0, y:600 });
		newLayer.addSprites(line);	
		line=new cnGame.Sprite({ src: srcObj.line1, width:156, height: 48, x:0, y:600 });
		newLayer.addSprites(line);	
		line=new cnGame.Sprite({ src: srcObj.line1, width:156, height: 48, x:800, y:600 });
		newLayer.addSprites(line);
		line=new cnGame.Sprite({ src: srcObj.line1, width:156, height: 48, x:800, y:1600 });
		newLayer.addSprites(line);
		line=new cnGame.Sprite({ src: srcObj.line1, width:156, height: 48, x:1800, y:2400 });
		newLayer.addSprites(line);
		line=new cnGame.Sprite({ src: srcObj.line, width:316, height: 96, x:1400, y:2400 });
		newLayer.addSprites(line);
		var line=new cnGame.Sprite({ src: srcObj.line, width:316, height: 96, x:1900, y:200 });
		newLayer.addSprites(line);	
		

		
		
        this.map.addLayer(newLayer);
		enviroment=this.enviroment=newLayer;
		
		this.view=new cnGame.View({map:this.map,x:0,y:0,width:cnGame.width,height:cnGame.height});
		this.view.centerElem(this.player,true);
		this.floorY=this.player.y+this.player.height;
	
	},
	update:function(duration){
		if(cnGame.collision.col_Between_Rects(this.player.getRect(),this.end.getRect())){
			alert("you win!");
			cnGame.loop.end();
			return;
		}
		if(!this.player.isDead){
			var input = cnGame.input;
			var playerSpeed=this.player.moveSpeed;
			if(!this.player.isHurt){
				if ((input.isPressed("left")||input.isPressed("a"))) {//向左转
					var floorY=this.player.y+this.player.height;
					this.player.setMovement({speedX:- playerSpeed});
					if(!this.player.isJump){
						this.player.setCurrentAnimation("playerRunLeft");
				
					}
					this.player.y=floorY-this.player.height;
				}
				else if ((input.isPressed("right")||input.isPressed("d"))) {//向右转
					var floorY=this.player.y+this.player.height;
					this.player.setMovement({speedX: playerSpeed});
					if(!this.player.isJump){
						this.player.setCurrentAnimation("playerRunRight");
			
					}
			

					this.player.y=floorY-this.player.height;
				}
				else if((input.isPressed("down")||input.isPressed("s"))&&!this.player.isJump){
					this.player.setMovement({speedY:0,speedX:0,aY:0});
					var floorY=this.player.y+this.player.height;
					if(isToRight(this.player)){
						this.player.setCurrentImage(srcObj.playerSitRight);
					}
					else if(isToLeft(this.player)){
						this.player.setCurrentImage(srcObj.playerSitLeft);	
					}
					this.player.y=floorY-this.player.height;
				}
				else if(!this.player.isJump&&isToRight(this.player)){
					var floorY=this.player.y+this.player.height;
					this.player.setMovement({speedX:0});
					this.player.setCurrentAnimation("playerStayRight");
					this.player.y=floorY-this.player.height;
				}
				else if(!this.player.isJump&&isToLeft(this.player)){
					var floorY=this.player.y+this.player.height;
					this.player.setMovement({speedX:0});
					this.player.setCurrentAnimation("playerStayLeft");
					this.player.y=floorY-this.player.height;

				}
				
				if((input.isPressed("up")||input.isPressed("w"))){
					if(!this.player.isJump){
						this.player.setMovement({speedY:-23,aY:30});
						this.player.isJump=true;
					}	
				}
				
				if(this.player.isJump){
					if(this.player.speedX>0){
						this.player.setCurrentImage(srcObj.playerJumpRight);
					}
					else if(this.player.speedX<0){
						this.player.setCurrentImage(srcObj.playerJumpLeft);
					}
					else if(isToRight(this.player)){
						this.player.setCurrentImage(srcObj.playerJumpRight);	
					}
					else if(isToLeft(this.player)){
						this.player.setCurrentImage(srcObj.playerJumpLeft);
					}
				}
			}
			if(input.isPressed("space")){
				this.player.shoot();
			}
	
			var _player=this.player;
			var enviroment=this.enviroment;
			var coliObj=isColiWithBlock(_player);
	
			if(coliObj){		
				var x=this.player.x;
				var y=this.player.y;
				var speedX=this.player.speedX;
				var speedY=this.player.speedY;
				
				
				if(coliObj["right"]&&this.player.speedX>0){	
					this.player.speedX=0;
					
				}
				if(coliObj["left"]&&this.player.speedX<0){
					this.player.speedX=0;
				}
				if(coliObj["top"]&&this.player.speedY<0){
					this.player.speedY*=-1;
				}
	
			}
			if(!coliObj["bottom"]&&!_player.isJump){//判断玩家是否脱离石级在跌落
				this.player.setMovement({aY:30});
				this.player.isJump=true;
			}
			else if(coliObj["bottom"]&&this.player.speedY>0){
				this.player.setMovement({aY:0,speedY:0});
				this.player.isJump=false;
				var floorY=this.player.y+this.player.height;
				floorY-=(floorY%this.enviroment.cellSize[1]);
				if(isToLeft(this.player)){
					this.player.setCurrentAnimation("playerStayLeft");
				}
				if(isToRight(this.player)){
					this.player.setCurrentAnimation("playerStayRight");
				}
			
				this.player.y=floorY-this.player.height;
			}
			var list=enviroment.spriteList;
		
			for(var i=0;i<list.getLength();i++){//检测子弹是否击中僵尸
		
				var obj=list.get(i);
				if(obj&&obj instanceof bullet){
					if(!this.view.isPartlyInsideView(obj)){
						list.remove(obj);
						i--;
						continue;
					}
					var bulletRect=obj.getRect();
					for(var j=0;j<list.getLength();j++){
						var obj2=list.get(j);
						if(obj2&&obj2 instanceof ghost&&!obj2.isDead&&this.view.isPartlyInsideView(obj2)&&cnGame.collision.col_Between_Rects(bulletRect,obj2.getRect())){
							obj2.hurt();
							list.remove(obj);
							i--;
							
						}
					}
				}
				else if(obj&&obj instanceof ghost){//更新僵尸的移动方向
					if(obj.isDead||!this.view.isPartlyInsideView(obj)){
						obj.run(0,enviroment);
					}
					else if(Math.abs(obj.x-this.player.x)<10&&this.view.isPartlyInsideView(obj)){
						var playerRect=this.player.getRect();
						var ghostRect=obj.getRect();
						if(!obj.isDead&&!obj.isHurt&&Math.abs(obj.x-this.player.x)<10&&_player.y+_player.height==obj.y+obj.height){
							_player.hurt();
						}	
						obj.run(0,enviroment);
					}
					else if(_player.isCenterLeftTo(obj)&&!obj.isHurt){
						obj.run(-1,enviroment);
					}
					else if(_player.isCenterRightTo(obj)&&!obj.isHurt){
						obj.run(1,enviroment);
					}
	
				
				}
			}
		}
		
		this.map.update(duration);
		this.view.update();
	},
	draw:function(){
		var map=this.map;
		this.view.applyInView(function(){
			map.draw();		
		});
		drawLife.call(this);
			
	}
}
cnGame.loader.start(gameObj, { srcArray: srcObj });

