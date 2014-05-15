/**
*
* name:cnGame.js	
*`author:cson
*`date:2012-2-7
*`version:1.0
*
**/	

(function(win, undefined) {
    var canvasPos;
    /**
    *获取canvas在页面的位置
    **/
    var getCanvasPos = function(canvas) {
        var left = 0;
        var top = 0;
        while (canvas.offsetParent) {
            left += canvas.offsetLeft;
            top += canvas.offsetTop;
            canvas = canvas.offsetParent;

        }
        return [left, top];

    }

    var _cnGame = {
        /**
        *初始化
        **/
        init: function(id, options) {
            options = options || {};
            this.canvas = this.core.$(id || "canvas");
            this.context = this.canvas.getContext('2d');
            this.canvas.width=this.width = options.width || 800;
            this.canvas.height=this.height = options.height || 600;
			this.bgColor=options.bgColor;
            this.title = this.core.$$('title')[0];
            canvasPos = getCanvasPos(this.canvas);
            this.x = canvasPos[0] || 0;
            this.y = canvasPos[1] || 0;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.style.left = this.x + "px";
            this.canvas.style.top = this.y + "px";
			this.spriteList=new this.SpriteList();
			this.drawBg();

        },
        /**
        *生成命名空间,并执行相应操作
        **/
        register: function(nameSpace, func) {
            var nsArr = nameSpace.split(".");
            var parent = win;
            for (var i = 0, len = nsArr.length; i < len; i++) {
                (typeof parent[nsArr[i]] == 'undefined') && (parent[nsArr[i]] = {});
                parent = parent[nsArr[i]];
            }
            if (func) {
                func.call(parent, this);
            }
            return parent;
        },
        /**
        *清除画布
        **/
        clean: function() {
            this.context.clearRect(0,0,this.width, this.height);
        },
        /**
        *绘制画布背景色
        **/		
		drawBg:function(){
			if(this.bgColor){
				var bgRect=new this.shape.Rect({width:this.width,height:this.height,style:this.bgColor});//绘制背景色
				bgRect.draw();
			}	
		}




    }


    win["cnGame"] = _cnGame;





    /**
    *
    *基本工具函数模块
    *
    **/
    cnGame.register("cnGame.core", function(cg) {
        /**
        按id获取元素
        **/
        this.$ = function(id) {
            return document.getElementById(id);
        };
        /**
        按标签名获取元素
        **/
        this.$$ = function(tagName, parent) {
            parent = parent || document;
            return parent.getElementsByTagName(tagName);
        };
        /**
        按类名获取元素
        **/
        this.$Class = function(className, parent) {
            var arr = [], result = [];
            parent = parent || document;
            arr = this.$$("*");
            for (var i = 0, len = arr.length; i < len; i++) {
                if ((" " + arr[i].className + " ").indexOf(" " + className + " ") > 0) {
                    result.push(arr[i]);
                }
            }
            return result;
        };
        /**
        事件绑定
        **/
        this.bindHandler = (function() {

            if (window.addEventListener) {
                return function(elem, type, handler) {
                    elem.addEventListener(type, handler, false);

                }
            }
            else if (window.attachEvent) {
                return function(elem, type, handler) {
                    elem.attachEvent("on" + type, handler);
                }
            }
        })();
        /**
        事件解除
        **/
        this.removeHandler = (function() {
            if (window.removeEventListerner) {
                return function(elem, type, handler) {
                    elem.removeEventListerner(type, handler, false);

                }
            }
            else if (window.detachEvent) {
                return function(elem, type, handler) {
                    elem.detachEvent("on" + type, handler);
                }
            }
        })();
        /**
        获取事件对象
        **/
        this.getEventObj = function(eve) {
            return eve || win.event;
        };
        /**
        获取事件目标对象
        **/
        this.getEventTarget = function(eve) {
            var eve = this.getEventObj(eve);
            return eve.target || eve.srcElement;
        };
        /**
        禁止默认行为
        **/
        this.preventDefault = function(eve) {
            if (eve.preventDefault) {
                eve.preventDefault();
            }
            else {
                eve.returnValue = false;
            }

        };
        /**
        获取对象计算的样式
        **/
        this.getComputerStyle = (function() {
            var body = document.body || document.documentElement;
            if (body.currentStyle) {
                return function(elem) {
                    return elem.currentStyle;
                }
            }
            else if (document.defaultView.getComputedStyle) {
                return function(elem) {
                    return document.defaultView.getComputedStyle(elem, null);
                }
            }

        })();
        /**
        是否为undefined
        **/
        this.isUndefined = function(elem) {
            return typeof elem === 'undefined';
        },
        /**
        是否为数组
        **/
		this.isArray = function(elem) {
		    return Object.prototype.toString.call(elem) === "[object Array]";
		};
        /**
        是否为Object类型
        **/
        this.isObject = function(elem) {
            return elem === Object(elem);
        };
        /**
        是否为字符串类型
        **/
        this.isString = function(elem) {
            return Object.prototype.toString.call(elem) === "[object String]";
        };
        /**
        是否为数值类型
        **/
        this.isNum = function(elem) {
            return Object.prototype.toString.call(elem) === "[object Number]";
        };
		/**
        是否为function
        **/
        this.isFunction = function(elem) {
            return Object.prototype.toString.call(elem) === "[object Function]";
        };
        /**
        *复制对象属性
        **/
        this.extend = function(destination, source, isCover) {
            var isUndefined = this.isUndefined;
            (isUndefined(isCover)) && (isCover = true);
            for (var name in source) {
                if (isCover || isUndefined(destination[name])) {
                    destination[name] = source[name];
                }

            }
            return destination;
        };
        /**
        *扩展prototype
        **/
		this.extendProto=function(constructor,obj){
			this.extend(constructor.prototype,obj);
		};
        /**
        *原型继承对象
        **/
        this.inherit = function(child, parent) {
            var func = function() { };
            func.prototype = parent.prototype;
            child.prototype = new func();
            child.prototype.constructor = child;
            child.prototype.parent = parent;
        };

    });

    /**
    *
    *Ajax模块
    *
    **/
    cnGame.register("cnGame.ajax", function(cg) {
        var activeXString; //为IE特定版本保留的activeX字符串
        var onXHRload = function(xhr, options) {
            return function(eve) {

                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.state < 300) || xhr.status == 304) {
                        var onSuccess = options.onSuccess;
                        onSuccess && onSuccess();
                    }
                    else {
                        var onError = options.onError;
                        onError && onError();

                    }
                }
            }
        }


        /**
        *生成XMLHttpRequest对象
        **/
        this.creatXHR = function() {
            if (!cg.core.isUndefined(XMLHttpRequest)) {
                return new XMLHttpRequest();
            }
            else if (!cg.core.isUndefined(ActiveXObject)) {
                if (!cg.core.isString(activeXString)) {
                    var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
                    for (var i = 0, len = versions.length; i < len; i++) {
                        try {
                            var xhr = new ActiveXObject(versions[i]);
                            activeXString = versions[i];
                            return xhr;
                        }
                        catch (e) {

                        }
                    }
                }
                return new ActiveXObject(activeXString);
            }
        }
        /**
        *发送请求
        **/
        this.request = function(options) {
            var defaultObj = {
                type: "get"
            };
            cg.core.extend(defaultObj, options);
            var type = options.type;
            var xhr = this.creatXHR();

            cg.core.bindHandler(xhr, "readystatechange", function(eve) {//资源加载完成回调函数
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.state < 300) || xhr.status == 304) {
                        var onSuccess = options.onSuccess;
                        onSuccess && onSuccess();
                    }
                    else {
                        var onError = options.onError;
                        onError && onError();

                    }
                }
            });

            var requestOpt = options.requestOpt;
            var url = options.url;

            if (type == "get") {//get请求数据处理
                if (url.indexOf("?") < 0) {
                    url += "?";
                }
                else {
                    url += "&";
                }

                for (name in requestOpt) {
                    if (requestOpt.hasOwnProperty(name)) {
                        url += encodeURIComponent(name) + "=" + encodeURIComponent(requestOpt[name]) + "&";
                        url = url.slice(0, -1);
                        xhr.open(type, url, true);
                        xhr.send(null);
                    }
                }
            }
            else if (type == "post") {//post请求数据处理
                var _requestOpt = {}
                for (name in requestOpt) {
                    if (requestOpt.hasOwnProperty(name)) {
                        _requestOpt[encodeURIComponent(name)] = encodeURIComponent(requestOpt[name]);
                    }
                }
                xhr.open(type, url, true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(_requestOpt);
            }
        }




    });

    /**
    *
    *资源加载器
    *
    **/
    cnGame.register("cnGame", function(cg) {

        var file_type = {}
        file_type["js"] = "js"
        file_type["json"] = "json"
        file_type["wav"] = "audio"
        file_type["mp3"] = "audio"
        file_type["ogg"] = "audio"
        file_type["png"] = "image"
        file_type["jpg"] = "image"
        file_type["jpeg"] = "image"
        file_type["gif"] = "image"
        file_type["bmp"] = "image"
        file_type["tiff"] = "image"
        var postfix_regexp = /\.([a-zA-Z0-9]+)/;
        /**
        *资源加载完毕的处理程序
        **/
        var resourceLoad = function(self, type) {
            return function() {
                self.loadedCount += 1;
                type == "image" && (self.loadedImgs[this.srcPath] = this);
                type == "audio" && (self.loadedAudios[this.srcPath] = this);
                this.onLoad = null; 				//保证图片的onLoad执行一次后销毁
                self.loadedPercent = Math.floor(self.loadedCount / self.sum * 100);
                self.onLoad && self.onLoad(self.loadedPercent);
                if (!type || self.loadedPercent === 100) {//如果没有资源需要加载或者资源已经加载完毕
                    self.loadedCount = 0;
                    self.loadedPercent = 0;
                    type == "image" && (self.loadingImgs = {});
                    type == "audio" && (self.loadingAudios = {});
                    if (self.gameObj && self.gameObj.initialize) {
                        self.gameObj.initialize(self.startOptions);
                        if (cg.loop && !cg.loop.stop) {//结束上一个循环
                            cg.loop.end();
                        }
                        cg.loop = new cg.GameLoop(self.gameObj); //开始新游戏循环
                        cg.loop.start();
                    }
                }
            }
        }

        /**
        *图像加载器
        **/
        var loader = {
            sum: 0, 		//图片总数
            loadedCount: 0, //图片已加载数
            loadingImgs: {}, //未加载图片集合
            loadedImgs: {}, //已加载图片集合
            loadingAudios: {}, //未加载音频集合
            loadedAudios: {}, //已加载音频集合
            /**
            *图像加载，之后启动游戏
            **/
            start: function(gameObj, options) {//options:srcArray,onload
				options=options||{};
                var srcArr = options.srcArray;
                this.startOptions = options.startOptions; //游戏开始需要的初始化参数
                this.onLoad = options.onLoad;
				this.gameObj = gameObj;
                this.sum = 0;
                cg.spriteList.clean();
				if(!srcArr){
					resourceLoad(this)();
				}
                else if (cg.core.isArray(srcArr) || cg.core.isObject(srcArr)) {

                    for (var i in srcArr) {
                        if (srcArr.hasOwnProperty(i)) {
                            this.sum++;
                            var path = srcArr[i];
                            var suffix = srcArr[i].substring(srcArr[i].lastIndexOf(".") + 1);
                            var type = file_type[suffix];
                            if (type == "image") {
                                this.loadingImgs[path] = new Image();
                                cg.core.bindHandler(this.loadingImgs[path], "load", resourceLoad(this, type));
                                this.loadingImgs[path].src = path;
                                this.loadingImgs[path].srcPath = path; //没有经过自动变换的src
                            }
                            else if (type == "audio") {
                                this.loadingAudios[path] = new Audio(path);
                                cg.core.bindHandler(this.loadingAudios[path], "canplay", resourceLoad(this, type));
                                this.loadingAudios[path].onload = resourceLoad(this, type);
                                this.loadingAudios[path].src = path;
                                this.loadingAudios[path].srcPath = path; //没有经过自动变换的src
                            }
                            else if (type == "js") {//如果是脚本，加载后执行
                                var head = cg.core.$$("head")[0];
                                var script = document.createElement("script");
                                head.appendChild(script);
                                cg.core.bindHandler(script, "load", resourceLoad(this, type));
                                script.src = path;

                            }
                        }
                    }

                }

            }

        }


        this.loader = loader;
    });




    /**
    *
    *canvas基本形状对象
    *
    **/
    cnGame.register("cnGame.shape", function(cg) {

        /**
        *矩形对象
        **/
        var rect = function(options) {
            if (!(this instanceof arguments.callee)) {
                return new arguments.callee(options);
            }
            this.init(options);
        }
        rect.prototype = {
            /**
            *初始化
            **/
            init: function(options) {
                /**
                *默认值对象
                **/
                var defaultObj = {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    style: "red",
                    isFill: true

                };
                options = options || {};
                options = cg.core.extend(defaultObj, options);
                this.setOptions(options);
            },
            /**
            *设置参数
            **/
            setOptions: function(options) {
				var isUndefined=cg.core.isUndefined;
                !isUndefined(options.x)&&(this.x = options.x);
                !isUndefined(options.y)&&(this.y = options.y);
                !isUndefined(options.width)&&(this.width = options.width);
                !isUndefined(options.height)&&(this.height = options.height);
                !isUndefined(options.style)&&(this.style = options.style);
                !isUndefined(options.isFill)&&(this.isFill = options.isFill);
                this.leftTop = [this.x, this.y];
                this.rightTop = [this.x + this.width, this.y];
                this.leftBottom = [this.x, this.y + this.height];
                this.rightBottom = [this.x + this.width, this.y + this.height];
                this.right = this.width + this.x;
                this.bottom = this.height + this.y;
            },
            /**
            *绘制矩形
            **/
            draw: function() {
                var context = cg.context;
                if (this.isFill) {
                    context.fillStyle = this.style;
                    context.fillRect(this.x, this.y, this.width, this.height);
                }
                else {
                    context.strokeStyle = this.style;
                    context.strokeRect(this.x, this.y, this.width, this.height);
                }

                return this;

            },
            /**
            *将矩形移动一定距离
            **/
            move: function(dx, dy) {
                dx = dx || 0;
                dy = dy || 0;
                this.x += dx;
                this.y += dy;
                resetRightBottom(this);
                return this;
            },
            /**
            *将矩形移动到特定位置
            **/
            moveTo: function(x, y) {
                x = x || this.x;
                y = y || this.y;
                this.x = x;
                this.y = y;
                resetRightBottom(this);
                return this;
            },
            /**
            *将矩形改变一定大小
            **/
            resize: function(dWidth, dHeight) {
                dWidth = dWidth || 0;
                dHeight = dHeight || 0;
                this.width += dWidth;
                this.height += dHeight;
                resetRightBottom(this);
                return this;

            },
            /**
            *将矩形改变到特定大小
            **/
            resizeTo: function(width, height) {
                width = width || this.width;
                height = height || this.height;
                this.width = width;
                this.height = height;
                resetRightBottom(this);
                return this;
            }
        }

        /**
        *圆形对象
        **/
        var circle = function(options) {
            if (!(this instanceof arguments.callee)) {
                return new arguments.callee(options);
            }
            this.init(options);
        }
        circle.prototype = {
            /**
            *初始化
            **/
            init: function(options) {
                /**
                *默认值对象
                **/
				this.x = 100;
				this.y = 100;
				this.r = 100;
				this.startAngle= 0;
				this.endAngle= Math.PI * 2;
				this.antiClock= false;
				this.style= "red";
				this.isFill= true;
              
                options = options || {};
                cg.core.extend(this, options);

            },
            /**
            *设置参数
            **/
            setOptions: function(options) {
				cg.core.extend(this, options);
            },
            /**
            *绘制圆形
            **/
            draw: function() {
                var context = cg.context;
                context.beginPath();
                context.arc(this.x, this.y, this.r, this.startAngle, this.endAngle, this.antiClock);
                context.closePath();
                if (this.isFill) {
                    context.fillStyle = this.style;
                    context.fill();
                }
                else {
                    context.strokeStyle = this.style;
                    context.stroke();
                }

            },
            /**
            *将圆形移动一定距离
            **/
            move: function(dx, dy) {
                dx = dx || 0;
                dy = dy || 0;
                this.x += dx;
                this.y += dy;
                return this;
            },
            /**
            *将圆形移动到特定位置
            **/
            moveTo: function(x, y) {
                x = x || this.x;
                y = y || this.y;
                this.x = x;
                this.y = y;
                return this;
            },
            /**
            *将圆形改变一定大小
            **/
            resize: function(dr) {
                dr = dr || 0;
                this.r += dr;
                return this;

            },
            /**
            *将圆形改变到特定大小
            **/
            resizeTo: function(r) {
                r = r || this.r;
                this.r = r;
                return this;
            }
        }
        /**
        *将圆形改变到特定大小
        **/
        var text = function(text, options) {
            if (!(this instanceof arguments.callee)) {
                return new arguments.callee(text, options);
            }
            this.init(text, options);

        }
        text.prototype = {
            /**
            *初始化
            **/
            init: function(options) {
				this.text="test";
				this.x= 100;
				this.y= 100;
				this.style="red";
				this.isFill=true;
				this.context=cg.context;
                options = options || {};
                this.setOptions(options);
            },
            /**
            *绘制
            **/
            draw: function() {
                var context = this.context;
				context.save();
                (!cg.core.isUndefined(this.font)) && (context.font = this.font);
                (!cg.core.isUndefined(this.textBaseline)) && (context.textBaseline = this.textBaseline);
                (!cg.core.isUndefined(this.textAlign)) && (context.textAlign = this.textAlign);
                (!cg.core.isUndefined(this.maxWidth)) && (context.maxWidth = this.maxWidth);
                if (this.isFill) {
                    context.fillStyle = this.style;
                    this.maxWidth ? context.fillText(this.text, this.x, this.y, this.maxWidth) : context.fillText(this.text, this.x, this.y);
                }
                else {
                    context.strokeStyle = this.style;
                    this.maxWidth ? context.strokeText(this.text, this.x, this.y, this.maxWidth) : context.strokeText(this.text, this.x, this.y);
                }
				context.restore();
            },
            /**
            *设置参数
            **/
            setOptions: function(options) {
				cg.core.extend(this, options);
            }
        }
		/*	直线	*/
		var line=function(options){
			if (!(this instanceof arguments.callee)) {
                return new arguments.callee(options);
            }
            this.init(options);
		}
	
		
		line.prototype = {
			/**
			*初始化
			**/
			init: function(options) {	
				this.start=[0,0];
				this.end=[0,0];	
				this.style="red";
				this.lineWidth=1;
				this.context=cg.context;
				options = options || {};
				cg.core.extend(this,options);
			},
			/**
			*判断线段和另一条线段是否相交
			**/
			isCross:function(newLine){
				var start=this.start;
				var end=this.end;
				var newStart=newLine.start;
				var newEnd=newLine.end;
				var point=[];
				
				var k1=(end[1]-start[1])/(end[0]-start[0]);//所在直线斜率
				var b1=end[1]-end[0]*k1;//所在直线截距
				
				var k2=(newEnd[1]-newStart[1])/(newEnd[0]-newStart[0]);//新线段所在直线斜率
				var b2=newEnd[1]-newEnd[0]*k2;//新线段所在直线截距
				
				if(((newStart[0]*k1+b1-newStart[1])*(newEnd[0]*k1+b1-newEnd[1]))<=0&&((start[0]*k2+b2-start[1])*(end[0]*k2+b2-end[1]))<=0){			
					point[0]=(b1-b2)/(k2-k1);
					point[1]=k2*point[0]+b2;
					return point;
					
				}
				return false;
				
			},
			/**
			*绘制
			**/
			draw: function() {
				var ctx=cg.context;
				var start=this.start;
				var end=this.end;
				ctx.strokeStyle = this.style;
				ctx.lineWidth = this.lineWidth;
				ctx.beginPath(); 
				ctx.lineTo(start[0],start[1]);
				ctx.lineTo(end[0],end[1]);
				ctx.closePath();  
				ctx.stroke();
			},
			/**
			*设置参数
			**/
			setOptions: function(options) {
				cg.core.extend(this,options);
			}
		};
		
		/*	多边形	*/
		var polygon=function(options){
			if (!(this instanceof arguments.callee)) {
                return new arguments.callee(options);
            }
            this.init(options);			
		};
		polygon.prototype={
			init:function(options){
				this.pointsArr=[];//所有顶点数组
				this.style="black";
				this.lineWidth=1;
				this.isFill=true;
				this.setOptions(options);
				this.pointsArr.push(this.pointsArr[0]);
				
				
			},
			/**
			*设置参数
			**/
			setOptions: function(options) {
				cg.core.extend(this,options);
			},
			/**
			*判断某点是否在多边形内(射线法)
			**/
			isInside:function(point){
				var lines=this.getLineSegs();

				var count=0;//相交的边的数量
				var lLine=new Line({start:[point[0],point[1]],end:[-9999,point[1]]});//左射线
				var crossPointArr=[];//相交的点的数组
				for(var i=0,len=lines.length;i<len;i++){
					var crossPoint=lLine.isCross(lines[i]);
					if(crossPoint){
						for(var j=0,len2=crossPointArr.length;j<len2;j++){
							//如果交点和之前的交点相同，即表明交点为多边形的顶点
							if(crossPointArr[j][0]==crossPoint[0]&&crossPointArr[j][1]==crossPoint[1]){
								break;	
							}
							
						}
						if(j==len2){
							crossPointArr.push(crossPoint);	
							count++;
						}
						
					}
				}
		
				if(count%2==0){//不包含
					return false;
				}
				return true;//包含
			},
			/**
			*获取多边形的线段集合
			**/
			getLineSegs:function(){
				var pointsArr=this.pointsArr;//点集合
				var lineSegsArr=[];
				for(var i=0,len=pointsArr.length;i<len-1;i++){
					var point=pointsArr[i];
					var nextPoint=pointsArr[i+1];
					var newLine=new line({start:[point[0],point[1]],end:[nextPoint[0],nextPoint[1]]});
					lineSegsArr.push(newLine);
				}
				return lineSegsArr;
				
			},
			/**
			*绘制
			**/
			draw:function(){
				var ctx=cg.context;
				ctx.beginPath();
				
				for(var i=0,len=this.pointsArr.length;i<len-1;i++){
					var start=this.pointsArr[i];
					var end=this.pointsArr[i+1];
			
					ctx.lineTo(start[0],start[1]);
					ctx.lineTo(end[0],end[1]);
					
					
				}
				ctx.closePath();
				if(this.isFill){
					ctx.fillStyle = this.style;
					ctx.fill();	
				}
				else{
					ctx.lineWidth = this.lineWidth;
					ctx.strokeStyle = this.style;
					ctx.stroke();	
				}
				
			}
			
		}
		this.Polygon=polygon;
		this.Line = line;
        this.Text = text;
        this.Rect = rect;
        this.Circle = circle;

    });
	
    /**
    *
    *事件模块
    *
    **/
    cnGame.register("cnGame", function(cg) {
		this.eventManager={
			register:function(){
				
			}
			
			
		};
	});



    /**
    *
    *输入记录模块
    *
    **/
    cnGame.register("cnGame.input", function(cg) {
											 
		this.mouse={};
		this.mouse.x = 0;
        this.mouse.y = 0;
		var m=[];
		m[0]= m[1] ="left";
		m[2]="right";
		/**
        *鼠标按下触发的处理函数
        **/
        var mousedown_callbacks = {};
		/**
        *鼠标松开触发的处理函数
        **/
        var mouseup_callbacks = {};
		/**
        *鼠标移动触发的处理函数
        **/
        var mousemove_callbacks = [];
		
        /**
        *记录鼠标在canvas内的位置
        **/
        var recordMouseMove = function(eve) {
            var pageX, pageY, x, y;
            eve = cg.core.getEventObj(eve);
            pageX = eve.pageX || eve.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft;
            pageY = eve.pageY || eve.clientY + document.documentElement.scrollTop - document.documentElement.clientTop;
            cg.input.mouse.x = pageX - cg.x;
            cg.input.mouse.y = pageY - cg.y;
			for (var i = 0, len = mousemove_callbacks.length; i < len; i++) {
				mousemove_callbacks[i]();
			}
        }
        /**
        *记录鼠标按键
        **/
		var recordMouseDown=function(eve){
			eve = cg.core.getEventObj(eve);
			var pressed_btn=m[eve.button];
			if(pressed_btn=="left"){//左键按下
				cg.input.mouse.left_pressed=true;
			}
			else if(pressed_btn=="right"){//右键按下
				cg.input.mouse.right_pressed=true;
			}
			var callBacksArr=mousedown_callbacks[pressed_btn];
			if(callBacksArr&&callBacksArr.length){
				for (var i = 0, len = callBacksArr.length; i < len; i++) {
                	callBacksArr[i]();
                }	
			}
		}
		/**
        *记录鼠标松开的键
        **/
		var recordMouseUp=function(eve){
			
			eve = cg.core.getEventObj(eve);
			var pressed_btn=m[eve.button];
			if(pressed_btn=="left"){//左键松开
				cg.input.mouse.left_pressed=false;
			}
			else if(pressed_btn=="right"){//右键松开
				btn=cg.input.mouse.right_pressed=false;
			}
			var callBacksArr=mouseup_callbacks[pressed_btn];
			if(callBacksArr&&callBacksArr.length){
				for (var i = 0, len = callBacksArr.length; i < len; i++) {
                	callBacksArr[i]();
                }	
			}
		}
        cg.core.bindHandler(window, "mousemove", recordMouseMove);
		cg.core.bindHandler(window, "mousedown", recordMouseDown);
		cg.core.bindHandler(window, "mouseup", recordMouseUp);
		
		

		/**
        *绑定鼠标按下事件
        **/
        this.onMouseDown = function(buttonName, handler) {
            buttonName = buttonName || "all";
            if (cg.core.isUndefined(mousedown_callbacks[buttonName])) {
                mousedown_callbacks[buttonName] = [];
            }
            mousedown_callbacks[buttonName].push(handler);
        };
		/**
        *绑定鼠标松开事件
        **/
        this.onMouseUp = function(buttonName, handler) {
            buttonName = buttonName || "all";
            if (cg.core.isUndefined(mouseup_callbacks[buttonName])) {
                mouseup_callbacks[buttonName] = [];
            }
			
            mouseup_callbacks[buttonName].push(handler);
        };
		/**
        *绑定鼠标松开事件
        **/
        this.onMouseMove = function(handler) {	
            mousemove_callbacks.push(handler);
        };
		

        /**
        *被按下的键的集合
        **/
        var pressed_keys = {};
        /**
        *要求禁止默认行为的键的集合
        **/
        var preventDefault_keys = {};
        /**
        *键盘按下触发的处理函数
        **/
        var keydown_callbacks = {};
        /**
        *键盘弹起触发的处理函数
        **/
        var keyup_callbacks = {};


        /**
        *键盘按键编码和键名
        **/
        var k = [];
        k[8] = "backspace"
        k[9] = "tab"
        k[13] = "enter"
        k[16] = "shift"
        k[17] = "ctrl"
        k[18] = "alt"
        k[19] = "pause"
        k[20] = "capslock"
        k[27] = "esc"
        k[32] = "space"
        k[33] = "pageup"
        k[34] = "pagedown"
        k[35] = "end"
        k[36] = "home"
        k[37] = "left"
        k[38] = "up"
        k[39] = "right"
        k[40] = "down"
        k[45] = "insert"
        k[46] = "delete"

        k[91] = "leftwindowkey"
        k[92] = "rightwindowkey"
        k[93] = "selectkey"
        k[106] = "multiply"
        k[107] = "add"
        k[109] = "subtract"
        k[110] = "decimalpoint"
        k[111] = "divide"

        k[144] = "numlock"
        k[145] = "scrollock"
        k[186] = "semicolon"
        k[187] = "equalsign"
        k[188] = "comma"
        k[189] = "dash"
        k[190] = "period"
        k[191] = "forwardslash"
        k[192] = "graveaccent"
        k[219] = "openbracket"
        k[220] = "backslash"
        k[221] = "closebracket"
        k[222] = "singlequote"

        var numpadkeys = ["numpad1", "numpad2", "numpad3", "numpad4", "numpad5", "numpad6", "numpad7", "numpad8", "numpad9"]
        var fkeys = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9"]
        var numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
        var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
        for (var i = 0; numbers[i]; i++) { k[48 + i] = numbers[i] }
        for (var i = 0; letters[i]; i++) { k[65 + i] = letters[i] }
        for (var i = 0; numpadkeys[i]; i++) { k[96 + i] = numpadkeys[i] }
        for (var i = 0; fkeys[i]; i++) { k[112 + i] = fkeys[i] }


        /**
        *记录键盘按下的键
        **/
        var recordPress = function(eve) {
            eve = cg.core.getEventObj(eve);
            var keyName = k[eve.keyCode];
            pressed_keys[keyName] = true;
            if (keydown_callbacks[keyName]) {
                for (var i = 0, len = keydown_callbacks[keyName].length; i < len; i++) {
                    keydown_callbacks[keyName][i]();

                }

            }
            if (keydown_callbacks["allKeys"]) {
                for (var i = 0, len = keydown_callbacks["allKeys"].length; i < len; i++) {
                    keydown_callbacks["allKeys"][i]();

                }
            }
            if (preventDefault_keys[keyName]) {
                cg.core.preventDefault(eve);
            }
        }
        /**
        *记录键盘松开的键
        **/
        var recordUp = function(eve) {
            eve = cg.core.getEventObj(eve);
            var keyName = k[eve.keyCode];
            pressed_keys[keyName] = false;
            if (keyup_callbacks[keyName]) {
                for (var i = 0, len = keyup_callbacks[keyName].length; i < len; i++) {
                    keyup_callbacks[keyName][i]();

                }
            }
            if (keyup_callbacks["allKeys"]) {
                for (var i = 0, len = keyup_callbacks["allKeys"].length; i < len; i++) {
                    keyup_callbacks["allKeys"][i]();

                }
            }
            if (preventDefault_keys[keyName]) {
                cg.core.preventDefault(eve);
            }
        }
        cg.core.bindHandler(window, "keydown", recordPress);
        cg.core.bindHandler(window, "keyup", recordUp);

        /**
        *判断某个键是否按下
        **/
        this.isPressed = function(keyName) {
            return !!pressed_keys[keyName];
        };
        /**
        *禁止某个键按下的默认行为
        **/
        this.preventDefault = function(keyName) {
            if (cg.core.isArray(keyName)) {
                for (var i = 0, len = keyName.length; i < len; i++) {
                    arguments.callee.call(this, keyName[i]);
                }
            }
            else {
                preventDefault_keys[keyName] = true;
            }
        }
        /**
        *绑定键盘按下事件
        **/
        this.onKeyDown = function(keyName, handler) {
            keyName = keyName || "allKeys";
            if (cg.core.isUndefined(keydown_callbacks[keyName])) {
                keydown_callbacks[keyName] = [];
            }
            keydown_callbacks[keyName].push(handler);

        }
        /**
        *绑定键盘弹起事件
        **/
        this.onKeyUp = function(keyName, handler) {
            keyName = keyName || "allKeys";
            if (cg.core.isUndefined(keyup_callbacks[keyName])) {
                keyup_callbacks[keyName] = [];
            }
            keyup_callbacks[keyName].push(handler);

        }
        /**
        *清除键盘按下事件处理程序
        **/
        this.clearDownCallbacks = function(keyName) {
            if (keyName) {
                keydown_callbacks[keyName] = [];
            }
            else {
                keydown_callbacks = {};
            }

        }
        /**
        *清除键盘弹起事件处理程序
        **/
        this.clearUpCallbacks = function(keyName) {
            if (keyName) {
                keyup_callbacks[keyName] = [];
            }
            else {
                keyup_callbacks = {};
            }

        }
    });

    /**
    *
    *碰撞检测
    *
    **/
    cnGame.register("cnGame.collision", function(cg) {
        /**
        *点和矩形间的碰撞
        **/
        this.col_Point_Rect = function(pointX, pointY, rectObj) {
            return (pointX >= rectObj.x && pointX <= rectObj.right && pointY >= rectObj.y && pointY <= rectObj.bottom);
        }
        /**
        *矩形和矩形间的碰撞
        **/
        this.col_Between_Rects = function(rectObjA, rectObjB) {

            return ((rectObjA.right >= rectObjB.x && rectObjA.right <= rectObjB.right || rectObjA.x >= rectObjB.x && rectObjA.x <= rectObjB.right) && (rectObjA.bottom >= rectObjB.y && rectObjA.bottom <= rectObjB.bottom || rectObjA.y <= rectObjB.bottom && rectObjA.bottom >= rectObjB.y));
        }
        /**
        *点和圆形间的碰撞
        **/
        this.col_Point_Circle = function(pointX, pointY, circleObj) {
            return (Math.pow((pointX - circleObj.x), 2) + Math.pow((pointY - circleObj.y), 2) < Math.pow(circleObj.r, 2));

        }
        /**
        *圆形和圆形间的碰撞
        **/
        this.col_between_Circles = function(circleObjA, circleObjB) {
            return (Math.pow((circleObjA.x - circleObjB.x), 2) + Math.pow((circleObjA.y - circleObjB.y), 2) < Math.pow((circleObjA.r + circleObjB).r, 2));

        }

    });

    /**
    *
    *动画
    *
    **/
    cnGame.register("cnGame", function(cg) {

        /**
        *帧的增量
        **/
        var path = 1;

        /**
        *获取帧集合
        **/
        var caculateFrames = function(options) {
            var frames = [];
            var width = options.width;
            var height = options.height;
            var beginX = options.beginX;
            var beginY = options.beginY;
            var frameSize = options.frameSize;
            var direction = options.direction;
            var x, y;
            /* 保存每一帧的精确位置 */
            if (direction == "right") {
                for (var y = beginY; y < height; y += frameSize[1]) {
                    for (var x = beginX; x < width; x += frameSize[0]) {
                        var frame = {};
                        frame.x = x;
                        frame.y = y;
                        frames.push(frame);

                    }

                }
            }
            else {
                for (var x = beginX; x < width; x += frameSize[0]) {
                    for (var y = beginY; y < height; y += frameSize[1]) {
                        var frame = {};
                        frame.x = x;
                        frame.y = y;
                        frames.push(frame);

                    }

                }

            }
            return frames;

        }
        /**
        *包含多帧图像的大图片
        **/
        spriteSheet = function(id, src, options) {
            if (!(this instanceof arguments.callee)) {
                return new arguments.callee(id, src, options);
            }
            this.init(id, src, options);
        }
        spriteSheet.prototype = {
            /**
            *初始化
            **/
            init: function(id, src, options) {

                /**
                *默认对象
                **/
                var defaultObj = {
                    x: 0,
                    y: 0,
                    width: 120,
                    height: 40,
                    frameSize: [40, 40],
                    frameDuration: 100,
                    direction: "right", //从左到右
                    beginX: 0,
                    beginY: 0,
					scale:1,
                    loop: false,
                    bounce: false
                };
                options = options || {};
                options = cg.core.extend(defaultObj, options);
                this.id = id; 								//spriteSheet的id
				this.context=options.context||cg.context;	//使用的上下文对象，默认是框架的context
                this.src = src; 							//图片地址
                this.x = options.x; 						//动画X位置
                this.y = options.y; 						//动画Y位置
				this.scale=options.scale;					//缩放比
                this.width = options.width; 				//图片的宽度
                this.height = options.height; 				//图片的高度
                this.image = cg.loader.loadedImgs[this.src]; //图片对象
                this.frameSize = options.frameSize; 		//每帧尺寸
                this.frameDuration = options.frameDuration; //每帧持续时间
                this.direction = options.direction; 		//读取帧的方向（从做到右或从上到下）
                this.currentIndex = 0; 					//目前帧索引
                this.beginX = options.beginX; 				//截取图片的起始位置X
                this.beginY = options.beginY; 				//截图图片的起始位置Y
                this.loop = options.loop; 					//是否循环播放
                this.bounce = options.bounce; 				//是否往返播放
                this.onFinish = options.onFinish; 			//播放完毕后的回调函数
                this.frames = caculateFrames(options); 	//帧信息集合
                this.now = new Date().getTime(); 			//当前时间
                this.last = new Date().getTime(); 		//上一帧开始时间
            },
            /**
            *更新帧
            **/
            update: function() {

                this.now = new Date().getTime();
                var frames = this.frames;
                if ((this.now - this.last) >= this.frameDuration) {//如果间隔大于等于帧间间隔，则update
                    var currentIndex = this.currentIndex;
                    var length = this.frames.length;
                    this.last = this.now;

                    if (currentIndex >= length - 1) {
                        if (this.loop) {	//循环
                            return frames[this.currentIndex = 0];
                        }
                        else if (!this.bounce) {//没有循环并且没有往返滚动，则停止在最后一帧
                            this.onFinish && this.onFinish();
                            return frames[currentIndex];
                        }
                    }
                    if ((this.bounce) && ((currentIndex >= length - 1 && path > 0) || (currentIndex <= 0 && path < 0))) {	//往返
                        path *= (-1);
                    }
                    this.currentIndex += path;

                }
                return frames[this.currentIndex];
            },
            /**
            *跳到特定帧
            **/
            index: function(index) {
                this.currentIndex = index;
                return this.frames[this.currentIndex];
            },
            /**
            *获取现时帧
            **/
            getCurrentFrame: function() {
                return this.frames[this.currentIndex];
            },
            /**
            *在特定位置绘制该帧
            **/
            draw: function() {

                var currentFrame = this.getCurrentFrame();
                var width = this.frameSize[0];
                var height = this.frameSize[1];
               	this.context.drawImage(this.image, currentFrame.x, currentFrame.y, width, height, this.x, this.y, width*this.scale, height*this.scale);
				
            }

        }
        this.SpriteSheet = spriteSheet;

    });

    /**
    *
    *sprite对象
    *
    **/
    cnGame.register("cnGame", function(cg) {

        var postive_infinity = Number.POSITIVE_INFINITY;

        var sprite = function(id, options) {
            if (!(this instanceof arguments.callee)) {
                return new arguments.callee(id, options);
            }
            this.init(id, options);
        }
        sprite.prototype = {
            /**
            *初始化
            **/
            init: function(options) {

                /**
                *默认对象
                **/
                var defaultObj = {
                    x: 0,
                    y: 0,
                    imgX: 0,
                    imgY: 0,
                    width: 32,
                    height: 32,
                    angle: 0,
                    speedX: 0,
                    speedY: 0,
                    rotateSpeed: 0,
                    aR: 0,
                    aX: 0,
                    aY: 0,
                    maxSpeedX: postive_infinity,
                    maxSpeedY: postive_infinity,
                    maxX: postive_infinity,
                    maxY: postive_infinity,
                    minX: -postive_infinity,
                    minY: -postive_infinity,
                    minAngle: -postive_infinity,
                    maxAngle: postive_infinity
                };
                options = options || {};
                options = cg.core.extend(defaultObj, options);
				this.context=options.context||cg.context;
                this.x = options.x;
                this.y = options.y;
                this.angle = options.angle;
                this.width = options.width;
                this.height = options.height;
                this.angle = options.angle;
                this.speedX = options.speedX;
                this.speedY = options.speedY;
                this.rotateSpeed = options.rotateSpeed;
                this.aR = options.aR;
                this.aX = options.aX;
                this.aY = options.aY;
                this.maxSpeedX = options.maxSpeedX;
                this.maxSpeedY = options.maxSpeedY;
                this.maxX = options.maxX;
                this.maxY = options.maxY;
                this.maxAngle = options.maxAngle;
                this.minAngle = options.minAngle;
                this.minX = options.minX;
                this.minY = options.minY;
                this.spriteSheetList = {};

                if (options.src) {	//传入图片路径
                    this.setCurrentImage(options.src, options.imgX, options.imgY, options.imgWidth, options.imgHeight);
                }
                else if (options.spriteSheet) {//传入spriteSheet对象
                    this.addAnimation(options.spriteSheet);
                    setCurrentAnimation(options.spriteSheet);
                }

            },
            /**
            *返回包含该sprite的矩形对象
            **/
            getRect: function() {
                return new cg.shape.Rect({ x: this.x, y: this.y, width: this.width, height: this.height });

            },
            /**
            *返回是否在某对象左边
            **/
			isLeftTo:function(obj){
				return this.x+this.width<obj.x;
			},
			/**
            *返回是否在某对象右边
            **/
			isRightTo:function(obj){
				return this.x>obj.x+obj.width;
			},
			/**
            *返回是否在某对象左边
            **/
			isTopTo:function(obj){
				return this.y+this.height<obj.y;
			},
			/**
            *返回是否在某对象左边
            **/
			isBottomTo:function(obj){
				return this.y>obj.y+obj.height;
			},
            /**
            *返回中点是否在某对象中点左边
            **/
			isCenterLeftTo:function(obj){
				return this.x+this.width/2<obj.x+obj.width/2;
			},
			/**
            *返回中点是否在某对象中点右边
            **/
			isCenterRightTo:function(obj){
				return this.x+this.width/2>obj.x+obj.width/2;
			},
			/**
            *返回中点是否在某对象中点左边
            **/
			isCenterTopTo:function(obj){
				return this.y+this.height/2<obj.y+obj.height/2;
			},
			/**
            *返回中点是否在某对象中点左边
            **/
			isCenterBottomTo:function(obj){
				return this.y+this.height/2>obj.y+obj.height/2;
			},
            /**
            *添加动画
            **/
            addAnimation: function(spriteSheet) {
				spriteSheet.relatedSprite=this;
                this.spriteSheetList[spriteSheet.id] = spriteSheet;
            },
            /**
            *设置当前显示动画
            **/
            setCurrentAnimation: function(id) {//可传入id或spriteSheet
                if (!this.isCurrentAnimation(id)) {
                    if (cg.core.isString(id)) {
                        this.spriteSheet = this.spriteSheetList[id];
						if(this.spriteSheet){
							this.width=this.spriteSheet.frameSize[0];
							this.height=this.spriteSheet.frameSize[1];
							this.image = this.imgX = this.imgY = undefined;
						}
                    }
                    else if (cg.core.isObject(id)) {
                        this.spriteSheet = id;
						if(this.spriteSheet){
							this.width=this.spriteSheet.frameSize[0];
							this.height=this.spriteSheet.frameSize[1];
							this.addAnimation(id);
							this.image = this.imgX = this.imgY = undefined;
						}
                    }
                }

            },
            /**
            *判断当前动画是否为该id的动画
            **/
            isCurrentAnimation: function(id) {
                if (cg.core.isString(id)) {
                    return (this.spriteSheet && this.spriteSheet.id === id);
                }
                else if (cg.core.isObject(id)) {
                    return this.spriteSheet === id;
                }
            },
            /**
            *设置当前显示图像
            **/
            setCurrentImage: function(src, imgX, imgY,imgWidth,imgHeight) {
                if (!this.isCurrentImage(src, imgX, imgY,imgWidth,imgHeight)) {

                    imgX = imgX || 0;
                    imgY = imgY || 0;
                    this.image = cg.loader.loadedImgs[src];
                    this.imgX = imgX;
                    this.imgY = imgY;
					this.width=this.imgWidth=imgWidth||this.image.width;
					this.height=this.imgHeight=imgHeight||this.image.height;
                    this.spriteSheet = undefined;
				

                }
            },
            /**
            *判断当前图像是否为该src的图像
            **/
            isCurrentImage: function(src, imgX, imgY,imgWidth,imgHeight) {
				var image = this.image;
				if(image&&src){
					imgX = imgX || 0;
					imgY = imgY || 0;
					imgWidth=imgWidth||image.width;
					imgHeight=imgHeight||image.height;
					if(this.imgX === imgX && this.imgY === imgY&&this.imgWidth === imgWidth && this.imgHeight === imgHeight){
						
						if (cg.core.isString(src)) {
							return (image.srcPath === src );
						}
						else{
							return image==src;
						}
						
					}
					
				}
				return false;
				
            },
			/**
            *跳到特定帧
            **/
			index:function(index){
				this.spriteSheet&&this.spriteSheet.index(index);		
			},
            /**
            *设置移动参数
            **/
            setMovement: function(options) {
                isUndefined = cg.core.isUndefined;
                isUndefined(options.speedX) ? this.speedX = this.speedX : this.speedX = options.speedX;
                isUndefined(options.speedY) ? this.speedY = this.speedY : this.speedY = options.speedY;
                isUndefined(options.rotateSpeed) ? this.rotateSpeed = this.rotateSpeed : this.rotateSpeed = options.rotateSpeed;
                isUndefined(options.aR) ? this.aR = this.aR : this.aR = options.aR;
                isUndefined(options.aX) ? this.aX = this.aX : this.aX = options.aX;
                isUndefined(options.aY) ? this.aY = this.aY : this.aY = options.aY;
                isUndefined(options.maxX) ? this.maxX = this.maxX : this.maxX = options.maxX;
                isUndefined(options.maxY) ? this.maxY = this.maxY : this.maxY = options.maxY;
                isUndefined(options.maxAngle) ? this.maxAngle = this.maxAngle : this.maxAngle = options.maxAngle;
                isUndefined(options.minAngle) ? this.minAngle = this.minAngle : this.minAngle = options.minAngle;
                isUndefined(options.minX) ? this.minX = this.minX : this.minX = options.minX;
                isUndefined(options.minY) ? this.minY = this.minY : this.minY = options.minY;
                isUndefined(options.maxSpeedX) ? this.maxSpeedX = this.maxSpeedX : this.maxSpeedX = options.maxSpeedX;
                isUndefined(options.maxSpeedY) ? this.maxSpeedY = this.maxSpeedY : this.maxSpeedY = options.maxSpeedY;


            },
            /**
            *重置移动参数回到初始值
            **/
            resetMovement: function() {
                this.speedX = 0;
                this.speedY = 0;
                this.rotateSpeed = 0;
                this.aX = 0;
                this.aY = 0;
                this.aR = 0;
                this.maxSpeedX = postive_infinity;
                this.maxSpeedY = postive_infinity;
                this.maxX = postive_infinity;
                this.minX = -postive_infinity;
                this.maxY = postive_infinity;
                this.minY = -postive_infinity;
                this.maxAngle = postive_infinity;
                this.minAngle = -postive_infinity;
            },
            /**
            *更新位置和帧动画
            **/
            update: function(duration) {//duration:该帧历时 单位：秒
                this.speedX = this.speedX + this.aX * duration;
                if (this.maxSpeedX < 0) {
                    this.maxSpeedX *= -1;
                }
                if (this.speedX < 0) {
                    this.speedX = Math.max(this.speedX, this.maxSpeedX * -1);
                }
                else {
                    this.speedX = Math.min(this.speedX, this.maxSpeedX);
                }

                this.speedY = this.speedY + this.aY * duration;
                if (this.maxSpeedY < 0) {
                    this.maxSpeedY *= -1;
                }
                if (this.speedY < 0) {
                    this.speedY = Math.max(this.speedY, this.maxSpeedY * -1);
                }
                else {
                    this.speedY = Math.min(this.speedY, this.maxSpeedY);
                }
                this.rotateSpeed = this.rotateSpeed + this.aR * duration;

                this.rotate(this.rotateSpeed).move(this.speedX, this.speedY);

                if (this.spriteSheet) {//更新spriteSheet动画
                    this.spriteSheet.x = this.x
                    this.spriteSheet.y = this.y;
                    this.spriteSheet.update();
                }
            },
            /**
            *绘制出sprite
            **/
            draw: function() {
                var context = this.context;
                var halfWith;
                var halfHeight;
                if (this.spriteSheet) {
                    this.spriteSheet.x = this.x
                    this.spriteSheet.y = this.y;
                    this.spriteSheet.draw();
                }
                else if (this.image) {
                    context.save()
                    halfWith = this.width / 2;
                    halfHeight = this.height / 2;
                    context.translate(this.x + halfWith, this.y + halfHeight);
                    context.rotate(this.angle * Math.PI / 180 * -1);
			
                    context.drawImage(this.image, this.imgX, this.imgY, this.imgWidth,this.imgHeight, -halfWith, -halfHeight, this.width, this.height);
                    context.restore();
                }

            },
            /**
            *移动一定距离
            **/
            move: function(dx, dy) {
                dx = dx || 0;
                dy = dy || 0;
                var x = this.x + dx;
                var y = this.y + dy;
                this.x = Math.min(Math.max(this.minX, x), this.maxX);
                this.y = Math.min(Math.max(this.minY, y), this.maxY);
                return this;

            },
            /**
            *移动到某处
            **/
            moveTo: function(x, y) {
                this.x = Math.min(Math.max(this.minX, x), this.maxX);
                this.y = Math.min(Math.max(this.minY, y), this.maxY);
                return this;
            },
            /**
            *旋转一定角度
            **/
            rotate: function(da) {
                da = da || 0;
                var angle = this.angle + da;

                this.angle = Math.min(Math.max(this.minAngle, angle), this.maxAngle);
                return this;
            },
            /**
            *旋转到一定角度
            **/
            rotateTo: function(a) {
                this.angle = Math.min(Math.max(this.minAngle, a), this.maxAngle);
                return this;

            },
            /**
            *改变一定尺寸
            **/
            resize: function(dw, dh) {
                this.width += dw;
                this.height += dh;
                return this;
            },
            /**
            *改变到一定尺寸
            **/
            resizeTo: function(width, height) {
                this.width = width;
                this.height = height;
                return this;
            }

        }
        this.Sprite = sprite;

    });
    /**
    *
    *sprite列表
    *
    **/
    cnGame.register("cnGame", function(cg) {

        var spriteList = function(){
			this.list=[];
		}
		spriteList.prototype={
			get:function(index){//传入索引或条件函数
				if(cg.core.isNum(index)){
					return this.list[index];
				}
				else if(cg.core.isFunction(index)){
					
					var arr=[];
					for(var i=0,len=this.list.length;i<len;i++){
						if(index(this.list[i])){
							arr.push(this.list[i]);
						}
					}
					return arr;
				}
			},
            add: function(sprite) {
                this.list.push(sprite);
            },
            remove: function(sprite) {//传入sprite或条件函数
                for (var i = 0, len = this.list.length; i < len; i++) {
                    if (this.list[i] === sprite||(cg.core.isFunction(sprite)&&sprite(this.list[i]))) {
                        this.list.splice(i, 1);
                        i--;
                        len--;
                    }
                }
            },
            clean: function() {
                for (var i = 0, len = this.list.length; i < len; i++) {
                    this.list.pop();
                }
            },
            sort: function(func) {
                this.list.sort(func);
            },
			getLength:function(){
				return this.list.length;
			},
			update:function(duration){
				for (var i = 0;i < this.list.length; i++) {
					if(this.list[i]&&this.list[i].update){
						this.list[i].update(duration);
					}
				}
			},
			draw:function(){
				for (var i = 0;i < this.list.length; i++) {
					if(this.list[i]&&this.list[i].draw){
						this.list[i].draw();
					}
				}				
				
			}
        }
        this.SpriteList = spriteList;
    });

    /**
    *
    *游戏循环
    *
    **/
    cnGame.register("cnGame", function(cg) {

        var timeId;
        var delay;
        /**
        *循环方法
        **/
        var loop = function() {
            var self = this;
            return function() {
                var now = new Date().getTime();
                if (!self.pause && !self.stop) {

                    var duration = (now - self.lastTime); //帧历时
                    var spriteList = cg.spriteList;
                    self.loopDuration = (self.startTime - self.now) / 1000;

                    if (self.gameObj.update) {//调用游戏对象的update
                        self.gameObj.update(duration / 1000);
                    }
					
					cg.clean();
					cg.drawBg();//绘制背景色
                    if (self.gameObj.draw) {
                        self.gameObj.draw(duration / 1000);
                    }
                   	//更新所有sprite
					spriteList.update(duration / 1000);                    
					spriteList.draw();	
                    

                    /*if (duration > self.interval) {//修正delay时间
                        delay = Math.max(1, self.interval - (duration - self.interval));
						

                    }*/	

                }
				self.lastTime = now;
                timeId = window.setTimeout(arguments.callee, delay);
				
               
            }
        }

        var gameLoop = function(gameObj, options) {

            if (!(this instanceof arguments.callee)) {
                return new arguments.callee(gameObj, options);
            }
            this.init(gameObj, options);
        }
        gameLoop.prototype = {
            /**
            *初始化
            **/
            init: function(gameObj, options) {
                /**
                *默认对象
                **/
                var defaultObj = {
                    fps: 30
                };
                options = options || {};

                options = cg.core.extend(defaultObj, options);
                this.gameObj = gameObj;
                this.fps = options.fps;
                this.interval = delay = 1000 / this.fps;

                this.pause = false;
                this.stop = true;
            },

            /**
            *开始循环
            **/
            start: function() {
                if (this.stop) {		//如果是结束状态则可以开始
                    this.stop = false;
                    var now = new Date().getTime();
                    this.startTime = now;
                    this.lastTime = now;
                    this.loopDuration = 0;
                    loop.call(this)();
                }
            }, 	/**
		 *继续循环
		**/
            run: function() {
                this.pause = false;
            },
            /**
            *暂停循环
            **/
            pause: function() {
                this.pause = true;
            },
            /**
            *停止循环
            **/
            end: function() {
                this.stop = true;
                window.clearTimeout(timeId);
            }


        }
        this.GameLoop = gameLoop;
    });

	/**
	*
	*地图
	*
	**/
	cnGame.register("cnGame", function(cg) {
		/**
		*层按zIndex由小到大排序
		**/							   
		var sortLayers=function(layersList){
			layersList.sort(function(layer1,layer2){
				if (layer1.zIndex > layer2.zIndex) {
					return 1;
				}
				else if (layer1.zIndex < layer2.zIndex) {
					return -1;
				}
				else {
					return 0;
				}				 
			});		
		}
		/**
		*层对象
		**/							   
		var layer = function(id,mapMatrix, options) {
	
			if (!(this instanceof arguments.callee)) {
				return new arguments.callee(id,mapMatrix, options);
			}
			this.init(id,mapMatrix, options);
		}
		layer.prototype={
			
			/**
			*初始化
			**/
			init: function(id,mapMatrix,options) {
				/**
				*默认对象
				**/	
				var defaultObj = {
					cellSize: [32, 32],   //方格宽，高
					x: 0, 	   			  //layer起始x
					y: 0				  //layer起始y
	
				};	
				options = options || {};
				options = cg.core.extend(defaultObj, options);
				this.id=options.id;
				this.mapMatrix = mapMatrix;
				this.cellSize = options.cellSize;
				this.x = options.x;
				this.y = options.y;
				this.row = mapMatrix.length; //有多少行
				this.width=this.cellSize[0]* mapMatrix[0].length;
				this.height=this.cellSize[1]* this.row;
				this.spriteList=new cg.SpriteList();//该层上的sprite列表
				this.imgsReference=options.imgsReference;//图片引用字典：{"1":{src:"xxx.png",x:0,y:0},"2":{src:"xxx.png",x:1,y:1}}
				this.zIindex=options.zIndex;
			},
			/**
			*添加sprite
			**/			
			addSprites:function(sprites){
				if (cg.core.isArray(sprites)) {
					for (var i = 0, len = sprites.length; i < len; i++) {
						arguments.callee.call(this, sprites[i]);
					}
				}
				else{
					this.spriteList.add(sprites);
					sprites.layer=this;
				}				
				
			},
			/**
			*获取特定对象在layer中处于的方格的值
			**/
			getPosValue: function(x, y) {
				if (cg.core.isObject(x)) {
					y = x.y;
					x = x.x;
				}
				var isUndefined = cg.core.isUndefined;
				y = Math.floor(y / this.cellSize[1]);
				x = Math.floor(x / this.cellSize[0]);
				if (!isUndefined(this.mapMatrix[y]) && !isUndefined(this.mapMatrix[y][x])) {
					return this.mapMatrix[y][x];
				}
				return undefined;
			},
			/**
			*获取特定对象在layer中处于的方格索引
			**/
			getCurrentIndex: function(x, y) {
				if (cg.core.isObject(x)) {
					y = x.y;
					x = x.x;
				}
				return [Math.floor(x / this.cellSize[0]), Math.floor(y / this.cellSize[1])];
			},
			/**
			*获取特定对象是否刚好与格子重合
			**/
			isMatchCell: function(x, y) {
				if (cg.core.isObject(x)) {
					y = x.y;
					x = x.x;
				}
				return (x % this.cellSize[0] == 0) && (y % this.cellSize[1] == 0);
			},
			/**
			*设置layer对应位置的值
			**/
			setPosValue: function(x, y, value) {
				this.mapMatrix[y][x] = value;
			},
			/**
			*更新层上的sprite列表
			**/			
			update:function(duration){
				this.spriteList.update(duration);
				
			},
			/**
			*根据layer的矩阵绘制layer和该layer上的所有sprite
			**/
			draw: function() {
				var mapMatrix = this.mapMatrix;
				var beginX = this.x;
				var beginY = this.y;
				var cellSize = this.cellSize;
				var currentRow;
				var currentCol
				var currentObj;
				var row = this.row;
				var img;
				var col;
				for (var i = beginY, ylen = beginY + row * cellSize[1]; i < ylen; i += cellSize[1]) {	//根据地图矩阵，绘制每个方格
					currentRow = (i - beginY) / cellSize[1];
					col=mapMatrix[currentRow].length;
					for (var j = beginX, xlen = beginX + col * cellSize[0]; j < xlen; j += cellSize[0]) {
						currentCol = (j - beginX) / cellSize[0];
						currentObj = this.imgsReference[mapMatrix[currentRow][currentCol]];
						if(currentObj){
							currentObj.x = currentObj.x || 0;
							currentObj.y = currentObj.y || 0;
							img = cg.loader.loadedImgs[currentObj.src];
							//绘制特定坐标的图像
							cg.context.drawImage(img, currentObj.x, currentObj.y, cellSize[0], cellSize[1], j, i, cellSize[0], cellSize[1]); 
						}
					}
				}
				//更新该layer上所有sprite
				this.spriteList.draw();
	
			}
		}
		
		
		
		/**
		*地图对象
		**/
		var map = function(options) {
	
			if (!(this instanceof arguments.callee)) {
				return new arguments.callee(options);
			}
			this.init(options);
		}
		map.prototype = {
			/**
			*初始化
			**/
			init: function(options) {
				/**
				*默认对象
				**/
				var defaultObj = {
					layers:[],
					x:0,
					y:0,
					width:100,
					height:100
	
				};
				options = options || {};
				options = cg.core.extend(defaultObj, options);
				this.layers=options.layers;
				this.x=options.x;
				this.y=options.y;
				this.width=options.width;
				this.height=options.height;
				this.enviroment=options.enviroment;//地形layer
			},
			/**
			*添加layer
			**/
			addLayer:function(layers){
				if (cg.core.isArray(layers)) {
					for (var i = 0, len = layers.length; i < len; i++) {
						arguments.callee.call(this, layers[i]);
					}
				}
				else{
					layers.x=this.x;
					layers.y=this.y;
					this.layers.push(layers);
					sortLayers(this.layers);
				}
				
			},
			/**
			*获取某个layer
			**/			
			getLayer:function(id){
				for (var i = 0, len = this.layers.length; i < len; i++) {
					if(this.layers[i].id==id){
						return 	this.layers[i];
					}
				}			
			},
			/**
			*更新所有layer
			**/
			update:function(duration){
				for(var i=0,len=this.layers.length;i<len;i++){
					this.layers[i].x=this.x;
					this.layers[i].y=this.y;
					this.layers[i].update(duration);				
				}				
			},			
			/**
			*绘制所有layer
			**/
			draw:function(){
				for(var i=0,len=this.layers.length;i<len;i++){
					this.layers[i].draw();				
				}				
			}
		}
		
		this.Layer = layer;
		this.Map = map;
	
	});

    /**
    *
    *场景
    *
    **/
    cnGame.register("cnGame", function(cg) {

        var view = function(options) {
            this.init(options);

        }
        view.prototype = {

            /**
            *初始化
            **/
            init: function(options) {
                /**
                *默认对象
                **/
                var defaultObj = {
                    width: cg.width,
                    height: cg.height,
                    imgWidth: cg.width,
                    imgHeight: cg.height,
                    x: 0,
                    y: 0

                }
                options = options || {};
                options = cg.core.extend(defaultObj, options);
                this.player = options.player;
                this.width = options.width;
                this.height = options.height;
                this.imgWidth = options.imgWidth;
                this.imgHeight = options.imgHeight;
                this.centerX = this.width / 2;
                this.src = options.src;
                this.x = options.x;
                this.y = options.y;
                this.insideArr = [];
                this.isLoop = false; ;
                this.isCenterPlayer = false;
                this.onEnd = options.onEnd;
				this.map=options.map;//view使用的地图对象
            },
            /**
            *使player的位置保持在场景中点之前的移动背景
            **/
            centerElem: function(elem,isInnerView) {
				this.elemToCenter=elem;
				this.isInnerView=isInnerView;
            },
			/**
            *取消对游戏元素的居中
            **/
			cancelCenter:function(){
				this.elemToCenter=undefined;
			},
			/**
            *更新
            **/
			update:function(){
				var elem=this.elemToCenter;
				if(elem){
					
					var map=this.map;
					var dir=this.centerDir;
				
					if(dir!="y"){//x方向居中
						this.x=Math.max(map.x,Math.min(map.width-this.width,elem.x-this.width/2));
						
					}
					if(dir!="x"){//y方向居中
						this.y=Math.max(map.y,Math.min(map.height-this.height,elem.y-this.height/2));	
					}
					if(this.isInnerView){

						if(elem.x<this.x){
							elem.x=this.x;	
						}
						else if(elem.x>this.x+this.width-elem.width){
							elem.x=this.x+this.width-elem.width;
						}
						if(elem.y<this.y){
							elem.y=this.y;	
						}
						else if(elem.y>this.y+this.height-elem.height){
							elem.y=this.y+this.height-elem.height;
						}
				
						
					}
				}
			},
			/**
            *判断对象是否在view内
            **/
			isPartlyInsideView:function(sprite){
				var spriteRect=sprite.getRect();
				var viewRect=this.getRect();
				return cg.collision.col_Between_Rects(spriteRect,viewRect);
				
			},
			/**
            *使坐标相对于view
            **/
			applyInView:function(func){	
				cg.context.save();
				cg.context.translate(-this.x, -this.y);
				func();
				cg.context.restore();
			},
			/**
            *返回包含该view的矩形对象
            **/
            getRect: function() {
                return new cg.shape.Rect({ x: this.x, y: this.y, width: this.width, height: this.height });
            }

        }
        this.View = view;
    });
	
	/**
    *
    *UI类
    *
    **/
    cnGame.register("cnGame.ui", function(cg) {
		/*	点击回调	*/								  
		var clickCallBacks={};
		
		var recordClick=function(){
				
			
		}
		/*	按钮	*/
		var button=function(options){
			this.init(options);
			cg.core.bindHandler(cg.canvas,"click",recordClick);
			
		};
		button.prototype={
			init:function(options){
				
				this.setOptions(options);			
							
			},
			onClick:function(){
				
			},
			setOptions:function(options){
				cg.core.extend(this,options);
				
			}
			
			
		};
										  
	});
	

})(window, undefined);

