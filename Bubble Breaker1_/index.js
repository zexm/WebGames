/// <reference path="jquery/jquery-1.3.2-vsdoc2.js" />

//颜色集合
//red:"#D41506",blue:"#006DB7",yellow:"#FAD11D",green:"#128202",purple:"#128202"
colors = ["#D41506", "#006DB7", "#FAD11D", "#128202", "#5F27A6"]
//分数计算规则
scoreRex = { 1: 1,
    2: 4,
    3: 8,
    4: 16,
    5: 32,
    6: 64,
    7: 128,
    8: 256,
    9: 512,
    10: 1024,
    11: 2048,
    12: 4096,
    13: 8192,
    14: 16384,
    15: 32768,
    16: 65536,
    17: 131072,
    18: 262144,
    19: 524288,
    20: 1048576
};

//程序入口
$(function() {
    //初始化游戏
    grobal.initGame();
    ////给每个方块绑定mouseover事件
    $("#Diamond").live('mouseover', function(e) {
        var rownum = $(this).attr('rownum');
        var linenum = $(this).attr('linenum');
        grobal.curColor = $(this).css("backgroundColor");
        grobal.hasDealDiamonds.push($(this));
        grobal.destroyDiamonds.push($(this));
        //对这个方块进行处理，得到要"销毁"的方块
        grobal.CreateDestroyDiamonds(rownum, linenum);

        if (grobal.destroyDiamonds.length > 1) {
            var curScore = $("#curScore")
            curScore.css("left", e.pageX + 20);
            curScore.css("top", e.pageY);
            curScore.css("display", "");
            curScore.text(scoreRex[grobal.destroyDiamonds.length]);

            for (var i = 0; i < grobal.destroyDiamonds.length; i++) {
                grobal.destroyDiamonds[i].css("borderColor", 'Red');
                grobal.destroyDiamonds[i].css("borderWidth", '1px');
            }
        }
        grobal.reset();
    })
    //给每个方块绑定mouseout事件
    $("#Diamond").live('mouseout', function() {
        for (var i = 0; i < grobal.destroyDiamonds.length; i++) {
            grobal.destroyDiamonds[i].css("borderColor", 'Red');
            grobal.destroyDiamonds[i].css("borderWidth", '0px');
        }
        $("#curScore").css("display", "none");
        grobal.reset();
    })

    //给每个方块绑定点击事件
    $("#Diamond").live('click', function() {
        var rownum = $(this).attr('rownum');
        var linenum = $(this).attr('linenum');
        grobal.curColor = $(this).css("backgroundColor");
        grobal.hasDealDiamonds.push($(this));
        grobal.destroyDiamonds.push($(this));

        //对这个方块及其相连的方块进行处理
        grobal.CreateDestroyDiamonds(rownum, linenum)
        //处理要“销毁”方块
        grobal.destory();

        //获取所有空的列的列号
        var emptyLinenum = grobal.getEmptyLinenum();
        if (emptyLinenum.length > 0) {
            for (var i = emptyLinenum.length - 1; i >= 0; i--) {
                //空列左边的所有列右移一列
                grobal.moveRight(emptyLinenum[i]);
            }
        }
        //判断是否已经游戏结束
        if (grobal.isGameOver()) {
            alert("游戏已经结束，您的得分是：" + grobal.userScore);
            grobal.initGame();
        }
    })

})


grobal = {
    //空白方块的背景颜色
    EmptyColor: "white",
    //行总和
    countRow: 18,
    //列总和
    countLine: 23,
    //玩家得分
    userScore: 0,
    //已经处理的方块
    hasDealDiamonds: [],
    //等待销毁的方块
    destroyDiamonds: [],
    //当前方块的颜色
    curColor: "",
    //创建方块
    createDiamonds: function(color, line, row) {
        return '<div id="Diamond" linenum="' + line + '" rownum="' + row
            + '" style="width:19px;height:19px; float:left; background-color:'
            + color + '; margin:1px; cursor:pointer;"></div>'
    },
    //初始化游戏
    initGame: function() {
        for (var i = 0; i < 414; i++) {
            var colorIndex = parseInt(colors.length * Math.random());
            //列号
            var line = parseInt(i % 23) + 1;
            //行号
            var row = parseInt(i / 23) + 1;
            //创建方块
            var Diamonds = grobal.createDiamonds(colors[colorIndex], line, row);
            //向页面写入方块
            $("#main").append(Diamonds);
        }
    },
    //判断是否已经存在于数据中
    isIn: function(DiamondArray, Diamond) {
        if (DiamondArray.length == 0) {
            return false;
        }
        for (var i = 0, len = DiamondArray.length; i < len; i++) {
            if (DiamondArray[i].attr('linenum') == Diamond.attr('linenum')
                  && DiamondArray[i].attr('rownum') == Diamond.attr('rownum')
                    ) {
                return true;
            }
        }
        return false;
    },
    //判断是否已经处理过
    isDeal: function(Diamond) {
        return this.isIn(this.hasDealDiamonds, Diamond);
    },
    //是否是要处理的方块
    isDestroy: function(Diamond) {
        return this.isIn(this.destroyDiamonds, Diamond);
    },
    //处理结果数组
    destory: function() {
        //如果选择的只是一个方块就返回
        if (this.destroyDiamonds.length <= 1) {
            this.reset();
            return;
        }
        //清空“已处理方块”数组
        for (var i = 0, len = this.destroyDiamonds.length; i < len; i++) {
            this.destroyDiamonds[i].css("backgroundColor", this.EmptyColor);
        }
        this.downDiamonds();
    },
    //把已销毁的方块上方的方块下移
    downDiamonds: function() {
        //将要清空的方块按列号分组
        var grouns = this.MarkGround();

        //获取最大和最小的行号
        for (var i in grouns) {
            grouns[i] = this.getMaxMin(grouns[i]);
        }
        for (var i in grouns) {
            var linenum = i;
            var minRownum = grouns[i].min;
            var maxRownum = grouns[i].max;
            var diff = maxRownum - minRownum;

            var colors = [];
            //保存该列除空白颜色外的所有的颜色
            for (var rownum = maxRownum - 1; rownum > 0; rownum--) {
                if (this.getDiamondColor(rownum, linenum) !== this.EmptyColor) {
                    colors.push(this.getDiamondColor(rownum, linenum));
                }
            }
            //重新编排方块颜色
            var colorIndex = 0;
            for (var rownum = maxRownum; rownum > 0; rownum--) {
                var color = colors[colorIndex++] || this.EmptyColor;
                this.setDiamondColor(rownum, linenum, color);
            }
            this.userScore += scoreRex[this.destroyDiamonds.length] || 0;
            $("#result").text(this.userScore);

            colors = null;
            this.reset();
        }
        grouns = null;
    },

    //获取同一列空间方块的最大最小行号（它们是相连的）
    getMaxMin: function(DataOne) {
        var min = 100000;
        var max = 0;
        var length = DataOne.length;
        for (var i = 0; i < length; i++) {
            var linenum = parseInt(DataOne[i].attr("rownum"))
            if (linenum > max) {
                max = linenum;
            }
            if (min > linenum) {
                min = linenum;
            }
        }
        return { min: min, max: max }
    },
    //方块按列号分组
    MarkGround: function() {
        var ground = {};
        for (var i = 0, len = this.destroyDiamonds.length; i < len; i++) {
            var linenum = this.destroyDiamonds[i].attr("linenum");
            //判断一下是否已有了这个列号
            var inGround = false;
            for (var n in ground) {
                if (n == linenum) {
                    inGround = true;
                    break;
                }
            }
            if (inGround) {
                ground[linenum].push(this.destroyDiamonds[i]);
            } else {
                ground[linenum] = [this.destroyDiamonds[i]];
            }
        }
        return ground;
    },
    //重置
    reset: function() {
        this.hasDealDiamonds = [];
        this.destroyDiamonds = [];
    },
    //获取全部为空的列的列号数组
    getEmptyLinenum: function() {
        var emptyLinenum = [];
        for (var line = 1; line <= this.countLine; line++) {
            var isEmptyLine = true;
            for (var row = 1; row <= this.countRow; row++) {
                var diamondColor = this.getDiamondColor(row, line);
                //如果还有不为空的方块，证明这列还不全为空。
                if (diamondColor !== this.EmptyColor) {
                    isEmptyLine = false;
                    break;
                }
            }

            if (isEmptyLine) {
                emptyLinenum.push(line);
            }
        }
        return emptyLinenum;
    },
    //右移一列
    moveRight: function(linenum) {
        //历遍第一列到空白的列
        for (var _linenum = linenum; _linenum > 0; _linenum--) {
            //历遍同一列的所有方块
            for (var rownum = 1; rownum <= this.countRow; rownum++) {
                //获取行号相同，列号小一的方块的颜色
                var preLinenum = parseInt(_linenum - 1);
                var preLineColor = this.getDiamondColor(rownum, preLinenum);
                //设置方块的颜色
                this.setDiamondColor(rownum, _linenum, preLineColor);
                //$("div[rownum='" + rownum + "'][linenum='" + _linenum + "']").css("backgroundColor", preLineColor);
            }
        }
    },
    //判断游戏是否已经结束
    isGameOver: function() {
        var DealDiamonds = [];
        for (var line = 1; line <= this.countLine; line++) {
            for (var row = 1; row <= this.countRow; row++) {
                var diamond = this.getDiamond(row, line)
                //方块是否存在
                if (diamond) {
                    if (diamond.css("backgroundColor") !== this.EmptyColor) {
                        //判断是否已经处理过
                        if (!this.isIn(DealDiamonds, diamond)) {
                            DealDiamonds.push(diamond);
                            var RoundDiamonds = this.getRoundDiamonds(row, line);
                            for (var i = 0; i < RoundDiamonds.length; i++) {
                                if (RoundDiamonds[i].css("backgroundColor") == diamond.css("backgroundColor")) {
                                    DealDiamonds = null;
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        return true;
    },
    // 获取某方块四周的方块
    getRoundDiamonds: function(rownum, linenum) {
        var left = parseInt(linenum) - 1;
        var right = parseInt(linenum) + 1;
        var top = parseInt(rownum) - 1;
        var buttom = parseInt(rownum) + 1;
        var Diamonds = [];
        //得到四周的方块
        var leftDiamond = this.getDiamond(rownum, left);
        var rightDiamond = this.getDiamond(rownum, right);
        var topDiamond = this.getDiamond(top, linenum);
        var buttomDiamond = this.getDiamond(buttom, linenum);

        if (leftDiamond) {
            Diamonds.push(leftDiamond);
        }
        if (rightDiamond) {
            Diamonds.push(rightDiamond);
        }
        if (topDiamond) {
            Diamonds.push(topDiamond);
        }
        if (buttomDiamond) {
            Diamonds.push(buttomDiamond);
        }
        return Diamonds;
    },
    //获取方块
    getDiamond: function(rownum, linenum) {
        if (rownum < 1 || linenum < 1 || rownum > this.countRow || linenum > this.countLine) {
            return false
        }
        return $("div[rownum='" + rownum + "'][linenum='" + linenum + "']");
    },
    //获取方块的颜色
    getDiamondColor: function(rownum, linenum) {
        var diamond = this.getDiamond(rownum, linenum);
        if (diamond) {
            return diamond.css("backgroundColor");
        } else {
            return this.EmptyColor;
        }
        diamond = null;
    },
    //设置方块的颜色
    setDiamondColor: function(rownum, linenum, color) {
        if (rownum < 1 || linenum < 1) {
            return false
        }
        return $("div[rownum='" + rownum + "'][linenum='" + linenum + "']").css("backgroundColor", color);
    },
    //处理某个方块
    CreateDestroyDiamonds: function(rownum, linenum) {
        var Diamonds = this.getRoundDiamonds(rownum, linenum);
        for (var i = 0, len = Diamonds.length; i < len; i++) {
            //如果还没有处理过这个方块
            if (!this.isDeal(Diamonds[i])) {
                //如果方块的颜色相同
                if (Diamonds[i].css("backgroundColor") == this.curColor) {
                    this.hasDealDiamonds.push(Diamonds[i]);
                    this.destroyDiamonds.push(Diamonds[i]);

                    var curRow = Diamonds[i].attr("rownum");
                    var curLine = Diamonds[i].attr("linenum");
                    //循环处理
                    this.CreateDestroyDiamonds(curRow, curLine);

                } else {
                    this.hasDealDiamonds.push(Diamonds[i]);
                }
            }
        }
    }
}
