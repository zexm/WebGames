var UIHelper = function(canvas) {
    this.info = "欢迎使用蛙蛙五子棋人机对战版";
    this._stoneManager = new StoneManager(15, 15, canvas);
    this._stoneManager.Init();
};
UIHelper.prototype.btnStartClick = function(event) {
    event.data._stoneManager.Start();
};
UIHelper.prototype.CanvasClick = function(e) {
    var offsetLef = $(this).offset().left;
    var offsetTop = $(this).offset().top;
    var positionX = e.clientX - offsetLef || e.layerX - offsetLef || 0;
    var positionY = e.clientY - offsetTop || e.layerY - offsetTop || 0;

    var x = Math.floor(positionX / 40);
    var y = Math.floor(positionY / 40);
    e.data._stoneManager.PersonDownStone(x, y);
};
UIHelper.ShowMessage = function(msg) {
    alert(msg);
}