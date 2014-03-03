if (typeof StoneRule == 'undefined') var StoneRule = {};
StoneRule.M = 15;
StoneRule.N = 15;
//color是bool，true是黑，false是false
StoneRule.IsFail = function(arr, boolColor) {
    if (!boolColor) {
        //如果是白棋不验证因为白棋无禁手
        return ChessboardState.Default;
    }
    else {
        //验证双三禁手（该处的双三因该是活的双三吧）
        var num = 0; 	//活的3子相连的个数
        for (var i = 0; i < 4; i++) {
            if (arr[i].Open && arr[i].Count == 3) {
                num++;
            }
        }
        if (num > 1) {
            return ChessboardState.BlackDoubleThree;
        }
        //验证双四禁手（该处的双四因该是活的双四吧）
        num = 0; 	//活的4子相连的个数
        for (var i = 0; i < 4; i++) {
            if (arr[i].Open && arr[i].Count == 4) {
                num++;
            }
        }
        if (num > 1) {
            return ChessboardState.BlackDoubleFour;
        }
        //验证长连禁手
        for (var i = 0; i < 4; i++) {
            if (Math.abs(arr[i].Count) > 5) {
                return ChessboardState.BlackOverline;
            }
        }
        return ChessboardState.Default;
    }
};
StoneRule.IsWin = function(arr) {
    for (var i = 0; i < 4; i++) {
        if (Math.abs(arr[i].Count) == 5) {
            return true;
        }
    }
    return false;
};
StoneRule.IsTie = function(stoneArr) {
    //当所有位置都有子时为平局
    for (var i = 0; i < StoneRule.M; i++) {
        for (var j = 0; j < StoneRule.N; j++) {
            if (stoneArr.Get(i, j) == 2)
                return false;
        }
    }
    return true;
};

StoneRule.CheckChessboardState = function(stoneArr, x, y, boolColor) {
    //m,n点四个方向的连子数，依次正东正西，正南正北方，西北东南，西南东北
    var arrf = new Array();
    var intColor = boolColor ? 0 : 1;
    arrf[0] = StoneRule.Xnum(x, y, stoneArr, intColor);
    arrf[1] = StoneRule.Ynum(x, y, stoneArr, intColor);
    arrf[2] = StoneRule.YXnum(x, y, stoneArr, intColor);
    arrf[3] = StoneRule.XYnum(x, y, stoneArr, intColor);

    //检查是否失败
    if (StoneRule.IsFail(arrf, boolColor) != ChessboardState.Default) {
        return StoneRule.IsFail(arrf, boolColor);
    }
    else {
        //检查是否胜利
        if (StoneRule.IsWin(arrf)) {
            return boolColor ? ChessboardState.BlackWin : ChessboardState.WhiteWin;
        }
        else {
            //检查是否平局
            if (StoneRule.IsTie(stoneArr)) {
                return ChessboardState.Tie;
            }
            else {
                return ChessboardState.Default;
            }
        }
    }
}

//从左到右
StoneRule.Xnum = function(x, y, stoneArr, intColor) {
    var openNum = 0;
    var count = 0;
    //先找到最左边的X
    while (x > 0) {
        var color = stoneArr.Get(x - 1, y);
        if (color == intColor)
            --x;
        else {
            if (color == 2)
                openNum++;
            break;
        }
    }
    //向右扫描
    while (x < StoneRule.M) {
        var color = stoneArr.Get(x, y);
        if (color != intColor) {
            if (color == 2)
                openNum++;
            break;
        }
        ++count;
        ++x;
    }
    return new CheckState(count, openNum);
};
//从上到下
StoneRule.Ynum = function(x, y, stoneArr, intColor) {
    var openNum = 0;
    var count = 0;
    //先找到最上面的y
    while (y > 0) {
        var color = stoneArr.Get(x, y - 1);
        if (color == intColor)
            --y;
        else {
            if (color == 2)
                openNum++;
            break;
        }
    }
    //向下扫描
    while (y < StoneRule.N) {
        var color = stoneArr.Get(x, y);
        if (color != intColor) {
            if (color == 2)
                openNum++;
            break;
        }
        ++count;
        ++y;
    }
    return new CheckState(count, openNum);
};
//从左上到右下
StoneRule.YXnum = function(x, y, stoneArr, intColor) {
    var openNum = 0;
    //找到左上角的坐标
    while (x > 0 && y > 0) {
        var color = stoneArr.Get(x - 1, y - 1);
        if (color == intColor) {
            --x;
            --y;
        }
        else {
            if (color == 2)
                openNum++;
            break;
        }
    }
    //向右下扫描
    var count = 0;
    while (x < StoneRule.M && y < StoneRule.N) {
        var color = stoneArr.Get(x, y);
        if (color != intColor) {
            if (color == 2)
                openNum++;
            break;
        }
        ++x;
        ++y;
        ++count;
    }
    return new CheckState(count, openNum);
};
//从左下到右上
StoneRule.XYnum = function(x, y, stoneArr, intColor) {
    var openNum = 0;
    var count = 0;

    //找到左下角的坐标
    while (x > 0 && y < StoneRule.N - 1) {
        var color = stoneArr.Get(x - 1, y + 1)
        if (color == intColor) {
            --x;
            ++y;
        }
        else {
            if (color == 2)
                openNum++;
            break;
        }
    }

    //向左上扫描
    while (x < StoneRule.M && y >= 0) {
        var color = stoneArr.Get(x, y);
        if (color != intColor) {
            if (color == 2)
                openNum++;
            break;
        }
        ++x;
        --y;
        ++count;
    }
    return new CheckState(count, openNum);
}