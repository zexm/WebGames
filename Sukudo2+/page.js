// JavaScript Document
var i=true;
var textobj;
var textid;
var initext=new Array(81);
var grid=new Array(81);
var ready =new Array(81);
var adHeight=90;
var load=false;

/*var URL = window.location.href;
if(URL.indexOf('http://polynet.512j.com')!=-1)
{
	window.location.href='http://www.polynet.name';
}*/

function ini()
{
	for(j=0;j<81;j=j+1)
	{
		ready[j]=0;
		var obj=document.getElementById("grid"+j);
		if(obj!=null)
		{
			if(obj.className=="gridr")
			{
				initext[j]=obj.value;
			}
			else
			{
				initext[j]="";
			}
		}
	}
	updatediv();
/*	document.getElementById("top_ad_home").style.height=adHeight+"px";
	document.getElementById("top_ad_home").style.display="block";*/
	load=true;
}


function onfocusfunc (event)
{
	i=true;
	/*
	if(event.pageX || event.pageY)
	{
		var x=event.pageX+20+'px';
		var y=event.pageY+20+'px';
	}else if(event.clientX || event.clientY)
	{
		var x=event.clientX+45+document.documentElement.scrollLeft+"px";
		var y=event.clientY-15+document.documentElement.scrollTop+"px";
	}
	var obj=document.getElementById('wintag');
	if(obj!=null)
	{
		obj.style.display="inline";
		obj.style.left=x;
		obj.style.top=y;
		
	}*/
	updatediv();
	event=window.event || event;
	textobj=event.srcElement || event.target;
	textid=getid();
	textobj.style.background='#FFFF00';

	var readobj=document.getElementById('readybutton');
	if(ready[textid]==0)
	{
		readobj.value="待定";
	}else
	{
		readobj.value="取消";
	}
}

function onblurfunc (event)
{
	event=window.event || event;
	textobj=event.srcElement || event.target;
	textobj.style.background='#FFFF00';
	//var obj=document.getElementById('wintag');
	if(i==true)
	{
		if(ready[textid]==0)
			textobj.style.background='#FFFFFF';
		//obj.style.display="none";
	}
}

function onblurfunc2 (event)
{
	//var obj=document.getElementById('wintag');
	if(i==true)
	{
		if(ready[textid]==0)
			textobj.style.background='#FFFFFF';
		//obj.style.display="none";
	}
}

function onmouseoverfunc(event)
{
	i=false;
	event=window.event || event;
	var obj=event.srcElement || event.target;
	obj.style.background='#555555';
	obj.style.color="#FFFFFF";
	obj.style.cursor='pointer';
}

function onmouseoutfunc(event)
{
	i=true;
	event=window.event || event;
	var obj=event.srcElement || event.target;
	obj.style.background='#FFFFFF';
	obj.style.color="#336633";
}

function onclickfunc(event,num)
{
	if(textobj!=null && ready[textid]==1)
	{
		processNotReady(num);
		return;
	}
	if(textobj!=null && ready[textid]==0)
	{
		textobj.value=num;
		updatediv();
	}
}

function processNotReady(num)
{
	var str=textobj.innerText;
	var p=str.indexOf(num);
	if(p==-1 && str.length<6)
	{
		str+=num;
	}else if(str.length<=6)
	{
			var l=str.substr(0,p);
			var h=str.substr(p+1,str.length);
			str=l+h;
	}
	textobj.innerText=str;
}

function getremain()
{
	var remain=81;
	for(j=0;j<81;j=j+1)
	{
		var obj=document.getElementById("grid"+j);
		if(obj!=null && obj.value!="")
		{
			remain=remain-1;
		}
	}
	return remain;
}

function onchangefunc(event)
{
	updatediv();
}

function updatediv()
{
	var obj=document.getElementById('message');
	var r=getremain();
	var readobj=document.getElementById('readybutton');
	var str="";
	if(ready[textid]==0)
	{
		readobj.value="待定";
	}else
	{
		readobj.value="取消";
	}
	completecorrect();
	if(r==0)
	{
		str="恭喜您完成题目";
	}else
	{
		str="未完成空格数"+r;
	}
	obj.innerHTML=str;
}

function onclickfunc2(event)
{
	if(ready[textid]!=1)
	{
		textobj.value="";
		updatediv();
	}else
	{
		textobj.innerText="";
	}
}

function onclickfunc3(event)
{
	if(load==false)
		return;
	if(!window.confirm("你确定要清空所有已经填的数字?"))
		return;
	for(j=0;j<81;j=j+1)
	{
		var obj=document.getElementById("grid"+j);
		if(obj!=null)
		{
			obj.value=initext[j];
		}
	}
	updatediv();
}

function completecorrect()
{
	var flag=true;
	for(j=0;j<81;j=j+1)
	{
		var obj=document.getElementById("grid"+j);
		if(obj!=null)
		{
			grid[j]=obj.value;
		}
	}
	for(j=0;j<81;j=j+1)
	{
		var obj2=document.getElementById("grid"+j);
		if(iscorrect(j)!=true)
		{
			flag=false;
			obj2.style.background="#FFFF00";
		}
		else
		{
			if(obj2.className=="gridr")
			{
				obj2.style.background="#FFFFFF";
			}else
			{
				obj2.style.background="#FFFFFF";
			}
		}
	}
	return flag;
}

function iscorrect(num)
{
	if(grid[num]==""||grid[num]=="X"||grid[num]=="?")
		return true;
	var re=/^[1-9]+$/; 
	if(!re.test(grid[num]))
		return false;
	var j,k;
	var col=parseInt(num/9);
	var row=num%9;
	var ii=parseInt(col/3)*3; 
	var jj=parseInt(row/3)*3; 
	var start=ii*9+jj;
	for(j=0;j<9;j=j+1)
	{
		var k=j+col*9;
		if(k!=num)
		{
			if(grid[k]==grid[num])
			{
				return false;
			}
		}
	}
	for(j=0;j<9;j=j+1)
	{
		var k=j*9+row;
		if(k!=num)
		{
			if(grid[k]==grid[num])
			{
				return false;
			}
		}
	}
	for(j=0;j<3;j=j+1)
	{
		for(k=0;k<3;k=k+1)
		{
			h=start+j*9+k;
			if(h!=num)
			{
				if(grid[h]==grid[num])
				{
					return false;
				}
			}
		}
	}
	return true;
}

function onclickfunc4(event)
{
	var inputobj=document.getElementById("numtext");
	var str=inputobj.value;
	var inputtext=str.replace(/\s/g, "");
	var url="http://www.polynet.name/index.php?";
	
	var grid=Array(81);
	
	for(j=0;j<inputtext.length&&j<81;j=j+1)
	{
		if(inputtext.substr(j,1)!="0")
			grid[j]=inputtext.substr(j,1);
	}
	for(;j<81;j=j+1)
	{
		grid[j]="0";
	}
	
	for(j=0;j<81;j=j+1)
	{
		url=url+"g"+j+"="+grid[j]+"&";
	}
	url=url+"f=1";
	window.location.href=url;
}

function onclickfunc5(event)
{		
	if(completecorrect()==false)
	{
		window.alert("您的输入存在错误！");
	}else
	{
		if(iscomplete()==false)
		{
			window.alert("您还没有完成题目!");
		}else
			window.alert("恭喜你完成题目!");
	}
}

function onclickfunc6(event)
{
	event=window.event || event;
	var obj=event.srcElement || event.target;
	
	if(ready[textid]==0)
	{
		ready[textid]=1;
		obj.value="取消";
		var parenttd=textobj.parentNode;
		parenttd.childNodes[0].style.display="none";
		parenttd.childNodes[1].style.display="block";
		textobj=parenttd.childNodes[1];
		textid=getid();
	}else
	{
		ready[textid]=0;
		obj.value="待定";
		var parenttd=textobj.parentNode;
		parenttd.childNodes[1].style.display="none";
		parenttd.childNodes[0].style.display="block";
		textobj=parenttd.childNodes[0];
		textid=getid();
	}
}

function iscomplete()
{
	for(j=0;j<81;j=j+1)
	{
		var obj=document.getElementById("grid"+j);
		if(obj==null || obj.value=="")
			return false;
	}
	return true;
}

function getid()
{
	return textobj.id.substr(4,2)-0;
}

function openAWindow( pageToLoad, winName, width, height, center)
{
	xposition=0; yposition=0;
	if ((parseInt(navigator.appVersion) >= 4 ) && (center)){
		xposition = (screen.width - width) / 2;
		yposition = (screen.height - height) / 2;
	}
	args = "width=" + width + ","
	+ "height=" + height + ","
	+ "location=0,"
	+ "menubar=0,"
	+ "resizable=1,"
	+ "scrollbars=1,"
	+ "status=0,"
	+ "titlebar=0,"
	+ "toolbar=0,"
	+ "hotkeys=0,"
	+ "screenx=" + xposition + ","  //NN Only
	+ "screeny=" + yposition + ","  //NN Only
	+ "left=" + xposition + ","     //IE Only
	+ "top=" + yposition;           //IE Only
	window.open( pageToLoad,winName,args );
}