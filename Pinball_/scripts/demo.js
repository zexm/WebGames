	/**
 * @author andyzei
 */

// Things that are configurable
var gFPS = 60;


var gLastFrameTime = 0;

var gCanvas = null; 
var gCCTX = null;
var gBGImages = null;

var gCurrentBGImage = 0;

var gB2 = {};

var gLFlipperPressed = false;
var gRFlipperPressed = false;
var gLauncherPressed = false;

var gBallDensity = 1;
var gNumFramesBallHasBeenTrappedFor = 0;
var gNumFramesToTrapBall = 200;
var gMagnetIsOff = false;
var gNumFramesToTurnOffMagnet = 300;
var gNumFramesMagnetHasBeenOffFor = 0;

var gScoreboard = null;
var gAnimationManager = null;

var gNumBallsInPlay = 0;

var gLauncherSpawnPoint = pixelToB2dCoords(370, 280);

var gbGameOver = false;

if (window.addEventListener) {
    window.addEventListener("load", StartGame, false);
}
else {
    window.attachEvent("onload", StartGame);

}


function StartGame()
{
    debugLogInit("_debugWindow", 60); // Takes a DIV and a number of lines for the buffer.
	debugLog("We're running!");

	    gCanvas = document.getElementById("pinballCanvas");
	    gCCTX = gCanvas.getContext("2d");

	    gAnimationManager = new AnimationManager(gCCTX);
	    gBGImages = new Array();

	    gBGImages[0] = new Image();
	    //	gBGImages[1] = new Image();
	    //	gBGImages[2] = new Image();


	    gBGImages[0].src = "./Image/bg1.png";
	    //	gBGImages[1].src = "./Image/bg2.png";
	    //	gBGImages[2].src = "./Image/bg3.png";

	    gScoreboard = new ScoreBoard(document.getElementById("spScore"),
								 document.getElementById("spMultiball"),
								 document.getElementById("spBalls"));

	    initWorld();
	    initInput();

	    // Create starting ball
	    createBall(gB2.world, gLauncherSpawnPoint.x, gLauncherSpawnPoint.y, .5, false);
		
		
	    setInterval(drawBgLoop, 600);
	    setInterval(mainLoop, 17);

	
}

function initInput()
{
	document.addEventListener("keydown", KeyDown, false);	
	document.addEventListener("keyup", KeyUp, false);	
	gCanvas.addEventListener("click", canvasOnClick, false);
	if(window.navigator.msPointerEnabled) {
		document.addEventListener("MSPointerDown", canvasOnPointerDown, false);
		document.addEventListener("MSPointerUp", canvasOnUp, false);
		var HTML = document.getElementById("demohtml");
		HTML.style.overflow = "hidden";
		HTML.style.msContentZooming = "none";
		document.getElementById("touchHelp").style.display = "inline-block";
		document.onselectstart=function(){return false}
		document.ondragstart=function() {return false}
		document.addEventListener("MSGestureHold", function (e) { e.preventDefault(); }, false);
		window.addEventListener("contextmenu", function (e) { e.preventDefault(); }, false);
	}
}

function KeyDown(key)
{
	if (key.keyCode == 37) {
		gLFlipperPressed = true;
	}	
	if (key.keyCode == 39) {
		gRFlipperPressed = true;
	}	
	if (key.keyCode == 40) {
		gLauncherPressed = true;
	}
}
function KeyUp(key)
{
	if (key.keyCode == 37) {
		gLFlipperPressed = false;
	}	
	if (key.keyCode == 39) {
		gRFlipperPressed = false;
	}
	if (key.keyCode == 40) {
		gLauncherPressed = false;
	}
}

function drawBgLoop()
{
	gCurrentBGImage = (gCurrentBGImage + 1) % gBGImages.length;	
}

function mainLoop()
{
	var b2 = gB2;	
	var timeStep = 1.0/45;

	if (!gbGameOver) {
		// Check for game conditions (multiball, endgame, etc.)
		handleGameConditions();
		// Handle collisions (contacts) between objects that occured in the previous frame
		handleCollisions();
		// Grap input
		handleInput();
		// Step the physics world
		b2.world.Step(timeStep, 3);
		// Draw the background image
		gCCTX.drawImage(gBGImages[gCurrentBGImage], 0, 0);
		// Note that we always want to have animations draw *below* physics objects, so we do that first	
		gAnimationManager.Draw();
		// Now draw the physics objects		
		drawWorld(b2.world, gCCTX);
	}
}

function handleGameConditions()
{
	// Check to see if we need to lob a new ball onto the launcher
	if (gNumBallsInPlay == 0 && gScoreboard.GetBallsLeft() > 0) {
		createBall(gB2.world, gLauncherSpawnPoint.x, gLauncherSpawnPoint.y, .5, false);
		gScoreboard.BurnABall();
	}
	
	// Check the scoreboard and see if we should do multiball.
	if (gScoreboard.GetScore() > (gScoreboard.GetMultiball()*1000)) {
		// Multiball!!!
		doMultiball();
		gScoreboard.GoToNextMultiballLevel();		
	}
	
	// Is the game over?
	if (gScoreboard.GetBallsLeft() == 0 &&  gNumBallsInPlay == 0) {
		document.getElementById("dGameOver").innerText = "Game Over. :(";
		gbGameOver = true;
	}		
}

function doMultiball()
{
	for (var i = 0; i < 10; i++) {
		var point = pixelToB2dCoords(305,237);
		createBall(gB2.world, point.x, point.y, .5, false, "TestBall");
	}
}

function handleCollisions()
{
	// Handle contact state, such as turning magnets off and on
	// This happens every frame regardless of whether or not there are contacts
	if (gMagnetIsOff) {
		gNumFramesMagnetHasBeenOffFor++;
		if (gNumFramesMagnetHasBeenOffFor >= gNumFramesToTurnOffMagnet) {
			// Turn the magnet back on
			gMagnetIsOff = false;
			gNumFramesMagnetHasBeenOffFor = 0;
		}
	}
	
	
	// Handle the actual contacts
	for (var contact = gB2.world.m_contactList; contact; contact = contact.m_next)
	{
		var BumperBounceFactor = 3;


			// Ball catcher
			if (contact.m_shape1.m_userData != null && contact.m_shape2.m_userData != null) {
				var ball = null;
				if (contact.m_shape1.m_userData.shapeName == "BallCatcher" && contact.m_shape2.m_userData.shapeName == "TestBall") {
					ball = contact.m_shape2;
				}
				if (contact.m_shape2.m_userData.shapeName == "BallCatcher" && contact.m_shape1.m_userData.shapeName == "TestBall") {
					ball = contact.m_shape1;
				}
                
                if (ball != null) {
                    // Trap the ball!
                    if (gNumFramesBallHasBeenTrappedFor < gNumFramesToTrapBall && !gMagnetIsOff) {
                        // Trap the ball by simulating a magnet. Hold it there for a couple of seconds.
                        gNumFramesBallHasBeenTrappedFor++;
                        var ballPos = ball.m_body.m_xf.position;
						gScoreboard.AddScore(20);
                        ball.m_body.ApplyImpulse(new b2Vec2(contact.m_manifolds[0].normal.x * -4, contact.m_manifolds[0].normal.y * -4), ballPos);
                    }
                    else { // let the ball go.
                        gNumFramesBallHasBeenTrappedFor = 0; 
						gMagnetIsOff = true;
						ball.m_body.WakeUp();
//                        var ballPos = ball.m_body.m_xf.position;
						// Give the ball a little push to get it off the magnet.
//                        ball.m_body.ApplyImpulse(new b2Vec2(contact.m_manifolds[0].normal.x * BumperBounceFactor*2, contact.m_manifolds[0].normal.y * BumperBounceFactor*2), ballPos);
                    }
                    
                }
			}


		if (contact.m_manifold.pointCount > 0) {
			// Trampolines
			// Left tramp
			if (contact.m_shape1.m_userData != null && contact.m_shape2.m_userData != null) {
				var ball = null;
				if (contact.m_shape1.m_userData.shapeName == "LTramp" && contact.m_shape2.m_userData.shapeName == "TestBall") {
					ball = contact.m_shape2;
				}
				if (contact.m_shape2.m_userData.shapeName == "LTramp" && contact.m_shape1.m_userData.shapeName == "TestBall") {
					ball = contact.m_shape1;
				}
				if (ball != null) {
					var ballPos = ball.m_body.m_xf.position;
					if (contact.m_manifolds[0].normal.x > 0.8320 && // Ensure that this is on the outer face of the tramp
					contact.m_manifolds[0].normal.x < 0.8321 &&
					contact.m_manifolds[0].normal.y < -0.5547 &&
					contact.m_manifolds[0].normal.y > -0.5548 &&
					b2dToPixelCoords(ballPos).y < 410) {
						ball.m_body.ApplyImpulse(new b2Vec2(BumperBounceFactor, -2*BumperBounceFactor), ballPos);
						gScoreboard.AddScore(50);
						gAnimationManager.DoAnimation(AnimationManager.AnimationTypes.LeftTramp);
					}
				}
			}
			// Right tramp
			if (contact.m_shape1.m_userData != null && contact.m_shape2.m_userData != null) {
				var ball = null;
				if (contact.m_shape1.m_userData.shapeName == "RTramp" && contact.m_shape2.m_userData.shapeName == "TestBall") {
					ball = contact.m_shape2;
				}
				if (contact.m_shape2.m_userData.shapeName == "RTramp" && contact.m_shape1.m_userData.shapeName == "TestBall") {
					ball = contact.m_shape1;
				}
				if (ball != null) {
					var ballPos = ball.m_body.m_xf.position;
					if (contact.m_manifolds[0].normal.x < -0.8320 && // Ensure that this is on the outer face of the tramp
					contact.m_manifolds[0].normal.x > -0.8321 &&
					contact.m_manifolds[0].normal.y < -0.5547 &&
					contact.m_manifolds[0].normal.y > -0.5548 &&
					b2dToPixelCoords(ballPos).y < 410) {
						ball.m_body.ApplyImpulse(new b2Vec2(-1*BumperBounceFactor, -2*BumperBounceFactor), ballPos);
						gScoreboard.AddScore(50);
						gAnimationManager.DoAnimation(AnimationManager.AnimationTypes.RightTramp);
					}
				}
			}
			

			// Bumpers
			if (contact.m_shape1.m_userData != null && contact.m_shape2.m_userData != null) {
				var ball = null;
				if ((contact.m_shape1.m_userData.shapeName == "UpperBumper" || 
				contact.m_shape1.m_userData.shapeName == "LowerBumper" ||
				contact.m_shape1.m_userData.shapeName == "Trapezoid" ||
				contact.m_shape1.m_userData.shapeName == "ULTriangle" ||
				contact.m_shape1.m_userData.shapeName == "URTriangle" ||
				contact.m_shape1.m_userData.shapeName == "BallCatcherUpperBox" ||
				contact.m_shape1.m_userData.shapeName == "RightBumper")
				&& contact.m_shape2.m_userData.shapeName == "TestBall") {
					ball = contact.m_shape2;
				}
				if ((contact.m_shape2.m_userData.shapeName == "UpperBumper" || 
				contact.m_shape2.m_userData.shapeName == "Trapezoid" ||
				contact.m_shape2.m_userData.shapeName == "ULTriangle" ||
				contact.m_shape2.m_userData.shapeName == "URTriangle" ||
				contact.m_shape2.m_userData.shapeName == "LowerBumper" ||
				contact.m_shape2.m_userData.shapeName == "BallCatcherUpperBox" ||
				contact.m_shape2.m_userData.shapeName == "RightBumper")
				&& contact.m_shape1.m_userData.shapeName == "TestBall") {
					ball = contact.m_shape1;
				}
				if (ball != null) {
					var ballPos = ball.m_body.m_xf.position;
					ball.m_body.ApplyImpulse(new b2Vec2(contact.m_manifolds[0].normal.x*BumperBounceFactor, contact.m_manifolds[0].normal.y*BumperBounceFactor), ballPos);
					gScoreboard.AddScore(25);
					var contactedShape = (ball == contact.m_shape1) ? contact.m_shape2 : contact.m_shape1;
					
					if (contactedShape.m_userData.shapeName == "BallCatcherUpperBox") {
//						gAnimationManager.DoAnimation(AnimationManager.AnimationTypes.CatcherBox);
					}
					else if (contactedShape.m_userData.shapeName == "ULTriangle") {
						gAnimationManager.DoAnimation(AnimationManager.AnimationTypes.ULTriangle);
					}
					else if (contactedShape.m_userData.shapeName == "UpperBumper") {
						gAnimationManager.DoAnimation(AnimationManager.AnimationTypes.UpperBumper);
					}
					else if (contactedShape.m_userData.shapeName == "LowerBumper") {
						gAnimationManager.DoAnimation(AnimationManager.AnimationTypes.LowerBumper);
					}
					else if (contactedShape.m_userData.shapeName == "RightBumper") {
						gAnimationManager.DoAnimation(AnimationManager.AnimationTypes.RightBumper);
					}
				}
			}
			

			// Ground
			if (contact.m_shape1.m_userData != null && contact.m_shape2.m_userData != null) {
				var ball = null;
				if (contact.m_shape1.m_userData.shapeName == "TheGround" && (contact.m_shape2.m_userData.shapeName == "TestBall" || contact.m_shape2.m_userData.shapeName == "MultiBall") ) {
					ball = contact.m_shape2;
				}
				if (contact.m_shape2.m_userData.shapeName == "TheGround" && (contact.m_shape1.m_userData.shapeName == "TestBall" || contact.m_shape1.m_userData.shapeName == "MultiBall") ) {
					ball = contact.m_shape1;
				}
				if (ball != null) {
					gB2.world.DestroyBody(ball.m_body);
					gNumBallsInPlay--;
				}
			}			
		}		
	}
}


var gFlipperOnStrength = 4000;
var gFlipperOffStrength = 4000;

function handleInput()
{
	// fire the motors
	
	if (gLFlipperPressed)
	{
		gLFlipperJoint.SetMotorSpeed(gFlipperOnStrength);
		gLFlipperJoint.SetMaxMotorTorque(.90 * gFlipperOnStrength);		
	}
	else 
	{
		gLFlipperJoint.SetMotorSpeed(-1 * gFlipperOffStrength);
		gLFlipperJoint.SetMaxMotorTorque(gFlipperOffStrength);					
	}
	if (gRFlipperPressed)
	{
		gRFlipperJoint.SetMotorSpeed(.90 * -1 * gFlipperOnStrength);
		gRFlipperJoint.SetMaxMotorTorque(gFlipperOnStrength);		
	}
	else 
	{
		gRFlipperJoint.SetMotorSpeed(gFlipperOffStrength);
		gRFlipperJoint.SetMaxMotorTorque(gFlipperOffStrength);					
	}
	if (gLauncherPressed)
	{
		gLauncherJoint.SetMaxMotorForce(100);
		gLauncherJoint.SetMotorSpeed(100);
	}
	else {
		gLauncherJoint.SetMaxMotorForce(400);
		gLauncherJoint.SetMotorSpeed(-3200);
	}
}

function canvasOnClick(event)
{	
	var point = pixelToB2dCoords(event.offsetX, event.offsetY);
	// Uncomment this line to enable debugging by creating balls with the mouse.
	//createBall(gB2.world, point.x, point.y, .5, false);	
}
function canvasOnPointerDown(event)
{	
	if(event.pointerId) {
		curPointerId = event.pointerId;
		if(event.x >= 195 && event.y >= 510 && event.x < 290 && event.y < 580) {
			gLFlipperPressed = true;
		}
		if(event.x >= 325 && event.y >= 510 && event.x < 420 && event.y < 580) {
			gRFlipperPressed = true;
		}
		if(event.x >= 465 && event.y >= 395 && event.x < 485 && event.y < 620) {
			gLauncherPressed = true;
		}
	}
}
function canvasOnUp(event)
{
	console.log("canvasOnUp");
	if(event.pointerId == curPointerId){ 
		gLFlipperPressed = false;
		gRFlipperPressed = false;
		gLauncherPressed = false;
	}
}
function createBall(world, x, y, rad, fixed, /*optional*/ ballShapeName) {
	gNumBallsInPlay++;
	var ballSd = new b2CircleDef();
	if (!fixed) ballSd.density = gBallDensity;
	ballSd.radius = rad || 10;
	ballSd.restitution = .5;
	ballSd.friction = 0.01;
	if (ballShapeName != null) {
		ballSd.userData = {shapeName:ballShapeName};		
	}
	else {
		ballSd.userData = {shapeName:"TestBall"};		
	}
	var ballBd = new b2BodyDef();
//	ballBd.AddShape(ballSd);
	ballBd.position.Set(x,y);
	var ballBody = world.CreateBody(ballBd);
	ballBody.isBullet = true;
	ballBody.CreateShape(ballSd);
	ballBody.SetMassFromShapes();
	return ballBody;
};


