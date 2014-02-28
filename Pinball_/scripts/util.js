/**
 * @author andyzei
 */

var gCoordinateScaleFactor = 20;

// Takes two points, or just a vector
function b2dToPixelCoords(xOrVector, y)
{
	var point = {x:0, y:0};

	if (y == undefined) { // it's a vector
		var vec = xOrVector;
		point.y = vec.y * gCoordinateScaleFactor; 
		point.x = vec.x * gCoordinateScaleFactor;
	}
	else { // it's two points
		var x = xOrVector;
		point.x = x * gCoordinateScaleFactor;
		point.y = y * gCoordinateScaleFactor;		
	}

	return point;			
}
function pixelToB2dCoords(xOrVector, y)
{
	var point = {x:0, y:0};

	if (y == undefined) { // it's a vector
		var vec = xOrVector;
		point.y = vec.y / gCoordinateScaleFactor; 
		point.x = vec.x / gCoordinateScaleFactor;
	}
	else { // it's two points
		var x = xOrVector;
		point.x = x / gCoordinateScaleFactor;
		point.y = y / gCoordinateScaleFactor;		
	}

	return point;			
}

function initWorld()
{	
	var b2 = gB2;
	
	// Set up the axis-aligned bounding box
	b2.aabb = new b2AABB();
	
	var minpoint = pixelToB2dCoords(-100, -100);
	var maxpoint = pixelToB2dCoords(1000, 1000);
	b2.aabb.lowerBound.Set(minpoint.x, minpoint.y);
	b2.aabb.upperBound.Set(maxpoint.x, maxpoint.y);
	
	b2.gravity = new b2Vec2(0, 11);
	b2.doSleep = true;
	
	// Create the world
	b2.world = new b2World(b2.aabb, b2.gravity, b2.doSleep);
	
	b2.toString = function() {
		return "Hi this is a b2 object!";		
		};

	initBoard();	
	debugLog("B2world sez: " + gB2);
}


function drawWorld(world, context) {
	for (var j = world.m_jointList; j; j = j.m_next) {
		// TODO: Fix joint drawing for b2d2.
		// drawJoint(j, context);
	}
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			drawShape(s, context);
		}
	}
}
function drawJoint(joint, context) {
	var b1 = joint.m_body1;
	var b2 = joint.m_body2;
	var x1 = b1.m_position;
	var x2 = b2.m_position;
	var p1 = joint.GetAnchor1();
	var p2 = joint.GetAnchor2();
	context.strokeStyle = '#00eeee';
	context.beginPath();
	switch (joint.m_type) {
	case b2Joint.e_distanceJoint:
		context.moveTo(p1.x, p1.y);
		context.lineTo(p2.x, p2.y);
		break;

	case b2Joint.e_pulleyJoint:
		// TODO
		break;

	default:
		if (b1 == gB2.world.m_groundBody) {
			context.moveTo(p1.x, p1.y);
			context.lineTo(x2.x, x2.y);
		}
		else if (b2 == gB2.world.m_groundBody) {
			context.moveTo(p1.x, p1.y);
			context.lineTo(x1.x, x1.y);
		}
		else {
			context.moveTo(x1.x, x1.y);
			context.lineTo(p1.x, p1.y);
			context.lineTo(x2.x, x2.y);
			context.lineTo(p2.x, p2.y);
		}
		break;
	}
	context.stroke();
}


function drawShape(shape, context) {
	if (shape.m_userData == null || shape.m_userData.drawShape != false) {
		context.strokeStyle = '#444444';
		context.beginPath();
		switch (shape.m_type) {
			case b2Shape.e_circleShape:{
				var circle = shape;
				//var pos = circle.m_position;
				//var r = circle.m_radius;
				
				var circlePos = circle.m_body.GetWorldCenter();
				
				var pos = b2dToPixelCoords(circlePos.x, circlePos.y);
				var r = b2dToPixelCoords(circle.m_radius, circle.m_radius).x;
				
				context.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
			/*				
			 
			 var segments = 16.0;
			 var theta = 0.0;
			 var dtheta = 2.0 * Math.PI / segments;
			 // draw circle
			 context.moveTo(pos.x + r, pos.y);
			 for (var i = 0; i < segments; i++) {
			 var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
			 var v = b2Math.AddVV(pos, d);
			 context.lineTo(v.x, v.y);
			 theta += dtheta;
			 }
			 context.lineTo(pos.x + r, pos.y);
			 
			 // draw radius
			 context.moveTo(pos.x, pos.y);
			 var ax = circle.m_R.col1;
			 var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
			 context.lineTo(pos2.x, pos2.y);
			 */
			}
break;
			case b2Shape.e_polygonShape:{
				var m_xf = shape.m_body.m_xf;
				var poly = shape;
				
				var tV = b2Math.AddVV(m_xf.position, b2Math.b2MulMV(m_xf.R, shape.m_vertices[0]));
				var tVp = b2dToPixelCoords(tV);
				context.moveTo(tVp.x, tVp.y);
				
				
				// Drawing hack for flippers
				var bDrawFlipper = false;
				if (shape.m_userData != undefined && (shape.m_userData.shapeName == "LFlipperPoly" || shape.m_userData.shapeName == "RFlipperPoly"))
				{
					bDrawFlipper = true;
				}
												
				for (var i = 0; i < poly.m_vertexCount; i++) {
					var v = b2Math.AddVV(m_xf.position, b2Math.b2MulMV(m_xf.R, shape.m_vertices[i]));
					var vp = b2dToPixelCoords(v);
					if (bDrawFlipper && i == 2) { // we don't want to close the flipper polygons.
						context.moveTo(vp.x, vp.y);
					}
					else {
						context.lineTo(vp.x, vp.y);
					}
				}
				context.lineTo(tVp.x, tVp.y);
			}
break;
		}
		context.stroke();
	}	
}



