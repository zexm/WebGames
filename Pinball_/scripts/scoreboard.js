var gInitialNumberOfBalls = 3; // start will 3 balls
var gInitialMultiballLevel = 0; // First multiball is @ 2k points


function ScoreBoard(scoreObject, multiballObject, ballsObject) {
	this.scoreElement = scoreObject;
	this.multiballElement = multiballObject;
	this.ballsElement = ballsObject;
	
	this.score = 0; // private
	this.multiballLevel = gInitialMultiballLevel;
	this.multiball = ScoreBoard.MultiballLevels[this.multiballLevel];
	this.balls = gInitialNumberOfBalls;
	
	this.Update(); 
}

ScoreBoard.MultiballLevels = [
	2,10,25,50,70,100
]

ScoreBoard.prototype.AddScore = function (intScore) 
{
	this.score += intScore;
	this.Update();
}

ScoreBoard.prototype.GetScore = function()
{
	return this.score;
}

ScoreBoard.prototype.Reset = function () 
{
	this.score = 0;
	this.numBallsRemaining = gInitialNumberOfBalls;
}

ScoreBoard.prototype.Update = function () 
{
	if (this.scoreElement.textContent != undefined) {
		this.scoreElement.textContent = this.score;
		this.multiballElement.textContent = this.multiball;
		this.ballsElement.textContent = this.balls;
	}
	else {
		this.scoreElement.innerText = this.score;
		this.multiballElement.innerText = this.multiball;
		this.ballsElement.innerText = this.balls;
	}
}

ScoreBoard.prototype.GetMultiball = function()
{
	return this.multiball;	
}

ScoreBoard.prototype.GoToNextMultiballLevel = function()
{
	this.multiballLevel++;
	if (this.multiballLevel >= ScoreBoard.MultiballLevels.length) {
		this.multiball += 50;
	}
	else {
		this.multiball = ScoreBoard.MultiballLevels[this.multiballLevel];
	}	
	this.Update();
}

ScoreBoard.prototype.GetBallsLeft = function()
{
	return this.balls;	
}

ScoreBoard.prototype.BurnABall = function()
{
	this.balls--;
	this.Update();
}



