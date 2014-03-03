var Chessboard = function(m, n, canvas) {
    this._m = m;
    this._n = n;
    this._canvas = canvas;
};
Chessboard.prototype.Draw = function() {
    this._canvas.css({ "background-image": "url(2010072514512816.gif)",
        "height": "600px", "width": "600px"
    });
};
Chessboard.prototype.DrawStone = function(x, y, boolColor) {
    var src = boolColor ? "2010072514520566.gif" : "2010072514522561.gif";
    $('<img>').attr("src", src).attr("id", "chess" + x + y)
        .width(40)
        .height(40)
        .css({ left: x * 40, top: y * 40, position: "absolute" })
        .appendTo(this._canvas);
};
Chessboard.prototype.RemoveStone = function(x, y) {
    $("#chess" + x + y).remove();
};
Chessboard.prototype.Reset = function() {
    this._canvas.empty();
}