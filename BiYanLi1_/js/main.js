init(100,"mylegend",525,500,main);
LSystem.screen(LStage.FULL_SCREEN);
var backLayer,tileLayer,ctrlLayer,overLayer,gameoverLayer,selectLayer;
var tileText,overText,gameoverText;
var col,row;
var time = 0;
var checkpoints = [
	["籍","藉"],
	["我","找"],
	["春","舂"],
	["龙","尤"],
	["曰","日"]
];
var checkpointNo = 0;
var i0;
var j0;
var i,j;
var partX,partY;
var overTextContent = ["恭喜您，您过关了","进入下一关","重新开始"];
var gameoverTextContent = ["对不起，您失败了","重开关卡"];
var nowLine;
var setTimeLine;
function main(){
	i0 = Math.floor(Math.random()*10);
	j0 = Math.floor(Math.random()*10);

	initLayer();
	initCtrl();
	initTile();
}
function initLayer(){
	backLayer = new LSprite();
	addChild(backLayer);
	
	tileLayer = new LSprite();
	backLayer.addChild(tileLayer);

	ctrlLayer = new LSprite();
	backLayer.addChild(ctrlLayer);
}
function initCtrl(){
	col = 10;
	row = 10;
	addEvent();
	addTimeLine();
}
function initTile(){
	for(i=0;i<row;i++){
		for(j=0;j<col;j++){
			tile();
		}
	}
}
function tile(){
	tileLayer.graphics.drawRect(3,"dimgray",[j*50,i*50,50,50],true,"lightgray");

	var w = checkpoints[checkpointNo][(i==i0 && j==j0) ? 0 : 1];
	tileText = new LTextField();
	tileText.weight = "bold";
	tileText.text = w;
	tileText.size = 25;
  	tileText.color = "lightgray";
	tileText.font = "黑体";
	tileText.x = j*50+7;
	tileText.y = i*50+7;
	tileLayer.addChild(tileText);
	
	var shadow = new LDropShadowFilter(1,15,"#000000");
	tileLayer.filters = [shadow];
}
function addEvent(event){
	overLayer = new LSprite();
	backLayer.addChild(overLayer);

	selectLayer = new LSprite();
	backLayer.addChild(selectLayer);

	gameoverLayer = new LSprite();
	backLayer.addChild(gameoverLayer);

	tileLayer.addEventListener(LMouseEvent.MOUSE_DOWN,onDown);
	selectLayer.addEventListener(LMouseEvent.MOUSE_UP,gameReStart);
	gameoverLayer.addEventListener(LMouseEvent.MOUSE_UP,reTry);
}
function gameReStart(){
	i0 = Math.floor(Math.random()*10);
	j0 = Math.floor(Math.random()*10);

	time = 0;

	tileLayer.removeAllChild();
	overLayer.removeAllChild();
	selectLayer.removeAllChild();
	backLayer.removeChild(selectLayer);
	backLayer.removeChild(overLayer);
	if(checkpointNo != checkpoints.length-1){
		checkpointNo++;
	}
	initTile();
	addEvent();
	addTimeLine();
}
function reTry(){
	i0 = Math.floor(Math.random()*10);
	j0 = Math.floor(Math.random()*10);

	time = 0;

	tileLayer.removeAllChild();
	overLayer.removeAllChild();
	gameoverLayer.removeAllChild();
	selectLayer.removeAllChild();
	backLayer.removeChild(selectLayer);
	backLayer.removeChild(overLayer);
	backLayer.removeChild(gameoverLayer);

	initTile();
	addEvent();
	addTimeLine();
}
function addTimeLine(){
	overLayer.graphics.drawRect(5,"dimgray",[500,0,20,500],true,"lightgray");
	overLayer.graphics.drawLine(15,"lightgray",[510,3,510,497]);
	overLayer.graphics.drawLine(15,"red",[510,3,510,497]);
	setTimeLine = setInterval(function(){drawTimeLine();},100);
}
function drawTimeLine(){
	nowLine = 3+((time/5)*495)/10;
	overLayer.graphics.drawLine(15,"lightgray",[510,3,510,497]);
	overLayer.graphics.drawLine(15,"red",[510,nowLine,510,497]);
	time++;
	if(time>50){
		clearInterval(setTimeLine);
		gameOver();
	}
}
function gameOver(){
	overLayer.graphics.drawRect(5,"dimgray",[(LGlobal.width - 420)*0.5,80,420,250],true,"lightgray");
	gameoverLayer.graphics.drawRect(5,"dimgray",[(LGlobal.width - 250)*0.5,230,250,50],true,"darkgray");

	for(var i=0;i<gameoverTextContent.length;i++){
		gameoverText = new LTextField();
		gameoverText.weight = "bold";
		gameoverText.color = "dimgray";
		gameoverText.font = "黑体";
		if(i==0){
			gameoverText.text = gameoverTextContent[i];
			gameoverText.size = 35;
			gameoverText.x = (LGlobal.width - gameoverText.getWidth())*0.5;
			gameoverText.y = 120;
			gameoverLayer.addChild(gameoverText);
		}else if(i==1){
			gameoverText.text = gameoverTextContent[i];
			gameoverText.size = 20;
			gameoverText.x = (LGlobal.width - gameoverText.getWidth())*0.5;
			gameoverText.y = 240;
			gameoverLayer.addChild(gameoverText);
		}
	}
	tileLayer.removeEventListener(LMouseEvent.MOUSE_DOWN,onDown);
}
function onDown(event){
	var mouseX,mouseY;
	mouseX = event.offsetX;
	mouseY = event.offsetY;

	partX = Math.floor((mouseX)/50);
	partY = Math.floor((mouseY)/50);
	isTure(partX,partY);
}
function isTure(x,y){
	if(x==j0 && y==i0){
		clearInterval(setTimeLine);
		overLayer.graphics.drawRect(5,"dimgray",[(LGlobal.width - 420)*0.5,80,420,250],true,"lightgray");
		selectLayer.graphics.drawRect(5,"dimgray",[(LGlobal.width - 250)*0.5,230,250,50],true,"darkgray");

		for(var i=0;i<overTextContent.length;i++){
			overText = new LTextField();
			overText.weight = "bold";
			overText.color = "dimgray";
			overText.font = "黑体";
			if(i==0){
				overText.text = overTextContent[i];
				overText.size = 35;
				overText.x = (LGlobal.width - overText.getWidth())*0.5;
				overText.y = 120;
				overLayer.addChild(overText);
			}else if(i==1){
				if(checkpointNo == checkpoints.length-1){
					overText.text = overTextContent[i+1];
					overText.size = 20;
					overText.x = (LGlobal.width - overText.getWidth())*0.5;
					overText.y = 240; 
					selectLayer.addChild(overText);
					checkpointNo = 0;
				}else{
					overText.text = overTextContent[i];
					overText.size = 20;
					overText.x = (LGlobal.width - overText.getWidth())*0.5;
					overText.y = 240;
					selectLayer.addChild(overText);
				}
			}
		}
		tileLayer.removeEventListener(LMouseEvent.MOUSE_DOWN,onDown);
	}
}