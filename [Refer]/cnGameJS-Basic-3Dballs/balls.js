
cnGame.init("canvas", { width:600, height: 500,bgColor:"rgba(0,0,0,1)"});//初始化框架
var cg=cnGame,input=cg.input,ctx=cg.context,Line=cg.shape.Line,Text=cg.shape.Text,Sprite=cg.Sprite,Polygon=cg.shape.Polygon,list=cg.spriteList;

var center=[cg.width/2,cg.height/2];//canvas中点
/*	图片资源字典	*/
var srcObj={
	tenBall:"tenBall.png",//十分球
	twentyBall:"twentyBall.png",//二十分球
	thirdtyBall:"thirdtyBall.png",//三十分球
	sTenBall:"sTenBall.png",//减十分球
	sTwentyBall:"sTwentyBall.png",//减二十分球
	sThirdtyBall:"sThirdtyBall.png"//减三十分球
}
/*	小球种类	*/
var ballKinds=[["tenBall",10],["twentyBall",20],["thirdtyBall",30],["sTenBall",-10],["sTwentyBall",-20],["sThirdtyBall",-30]];
/*	小球对象	*/
var Ball=function(opt){
	this.parent.call(this,opt);
	this.oriPos=[this.x+this.width/2,this.y+this.height/2];
	this.oriSize=opt.size;
	this.z=opt.z||0;
	this.score=opt.score||0;
	this.oriSpeedZ=4+Math.random()*4;
	this.scale=1;
	this.resetXY();
	
}
cg.core.inherit(Ball,Sprite);
cg.core.extendProto(Ball,{
	disappear:function(){//小球被选中消失
		list.remove(this);
	},
	resetXY:function(){//根据Z改变x,y的位置和尺寸
		var oriX=this.oriPos[0];
		var oriY=this.oriPos[1];
		var oriSize=this.oriSize;
		this.scale=((center[0]+this.z)/center[0]);//相对于现时的scale		
		this.x=(oriX-center[0])*this.scale+center[0];
		this.y=(oriY-center[1])*this.scale+center[1];
		this.height=this.width=this.oriSize*this.scale;
		this.speedZ=this.oriSpeedZ*this.scale;
		if(this.z>1000){
			this.disappear();
		}
	},
	update:function(){
		this.parent.prototype.update.call(this);
		this.resetXY();
	}
});


/*	小球对象管理器	*/
var ballsManager={
	createDuration:200,
	ballSize:30,
	lastCreateTime:Date.now(),
	/*	随机生成小球	*/
	createRandomBalls:function(num){
		var now=Date.now();
		if(now-this.lastCreateTime>this.createDuration){
			for(var i=0;i<num;i++){
				var x=Math.random()* cg.width;
				var y=Math.random()* cg.height;
				var randomKind=ballKinds[Math.floor(Math.random()*6)];//随机获得的小球种类和分值	
				var newBall=new Ball({x:x,y:y,size:this.ballSize,z:-280,score:randomKind[1]});
				newBall.setCurrentImage(srcObj[randomKind[0]]);//设置图片
				list.add(newBall);
			}
			this.lastCreateTime=now;
		}
	},
	/*	改变小球位置	*/
	changeBallsPos:function(){
		var ballsArr=list.get(function(elem){
			return elem instanceof Ball;							   
		});
		for(var i=0,len=ballsArr.length;i<len;i++){
			var ball=ballsArr[i];
			ball.z+=ball.speedZ;	
		}
	}
}

/*	游戏对象	*/
var gameObj=(function(){
	var prePos;	//鼠标上次的位置
	var currentPos;//鼠标该次的位置
	var circle;//圆对象
	var hasClosed;
	var closedLineSegsArr=[];//闭合轨迹组成线段的数组
	var polygon;//多边形选中区域
	var startTime;//倒计时开始时间
	
	var isPosSame=function(){//判断是否和上一次的位置一样
		return currentPos[0]==prePos[0]&&currentPos[1]==prePos[1];
	};
	/*	倒计时	*/
	var countDown=function(countTime){//秒数形式传入
		var now=Date.now();
		startTime=startTime||now;
		return Math.ceil(countTime-(now-startTime)/1000);//秒数形式返回
			
	};
	/*	判断轨迹是否包含了圆	*/
	var isCover=function(lines,ball){
		var ballCenter=[];
		ballCenter[0]=ball.x+ball.width/2;
		ballCenter[1]=ball.y+ball.height/2;
		debugger;
		var count=0;//相交的边的数量
		var lLine=new Line({start:[ballCenter[0],ballCenter[1]],end:[0,ballCenter[1]],lineWidth:5});//左射线
		for(var i=0,len=lines.length;i<len;i++){
			if(lLine.isCross(lines[i])){
				count++;
			}
		}
		if(count%2==0){//不包含
			return false;
		}
		return true;//包含
	}
	/*	判断线段是否相连接	*/
	var isJoin=function(lineSeg1,lineSeg2){
		return ((lineSeg1.end[0]==lineSeg2.start[0])&&(lineSeg1.end[1]==lineSeg2.start[1]));
	}
	/*	重置线段	*/
	var resetLineSegs=function(lines,i,j,point){
		lines[i].end[0]=point[0];
		lines[i].end[1]=point[1];
		lines[i+1].start[0]=point[0];
		lines[i+1].start[1]=point[1];
		
		lines[j].start[0]=point[0];
		lines[j].start[1]=point[1];
	
		lines[j-1].end[0]=point[0];
		lines[j-1].end[1]=point[1];
		for(var m=i+1;m<j;m++){
			closedLineSegsArr.push(lines[m]);
		}	
	}
	/*	返回轨迹是否闭合	*/
	var isClose=function(lines){	
		var hasClose=false;
		for(var i=0;i<lines.length;i++){
			var l1=lines[i];
			for(var j=i+2;j<lines.length;j++){
				var l2=lines[j];
				if(l2){
					var point=l1.isCross(l2);//交点坐标
					if(point){//非连接的相交
						resetLineSegs(lines,i,j,point);
						hasClosed=true;
						return true;
					}
				}
			}
		}
		
		return false;
	};				  
					  
	return {
		/*	初始化	*/
		initialize:function(){
			var self=this;
			this.score=0;
			this.countDownTime=60;
			this.scoreText=new Text({text:"Score:",x:30,y:40,style:"rgb(200,195,195)"});
			this.scoreText.setOptions({font:"30px Calibri"});
			list.add(this.scoreText);
			this.timeText=new Text({text:"60",x:500,y:50,style:"#fff"});
			this.timeText.setOptions({font:"60px Calibri"});
			list.add(this.timeText);
			
			
			currentPos=prePos=[input.mouse.x,input.mouse.y];
			input.onMouseUp("left",function(){//松开鼠标左键时，如果是线段，则删除	
				var lines=list.get(function(elem){//获取线段集合
					return elem instanceof 	Line;						   
				});
				if(isClose(lines)){//轨迹闭合了
					var ballsArr=list.get(function(elem){
						return elem instanceof Ball;							   
					});
					for(var i=0;i<ballsArr.length;i++){
						var ball=ballsArr[i];
						var ballCenter=[ball.x+ball.width/2,ball.y+ball.height/2];
						if(polygon&&polygon.isInside(ballCenter)&&ball.z>-220){
							ball.disappear();//小球消失
							self.addScore(ball.score);
						}
						
					};
				}
				list.remove(function(elem){//线段消失
					return elem instanceof 	Line;					 
				});
							
				list.remove(polygon);//多边形消失
				hasClosed=false;
				closedLineSegsArr=[];
			});

		},
		/*	得分	*/
		addScore:function(s){
			this.score+=s;
		},
		/*	更新	*/
		update:function(){
			this.scoreText.setOptions({text:"Score:"+this.score});//设置分数内容
			
			var timeLeft=countDown(this.countDownTime);//倒计时
			this.timeText.setOptions({text:timeLeft});
			if(timeLeft<=0){//倒计时结束，结束游戏
				this.end();
				return;
			}

			
			currentPos=[input.mouse.x,input.mouse.y];
			if(!isPosSame()&&input.mouse.left_pressed){//如果和上次位置不一样并且按着鼠标左键，则生成线段
				var newLineSeg=new Line({start:prePos,end:currentPos,lineWidth:5});
				list.add(newLineSeg);
				var lines=list.get(function(elem){//获取线段集合
					return elem instanceof 	Line;						   
				});
				if(!hasClosed){
					if(isClose(lines)){
						var pointsArr=[];
						for(var i=0,len=closedLineSegsArr.length;i<len;i++){
							pointsArr.push([closedLineSegsArr[i].start[0],closedLineSegsArr[i].start[1]]);	
						}
						polygon=new Polygon({pointsArr:pointsArr,style:"rgba(241,46,8,0.5)"});
						list.add(polygon);
					}
				}
			}
			ballsManager.createRandomBalls(Math.floor((Math.random()*4)));//随机生成小球
			ballsManager.changeBallsPos();
			prePos=currentPos;
		},
		/*	游戏结束	*/
		end:function(){
			cg.loop.end();
			alert("Game over!Your score is:"+this.score);
		}
		
	};
					  
})();

var beginText=new Text({text:"press Enter to start",x:60,y:200,style:"rgb(200,195,195)"});
beginText.setOptions({font:"50px Calibri"});
beginText.draw();
input.preventDefault("enter");
input.onKeyDown("enter",function(){
	cnGame.loader.start(gameObj, { srcArray: srcObj });
});