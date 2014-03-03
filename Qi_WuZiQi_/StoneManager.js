var StoneManager = function(m, n, canvas) {
    StoneRule.M = m;
    StoneRule.N = n;
    this._chessboard = new Chessboard(m, n, canvas); //棋盘
    this._arrStones = new StoneArray(m, n); //arr[i][j]=0为黑子，1为白子，2为无子

    this._playFirst = false; //谁是先手，true是电脑，false是人，先手为黑子
    this._boolComputerColor = this._playFirst; ; //电脑使用的颜色,true是黑色，false是白色
    this._boolNextColor = true; //下一个子的颜色,true 为黑色，false为白色
};
StoneManager.prototype.Init = function() {
    this._chessboard.Draw();
};
StoneManager.prototype.Start = function() {
    this._chessboard.Reset();
    this._arrStones.Reset();

    this._playFirst = !this._playFirst;
    this._boolComputerColor = this._playFirst;
    this._boolNextColor = true;

    if (this._playFirst) {
        this.ComputerDownStone();
    }
};
StoneManager.prototype.PersonDownStone = function(x, y) {
    if (this._arrStones.Get(x, y) != 2) {
        UIHelper.ShowMessage("这里不能下子");
        return;
    }
    if (this.DownStone(x, y))
        return;
    this.ComputerDownStone();
};
//返回值，0：继续，1：需重新开始，2：需回滚。
StoneManager.prototype._checkChessboardState = function(x, y, color) {
    var state = StoneRule.CheckChessboardState(this._arrStones, x, y, color);
    switch (state) {
        case ChessboardState.Default:
            return 0;
        case ChessboardState.BlackWin:
            UIHelper.ShowMessage("黑方胜");
            return 1;
        case ChessboardState.BlackDoubleThree:
            UIHelper.ShowMessage("黑方三三禁手");
            return 2;
        case ChessboardState.BlackDoubleFour:
            UIHelper.ShowMessage("黑方四四禁手");
            return 2;
        case ChessboardState.BlackOverline:
            UIHelper.ShowMessage("黑方长连禁手"); ;
            return 2;
        case ChessboardState.WhiteWin:
            UIHelper.ShowMessage("白方胜");
            return 1;
        case ChessboardState.Tie:
            UIHelper.ShowMessage("平局了，牛呀！");
            return 1;
        default:
            UIHelper.ShowMessage("内部错误，热。");
            return 1;
    }
};
StoneManager.prototype.ComputerDownStone = function() {
    var point = new Point(-1, -1);
    var count = 0;
    do {
        point = StoneAI.CalculateNextStonePoint(this._arrStones, this._boolComputerColor)
        count++;
        if (count > 100) {
            UIHelper.ShowMessage("异常！");
            this.Start();
            return;
        }
    }
    while (this._arrStones.Get(point.X, point.Y) < 2);

    if (this.DownStone(point.X, point.Y))
        return;
}
StoneManager.prototype.DownStone = function(x, y) {
    this._chessboard.DrawStone(x, y, this._boolNextColor);
    this._arrStones.Set(x, y, this._boolNextColor ? 0 : 1);

    var tempState = this._checkChessboardState(x, y, this._boolNextColor);
    if (tempState == 1) {
        this.Start();
        return true;
    } else if (tempState == 2) {
        this._chessboard.RemoveStone(x, y);
        this._arrStones.Set(x, y, 2);
        return true;
    }
    else {
        this._boolNextColor = !this._boolNextColor;
        return false;
    }
}