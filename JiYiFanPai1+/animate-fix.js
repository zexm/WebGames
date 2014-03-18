/*
 * by zhangxinxu(.com) 2012-10-30
 * 让不支持CSS3 animation的浏览器向下兼容效果
*/

var BROWSER = function() {
	var ua = navigator.userAgent.toLowerCase();

	var match = /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) ||
		[];

	return { browser: match[1] || "", version: match[2] || "0" };
}();

if ((BROWSER.animate = (BROWSER.browser !== "mozilla" && BROWSER.browser !== "webkit"))) {
	// 不是目标浏览器，创建CSS向下兼容
	var oStyle = document.createElement("style"), cssText = ".out{display:none!important;}";
	oStyle.type = "text/css";
	if (BROWSER.browser === "msie") {
		oStyle.styleSheet.cssText = cssText;
	} else {
		oStyle.innerHTML = cssText;
	}	
	document.getElementsByTagName("head")[0].appendChild(oStyle);
}