var StoneArray = function(m, n) {
    this._m = m;
    this._n = n;
    this._arr = new Array();
    this.Reset = function() {
        for (var i = 0; i < this._m; i++) {
            for (var j = 0; j < this._n; j++) {
                this._arr[i][j] = 2;
            }
        }
    };
    this.Get = function(x, y) {
        return this._arr[x][y];
    };
    this.Set = function(x, y, intColor) {
        this._arr[x][y] = intColor;
    };
    for (var i = 0; i < m; i++) {
        this._arr[i] = new Array();
        for (var j = 0; j < n; j++) {
            this._arr[i][j] = 2;
        }
    }
};
var Point = function(x, y) {
    this.X = x;
    this.Y = y;
};
var CheckState = function(count, openCount) {
    this.Count = count;
    this.Open = openCount >= 2;
    this.OpenCount = openCount;
};
//棋盘状态
if (typeof ChessboardState == "undefined") {
    var ChessboardState = {};
    ChessboardState.Default = 0; //默认
    ChessboardState.BlackWin = 1; //黑方胜
    ChessboardState.BlackDoubleThree = 2; //黑方三三禁手
    ChessboardState.BlackDoubleFour = 3; //黑方四四禁手
    ChessboardState.BlackOverline = 4; //黑方长连禁手
    ChessboardState.WhiteWin = 5;    //白方胜
    ChessboardState.Tie = 6;    //平局
}