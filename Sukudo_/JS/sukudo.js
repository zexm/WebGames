/*公共属性定义----Begin*/
var s=new Array(9);//全部数据
var bl=new Array(9);//重复记录加锁
var tn=new Array(9);//9格临时数据
var blockscount=0;//空格数量
var currentmouseint=1;//当前鼠标滚轮选择的数字
var lastselectednum=0;
var numcount=new Array(9);
var test=0;
var g={
        selectedsquare:'.sel',
        canvas:'#canvas',
        levelblocks:16,
        leftsg:'#leftsg',
 sourcenum:'843215697172396485695748132254139876317682954968574213421857369789463521536921748'
}
/*公共属性定义----End*/

/*初始化表格数据----Begin*/
function InitData()
{
    for (i=0;i<9;i++) {bl[i]=new Array(9);tn[i]=new Array(2);s[i]=new Array(9);numcount[i]=9;}
    for(j=0;j<9;j++)for(k=0;k<9;k++){bl[j][k]=0;s[j][k]=g.sourcenum.substr(j*9+k,1);}
}
/*初始化表格数据----End*/

/*初始化表格数据----Begin*/
function InitBlockData(level)
{
    var lt=20+level+Math.floor(Math.random() * 3);
    var j=Math.floor(Math.random() * 9);
    var k=Math.floor(Math.random() * 9);
    if (level==0)
    {
        blockscount=0;
    }
    else
    for(i=0;i < lt;i++)
    {
        while(true)
        {
            j=Math.floor(Math.random() * 9);
            k=Math.floor(Math.random() * 9);
            if (s[j][k]==0)
            {
                continue;
            }
            if (j==4 && k==4)
            {
                if ((numcount[s[j][k]-1]==(6-level) || numcount[s[Math.abs(j-8)][Math.abs(k-8)]-1]==(6-level)))
                {
                    continue;
                }
                else
                {
                    break;
                }
            }
            else if (numcount[s[j][k]-1]==(5-level) || numcount[s[Math.abs(j-8)][Math.abs(k-8)]-1]==(5-level))
            {
                continue;
            }
            else
            {
                break;
            }
        }
        //log("xa:"+j+",ya:"+k+",val="+s[j][k]);
        //log("xx:"+Math.abs(j-8)+",yy:"+Math.abs(k-8)+",val="+s[Math.abs(j-8)][Math.abs(k-8)]);
        numcount[s[j][k]-1]--;
        //log("numcount["+(s[j][k]-1)+"]:"+numcount[s[j][k]-1]);
        s[j][k]=0;
        if (s[Math.abs(j-8)][Math.abs(k-8)]!=0)
        {
            numcount[s[Math.abs(j-8)][Math.abs(k-8)]-1]--;
        }
        //log("numcount["+(s[Math.abs(j-8)][Math.abs(k-8)]-1)+"]:"+numcount[s[Math.abs(j-8)][Math.abs(k-8)]-1]);
        s[Math.abs(j-8)][Math.abs(k-8)]=0;


    }
    blockscount=0;
    for (j = 0; j < 9; j++)for(k=0;k<9;k++)if(s[j][k]==0)blockscount++;
}
/*初始化表格数据----End*/

/*生成数独数据----Begin*/
function CreateSukudoArray()
{
    var times=Math.floor(Math.random() * 9)+17;
    var ctype=0;//0:swaprow,1:swapcol,2:swapbigrow,3:swapbigcol

    for (i = 0; i < times; i += 1)
    {
        ctype=Math.floor((Math.random()*10)%4);
        if (ctype==0) SwapRow();
        else if (ctype==1) SwapCol();
        else if (ctype==2) SwapBigRow();
        else if (ctype==3) SwapBigCol();
    }
}
/*生成数独数据----End*/

/*生成数独表格----Begin*/
function CreateSukudoTable()
{
    var table="",x=0,y=0;
    table+="<table id='SukudoTable' class='sk' cellspacing='0' cellpadding='0'>";

    for (i=0;i<9;i++)
    {
        if(i%3==0) table+="<tr>";
        table+="<td>";
        table+="<table id='t_"+i+"' class='ck' cellspacing='0' cellpadding='0'>";
        for(j=0;j<3;j++)
        {
            table+="<tr>";
            for(k=0;k<3;k++)
            {
            x=((i%3)*3+k);
            y=(Math.floor(i/3)*3+j);
            if(s[x][y]!=0)
            {
                table+="<td id='c_"+x+"_"+y+"' class='g'>"+s[x][y]+"</td>";
            }
            else
            {
                table+="<td id='c_"+x+"_"+y+"' class='c'>&nbsp;</td>";
            }
            }
            table+="</tr>";
        }
        table+="</table></td>";
        if(i%3==2) table+="</tr>";

    }


    table+="</table>";
    $('#canvas').html(table);
}
/*生成数独表格----End*/

/*辅助函数----Begin*/
function SwapRow()
{
    var bigindex=Math.floor(Math.random() * 3),index=Math.floor(Math.random() * 3),RowA=bigindex*3+index,RowB=bigindex*3+(index+1)%3;
    var temp=s[RowA];
    s[RowA]=s[RowB];
    s[RowB]=temp;
}

function SwapCol()
{
    var bigindex=Math.floor(Math.random() * 3),index=Math.floor(Math.random() * 3),ColA=bigindex*3+index,ColB=bigindex*3+(index+1)%3,temp=0;
    for(li=0;li<9;li++)
    {
        temp=s[ColA][li];
        s[ColA][li]=s[ColB][li];
        s[ColB][li]=temp;
    }
}

function SwapBigRow()
{
    var bigindex=Math.floor(Math.random() * 3),RowA=bigindex,RowB=(bigindex+1)%3;
    SwapRow(RowA*3,RowB*3);
    SwapRow(RowA*3+1,RowB*3+1);
    SwapRow(RowA*3+2,RowB*3+2);
}

function SwapBigCol()
{
    var bigindex=Math.floor(Math.random() * 3),ColA=bigindex,ColB=(bigindex+1)%3;
    SwapCol(ColA*3,ColB*3);
    SwapCol(ColA*3+1,ColB*3+1);
    SwapCol(ColA*3+2,ColB*3+2);
}

function log(msg)
{
    if (msg=='')$('#err').html('');
    else $('#err').html($('#err').html()+"</br>"+msg);
}

function check(o)
{
    var id=o.attr('id'),x=id.substr(2,1),y=id.substr(4,1),val=o.num(),tx=Math.floor(x/3),ty=Math.floor(y/3);

for (i = 0; i < 3; i++)
{
    for (j = 0; j < 3; j++)
    {
        tn[i*3+j][0]=tx*3+i;
        tn[i*3+j][1]=ty*3+j;

    }
}
    for(i=0;i<9;i++)
    {
        if (x!=i)
        {
            if(s[i][y]==val && val!=0){bl[i][y]++;bl[x][y]++;}
            else if(bl[i][y]>0 && lastselectednum==s[i][y])bl[i][y]--;
        }
        if (y!=i)
        {
            if(s[x][i]==val && val!=0){bl[x][i]++;bl[x][y]++;}
            else if(bl[x][i]>0 && lastselectednum==s[x][i])bl[x][i]--;
        }
    }

for (i = 0; i < tn.length; i++)
{
    if (tn[i][0]!=x && tn[i][1]!=y)
    {
            if(s[tn[i][0]][tn[i][1]]==val && val!=0){bl[tn[i][0]][tn[i][1]]++;bl[x][y]++;}
            else if(bl[tn[i][0]][tn[i][1]]>0 && lastselectednum==s[tn[i][0]][tn[i][1]])bl[tn[i][0]][tn[i][1]]--;
    }
}

        for (j = 0; j < 9; j++)
        {
            for (k = 0; k < 9; k++)
            {
                if (bl[j][k]>0)$("#c_"+j+"_"+k+"").addClass('err');
                else $("#c_"+j+"_"+k+"").removeClass('err');
            }
        }



if ($('.err').size()==0 && blockscount==0)
{
    $(g.canvas).unblock().block({ message: finishedinfo, css: {width:'400px', border: '3px solid #a00' }});
    $('#timer').stopTime();
}
$('#lefts').text('LeftSquares：'+blockscount+'');
$('#leftsg').refreshnumcount();
}

function finit(l)
{
$('#timer').stopTime();$('#timer').html('Timer:<span>00:00:00<span/>').find('span').css({'font-weight': '100'});
InitData();CreateSukudoArray();InitBlockData(l);CreateSukudoTable();$('.g').hover(function(){$(this).addClass('h');},function(){$(this).removeClass('h');});$('.c').hover(function(){$(this).addClass('h');},function(){$(this).removeClass('h');}).click(function(){$('td').removeClass('sel').unmousewheel();$(this).addClass('sel').mousewheel(function(objEvent, intDelta){wc(intDelta,$(this));});currentmouseint=$(this).num();});$('#lefts').html('LeftSquares:'+blockscount+'');$('#leftsg').refreshnumcount();
if(l!=0)$('#timer').everyTime(1000,'timer',function(i){$(this).html('Timer:<span>'+f(Math.floor(i/3600))+':'+f(Math.floor(i/60))+':'+f(i%60)+'</span>').find('span').css({'font-weight': '100'});})
}

function wc(intDelta,o){
    var id=o.attr('id'),x=id.substr(2,1),y=id.substr(4,1);
    if (intDelta > 0 && currentmouseint<9){
       currentmouseint++;
       o.setwheelnum(currentmouseint);o.check();
    }
    else if (intDelta < 0 && currentmouseint>1){
        currentmouseint--;
       o.setwheelnum(currentmouseint);o.check();
    }
    else if((intDelta > 0 && currentmouseint==9) || (intDelta < 0 && currentmouseint==1))   {o.setempty();o.check();}
    else  o.html(o.html());
    
}

function f(s)
{
    if (s<10) return '0'+s;
    else return ''+s;

}
/*辅助函数----End*/
jQuery.fn.extend({
    num: function() {
        if(this.html()=='&nbsp;') return 0;
        return this.text()*1;
  },
    c: function() {
        var c={x:this.attr('id').substr(2,1),y:this.attr('id').substr(4,1)}
        return c;
},
    setempty: function() {
        lastselectednum=this.num();
        numcount[lastselectednum-1]--;
        this.html('&nbsp;');
        blockscount++;
        bl[this.c().x][this.c().y]=0;
        s[this.c().x][this.c().y]=0;
        return this;
},
    setnum: function(code) {
        if (this.num() == 0) blockscount--;
        else numcount[this.num()-1]--;
        lastselectednum=this.num();
        if(code>0 && code<9)this.text(code);
        else this.text(String.fromCharCode(code));
        if (s[this.c().x][this.c().y]!=this.num()) bl[this.c().x][this.c().y]=0;
        s[this.c().x][this.c().y]=this.num();
        numcount[this.num()-1]++;
        return this;
},
    setwheelnum: function(code) {
        if (this.num() == 0) blockscount--;
        else numcount[this.num()-1]--;
        lastselectednum=this.num();
        this.text(code+'');
        if (s[this.c().x][this.c().y]!=this.num()) bl[this.c().x][this.c().y]=0;
        s[this.c().x][this.c().y]=this.num();
        numcount[this.num()-1]++;
        return this;
},
    check: function() {
        check(this);
},
    gensukudo: function(l) {
    if(true) {finit(l);}
},
    congtl: function() {
    var x=0 ,y=0;

    for (j = 0; j < 9; j += 1)
    {
        for (k = 0; k < 9; k += 1)
        {
         $('#c_'+j+'_'+k).fadeOut(1000).fadeIn(1200);
        }
    }
},
    gennumcount: function()
{
    var str="";
    str+="<table id='nct' cellspacing='0' cellpadding='0' style='border:0px;vertical-align : bottom;' ><tr>";
    for (i = 1; i < 10; i++)
    {
        str+="<td id='nc_"+i+"' class='th' style='border:0px;vertical-align:bottom;'></td>";
    }
    str+="</tr></table>";
    this.html(str);
    return this;
},
    refreshnumcount: function()
{
var str="";//log('');
for (i = 1; i < 10; i++)
{
    str="";

    for (j = 8; j>=0; j--)
    {
        if (j >= numcount[i-1])
        {
            str+="<div class='tdb'></div>";
        }
        else
        {
            str+="<div class='td'></div>";
        }

    }
      str+="<b>"+i+"</b>";
    $('#nc_'+i).html(str);

}
}


});



