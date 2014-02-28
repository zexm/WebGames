if (typeof StoneAI == 'undefined') var StoneAI = {};
StoneAI.CalculateNextStonePoint = function(stoneArr, color) {
    //权值数组
    var qz = new StoneArray(StoneRule.M, StoneRule.N);
    //基本思路：先计算每个点的权值，在权值最高的位置下棋
    for (var i = 0; i < StoneRule.M; i++) {
        for (var j = 0; j < StoneRule.N; j++) {
            if (stoneArr.Get(i, j) < 2) {
                qz.Set(i, j, -1); 	//当已有子时标注为-1
            }
            else {
                qz.Set(i, j, StoneAI.Check(i, j, stoneArr, color));
            }
        }
    }
    return StoneAI.MaxQZ(qz);
}
StoneAI.MaxQZ = function(qz) {
    var max = 0;
    var x = 0, y = 0;
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (qz.Get(i, j) > max) {
                x = i;
                y = j;
                max = qz.Get(i, j);
            }
        }
    }
    return new Point(x, y);
}
//boolComputerColor是电脑的颜色，true表示黑，false表示白色
StoneAI.Check = function(m, n, arrchessboard, boolComputerColor) {
    var qz = 0;
    //找自己的取胜点（1000）
    var w1 = 100000;
    //找对手的取胜点（80）
    var w2 = 50000;
    //找自己的三个相连的点（60）
    var w3 = 10000;
    //找对手的三个相连的点（40）
    var w4 = 5000;
    //找自己的两个相连的点（20）
    var w5 = 1000;
    //找对手的两个相连的点（10）
    var w6 = 500;
    //找自己的相连的点（5）
    var w7 = 100;
    //找对方的相连的点（5）
    var w8 = 50;
    //找自己的失败点
    var w9 = -1000000;

    var arrf = new Array();
    //如果该位置下我方的子
    if (boolComputerColor) {
        //我方黑子
        arrchessboard.Set(m, n, 0);
    }
    else {
        //我方白子
        arrchessboard.Set(m, n, 1);
    }
    arrf[0] = StoneRule.Xnum(m, n, arrchessboard, boolComputerColor ? 0 : 1);
    arrf[1] = StoneRule.Ynum(m, n, arrchessboard, boolComputerColor ? 0 : 1);
    arrf[2] = StoneRule.YXnum(m, n, arrchessboard, boolComputerColor ? 0 : 1);
    arrf[3] = StoneRule.XYnum(m, n, arrchessboard, boolComputerColor ? 0 : 1);
    //中心点权值加1
    if (m == 7 && n == 7) { qz += 1; }

    for (var i = 0; i < 4; i++) {
        if (Math.abs(arrf[i].Count) == 5) {
            qz += w1;
        }
        if (arrf[i].Count == 4 && arrf[i].OpenCount >= 1) {
            qz += w3;
        }
        if (arrf[i].Count == 3 && arrf[i].OpenCount >= 2) {
            qz += w5;
        }
        if (arrf[i].Count == 2 && arrf[i].OpenCount >= 2) {
            qz += w7;
        }
        //如果我方为黑棋，还要检查失败点
        if (boolComputerColor) {
            if (StoneRule.IsFail(arrf, boolComputerColor) != ChessboardState.Default) {
                qz += w9;
            }
        }
    }
    //如果该位置下对方的子
    if (boolComputerColor) {
        //对方白子
        arrchessboard.Set(m, n, 1);
    }
    else {
        //对方黑子
        arrchessboard.Set(m, n, 0);
    }
    arrf[0] = StoneRule.Xnum(m, n, arrchessboard, (!boolComputerColor) ? 0 : 1);
    arrf[1] = StoneRule.Ynum(m, n, arrchessboard, (!boolComputerColor) ? 0 : 1);
    arrf[2] = StoneRule.YXnum(m, n, arrchessboard, (!boolComputerColor) ? 0 : 1);
    arrf[3] = StoneRule.XYnum(m, n, arrchessboard, (!boolComputerColor) ? 0 : 1);

    for (var i = 0; i < 4; i++) {
        if (Math.abs(arrf[i].Count) == 5) {
            qz += w2;
        }
        if (arrf[i].Count == 4 && arrf[i].OpenCount >= 1) {
            qz += w4;
        }
        if (arrf[i].Count == 3 && arrf[i].OpenCount >= 2) {
            qz += w6;
        }
        if (arrf[i].Count == 2 && arrf[i].OpenCount >= 2) {
            qz += w8;
        }
    }
    arrchessboard.Set(m, n, 2);
    return qz;
}