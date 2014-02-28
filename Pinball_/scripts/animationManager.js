

function AnimationManager(canvasContext)
{
	this.animationsInProgress = new Array();
	
	this.canvas = canvasContext;	
	this.defaultAnimationDuration = 15;
			
}

AnimationManager.AnimationTypes = {
	LeftTramp		: 0,
	RightTramp		: 1,
	UpperBumper		: 2,
	RightBumper		: 3,
	LowerBumper		: 4,
	ULTriangle		: 5,
	Trapezoid		: 6,
	CatcherBox		: 7
}

AnimationManager.prototype.DoAnimation = function (animationType)
{
	this.animationsInProgress[animationType] = this.defaultAnimationDuration;	
}

AnimationManager.prototype.Draw = function ()
{
	var ctx = this.canvas;


	
	if (this.animationsInProgress[AnimationManager.AnimationTypes.LeftTramp] != undefined &&
		this.animationsInProgress[AnimationManager.AnimationTypes.LeftTramp] > 0) {
		ctx.save();
		ctx.strokeStyle = "rgba(100,100,100," + 
						this.animationsInProgress[AnimationManager.AnimationTypes.LeftTramp] /
						this.defaultAnimationDuration
						 + ")";
		ctx.lineWidth = 2.0;
		
		ctx.beginPath();
		ctx.moveTo(89, 322);
		ctx.lineTo(101, 295);
		ctx.moveTo(105, 352);
		ctx.lineTo(138, 328);
		ctx.moveTo(125, 378);
		ctx.lineTo(170, 375);
		ctx.stroke();					
		ctx.restore();		
		this.animationsInProgress[AnimationManager.AnimationTypes.LeftTramp]--;
	}
	if (this.animationsInProgress[AnimationManager.AnimationTypes.RightTramp] != undefined &&
		this.animationsInProgress[AnimationManager.AnimationTypes.RightTramp] > 0) {
		ctx.save();
		ctx.strokeStyle = "rgba(100,100,100," + 
						this.animationsInProgress[AnimationManager.AnimationTypes.RightTramp] /
						this.defaultAnimationDuration
						 + ")";
		ctx.lineWidth = 2.0;
		
		ctx.beginPath();
		ctx.moveTo(269, 393);
		ctx.lineTo(235, 385);
		ctx.moveTo(290, 356);
		ctx.lineTo(252, 344);
		ctx.moveTo(307, 319);
		ctx.lineTo(280, 293);
		ctx.stroke();					
		ctx.restore();		
		this.animationsInProgress[AnimationManager.AnimationTypes.RightTramp]--;
	}

	if (this.animationsInProgress[AnimationManager.AnimationTypes.CatcherBox] != undefined &&
		this.animationsInProgress[AnimationManager.AnimationTypes.CatcherBox] > 0) {
		ctx.save();
		ctx.strokeStyle = "rgba(100,100,100," + 
						this.animationsInProgress[AnimationManager.AnimationTypes.CatcherBox] /
						this.defaultAnimationDuration
						 + ")";
		ctx.lineWidth = 2.0;
		
		ctx.beginPath();
		ctx.moveTo(306,176);
		ctx.lineTo(280,176);
		ctx.moveTo(321,150);
		ctx.lineTo(303,130);
		ctx.moveTo(337,126);
		ctx.lineTo(322,92);
		ctx.stroke();					
		ctx.restore();		
		this.animationsInProgress[AnimationManager.AnimationTypes.CatcherBox]--;
	}
		
	if (this.animationsInProgress[AnimationManager.AnimationTypes.ULTriangle] != undefined &&
		this.animationsInProgress[AnimationManager.AnimationTypes.ULTriangle] > 0) {
		ctx.save();
		ctx.strokeStyle = "rgba(100,100,100," + 
						this.animationsInProgress[AnimationManager.AnimationTypes.ULTriangle] /
						this.defaultAnimationDuration
						 + ")";
		ctx.lineWidth = 2.0;
		
		ctx.beginPath();
		ctx.moveTo(42,89);
		ctx.lineTo(47,127);
		ctx.moveTo(65, 75);
		ctx.lineTo(92,98);
		ctx.moveTo(88,55);
		ctx.lineTo(117,74);
		ctx.stroke();					
		ctx.restore();		
		this.animationsInProgress[AnimationManager.AnimationTypes.ULTriangle]--;
	}
		
	if (this.animationsInProgress[AnimationManager.AnimationTypes.UpperBumper] != undefined &&
		this.animationsInProgress[AnimationManager.AnimationTypes.UpperBumper] > 0) {
		ctx.save();
		ctx.strokeStyle = "rgba(100,100,100," + 
						this.animationsInProgress[AnimationManager.AnimationTypes.UpperBumper] /
						this.defaultAnimationDuration
						 + ")";
		ctx.lineWidth = 2.0;
		
		ctx.beginPath();

		ctx.moveTo(186,103);
		ctx.lineTo(203,110);

		ctx.moveTo(162,127);
		ctx.lineTo(172,141);

		ctx.moveTo(138,125);
		ctx.lineTo(126,138);

		ctx.moveTo(115,102);
		ctx.lineTo(105,105);

		ctx.moveTo(122,62);
		ctx.lineTo(112,53);

		ctx.moveTo(145,57);
		ctx.lineTo(145,43);

		ctx.moveTo(161,57);
		ctx.lineTo(176,48);

		ctx.moveTo(180,76);
		ctx.lineTo(194,73);

		ctx.stroke();
		ctx.restore();		
		this.animationsInProgress[AnimationManager.AnimationTypes.UpperBumper]--;
	}
		
	if (this.animationsInProgress[AnimationManager.AnimationTypes.LowerBumper] != undefined &&
		this.animationsInProgress[AnimationManager.AnimationTypes.LowerBumper] > 0) {
		ctx.save();
		ctx.strokeStyle = "rgba(100,100,100," + 
						this.animationsInProgress[AnimationManager.AnimationTypes.LowerBumper] /
						this.defaultAnimationDuration
						 + ")";
		ctx.lineWidth = 2.0;
		
		ctx.beginPath();

		ctx.moveTo(206,204);
		ctx.lineTo(221,212);
		
		ctx.moveTo(190,227);
		ctx.lineTo(193,246);
		
		ctx.moveTo(155,227);
		ctx.lineTo(147,241);
		
		ctx.moveTo(136,211);
		ctx.lineTo(126,215);
		
		ctx.moveTo(135,179);
		ctx.lineTo(121,179);
		
		ctx.moveTo(154,159);
		ctx.lineTo(151,147);
		
		ctx.moveTo(181,153);
		ctx.lineTo(192,140);
		
		ctx.moveTo(202,165);
		ctx.lineTo(211,153);
		
		ctx.stroke();
		ctx.restore();		
		this.animationsInProgress[AnimationManager.AnimationTypes.LowerBumper]--;
	}
		
	if (this.animationsInProgress[AnimationManager.AnimationTypes.RightBumper] != undefined &&
		this.animationsInProgress[AnimationManager.AnimationTypes.RightBumper] > 0) {
		ctx.save();
		ctx.strokeStyle = "rgba(100,100,100," + 
						this.animationsInProgress[AnimationManager.AnimationTypes.RightBumper] /
						this.defaultAnimationDuration
						 + ")";
		ctx.lineWidth = 2.0;
		
		ctx.beginPath();

		ctx.moveTo(282,119);
		ctx.lineTo(300,119);
		
		ctx.moveTo(264,97);
		ctx.lineTo(273,83);
		
		ctx.moveTo(236,97);
		ctx.lineTo(226,83);
		
		ctx.moveTo(218,118);
		ctx.lineTo(204,114);
		
		ctx.moveTo(221,155);
		ctx.lineTo(216,166);
		
		ctx.moveTo(259,164);
		ctx.lineTo(253,182);
		
		ctx.moveTo(283,149);
		ctx.lineTo(295,157);
		
		ctx.stroke();
		ctx.restore();		
		this.animationsInProgress[AnimationManager.AnimationTypes.RightBumper]--;
	}
		
	
}
