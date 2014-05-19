init(100,"mylegend",525,500,main);
LSystem.screen(LStage.FULL_SCREEN);
var backLayer,tileLayer,ctrlLayer,overLayer,gameoverLayer,selectLayer;
var tileText,overText,gameoverText;
var col,row;
var time = 0;
var timerTickerInterval = 1000;
var description = [
	"'日'对'曰'说：该减肥了。",
	"'占'对'点'说：买小轿车了？",
	"'自'对'目'说：你单位裁员了？",
	"'寸'对'过'说：老爷子，买躺椅了？",
	"'晶'对'品'说：你家难道没装修？",
	"'办'对'为'说：平衡才是硬道理！",
	"'且'对'但'说：胆小的，还请保镖了？",
	"'吕'对'昌'说：和你相比，我家徒四壁。",
	"'凸'对'凹'说：你也开始练瑜珈了！",
	"'由'对'甲'说：这样练一指禅挺累吧？",
	"'也'对'她'说：当老板了，出门还带秘书？",
	"'比'对'北'说：夫妻一场，何必闹离婚呢？",
	"'茜'对'晒'说：出太阳了，咋不戴顶草帽？",
	"'日'对'旦'说：你什么时候学会玩滑板了？",
	"'大'对'爽'说：就四道题，你怎么全做错了？",
	"'大'对'太'说：做个疝气手术其实很简单。",
	"'人'对'从'说：你怎么还没去做分离手术？",
	"'果'对'裸'说：哥们儿，你穿上衣服还不如不穿",
	"'木'对'术'说：脸上长颗痣就当自己是美人了。",
	"'王'对'三'说：没有主心骨，你永远成不了气候！",
	"'臣'对'巨'说：和你一样的面积，我却有三室两厅。",
	"'兵'对'丘'说：看看战争有多残酷，两条腿都炸飞了！",
	"'个'对'人'说：不比你们年轻人，没根手杖寸步难走。",
	"'叉'对'又'说：什么时候整的容啊？脸上那颗痣呢？",
	"'巾'对'币'说：儿啊，你戴上博士帽，也就身价百倍了。",
	"'王'对'皇'说：当皇上有什么好处，你看，头发都白了。",
	"'口'对'回'说：亲爱的，都怀孕这么久了，也不说一声。",
	"'弋'对'戈'说：'别以为你带了一把剑我就怕你，有种单挑！",
	"'长'对'张'说：'你以为你是后羿啊，没事整天背着弓干嘛？",
	"'尺'对'尽'说：姐姐，结果出来了。你怀的是双胞胎。",
	"'土'对'丑'说：别以为披肩发就好看，其实骨子里还是老土。"
];
var checkpoints = [
	["籍","藉"],
	["我","找"],
	["春","舂"],
	["龙","尤"],
	["含","合"],
	["吴","昊"],
	["忐","忑"],
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
	setTimeLine = setInterval(function(){drawTimeLine();},timerTickerInterval);
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