/** 
 * @date 2009-08-05 
 * @author luoyouhua 
 * */  
var D = document;  
var map = {  
    map_one:["OOOOOOOOOO","OWWWWWWOOO","OWOOGTWWOO","OWOOOBGWOO", "OWWWDWOWOO","WWOOOOOWOO","WOOBOOWWOO","WOOOWWWOOO","WWWWWOOOOO","OOOOOOOOOO"],  
    map_two:["OOOOOOOOOO","OWWWWOOOOO","OWTOWOOOOO","OWOOWOOOOO","WWGOWWWWOO","WOBBGOGWOO","WOOBOWWWOO","WWWOOWOOOO","OOWWWWOOOO","OOOOOOOOOO"],  
    map_three:["OOOOOOOOOO","OWWWWWOOOO","OWGOOWOOOO","OWOWOWWWOO", "OWODBOOWOO","OWOOBGOWOO","OWOOTWWWOO","OWWWWWOOOO","OOOOOOOOOO","OOOOOOOOOO"],  
    map_four:["OOOOOOOOOO","OOOWWWWWOO","OOOWOOOWOO","OOOWOWGWOO", "OWWWOOGWOO","OWTOBBOWOO","OWOOGBOWOO","OWWWWWWWOO","OOOOOOOOOO","OOOOOOOOOO"],  
    map_five:["OOOOOOOOOO", "OWWWWWWOOO","OWOOOTWOOO","OWOBWOWWWO",  "OWODOBOOWO","OWOOOWWOWO","OWWGOOGOWO","OOWWOOOWWO","OOOWWWWWWO", "OOOOOOOOOO"]  
}  
function keyCode(evt){  
    var evt = window.event?window.event:evt;  
    return window.event?event.keyCode:evt.which;  
}  
function each(arr,fn){  
    for(var i=0;i<arr.length;i++){  
        fn(arr[i],i);  
    }  
}  
function changeCharAt(id,b){  
     var r = id.split("");var n = r[0];  
     r[0] = b?--n:++n;  
     return topId = r.join("");  
}  
function setClassName(div,n){  
    div.className = n;  
}  
function removeAll(t){  
    t.innerHTML="";  
}  
function getClassName(p){  
    switch(p){  
        case "W"://墙壁  
         return "wall";  
         break;  
        case "O": //通道  
         return "hall";  
         break;  
        case "T"://推手  
         return "push";  
         break;  
        case "B"://箱子  
         return "box";  
         break;    
        case "G"://目标  
         return "target";  
         break;   
        case "D"://到达目标  
         return "done";  
         break;  
    }  
}  
function Game(t){  
    var T = this;  
    T.target = t;  
    T.currentDiv = null;  
    T.amount = 0;  
    T.targetAmount = 0;  
    T.m = map.map_one;  
    T.setMap = function(m){if(m) T.m = map[m];}  
    T.initMap = function(){  
        removeAll(T.target);  
        var f = document.createDocumentFragment();  
        each(T.m,function(e,i){  
            var arr = e.split("");  
            each(arr,function(p,j){  
                var div = D.createElement("DIV");  
                div.className=getClassName(p);  
                T.initCell(div,p,i+""+j);  
                f.appendChild(div);  
                T.sets(p,div);  
            });     
        });  
        T.target.appendChild(f);  
    };  
    T.sets = function(p,div){  
         switch(p){  
            case "T"://推手  
             T.currentDiv = div;  
             break;   
            case "G"://目标  
             T.amount++  
             break;   
            case "D"://到达目标  
             T.amount++  
             T.targetAmount++;  
             break;    
    }  
    }  
    /**=====================initialize div attrib===================*/  
    T.initCell = function(div,p,id){  
        div.id = id;  
        T.intPass(div,p);//initialize pass attrib  
        T.intIsTar(div,p); //initialize target attrib  
        T.intIsEmpty(div,p); //initialize empty attrib  
    };  
    T.intPass = function(div,p){  
        var pass = (p=="W")?"false":"true";  
        div.setAttribute("pass",pass)   
    };  
    T.intIsTar = function(div,p){  
        var isTar = ((p=="G")||(p=="D"))?"true":"false";  
        div.setAttribute("isTar",isTar);    
    };  
    T.intIsEmpty = function(div,p){  
       var isEmpty = (p=="O"||p=="G"||p=="T")?"true":"false";  
       div.setAttribute("isEmpty",isEmpty);  
    };  
      
    /**============get top bottom previous next div========================*/  
    T.previousDiv = function(div){  
        return div.previousSibling;  
    };  
    T.nextDiv = function(div){  
        return div.nextSibling;  
    };  
    T.topDiv = function(div){  
      if(div){  
         var topId = changeCharAt(div.id,true);  
         return D.getElementById(topId);  
      }  
    };  
    T.bottomDiv = function(div){  
      if(div){  
         var buttomId = changeCharAt(div.id,false);  
         return D.getElementById(buttomId);  
      }  
    }  
    /**==================set div type===========================*/  
    T.setBox = function(div){setClassName(div,"box");};  
    T.setPush = function(div){setClassName(div,"push");}  
    T.setTarget = function(div){setClassName(div,"target");}  
    T.setHall = function(div){setClassName(div,"hall");}  
    T.setDone = function(div){setClassName(div,"done");}  
    T.setEmptyDiv = function(div){  
        if(!div)return;  
        var tar = div.getAttribute("isTar");  
        div.setAttribute("isEmpty","true");  
        "true"==tar?T.setTarget(div):T.setHall(div);  
    };  
    T.fullDiv = function(div,fromDiv){  
        if(!div)return;  
        div.setAttribute("isEmpty","false");  
        var isTar = div.getAttribute("isTar");  
        var fromTar = fromDiv.getAttribute("isTar");  
        if("true"==isTar){  
            T.setDone(div);//推到目标点  
            T.targetAmount++;  
        }else{  
            T.setBox(div);  
        }  
        if("true"==fromTar){//离开目标点  
            T.targetAmount--;  
        }  
    }  
    /**==================on keypassdown event==========================*/  
    T.keyPassDown = function(evt){  
        var code = keyCode(evt);  
        var type = T.getMoveType(code);  
        if(type!=null){  
            var targetDiv = T.getTargetDiv(T.currentDiv,type);  
            if(targetDiv){  
                  if(T.isPass(targetDiv)){  
                     if(T.isEmpty(targetDiv)){//move push div  
                         T.movePush(targetDiv);  
                     }else{//push box   
                         T.pushBox(targetDiv,type);  
                     }  
                  }  
            }  
        }  
    };  
    T.getMoveType = function(code){  
        if(code==38||code==87){  
            return "UP";  
        }else if(code==40||code==83){  
            return "DOWN";  
        }else if(code==37||code==65){  
            return "LEFT";  
        }else if(code==39||code==68){  
            return "RIGHT";  
        }else{  
            return null;  
        }  
    };  
    T.getTargetDiv = function(div,type){  
        switch(type){  
            case "UP":  
              return T.topDiv(div);  
            case "DOWN":  
              return T.bottomDiv(div);  
            case "LEFT":  
              return T.previousDiv(div);  
            case "RIGHT":  
              return T.nextDiv(div);  
            default:  
              return null;      
        }  
    };  
    T.pushBox = function(boxDiv,type){  
        var nextDiv = T.getTargetDiv(boxDiv,type);  
        if(nextDiv){  
            if(T.isPass(nextDiv)&&T.isEmpty(nextDiv)){  
                T.fullDiv(nextDiv,boxDiv);  
                T.movePush(boxDiv);  
                if(T.amount==T.targetAmount){  
                    alert("推箱子成功!");  
                }  
            }  
        }  
    };  
    T.movePush = function(targetDiv){  
            T.setPush(targetDiv);  
            T.setEmptyDiv(T.currentDiv);  
            T.currentDiv = targetDiv;  
    };  
    T.isPass = function(div){return  div.getAttribute("pass")=="true";}  
    T.isEmpty = function(div){return  div.getAttribute("isEmpty")=="true";}  
      
}  