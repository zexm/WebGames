/**
 * @author andyzei
 */

gBoardElementRestitution = .5;
gBoardElementFriction = .1;


gBallRestitution = .2;
gBallFriction = .001;
gBallDensity = 3;

gFlipperRestitution = .2;
gFlipperFriction = .001;
gFlipperDensity = 3;


gLFlipperJoint = null;
gRFlipperJoint = null;

// This is a helper function since b2BoxDef was removed from b2d2.
function CreateStaticBox(sizeX, sizeY, posX, posY, userData)
{	
	var shape = new b2PolygonDef();
	var ext = pixelToB2dCoords(sizeX, sizeY);
	shape.SetAsBox(ext.x, ext.y);
	shape.userData = userData;
	shape.restitution = gBoardElementRestitution;
	var groundBd = new b2BodyDef();
	var pos = pixelToB2dCoords(posX, posY);
	groundBd.position.Set(pos.x, pos.y);
	var body = gB2.world.CreateBody(groundBd);
	body.CreateShape(shape);
	
}

function initBoard(){
	// Ground
	CreateStaticBox(180,1, 200,540, {drawShape: false, shapeName: "TheGround"});
	// Right Wall
	CreateStaticBox(1,260, 384,280, {drawShape: false, shapeName: "BoundingBox"});
	// ?? Wall
	CreateStaticBox(1,80, 361,320, {drawShape: false, shapeName: "BoundingBox"});
	// Left Wall
	CreateStaticBox(1,260, 20,280, {drawShape: false, shapeName: "BoundingBox"});
	// ?? Wall
	CreateStaticBox(180,1, 200,20, {drawShape: false, shapeName: "BoundingBox"});

	var b2 = gB2;
		
	// Create Trampolines
	var LTrampPoints = [];
	LTrampPoints[0] = [80, 120];
	LTrampPoints[1] = [0, 80];
	LTrampPoints[2] = [0, 0];
	var LTrampPos = [60, 300];	
	var LTrampBody = createPoly(b2.world, LTrampPos[0], LTrampPos[1], LTrampPoints, true, {drawShape:false, shapeName:"LTramp"});
	
	var RTrampPoints = [];
	RTrampPoints[0] = [80, -120];
	RTrampPoints[1] = [80, -40];
	RTrampPoints[2] = [0, 0];
	var RTrampPos = [260, 420];					
	var RTrampBody = createPoly(b2.world, RTrampPos[0], RTrampPos[1], RTrampPoints, true, {drawShape:false, shapeName:"RTramp"});

	// Create valve to prevent balls from going back into the launcher	
	var valveShape = new b2PolygonDef();
	var valveSize = pixelToB2dCoords(1, 12);
	valveShape.SetAsOrientedBox(valveSize.x, valveSize.y, new b2Vec2(0,0), 1/*.25 * b2Settings.b2_pi*/);
	valveShape.userData = {drawShape:true, shapeName:"LauncherValve"};
	valveShape.restitution = gBoardElementRestitution;
	valveShape.density = 1;
	
	var valveBody = new b2BodyDef();
	var pos = pixelToB2dCoords(370, 95);
	valveBody.position.Set(pos.x, pos.y);
	var valveBody = gB2.world.CreateBody(valveBody);
	valveBody.CreateShape(valveShape);
	valveBody.SetMassFromShapes();
	var valveJointDef = new b2RevoluteJointDef();
	
	var anchorPos = pixelToB2dCoords(362, 103);
	valveJointDef.Initialize(b2.world.GetGroundBody(),valveBody,new b2Vec2(anchorPos.x, anchorPos.y));
	valveJointDef.userData = {jointName : "ValveJoint"};	
	b2.world.CreateJoint(valveJointDef);		



	// Create Flippers
	// LFlipper
	var LFlipperPolyPoints = [];
	LFlipperPolyPoints[2] = [-58, -65];
	LFlipperPolyPoints[1] = [-80, -31];
	LFlipperPolyPoints[0] = [0, 0];
	LFlipperPolyPos = [180,500];
	
	var LFlipperSd = new b2CircleDef();
	var LFlipperBd = new b2BodyDef();
	
	LFlipperSd.radius = pixelToB2dCoords(20, 0).x;
	var LFlipperPos = pixelToB2dCoords(110, 452);
	LFlipperBd.allowSleep = false;
	LFlipperBd.position.Set(LFlipperPos.x, LFlipperPos.y);
	var LFlipperCircleBody = b2.world.CreateBody(LFlipperBd);
	LFlipperCircleBody.CreateShape(LFlipperSd);
	var LFlipperPolyBody = createPoly(b2.world, LFlipperPolyPos[0], LFlipperPolyPos[1], LFlipperPolyPoints, false, {drawShape:true, allowSleep:false, shapeName:"LFlipperPoly"});
	LFlipperPolyBody.SetMassFromShapes();
	LFlipperPolyBody.isBullet = true;
	var LFlipperJointDef = new b2RevoluteJointDef();
	
	LFlipperJointDef.Initialize(LFlipperPolyBody, LFlipperCircleBody, LFlipperCircleBody.m_xf.position);
	LFlipperJointDef.userData = {jointName : "LFlipper"};

//	LFlipperJointDef.upperAngle =  0.315 * b2Settings.b2_pi;
	LFlipperJointDef.upperAngle =  0.25 * b2Settings.b2_pi;
//	LFlipperJointDef.lowerAngle = -0.001;
	LFlipperJointDef.lowerAngle = 0.07;
	LFlipperJointDef.motorTorque = 0;
	LFlipperJointDef.motorSpeed = 0;
	LFlipperJointDef.enableLimit = true;
	LFlipperJointDef.enableMotor = true;
	
	gLFlipperJoint = b2.world.CreateJoint(LFlipperJointDef);	
	
	
	// RFlipper
	var RFlipperPolyPoints = [];
	RFlipperPolyPoints[1] = [62, -67];
	RFlipperPolyPoints[2] = [80, -31];
	RFlipperPolyPoints[0] = [0, 0];
	RFlipperPolyPos = [219,499];
	
	var RFlipperSd = new b2CircleDef();
	var RFlipperBd = new b2BodyDef();
	
	RFlipperSd.radius = pixelToB2dCoords(20, 0).x;
	var RFlipperPos = pixelToB2dCoords(288, 452);
	RFlipperBd.allowSleep = false;
	RFlipperSd.rotation = 1;
	RFlipperBd.position.Set(RFlipperPos.x, RFlipperPos.y);
	var RFlipperCircleBody = b2.world.CreateBody(RFlipperBd);
	RFlipperCircleBody.CreateShape(RFlipperSd);
	var RFlipperPolyBody = createPoly(b2.world, RFlipperPolyPos[0], RFlipperPolyPos[1], RFlipperPolyPoints, false, {drawShape:true, allowSleep:false, shapeName:"RFlipperPoly"});
	RFlipperPolyBody.SetMassFromShapes();
	var RFlipperJointDef = new b2RevoluteJointDef();
	
	RFlipperJointDef.Initialize(RFlipperPolyBody, RFlipperCircleBody, RFlipperCircleBody.m_xf.position);
	RFlipperJointDef.userData = {jointName : "RFlipper"};
;
	RFlipperJointDef.upperAngle =  0;
//	RFlipperJointDef.lowerAngle = -0.99;
	RFlipperJointDef.lowerAngle = -0.77;
	RFlipperJointDef.motorTorque = 0;
	RFlipperJointDef.motorSpeed = 0;
	RFlipperJointDef.enableLimit = true;
	RFlipperJointDef.enableMotor = true;
	
	gRFlipperJoint = b2.world.CreateJoint(RFlipperJointDef);
	
	// Trapezoid
	var TrapezoidPoints = [];
	TrapezoidPoints[3] = [0,0];
	TrapezoidPoints[2] = [0, 120];
	TrapezoidPoints[1] = [40, 80];
	TrapezoidPoints[0] = [40, 40];
	var TrapezoidPos = [20, 140];					
	var TrapezoidBody = createPoly(b2.world, TrapezoidPos[0], TrapezoidPos[1], TrapezoidPoints, true, {drawShape:false, shapeName:"Trapezoid"});

	// LFlipperBox
	var LFlipperUpperBoxPoints = [];
	LFlipperUpperBoxPoints[0] = [0,0];
	LFlipperUpperBoxPoints[1] = [52,28];
	LFlipperUpperBoxPoints[2] = [40,60];
	LFlipperUpperBoxPoints[3] = [0,60];
	var LFlipperUpperBoxPos = [42, 400];					
	var LFlipperUpperBoxBody = createPoly(b2.world, LFlipperUpperBoxPos[0], LFlipperUpperBoxPos[1], LFlipperUpperBoxPoints, true, {drawShape:false, shapeName:"LFlipperUpperBox"});

	var LFlipperLowerBoxPoints = [];
	LFlipperLowerBoxPoints[0] = [0,0];
	LFlipperLowerBoxPoints[1] = [40,0];
	LFlipperLowerBoxPoints[2] = [140,60];
	LFlipperLowerBoxPoints[3] = [0,60];
	var LFlipperLowerBoxPos = [42,460];					
	var LFlipperLowerBoxBody = createPoly(b2.world, LFlipperLowerBoxPos[0], LFlipperLowerBoxPos[1], LFlipperLowerBoxPoints, true, {drawShape:false, shapeName:"LFlipperLowerBox"});

	// RFlipperBox
	var RFlipperUpperBoxPoints = [];
	RFlipperUpperBoxPoints[0] = [0,-2];
	RFlipperUpperBoxPoints[1] = [0,60];
	RFlipperUpperBoxPoints[2] = [-40,60];
	RFlipperUpperBoxPoints[3] = [-58,28];
	var RFlipperUpperBoxPos = [358, 400];					
	var RFlipperUpperBoxBody = createPoly(b2.world, RFlipperUpperBoxPos[0], RFlipperUpperBoxPos[1], RFlipperUpperBoxPoints, true, {drawShape:false, shapeName:"RFlipperUpperBox"});


	var RFlipperLowerBoxPoints = [];
	RFlipperLowerBoxPoints[0] = [0,0];
	RFlipperLowerBoxPoints[1] = [0, 60];
	RFlipperLowerBoxPoints[2] = [-140, 60];
	RFlipperLowerBoxPoints[3] = [-40, 0];
	var RFlipperLowerBoxPos = [358, 460];					
	var RFlipperLowerBoxBody = createPoly(b2.world, RFlipperLowerBoxPos[0], RFlipperLowerBoxPos[1], RFlipperLowerBoxPoints, true, {drawShape:false, shapeName:"RFlipperLowerBox"});

	// ULTriangle
	var ULTrianglePoints = [];
	ULTrianglePoints[0] = [0,0];
	ULTrianglePoints[1] = [50,0];
	ULTrianglePoints[2] = [50,50];
	var ULTrianglePos = [330, 20];					
	var ULTriangleBody = createPoly(b2.world, ULTrianglePos[0], ULTrianglePos[1], ULTrianglePoints, true, {drawShape:false, shapeName:"URTriangle"});

	// URTriangle
	var URTrianglePoints = [];
	URTrianglePoints[0] = [0,0];
	URTrianglePoints[1] = [80,0];
	URTrianglePoints[2] = [0,80];
	var URTrianglePos = [20, 20];					
	var URTriangleBody = createPoly(b2.world, URTrianglePos[0], URTrianglePos[1], URTrianglePoints, true, {drawShape:false, shapeName:"ULTriangle"});

	// BallCatcherUpperBox
	var BallCatcherUpperBoxPoints = [];
	BallCatcherUpperBoxPoints[0] = [0,0];
	BallCatcherUpperBoxPoints[1] = [0,110];
	BallCatcherUpperBoxPoints[2] = [-60,110];
	BallCatcherUpperBoxPoints[3] = [-60,100];
	var BallCatcherUpperBoxPos = [360, 100];					
	var BallCatcherUpperBoxBody = createPoly(b2.world, BallCatcherUpperBoxPos[0], BallCatcherUpperBoxPos[1], BallCatcherUpperBoxPoints, true, {drawShape:false, shapeName:"BallCatcherUpperBox"});


	// BallCatcherLowerBox
	var BallCatcherLowerBoxPoints = [];
	BallCatcherLowerBoxPoints[0] = [0,0];
	BallCatcherLowerBoxPoints[1] = [32,0];
	BallCatcherLowerBoxPoints[2] = [32,34];
	BallCatcherLowerBoxPoints[3] = [0,34];
	var BallCatcherLowerBoxPos = [328,211];					
	var BallCatcherLowerBoxBody = createPoly(b2.world, BallCatcherLowerBoxPos[0], BallCatcherLowerBoxPos[1], BallCatcherLowerBoxPoints, true, {drawShape:false, shapeName:"BallCatcherLowerBox"});

	// BallCatcherLowerBoxAddon
	var BallCatcherLowerBoxAddonPoints = [];
	BallCatcherLowerBoxAddonPoints[0] = [0,0];
	BallCatcherLowerBoxAddonPoints[1] = [7,0];
	BallCatcherLowerBoxAddonPoints[2] = [7,15];
	BallCatcherLowerBoxAddonPoints[3] = [0,15];
	var BallCatcherLowerBoxAddonPos = [321,231];					
	var BallCatcherLowerBoxAddonBody = createPoly(b2.world, BallCatcherLowerBoxAddonPos[0], BallCatcherLowerBoxAddonPos[1], BallCatcherLowerBoxAddonPoints, true, {drawShape:false, shapeName:"BallCatcherLowerBoxAddon"});

	// BallCatcher
	var BallCatcherPoints = [];
	BallCatcherPoints[2] = [0,0];
	BallCatcherPoints[1] = [20,20];
	BallCatcherPoints[0] = [20,0];
	var BallCatcherPos = [308,212];					
	var BallCatcherBody = createPoly(b2.world, BallCatcherPos[0], BallCatcherPos[1], BallCatcherPoints, true, {drawShape:false, restitution:0, shapeName:"BallCatcher"});

	// LowerBumper
	var LowerBumperDef = new b2CircleDef();
	var LowerBumperRadius = pixelToB2dCoords(31, 0);
	LowerBumperDef.radius = LowerBumperRadius.x;
	LowerBumperDef.restitution = gBoardElementRestitution;
	LowerBumperDef.friction = gBoardElementFriction;
	LowerBumperDef.userData = {shapeName:"LowerBumper", drawShape:false};
	var LowerBumperBodyDef = new b2BodyDef();
//	LowerBumperBodyDef.AddShape(LowerBumperDef);
	var LowerBumperPos = pixelToB2dCoords(170,190)
	LowerBumperBodyDef.position.Set(LowerBumperPos.x, LowerBumperPos.y);
	var LowerBumperBody = b2.world.CreateBody(LowerBumperBodyDef);
	LowerBumperBody.CreateShape(LowerBumperDef);

	// UpperBumper
	var UpperBumperDef = new b2CircleDef();
	var UpperBumperRadius = pixelToB2dCoords(31, 0);
	UpperBumperDef.radius = UpperBumperRadius.x;
	UpperBumperDef.restitution = gBoardElementRestitution;
	UpperBumperDef.friction = gBoardElementFriction;
	UpperBumperDef.userData = {shapeName:"UpperBumper", drawShape:false};
	var UpperBumperBodyDef = new b2BodyDef();
//	UpperBumperBodyDef.AddShape(UpperBumperDef);
	var UpperBumperPos = pixelToB2dCoords(150,90)
	UpperBumperBodyDef.position.Set(UpperBumperPos.x, UpperBumperPos.y);
	var UpperBumperBody = b2.world.CreateBody(UpperBumperBodyDef);
	UpperBumperBody.CreateShape(UpperBumperDef);
	
	// RightBumper
	var RightBumperDef = new b2CircleDef();
	var RightBumperRadius = pixelToB2dCoords(31, 0);
	RightBumperDef.radius = RightBumperRadius.x;
	RightBumperDef.restitution = gBoardElementRestitution;
	RightBumperDef.friction = gBoardElementFriction;
	RightBumperDef.userData = {shapeName:"RightBumper", drawShape:false};
	var RightBumperBodyDef = new b2BodyDef();
//	RightBumperBodyDef.AddShape(RightBumperDef);
	var RightBumperPos = pixelToB2dCoords(250,130)
	RightBumperBodyDef.position.Set(RightBumperPos.x, RightBumperPos.y);
	var RightBumperBody = b2.world.CreateBody(RightBumperBodyDef);
	RightBumperBody.CreateShape(RightBumperDef);

	// Launcher
	var launcher = new b2PolygonDef();
	ext = pixelToB2dCoords(7.5, 30);
	launcher.SetAsBox(ext.x, ext.y);
	launcher.userData = {
		drawShape: true,
		shapeName: "launcher"
	};
	launcher.density = 1;
	launcher.restitution = gBoardElementRestitution;
	groundBd = new b2BodyDef();
	pos = pixelToB2dCoords(370, 400);
	groundBd.position.Set(pos.x, pos.y);
	groundBd.allowSleep = false;
	var launcherBody = b2.world.CreateBody(groundBd);
	launcherBody.CreateShape(launcher);
	launcherBody.density = .1;
	launcherBody.SetMassFromShapes();
	
	LauncherJoint = new b2PrismaticJointDef();
	var LJAnchorPoint = pixelToB2dCoords(369,400);
//	LauncherJoint.anchorPoint = new b2Vec2(LJAnchorPoint.x, LJAnchorPoint.y);
	
	LauncherJoint.Initialize(launcherBody, b2.world.GetGroundBody(), 
							new b2Vec2(LJAnchorPoint.x, LJAnchorPoint.y), new b2Vec2(0, -1));
//	LauncherJoint.body2 = b2.world.GetGroundBody();
//	LauncherJoint.body1 = launcherBody;
//	LauncherJoint.axis = new b2Vec2(0, -1);
	var LJTransLimit = pixelToB2dCoords(70,-51);
	LauncherJoint.upperTranslation = LJTransLimit.x;
	LauncherJoint.lowerTranslation = LJTransLimit.y;
	LauncherJoint.enableLimit = true;
	LauncherJoint.enableMotor = true;
	LauncherJoint.motorForce = 1000;
	LauncherJoint.motorSpeed = 1000;
	gLauncherJoint = b2.world.CreateJoint(LauncherJoint);
}


function createPoly (world, x, y, points, fixed, userData) {
	var polySd = new b2PolygonDef();
	if (!fixed) polySd.density = 5.0;
	polySd.vertexCount = points.length;
	polySd.userData = userData;
	if (userData.restitution != undefined) {
		polySd.restitution = userData.restitution;
	}
	for (var i = 0; i < points.length; i++) {
		var point = pixelToB2dCoords(points[i][0], points[i][1]);
		polySd.vertices[i].Set(point.x, point.y);
	}
	var polyBd = new b2BodyDef();
	if (userData != null && userData.allowSleep == false) {
		polyBd.allowSleep = false;
	}
//	polyBd.AddShape(polySd);
	var pos = pixelToB2dCoords(x, y);
	polyBd.position.Set(pos.x, pos.y);	
	var body = world.CreateBody(polyBd);
	body.CreateShape(polySd);
	return body;
};

