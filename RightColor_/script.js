var Game = {

	colors : ['Blue', 'Red', 'Green', 'Black', 'Orange', 'Purple'],  //颜色库
	timeLimit : 30,  //限时
	gameStatus : 'waiting',  //当前状态

	//程序入口
	init : function() {
		this.collectElems();
		this.bindEvents();
	},
	//收集相关元素
	collectElems : function() {
		this.stage     = this.get('stage');
		this.score     = this.get('score');
		this.beginBtn  = this.get('begin_btn');
		this.countdown = this.get('countdown');
		this.remark    = this.get('remark');
		this.goodImg   = this.get('good_img');
		this.badImg    = this.get('bad_img');
		this.lRightImg = this.get('l_right_img');
		this.lWrongImg = this.get('l_wrong_img');
		this.rRightImg = this.get('r_right_img');
		this.rWrongImg = this.get('r_wrong_img');
		this.sampleP   = this.get('sample_p');
		this.ps        = this.stage.getElementsByTagName('p');
	},
	//绑定相关事件
	bindEvents : function() {
		var G = this;
		this.bind(this.beginBtn, 'click', function() {
			G.gameStart();
		} );
		this.bind(document, 'keydown', function(e) {
			var key_code = e.keyCode;
			if (key_code != 13 && key_code != 37 && key_code != 39) {
				return;
			}
			if (key_code == 13) {
				G.gameStart();
				return;
			}
			G.gameRunning(key_code);
		} );
		this.bind(this.goodImg, 'mousedown', function() {
			G.gameRunning(37);
		} );
		this.bind(this.badImg, 'mousedown', function() {
			G.gameRunning(39);
		} );	
	},
	//游戏开始
	gameStart : function() {
		this.gameStatus = 'running';
		this.score.innerHTML = 0;
		for (var i = 8; i--; ) {
			var p = this.createNew();
			this.stage.appendChild(p);
		}
		this.hide(this.remark, this.beginBtn);
		this.show(this.countdown, this.goodImg, this.badImg);
		this.doCountdown();
	},
	//倒计时
	doCountdown : function() {
		var G = this, t = this.timeLimit;
		this.countdown.innerHTML = t;
		var _id = setInterval( function() {
			if (--t == -1) {
				G.gameOver();
				clearInterval(_id);
			}
			G.countdown.innerHTML = t;
		}, 1000 );
	},
	//游戏运行时(处理玩家的选择)
	gameRunning : function(key_code) {
		if (this.gameStatus != 'running') {
			return;
		}
		var p = this.ps[7];
		this.bingo = false;
		if (key_code == 37 && p.getAttribute('color') == p.innerHTML ||
				key_code == 39 && p.getAttribute('color') != p.innerHTML) {
			this.bingo = true;  //命中
		}
		this.hide(this.lRightImg, this.lWrongImg, this.rRightImg, this.rWrongImg);
		this.show(key_code == 37 ? (this.bingo ? this.lRightImg : this.lWrongImg) :
						this.bingo ? this.rRightImg : this.rWrongImg);
		this.updateScore();
		this.createNewSmoothly();
		this.ps.length > 15 && this.ps[15].parentNode.removeChild(this.ps[15]);
	},
	//创建一个颜色
	createNew : function() {
		var p = this.sampleP.cloneNode(false),
			match = this.makeRandom(0, 4) < 2 ? true : false,
			color = this.colors[this.makeRandom(0, this.colors.length - 1)],
			color2 = match ? color : this.colors[this.makeRandom(0, this.colors.length - 1)];
		p.style.color = color.toLowerCase();
		p.innerHTML = color2;
		p.setAttribute('color', color);
		p.removeAttribute('id');
		return p;
	},
	//缓动地创建一个颜色
	createNewSmoothly : function() {
		var new_p = this.createNew();
		new_p.style.lineHeight = '0px';
		this.stage.insertBefore(new_p, this.stage.children[0]);
		var line_height = 0,
			sample_line_height = parseInt(this.sampleP.style.lineHeight);
		var _id = setInterval( function() {
			line_height += 4;
			new_p.style.lineHeight = line_height + 'px';
			line_height >= sample_line_height && clearInterval(_id);
		}, 15 );
	},
	//更新分数
	updateScore : function() {
		var score = +this.score.innerHTML;
		if (this.bingo) {
			score += 1;
		} else if (score > 0) {
			score -= 1;
		}
		this.score.innerHTML = score;
	},
	//游戏结束
	gameOver : function() {
		var ps = this.ps;
		for (var i = ps.length; i--; ) {
			ps[i].parentNode.removeChild(ps[i]);
		}
		this.gameStatus = 'over';
		this.hide(this.countdown, this.goodImg, this.badImg,
				this.lRightImg, this.lWrongImg, this.rRightImg, this.rWrongImg);
		this.show(this.remark, this.beginBtn);
		this.evaluate();
	},
	//设置评语
	evaluate : function() {
		var comment = '—— Game Over<br />',
			score = +this.score.innerHTML;
		switch (Math.floor(score / 10)) {
			case 0  :
			case 1  :
			case 2  : comment += '—— 这反应也太慢了点吧...'; break;
			case 3  :
			case 4  :
			case 5  : comment += '—— 还是太慢了，加快节奏啊...'; break;
			case 6  :
			case 7  : comment += '—— 准男人，再加把劲啊...'; break;
			case 8  :
			case 9  :
			default : comment += '—— 恭喜恭喜，你超神啦~';
		}
		this.remark.innerHTML = comment;
	},

	get : function(id) {
		return typeof id === 'string' ? document.getElementById(id) : id;
	},
	bind : function(target, event, handler) {
		if (target.addEventListener) {
			target.addEventListener(event, handler, false);
		} else if (target.attachEvent) {
			target.attachEvent('on' + event, handler);
		} else {
			target['on' + event] = handler;
		}
	},
	hide : function() {
		for (var i = arguments.length; i--; ) {
			arguments[i].style.display = 'none';
		}
	},
	show : function() {
		for (var i = arguments.length; i--; ) {
			arguments[i].style.display = '';
		}
	},
	makeRandom : function(begin, end) {
		var range = end - begin + 1;
		return Math.floor(Math.random() * range + begin);
	}

};

Game.init();  //run!!
