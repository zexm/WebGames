void function() {
	var $ = {
		loaded : {},
		loadScript : function($, _) {
			_ = _ || document.getElementsByTagName("head")[0];
			var A = document.createElement("script");
			A.type = "text/javascript";
			A.src = $;
			_.appendChild(A)
		},
		loadImages : function(B, A) {
			var E = B.length, $ = 0, _ = function() {
				$++;
				if ($ == E)
					A()
			}, D = function(B) {
				var A = document.createElement("img"), $ = A.style;
				$.position = "absolute";
				$.left = $.top = "-10px";
				$.width = $.height = "1px";
				document.body.appendChild(A);
				A.onerror = A.onload = function() {
					this.onerror = this.onload = null;
					_()
				};
				A.src = B
			};
			for (var F = 0, C = B.length; F < C; F++)
				D(B[F])
		},
		conditionLoad : function($, _) {
			var A = this;
			this.listen($, function() {
				A.loadScript(_)
			})
		},
		listen : function(_, $) {
			_.interval = setInterval(function() {
				if (_()) {
					clearInterval(_.interval);
					$()
				}
			}, 16)
		}
	};
	window.loader = $;
	$.loadScript("scripts/lib.js");
	$.conditionLoad(function() {
		return window.Ucren && $.loaded.raphael
	}, "scripts/system.js");
	$.loadImages(["images/car.png", "images/cloud.jpg", "images/hill.gif", "images/mask.png", "images/pause.png", "images/covers/tree1.png", "images/covers/tree2.png", "images/covers/tree3.png", "images/covers/tree4.png", "images/covers/tree5.png", "images/covers/tree6.png", "images/speed-bg.gif", "images/speed-pointer.gif"], function() {
		$.loaded.images = true
	});
	$.conditionLoad(function() {
		return $.loaded.images && $.loaded.systemJS
	}, "scripts/main.js")
}()