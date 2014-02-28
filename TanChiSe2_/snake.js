/**
 * 贪吃蛇
 * 李忠
 * www.qttc.net
 */

var TanChiShe = {
	width:$(document).width(),	
	height:$(document).height(),
	set:null,
	timeset:null,
	xyArr:new Array(),
	chi:0,
	fenshu:0,
	lastOnKey:false,
	debug:false,
	egg_color_index:1,
	she_color:'#fff',
	is_use_zhandan:false,
	default_time:60,
	default_zhadan:3,
	zhadan_fenshu:3000,
	color_list:[
		'#fff',
		'green',
		'yellow',
		'#FF6600',
		'#CCCCFF',
		'#00CCFF',
		'#FFB7DD'
	],

	// 默认方向
	// 37 左
	// 38 上
	// 39 右
	// 40 下
	fangx:40,

	// 默认速度
	default_speed:200,
	speed_sep:5,

	// 构建
	goujian:function(){
		var _this = this;

		// 页面构建
		$('body').css({
			'margin':0,					
			'padding':0,
			'position':'relative',
			'overflow':'hidden',
			'font-size':'14px'
		}).html(
			'<div class="left" style="position:absolute;width:20%;height:'+_this.height+'px;left:0;top:0;background:#eee;">'+
			'<div style="width:90%;margin:30px auto;">'+
				'<div class="jishu" style="margin:10px 0;">'+
					'已贪吃:<i style="margin:0 10px;font-weight:bold;color:green;">0</i> 个'+
				'</div>'+
				'<div class="jifen" style="margin:10px 0;">'+
					'积分:<i style="margin:0 10px;font-weight:bold;color:green;">0</i>分'+
				'</div>'+
				'<div class="sudu" style="margin:10px 0;">'+
					'速度:<i style="margin:0 10px;font-weight:bold;color:green;">0</i>毫秒跑<span>0</span>px'+
				'</div>'+
				'<div class="zhadan" style="margin:10px 0;">'+
					'炸弹:<i style="margin:0 10px;font-weight:bold;color:green;">0</i>个'+
				'</div>'+
				'<div class="play" style="margin:10px 0;">'+
					'<p style="font-weight:bold;">玩法：</p>'+
					'<p> 按<span style="color:red;font-weight:bold;margin:0 5px;">空格</span>开始/停止 游戏</p>'+
					'<p> <span style="color:red;font-weight:bold;">上 下 左 右</span> 操作方向 </p>'+
					'<p> 吃的越多速度越快 </p>'+
					'<p class="times"> 每吃一个蛋换取<span style="margin:0 10px;font-weight:bold;color:green;"></span>秒</p>'+
					'<p> 炸弹道具可以<span style="margin:0 10px;font-weight:bold;color:green;">远程</span>吞蛋</p>'+
					'<p> 按<span style="margin:0 10px;font-weight:bold;color:green;">a</span>键使用炸弹</p>'+
					'<p class="zhandan_shuoming"> 每到<span style="margin:0 10px;font-weight:bold;color:green;">'+_this.zhadan_fenshu+'</span>分获取一个炸弹</p>'+
					'<p> 撞边或尾巴或到时间一律Over </p>'+
				'</div>'+
				'<div class="author" style="margin:50px 0;color:#fc0a88;">'+
					'李忠制作 <a href="http://www.qttc.net" style="color:#fc0a88;" target="_blank">www.qttc.net</a>'+
				'</div>'+
			'</div>'+
			'</div>'+
			'<div class="right" style="position:absolute;width:80%;height:'+_this.height+'px;left:20%;top:0;background:#000;"></div>'+
			'<div class="dialog" style="z-index:9999999999;position:fixed;width:500px;height:100px;margin-top:-50px;margin-left:-150px;background:#EEFFBB;display:none;font-weight:bold;color:green;text-align:center;line-height:100px;font-size:30px;border:3px solid #ccc;left:50%;top:50%;"></div>'
		).get(0).onkeydown = function(obj){
			return function(evt){
				e = evt || window.event;
				var c = e.keyCode;
				if(!_this.lastOnKey && (obj.fangx==37 || obj.fangx==39) && (c==38 || c==40)){
					obj.fangx = c;
					_this.lastOnKey = true;
					return false;
				}else if(!_this.lastOnKey && (obj.fangx==38 || obj.fangx==40) && (c==37 || c==39)){
					obj.fangx = c;	
					_this.lastOnKey = true;
					return false;
				}else if(c==32){
					if(_this.set){
						_this.stop();
					}else{
						_this.start();	
					}
					return false;
				}else if(c==65){
					if(!_this.is_use_zhadan){
						if(_this.zhadan>=1){
							_this.is_use_zhadan = true;
							_this.zhadan--;
							$('div.left>div>div.zhadan>i').html(_this.zhadan);
						}else{
							_this.jia('远程炸弹已用完');
						}
					}
				}

				/*
				if(Math.abs(c-obj.fangx)==2){
					$('div.right>div.main').css('background','red');				
					setTimeout(function(){
						$('div.right>div.main').css('background','#333');
					},100);
				}
				*/

				return true;
			} 
		}(_this);

		if(_this.debug){
			var html = '<div class="info" style="position:absolute;width:300px;height:100px;background:#021;left:0;top:0;color:#fff;"></div>';	
			$('body').append(html);
		}

		// 游戏区域算法
		var div_width = $('div.right').width();
		var div_height = $('div.right').height();

		// 宽列数
		_this.lieshu_x = 50;
		
		// 边距
		_this.margin = 50;	

		// 蛋宽高		
		_this.box_wh = parseInt((div_width-_this.margin*2)/_this.lieshu_x);

		$('div.left>div>div.sudu>span').html(_this.box_wh);

		// 创建游戏主窗宽度
		_this.new_box_width = _this.box_wh*_this.lieshu_x;

		// 高列数
		_this.lieshu_y = parseInt((div_height-_this.margin*2)/_this.box_wh);

		// 创建游戏主窗高度
		_this.new_box_height = _this.lieshu_y  * _this.box_wh;

		// 创建游戏窗
		$('div.right').append(
			'<div class="main" style="position:absolute;left:50%;top:50%;border:2px solid #fff;'+
			'width:'+_this.new_box_width+'px;height:'+_this.new_box_height+'px;margin-left:-'+(parseInt(_this.new_box_width/2)+1)+'px;margin-top:-'+(parseInt(_this.new_box_height/2)+1)+'px;background:#333;"></div>'			
		);

		// 算出每次加时间的步长
		_this.life_time_sep = parseInt(_this.lieshu_x*_this.default_speed/1000) * 1000;
		_this.life_time = _this.life_time_sep * 2;

		var time_div_height = 30;
		// 创建时间区
		$('div.right').append(
			'<div class="time" style="position:absolute;left:'+(_this.margin+100)+
			'px;top:'+parseInt((_this.margin-time_div_height)/2)+'px;width:80%;height:'+time_div_height+
			'px;color:#fff;">倒计时<i style="font-weight:blod;font-family:\'arial\';font-size:30px;margin:0 10px;color:#99FF33;">'+_this.life_time/1000+'</i>秒</div>'
		);

		$('div.left>div>div.play>p.times>span').html((_this.life_time_sep/1000));

		//  重置
		_this.chongzhi();

		// 绑定开始游戏按钮
		/*
		$('div.left>div>div>button').get(0).onclick = function(obj){
			return function(){
				_this = $(this);
				if(_this.html() =='开始游戏'){	
					obj.start();
					_this.html('停止游戏');
				}else{
					obj.stop();
				}
			};	
		}(_this);
		*/
		return false;

	},

	// 弹出浮层
	dialog:function(str){
	 	$('div.dialog').html(str).show();

		setTimeout(function(){
			$('div.dialog').hide();	
		},3000);

	},

	// 停止游戏
	stop:function(){
    		this.chongzhi();	
     	},

	// 判断是否在数组中
	in_array:function(pos){
		var _this = this;

		// 遍历是否在数组中
		for(var i=0,k=_this.xyArr.length;i<k;i++){
			if(pos.x==_this.xyArr[i].x && pos.y==_this.xyArr[i].y){
		    		return true;
			}
	    	}
	 
	    	// 如果不在数组中就会返回false
	    	return false;
	},
	

	// 重置
	chongzhi:function(){
		var _this = this;

		//$('div.left>div>div>button').html('开始游戏');


		
		_this.next_zhadan_jifen = _this.zhadan_fenshu;

		_this.fenshu = 0;
		_this.zhadan = _this.default_zhadan;
			 
		_this.life_time = _this.life_time_sep*2;
		_this.xyArr = new Array();
		_this.speed = _this.default_speed;
		
		_this.chi = 0;
		_this.fangx = 40;

		if(_this.set){
			clearInterval(_this.set); 
			_this.set = null;
		}

		if(_this.timeset){
			clearInterval(_this.timeset);	
			_this.timeset = null;
		}


		_this.x = _this.box_wh*parseInt(_this.lieshu_x/2);
		_this.y = _this.box_wh*parseInt(_this.lieshu_y/2);

		_this.xyArr.push({'x':_this.x,'y':_this.y});

		_this.lastOnKey = false;
		_this.fangx = 40;

		// 创建蛇	
		$('div.right>div.main').html(
			'<div class="she" style="z-index:20000;position:absolute;width:'+_this.box_wh+'px;height:'+_this.box_wh+'px;background:yellow;left:'+_this.x+'px;top:'+_this.y+'px;"></div>'	
		);

	},

	// 检测时间
	check_time:function(){
		var _this = this;
		if(_this.life_time>0){
			_this.life_time -= 1000;
			$('div.right>div.time>i').html((_this.life_time/1000));
		}else{
			_this.dialog('你太不珍惜时间了，重来吧！');
			_this.stop();	
		}			   
	},

	// 开始游戏
	start:function(){

		var _this = this;
		_this.chongzhi();
		// 创建蛋
		_this.create_egg();

		$('div.left>div>div.sudu>i').html(_this.speed);
		$('div.left>div>div.jishu>i').html(0);
		$('div.left>div>div.jifen>i').html(0);
		$('div.right>div.time>i').html(_this.life_time/1000);
		$('div.left>div>div.zhadan>i').html(_this.zhadan);

		_this.set = setInterval(_this.bind(_this,_this.go),_this.speed);	
		_this.timeset = setInterval(_this.bind(_this,_this.check_time),1000);
	},

	// 随机创建蛋
	create_egg:function(){
	 	var _this = this; 
		var loop = false;

		do{
			var x = _this.rd(0,_this.lieshu_x-1) * _this.box_wh;
			var y = _this.rd(0,_this.lieshu_y-1) * _this.box_wh;
			
			var flag = _this.in_array({'x':x,'y':y});

			if(flag){
				var loop = true;
			}else{
				var loop =false;
			}

		}while(loop);

		_this.egg_x = x;
		_this.egg_y = y;


		var index = _this.rd(0,_this.color_list.length-1);
		var color  = _this.color_list[index];
		
		_this.egg_color_index = index;
		_this.color_list.splice(index,1);
		_this.color_list.push(_this.egg_color);
		_this.egg_color = color;


		// 创建蛇	
		$('div.right>div.main').append(
			'<div class="egg" style="position:absolute;width:'+_this.box_wh+'px;height:'+_this.box_wh+
			'px;left:'+_this.egg_x+'px;top:'+_this.egg_y+'px;text-align:center;background:'+_this.egg_color+'">'+
			'</div>'
		);

		return false;
	},

	// 随机数
	rd:function(n,m){
		var c = m-n+1;  
		return Math.floor(Math.random() * c + n);
	},


	// 绑定
	bind:function(object, func) {  
		return function() {  
			return func.apply(object, arguments);
		}  
	},

	// 获得坐标
	getxy:function(obj){
		var y = parseInt(obj.css('top'));
		var x = parseInt(obj.css('left'));    		 
		return {'x':x,'y':y};
      	},	

	// go
	go:function(){
		var _this = this;
		//var pos = _this.getxy($('div.right>div.main>div.she:last'));
		var pos = {'x':_this.x,'y':_this.y};

		switch(_this.fangx){
			case 37:
				var x = pos.x - _this.box_wh;
				var y = pos.y;
				break;
			case 38:
				var x = pos.x;
				var y = pos.y - _this.box_wh;
				break;
			case 39:		
				var x = pos.x + _this.box_wh;
				var y = pos.y;
				break;
			case 40:
			default:
				
				var x = pos.x;
				var y = pos.y + _this.box_wh;
		}

		_this.lastOnKey = false;
		

		if(_this.is_chidan(x,y)) { return; }
			
		// if(_this.debug) $('.info').html('蛋: x='+_this.egg_x+',y='+_this.egg_y+' | 预期到: x='+x+',y='+y+' | 目前: x='+_this.x+', y='+_this.y+' | '+_this.xyArr.length+' | 速度:'+_this.speed);

		var she = $('div.right>div.main>div.she:last').clone();

		she.css({
			'left':x+'px',			
			'top':y+'px'
		});

		// 判断是否over
		var flag = _this.is_over(x,y);

		if(flag){
			$('div.right>div.main').append(she);
			$('div.right>div.main>div.she:eq(0)').remove();	
			_this.x = x;
			_this.y = y;
			_this.xyArr.shift();
			_this.xyArr.push({'x':_this.x,'y':_this.y});
		}else{
			_this.stop();
			_this.dialog('你太不小心了，撞墙 or 尾巴死掉了');
		}

		return false;
	},

	// 是否吃蛋
	is_chidan:function(x,y){
		var _this = this;
		if( (_this.is_use_zhadan && $('div.right>div.main>div.egg').is(':visible')) || (_this.egg_x==x && _this.egg_y==y && $('div.right>div.main>div.egg').is(':visible')) ){
			$('div.right>div.main>div.egg').remove();

			$('div.right>div.main').append(
				'<div class="she" style="z-index:20000;position:absolute;width:'+_this.box_wh+'px;height:'+_this.box_wh+'px;left:'+x+'px;top:'+y+'px;"></div>'	
			);
			
			$('div.right>div.main>div.she').css('background',_this.egg_color);
			_this.she_color = _this.egg_color;

			_this.x = x;
			_this.y = y;
			_this.xyArr.push({'x':x,'y':y});
			
			var fen = (_this.egg_color_index+1)*100;
			_this.fenshu += fen;

			if(_this.speed>125){
				var tmp = _this.life_time_sep;
			}else{
				if(parseInt(_this.life_time_sep/2)>=5){	
					var tmp = parseInt(_this.life_time_sep/1000/2) * 1000;
				}else{
					var tmp = 5;			
				}
			}

			_this.life_time += tmp;
			_this.create_egg();
			_this.chi++;	

			if(_this.speed-_this.speed_sep>50){
				_this.speed-=_this.speed_sep;	
			}

			$('div.left>div>div.play>p.times>span').html(tmp/1000);
			$('div.left>div>div.jishu>i').html(_this.chi);
			$('div.left>div>div.jifen>i').html(_this.fenshu);
			$('div.left>div>div.sudu>i').html(_this.speed);

			var str = '+'+fen+'分 +'+tmp/1000+'秒';
			if(_this.is_use_zhadan){
				str = '使用炸弹 '+str;
				_this.is_use_zhadan = false;	
			}

			if(_this.fenshu>=_this.next_zhadan_jifen){
				str += ' +1 炸弹';
				_this.zhadan++;
				_this.next_zhadan_jifen+=_this.zhadan_fenshu;
				$('div.left>div>div.zhadan>i').html(_this.zhadan);
			}
			// 提示动画
			_this.jia(str);

			// 提速
			clearInterval(_this.set);
			_this.set = setInterval(_this.bind(_this,_this.go),_this.speed);
		
			return true;
		}else{
			return false;	
		}		  
	},

	jia:function(str){
   		var _this = this; 
		if(_this.y-100>0){
			var y = _this.y-100;	
		}else{
			var y = 0;	
		}

		if(_this.x>100){
			var x = _this.x-_this.box_wh;	
		}else{
			var x = _this.x+_this.box_wh;	
		}
	       
		$('div.right>div.main').append( '<div class="jia" style="z-index:9000000;font-weight:bold;font-size:13px;color:'+_this.she_color+';position:absolute;width:500px;height:20px;left:'+x+'px;top:'+_this.y+'px;text-shadow:2px 3px 2px #000;font-family:\'arial\',\'宋体\'">'+str+'</div>');

		$('div.right>div.main>div.jia:last').animate({
			'top':y+'px',
			'opacity':0,	
			'font-size':'30px'
		},1000,false,function(){
			$(this).remove();
		});		

    	},

	// 判断是否over
	is_over:function(x,y){
		var _this = this;
		if(x>=0 && y>=0 && _this.new_box_width-x>=_this.box_wh && _this.new_box_height-y>=_this.box_wh && !_this.in_array({'x':x,'y':y}) ){
			return true;
		}else{
			return false;	
		}			
	},

	// 初始化
	init:function(){
    		var _this = this; 

		// 初始蛋颜色
		_this.egg_color = _this.color_list[0];
		_this.color_list.splice(0,1);
		
		// 积分赠送目标
		_this.next_zhadan_jifen = _this.zhadan_fenshu;

		// 构建
		_this.goujian();	
	}
};
