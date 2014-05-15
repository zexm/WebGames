
cnGame.init("canvas", { width:600, height: 500,bgColor:"rgba(0,0,0,1)"});//��ʼ�����
var cg=cnGame,input=cg.input,ctx=cg.context,Line=cg.shape.Line,Text=cg.shape.Text,Sprite=cg.Sprite,Polygon=cg.shape.Polygon,list=cg.spriteList;

var center=[cg.width/2,cg.height/2];//canvas�е�
/*	ͼƬ��Դ�ֵ�	*/
var srcObj={
	tenBall:"tenBall.png",//ʮ����
	twentyBall:"twentyBall.png",//��ʮ����
	thirdtyBall:"thirdtyBall.png",//��ʮ����
	sTenBall:"sTenBall.png",//��ʮ����
	sTwentyBall:"sTwentyBall.png",//����ʮ����
	sThirdtyBall:"sThirdtyBall.png"//����ʮ����
}
/*	С������	*/
var ballKinds=[["tenBall",10],["twentyBall",20],["thirdtyBall",30],["sTenBall",-10],["sTwentyBall",-20],["sThirdtyBall",-30]];
/*	С�����	*/
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
	disappear:function(){//С��ѡ����ʧ
		list.remove(this);
	},
	resetXY:function(){//����Z�ı�x,y��λ�úͳߴ�
		var oriX=this.oriPos[0];
		var oriY=this.oriPos[1];
		var oriSize=this.oriSize;
		this.scale=((center[0]+this.z)/center[0]);//�������ʱ��scale		
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


/*	С����������	*/
var ballsManager={
	createDuration:200,
	ballSize:30,
	lastCreateTime:Date.now(),
	/*	�������С��	*/
	createRandomBalls:function(num){
		var now=Date.now();
		if(now-this.lastCreateTime>this.createDuration){
			for(var i=0;i<num;i++){
				var x=Math.random()* cg.width;
				var y=Math.random()* cg.height;
				var randomKind=ballKinds[Math.floor(Math.random()*6)];//�����õ�С������ͷ�ֵ	
				var newBall=new Ball({x:x,y:y,size:this.ballSize,z:-280,score:randomKind[1]});
				newBall.setCurrentImage(srcObj[randomKind[0]]);//����ͼƬ
				list.add(newBall);
			}
			this.lastCreateTime=now;
		}
	},
	/*	�ı�С��λ��	*/
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

/*	��Ϸ����	*/
var gameObj=(function(){
	var prePos;	//����ϴε�λ��
	var currentPos;//���ôε�λ��
	var circle;//Բ����
	var hasClosed;
	var closedLineSegsArr=[];//�պϹ켣����߶ε�����
	var polygon;//�����ѡ������
	var startTime;//����ʱ��ʼʱ��
	
	var isPosSame=function(){//�ж��Ƿ����һ�ε�λ��һ��
		return currentPos[0]==prePos[0]&&currentPos[1]==prePos[1];
	};
	/*	����ʱ	*/
	var countDown=function(countTime){//������ʽ����
		var now=Date.now();
		startTime=startTime||now;
		return Math.ceil(countTime-(now-startTime)/1000);//������ʽ����
			
	};
	/*	�жϹ켣�Ƿ������Բ	*/
	var isCover=function(lines,ball){
		var ballCenter=[];
		ballCenter[0]=ball.x+ball.width/2;
		ballCenter[1]=ball.y+ball.height/2;
		debugger;
		var count=0;//�ཻ�ıߵ�����
		var lLine=new Line({start:[ballCenter[0],ballCenter[1]],end:[0,ballCenter[1]],lineWidth:5});//������
		for(var i=0,len=lines.length;i<len;i++){
			if(lLine.isCross(lines[i])){
				count++;
			}
		}
		if(count%2==0){//������
			return false;
		}
		return true;//����
	}
	/*	�ж��߶��Ƿ�������	*/
	var isJoin=function(lineSeg1,lineSeg2){
		return ((lineSeg1.end[0]==lineSeg2.start[0])&&(lineSeg1.end[1]==lineSeg2.start[1]));
	}
	/*	�����߶�	*/
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
	/*	���ع켣�Ƿ�պ�	*/
	var isClose=function(lines){	
		var hasClose=false;
		for(var i=0;i<lines.length;i++){
			var l1=lines[i];
			for(var j=i+2;j<lines.length;j++){
				var l2=lines[j];
				if(l2){
					var point=l1.isCross(l2);//��������
					if(point){//�����ӵ��ཻ
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
		/*	��ʼ��	*/
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
			input.onMouseUp("left",function(){//�ɿ�������ʱ��������߶Σ���ɾ��	
				var lines=list.get(function(elem){//��ȡ�߶μ���
					return elem instanceof 	Line;						   
				});
				if(isClose(lines)){//�켣�պ���
					var ballsArr=list.get(function(elem){
						return elem instanceof Ball;							   
					});
					for(var i=0;i<ballsArr.length;i++){
						var ball=ballsArr[i];
						var ballCenter=[ball.x+ball.width/2,ball.y+ball.height/2];
						if(polygon&&polygon.isInside(ballCenter)&&ball.z>-220){
							ball.disappear();//С����ʧ
							self.addScore(ball.score);
						}
						
					};
				}
				list.remove(function(elem){//�߶���ʧ
					return elem instanceof 	Line;					 
				});
							
				list.remove(polygon);//�������ʧ
				hasClosed=false;
				closedLineSegsArr=[];
			});

		},
		/*	�÷�	*/
		addScore:function(s){
			this.score+=s;
		},
		/*	����	*/
		update:function(){
			this.scoreText.setOptions({text:"Score:"+this.score});//���÷�������
			
			var timeLeft=countDown(this.countDownTime);//����ʱ
			this.timeText.setOptions({text:timeLeft});
			if(timeLeft<=0){//����ʱ������������Ϸ
				this.end();
				return;
			}

			
			currentPos=[input.mouse.x,input.mouse.y];
			if(!isPosSame()&&input.mouse.left_pressed){//������ϴ�λ�ò�һ�����Ұ������������������߶�
				var newLineSeg=new Line({start:prePos,end:currentPos,lineWidth:5});
				list.add(newLineSeg);
				var lines=list.get(function(elem){//��ȡ�߶μ���
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
			ballsManager.createRandomBalls(Math.floor((Math.random()*4)));//�������С��
			ballsManager.changeBallsPos();
			prePos=currentPos;
		},
		/*	��Ϸ����	*/
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