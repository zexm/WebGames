/*	加载的图片资源字典	*/
var srcObj = {
    player: "player4.png",
    ground: "ground.png",
    wall1: "wall5.png",
    wall2: "wall7.png",
    redDoor0: "redDoor.png",
    redDoor: "redDoor.png",
	greenDoor0: "greenDoor.png",
    greenDoor: "greenDoor.png",
	blueDoor0: "blueDoor.png",
    blueDoor: "blueDoor.png",
	redKey0: "redKey0.png",
    redKey: "redKey.png",
	redKey1: "redKey1.png",
    greenKey0: "greenKey0.png",
    greenKey: "greenKey.png",
	greenKey1: "greenKey1.png",
    blueKey0: "blueKey0.png",
    blueKey: "blueKey.png",
	blueKey1: "blueKey1.png",
    enemy0:"enemy0AA.png",
    enemy: "enemyAA.png",
    enemy1:"enemy1AA.png",
    hurt:"hurt.png",
    star:"star.png",
	pl:"player10.png",
	enemy10:"enemyDie.png",
	life:"life.png",
	destination:"destinationAA.png"
  
  
 };
/*	地图矩阵	*/
var mapMatrix = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 2],
  [2, 0, 1, 0, 0, 1, 2, 2, 2, 1, 1, 0, 0, 1, 0, 1, 0, 2],
  [2, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 2],
  [2, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 2],
  [2, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 2],
  [2, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 2, 0, 1, 0, 2, 0, 2],
  [2, 2, 2, 2, 2, 1, 1, 3, 1, 1, 1, 2, 1, 2, 0, 2, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 2, 0, 0, 0, 1, 5, 2],
  [2, 0, 2, 2, 2, 2, 2, 0, 1, 1, 0, 1, 1, 0, 2, 2, 0, 2],
  [2, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 4, 0, 0, 0, 0, 2],
  [2, 0, 1, 0, 0, 0, 1, 0, 1, 2, 0, 1, 1, 1, 1, 1, 0, 2],
  [2, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2],
  [2, 0, 1, 0, 1, 0, 2, 1, 1, 2, 0, 2, 2, 2, 1, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 2],
  [2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 0, 0, 1, 0, 0, 2],
  [2, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 2, 1, 0, 0, 2],
  [2, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 2, 1, 0, 0, 2],
  [2, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];


cnGame.init("canvas", { width: 360, height: 400 });//初始化框架

/*	player构造函数	*/
var player = function(options) {
    this.init(options);
    this.FOV = options.FOV || 60; //玩家的视野角度
    this.bodyHeight = 20; //玩家视觉高度
    this.moveSpeed = 2;
    this.life = 10;
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    this.hurtLastTime = 0;
    this.hurtDuration = 2; //受伤持续时间:秒
   

}
cnGame.core.inherit(player, cnGame.Sprite);

/*	player的射击方法	*/
player.prototype.shoot = function(starPos) {
	var list2=colImgsArray;
    this.isShooting = true;
    var enemyRect;
	this.relatedObj.setCurrentAnimation("shoot");//屏幕上的射击动画
	this.relatedObj.index(0);
  
    for (var i = list2.length - 1; i >= 0; i--) {
        if (list2[i] instanceof enemy2 && list2[i].relatedParent.isShooting) {
            var obj = list2[i];
            var enemyRect = obj.getRect();//构造敌人在屏幕上形成的矩形对象
            if (cnGame.collision.col_Point_Rect(starPos[0], starPos[1], enemyRect)) {
				obj.setCurrentAnimation("enemyDie");	
                break;
            }
        }
    }

}
/*	player受伤	*/
player.prototype.hurt = function() {
    this.isHurt = true;
	this.life = Math.max(0, this.life - 1);
    this.hurtLastTime = (new Date()).getTime();

}
/*	player恢复	*/
player.prototype.recover = function() {
    this.isHurt = false;

}
/*	屏幕上的player	*/
var player2=function(options){
    this.init(options);	
	
}
cnGame.core.inherit(player2, cnGame.Sprite);

/*	敌人构造函数	*/
var enemy = function(options) {
    this.init(options);
    this.screenImg = options.screenImg; //在3D屏幕上的图片
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2;
    this.shootDuration = options.shootDuration; //单位：秒
    this.lastShootTime = 0;
}

cnGame.core.inherit(enemy, cnGame.Sprite);
/*	敌人射击方法	*/
enemy.prototype.shoot = function(player) {
    var randomNum = Math.floor(Math.random() * 2); //获取随机数
    if (!randomNum) {//如果随机数是0（1/2机会），则击中玩家
        player.hurt();

    }

}
/*	敌人更新的同时更新屏幕上的敌人对象	*/
enemy.prototype.update=function(){
	this.parent.prototype.update.call(this);
	this.relatedObj.update();
	
}

/*	屏幕上的敌人的构造函数	*/
var enemy2=function(options){
    this.init(options);	
	
}
cnGame.core.inherit(enemy2, cnGame.Sprite);


/*	钥匙构造函数	*/
var key = function(options) {
    this.init(options);
    this.keyValue = options.keyValue;//钥匙的值
    this.screenImg = options.screenImg; //在3D屏幕上的图片

}
cnGame.core.inherit(key, cnGame.Sprite);

/*	屏幕上的钥匙构造函数	*/
var key2=function(options){
	this.init(options);		
}
cnGame.core.inherit(key2, cnGame.Sprite);


/*  获取屏幕上门或墙的图片  */
var getImgOnScreen = function(map, x, y) {
    var loadedImgs = cnGame.loader.loadedImgs;
    if (map.getPosValue(x, y) == 1) {
        img = loadedImgs[srcObj.wall1]; //墙1的图片
    }
    else if (map.getPosValue(x, y) == 2) {
        img = loadedImgs[srcObj.wall2]; //墙2的图片
    }
    else if (map.getPosValue(x, y) == 3) {
        img = loadedImgs[srcObj.redDoor]; //红门的图片
    }
    else if (map.getPosValue(x, y) == 4) {
        img = loadedImgs[srcObj.greenDoor]; //绿门的图片
    }
    else if (map.getPosValue(x, y) == 5) {
        img = loadedImgs[srcObj.blueDoor]; //蓝门的图片
    }
    return img;
}
/*	player是否碰墙	*/
var isOnWall = function(x, y, width, height, map) {
    return map.getPosValue(x + width / 2, y + height / 2);

}
var colImgsArray = []; //像素线数组

/*	更新每个像素线的信息	*/
var updateColLine = function() {
    var screenX;
    var colAngle;
    var centerX, centerY, beforeX, beforeY, x, y, distant, heightInScreen;
    var colCount = this.screenSize[0] / this.viewColWidth;
	var spriteList = cnGame.spriteList;
	var _player=this.player;
	var screenSize=this.screenSize;
	var screenDistant=this.screenDistant;
	var viewColWidth=this.viewColWidth;
	var map=this.map;
	var wallSize=this.wallSize;
	var playerView=(this.player.FOV/2)*Math.PI/180;//player的左右视野范围
    colImgsArray = [];

    for (var index = 0, colCount = screenSize[0] / viewColWidth; index < colCount; index++) {
        var colliDir;
        var img;
        screenX = -screenSize[0] / 2 + index * viewColWidth; //该竖线在屏幕的x坐标	
        colAngle = Math.atan(screenX / screenDistant); //玩家的视线到屏幕上的竖线所成的角度
        colAngle %= 2 * Math.PI;
        var angle = _player.angle / 180 * (Math.PI) - colAngle; //射线在地图内所成的角度
        angle %= 2 * Math.PI;
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        distant = 0;
        x = 0;
        y = 0;
        centerX = _player.x + (_player.width) / 2; //玩家中点X坐标
        centerY = _player.y + (_player.height) / 2; //玩家中Y坐标
        while (map.getPosValue(centerX + x, centerY - y) == 0) {
            var nextDistant = distant + 1;

            nextX = nextDistant * Math.cos(angle);
            nextY = nextDistant * Math.sin(angle);
            if (map.getPosValue(centerX + nextX, centerY - y) != 0) {
                colliDir = "x"; //x方向上的相交
            }
            else if (map.getPosValue(centerX + x, centerY - nextY) != 0) {
                colliDir = "y"; //y方向上的相交
            }
            x = nextX;
            y = nextY;
            distant = nextDistant;
        }
        distant *= Math.cos(colAngle); //防止鱼眼效果
        heightInScreen = screenDistant / (distant) * wallSize[2]; //根据玩家到墙壁的距离计算墙壁在视觉平面的高度

        var img = getImgOnScreen(map, centerX + x, centerY - y);

        if (colliDir == "y") {
            var len = ((centerX + x) % wallSize[0]) * (img.width / wallSize[0]);
        }
        else if (colliDir == "x") {
            var len = ((centerY - y) % wallSize[1]) * (img.width / wallSize[1]);
        }
        var newObj = {
            img: img,
            oriX: Math.floor(len),
            oriY: 0,
            oriWidth: img.width / screenSize[0] * viewColWidth,
            oriHeight: img.height,
            x: viewColWidth * index,
            y: (screenSize[1] - heightInScreen) / 2,
            width: viewColWidth,
            height: heightInScreen,
            zIndex: Math.floor(1 / distant * 10000)

        }
        colImgsArray.push(newObj);
    }
	
	/* 敌人和钥匙对象屏幕上的信息更新	*/

    for (var i = 0, len = spriteList.length; i < len; i++) {
        if (spriteList[i] instanceof enemy||spriteList[i] instanceof key) {
            var playerCenter = getCenterXY(_player);
            var enemyCenter = getCenterXY(spriteList[i]);
            var xDistant = enemyCenter[0] - playerCenter[0];
            var yDistant = playerCenter[1] - enemyCenter[1];
            var spriteAngle = Math.atan2(yDistant, xDistant);
			if(spriteAngle>Math.PI){
				spriteAngle=2*Math.PI-spriteAngle;
			}
			else if(spriteAngle<-Math.PI){
				spriteAngle=2*Math.PI+spriteAngle;
				
			}
            var angleToPlayer = (_player.angle * Math.PI / 180) - spriteAngle;//相对于player的角度

            if (angleToPlayer > Math.PI) {//计算夹角，取小的
                angleToPlayer -= 2 * Math.PI;
            }
            else if (angleToPlayer < -Math.PI) {
                angleToPlayer += 2 * Math.PI;
            }
			
            if (angleToPlayer > -playerView && angleToPlayer < playerView) {//在player视野范围内
                var distant = Math.sqrt(xDistant * xDistant + yDistant * yDistant);
                var scale = screenDistant / distant;
                screenX = screenSize[0] / 2 + Math.tan(angleToPlayer) * screenDistant - spriteList[i].width / 2 * scale;
				var img=spriteList[i].image;
				var relatedObj=spriteList[i].relatedObj;
				var relatedShow=relatedObj.image||relatedObj.spriteSheet;
 				
				var frameSizeWidth;
				var frameSizeHeight;
				var heightScale;
				var imgHeight;
				var imgWidth;
                	
				if(relatedObj.spriteSheet){
					scale=(img.width*scale)/relatedShow.frameSize[0];
					relatedShow.scale=scale;
					imgHeight=scale*relatedShow.frameSize[1];
				}
				else if(relatedObj.image){
					heightScale=relatedObj.image.height/relatedObj.image.width;					
               		imgWidth = img.width * scale;
					imgHeight = imgWidth*heightScale;
					relatedObj.width=imgWidth;
					relatedObj.height=imgHeight;
				}
                var screenY = (screenSize[1]) / 2 - imgHeight / 4;
                var zIndex = Math.floor(1 / distant * 10000);
                spriteList[i].zIndex = zIndex;
				relatedObj.x= screenX;
				relatedObj.y= screenY;
				relatedObj.zIndex=zIndex;	
				relatedObj.imgWidth=relatedShow.width;
				relatedObj.imgHeight=relatedShow.height;				
				colImgsArray.push(relatedObj);
            }
        }

    }


}
/*  检测是否获得钥匙    */
var checkGetKeys = function() {
    var list = cnGame.spriteList;
	var playerRect= this.player.getRect();
    for (var i = 0, len = list.length; i < len; i++) {
        if (list[i] instanceof key) {
            if (cnGame.collision.col_Between_Rects(list[i].getRect(),playerRect)) {
                this.keysValue.push(list[i].keyValue);
                list.remove(list[i]);
                i--;
                len--;
            }
        }
    }

}
/*  返回在哪扇门前   */
var BeforeDoor = function() {
    var rect = this.player.getRect();
    var map = this.map;
    var doorsArr = this.doorsArr;
    for (var i = 0, len = doorsArr.length; i < len; i++) {
        if (map.getPosValue(rect.leftTop[0], rect.leftTop[1]) == doorsArr[i].value || map.getPosValue(rect.rightTop[0], rect.rightTop[1]) == doorsArr[i].value || map.getPosValue(rect.leftBottom[0], rect.leftBottom[1]) == doorsArr[i].value || map.getPosValue(rect.rightBottom[0], rect.rightBottom[1]) == doorsArr[i].value) {
            return doorsArr[i];
        }
    }

}


/*  门对象的构造函数    */
var door = function(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;

}
/*  打开门  */
var openDoor = function(door, map) {
    var index = map.getCurrentIndex(door.x, door.y);
    map.setIndexValue(index,0);
}
/*  获取对象的中点坐标  */
var getCenterXY=function(elem){
    return [elem.x+elem.width/2,elem.y+elem.height/2];
}

/*  根据玩家位置改变敌人的角度  */
var changeEnemyAngle = function(duration) {
    var spriteList = cnGame.spriteList;
    var player = this.player;
    var playerCenter = getCenterXY(player);
    var playerRect = this.player.getRect();
    var distant;
    var x;
    var y;
    var nextX;
    var nextY;

    for (var i = 0, len = spriteList.length; i < len; i++) {
        if (spriteList[i] instanceof enemy) {
            distant = 0;
            var enemyCenter = getCenterXY(spriteList[i]);
            var distantX = playerCenter[0] - enemyCenter[0];
            var distantY = enemyCenter[1] - playerCenter[1];
            var detect = false;

            var angle = Math.atan2(distantY, distantX);

            if (angle < 0) {
                angle += 2 * Math.PI;
            }
            else if (angle > 2 * Math.PI) {
                angle -= 2 * Math.PI;
            }

            spriteList[i].angle = angle * 180 / Math.PI;
            nextX = enemyCenter[0];
            nextY = enemyCenter[1];
            while (this.map.getPosValue(nextX, nextY) == 0) {
                distant += 1;
                x = nextX;
                y = nextY;
                if (cnGame.collision.col_Point_Rect(x, y, playerRect)&&!spriteList[i].relatedObj.isCurrentAnimation("enemyDie")) {//如果地图上敌人能看到玩家，则向玩家射击
                    spriteList[i].isShooting = true;
                    if (spriteList[i].lastShootTime > spriteList[i].shootDuration) {//检查是否超过射击时间间隔，超过则射击玩家            
                        spriteList[i].shoot(player);
                        spriteList[i].relatedObj.setCurrentImage(srcObj.enemy1);		
                        spriteList[i].lastShootTime = 0;

                    }
                    else {
                        if (spriteList[i].lastShootTime > 0.1) {
                            spriteList[i].relatedObj.setCurrentImage(srcObj.enemy);
                        }
                        spriteList[i].lastShootTime += duration;
                    }
                    break;
                }
                else {
                    spriteList[i].isShooting = false;
                }
                nextX = distant * Math.cos(angle) + enemyCenter[0];
                nextY = enemyCenter[1] - distant * Math.sin(angle);
            }

        }
    }
}
/*	画出血条信息	*/
var	drawLife=function(){	
	this.lifeText.draw();
	var lifeImg=cnGame.loader.loadedImgs[srcObj.life];
	this.screenContext.drawImage(lifeImg,0,0,100,15,60,4,this.player.life*10,15);
}
/*	画出获得的钥匙信息	*/
var drawKeys=function(){
	this.keyText.draw();
	var keyImg;
	var startX=240;
	var keysArr=this.keysValue;
	for(var i=0,len=keysArr.length;i<len;i++){
		if(keysArr[i]==3){
			keyImg=cnGame.loader.loadedImgs[srcObj.redKey1];			
		}
		else if(keysArr[i]==4){
			keyImg=cnGame.loader.loadedImgs[srcObj.greenKey1];	
		}
		else if(keysArr[i]==5){
			keyImg=cnGame.loader.loadedImgs[srcObj.blueKey1];	
		}
		this.screenContext.drawImage(keyImg,startX,2,20,20);
		startX+=25;
	}
	
}
/*	添加敌人	*/
var addEnemy=function(enemyX,enemyY,shootDuration,screenContext){
	    var newEnemy = new enemy({ src: srcObj.enemy0, width: 10, height: 10, angle: 0, x: enemyX, y: enemyY, screenImg: cnGame.loader.loadedImgs[srcObj.enemy], shootDuration: shootDuration });
		newEnemy.relatedObj=new enemy2({src:srcObj.enemy,context:screenContext});
		newEnemy.relatedObj.relatedParent=newEnemy;
		newEnemy.relatedObj.addAnimation(new cnGame.SpriteSheet("enemyDie",srcObj.enemy10,{frameDuration:100,width:1140,height:550,frameSize:[190,550],context:screenContext,onFinish:function(){cnGame.spriteList.remove(this.relatedSprite.relatedParent);}}));
        cnGame.spriteList.add(newEnemy);
	
}


/*	游戏对象	*/
var gameObj = {
    screenSize: [320, 240], //视觉屏幕尺寸
    viewColWidth: 1, //每条绘制线条的宽
    wallSize: [20, 20, 20], //墙的尺寸
    keysValue: [], //钥匙的值 3：红 4：绿 5：蓝
    doorsArr: [],//门数组
    initialize: function() {

        cnGame.input.preventDefault(["left", "up", "down", "right", "shift", "space","w","s","a","d"]);

        this.player = new player({ src: srcObj.player, width: 10, height: 10, angle: 90, x: 20, y: 360 });
		this.screenCanvas = cnGame.core.$("screenCanvas"); //用于显示3d空间的canvas
        this.screenContext = this.screenCanvas.getContext("2d"); //3d空间的canvas的context
		this.player.relatedObj=new player2({src:srcObj.pl,x:0,y:55,width:320,height:185,imgWidth:320,imgHeight:185,context:this.screenContext});
		this.player.relatedObj.addAnimation(new cnGame.SpriteSheet("shoot",srcObj.pl,{width:3520,height:185,frameSize:[320,185],context:this.screenContext}));

        cnGame.spriteList.add(this.player);
		cnGame.spriteList.add(this.player.relatedObj);
		
        this.screenDistant = (this.screenSize[0] / 2) / (Math.tan(this.player.FOV / 2 * Math.PI / 180)); //屏幕离玩家的距离
        this.enemyMoveDuration = 2;
        this.enemyLastMove = 0;

        this.map = new cnGame.Map(mapMatrix, { cellSize: [20, 20], width: cnGame.width, height: cnGame.height });

        var redKey = new key({ src: srcObj.redKey0, x: 25, y: 225, width: 5, height: 5, screenImg: cnGame.loader.loadedImgs[srcObj.redKey], keyValue: 3 });
		redKey.relatedObj=new key2({src:srcObj.redKey,context:this.screenContext});
        cnGame.spriteList.add(redKey);
		
        var greenKey = new key({ src: srcObj.greenKey0, x: 25, y: 65, width: 5, height: 5, screenImg: cnGame.loader.loadedImgs[srcObj.greenKey], keyValue: 4 });
		greenKey.relatedObj=new key2({src:srcObj.greenKey,context:this.screenContext});
        cnGame.spriteList.add(greenKey);
        var blueKey = new key({ src: srcObj.blueKey0, x: 270, y: 30, width: 5, height: 5, screenImg: cnGame.loader.loadedImgs[srcObj.blueKey], keyValue: 5 });
		blueKey.relatedObj=new key2({src:srcObj.blueKey,context:this.screenContext});
        cnGame.spriteList.add(blueKey);

        var cellSize = this.map.cellSize;
        var redDoor = new door(7 * cellSize[0], 7 * cellSize[1], 3);
        this.doorsArr.push(redDoor);
        var greenDoor = new door(12 * cellSize[0], 10 * cellSize[1], 4);
        this.doorsArr.push(greenDoor);
        var blueDoor = new door(16 * cellSize[0], 8 * cellSize[1], 5);
        this.doorsArr.push(blueDoor);
		
		/*	在不同地方添加敌人	*/
		addEnemy(60,165,1,this.screenContext);
		addEnemy(100,165,2,this.screenContext);
		addEnemy(150,105,1,this.screenContext);
		addEnemy(50,120,1.5,this.screenContext);
		addEnemy(25,40,0.5,this.screenContext);
		addEnemy(240,90,1,this.screenContext);
		addEnemy(95,285,0.5,this.screenContext);
		addEnemy(160,365,1.5,this.screenContext);
		addEnemy(210,170,2,this.screenContext);
		addEnemy(225,205,0.5,this.screenContext);
		addEnemy(175,25,1.5,this.screenContext);
		addEnemy(265,190,0.5,this.screenContext);
		addEnemy(285,110,0.5,this.screenContext);
		addEnemy(265,205,1,this.screenContext);
		addEnemy(265,295,1,this.screenContext);
		addEnemy(325,295,1.5,this.screenContext);

		/*	生命条和钥匙文本	*/
		this.lifeText=cnGame.shape.Text("生命值：",{x:10,y:14,style:"#000",font:"10px sans-serif",context:this.screenContext});
		this.keyText=cnGame.shape.Text("获得钥匙：",{x:180,y:14,style:"#000",font:"10px sans-serif",context:this.screenContext});
    },
    update: function(duration) {
		if(this.player.life==0){
			cnGame.loop.end();
			alert("you lost!");	
			return;
		}
		if(this.map.getPosValue(this.player.x,this.player.y)=="9"){
			cnGame.loop.end();
			alert("you win!");	
			return;		
		}
        var now = (new Date()).getTime();
        var input = cnGame.input;
        if (input.isPressed("left")||input.isPressed("a")) {//向左转
            this.player.angle += 5;
        }
        else if (input.isPressed("right")||input.isPressed("d")) {//向右转
            this.player.angle -= 5;
        }
        if (this.player.angle < 0) {
            this.player.angle += 360;
        }
        else if (this.player.angle >= 360) {
            this.player.angle %= 360;
        }
        if (input.isPressed("up")||input.isPressed("w")) {//前进
            var nextX = this.player.x + Math.cos(this.player.angle * Math.PI / 180) * this.player.moveSpeed;
            var nextY = this.player.y - Math.sin(this.player.angle * Math.PI / 180) * this.player.moveSpeed;
            if (!isOnWall(nextX, nextY, this.player.width, this.player.height, this.map)) {
                this.player.x = nextX;
                this.player.y = nextY;
            }

        }
        else if (input.isPressed("down")||input.isPressed("s")) {//后退
            var nextX = this.player.x - Math.cos(this.player.angle * Math.PI / 180) * this.player.moveSpeed;
            var nextY = this.player.y + Math.sin(this.player.angle * Math.PI / 180) * this.player.moveSpeed;
            if (!isOnWall(nextX, nextY, this.player.width, this.player.height, this.map)) {
                this.player.x = nextX;
                this.player.y = nextY;
            }
        }
        var door;
        if (input.isPressed("shift")) {//开门
            door = BeforeDoor.call(this);
            if (door) {
                for (var i = 0, len = this.keysValue.length; i < len; i++) {
                    if (this.keysValue[i] == door.value) {
                        openDoor(door, this.map);
                        break;
                    }
                }
            }
        }
   
        if (input.isPressed("space")) {
            if (!this.player.isShooting) {
                this.player.shoot([this.screenSize[0] / 2, this.screenSize[1] / 2]);
            }
        }
        else {
            this.player.isShooting = false;
        }
		
        changeEnemyAngle.call(this, duration);
        updateColLine.call(this);
        checkGetKeys.call(this);

        if (this.player.isHurt && (now - this.player.hurtLastTime) / 1000 > this.player.hurtDuration) {//player受伤状态的恢复
            this.player.recover();
        }

        colImgsArray.sort(function(obj1, obj2) {

            if (obj1.zIndex > obj2.zIndex) {
                return 1;
            }
            else if (obj1.zIndex < obj2.zIndex) {
                return -1;
            }
            else {
                return 0;
            }
        });
    },
    draw: function(duration) {
		//画出地图
        this.map.draw({ "0": { src: srcObj.ground }, "1": { src: srcObj.wall1 }, "2": { src: srcObj.wall2 }, "3": { src: srcObj.redDoor }, "4": { src: srcObj.greenDoor }, "5": { src: srcObj.blueDoor},"9":{ src: srcObj.destination}});
		//画出天和地
        var context = this.screenContext;
        context.clearRect(0, 0, this.screenSize[0], this.screenSize[1]);
        context.fillStyle = "rgb(203,242,238)";
        context.fillRect(0, 0, this.screenSize[0], this.screenSize[1] / 2);
        context.fillStyle = "rgb(77,88,87)";
        context.fillRect(0, this.screenSize[1] / 2, this.screenSize[0], this.screenSize[1] / 2);
		//画出每条像素线和游戏元素
        for (var i = 0, len = colImgsArray.length; i < len; i++) {
            var obj = colImgsArray[i];
			if(obj.draw){
				obj.draw();
			}
			else{
            	context.drawImage(obj.img, obj.oriX, obj.oriY, obj.oriWidth, obj.oriHeight, obj.x, obj.y, obj.width, obj.height);
			}
        }	
		//画出准星
        var starImg = cnGame.loader.loadedImgs[srcObj.star];
        context.drawImage(starImg, this.screenSize[0] / 2 - starImg.width, this.screenSize[1] / 2 - starImg.height, starImg.width, starImg.height); 
		//受伤的时候画出红屏
        if (this.player.isHurt) {
            context.drawImage(cnGame.loader.loadedImgs[srcObj.hurt], 0, 0, this.screenSize[0], this.screenSize[1]);
        }
		//画出血条信息
		drawLife.call(this);
		//画出钥匙信息
		drawKeys.call(this);

    }
};
cnGame.loader.start(gameObj, { srcArray: srcObj });