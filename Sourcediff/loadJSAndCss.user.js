// ==UserScript==
// @name        loadJSAndCss
// @namespace   detail.setup
// @include     http://detail1.pre.tmall.com/item.htm*
// @include     http://detail2.pre.tmall.com/item.htm*
// @include     http://detail.daily.tmall.net/item.htm*
// @include     http://detail.tmall.com/item.htm*
// @version     1
// ==/UserScript==
var win = unsafeWindow || window;

//	重写alert样式
loadJS('http://labs.abeautifulsite.net/archived/jquery-alerts/demo/jquery.js',function(){
	loadJS('http://labs.abeautifulsite.net/archived/jquery-alerts/demo/jquery.alerts.js',function(){
		loadJS('http://labs.abeautifulsite.net/archived/jquery-alerts/demo/jquery.ui.draggable.js',function(){
			loadJS('http://www.aspxcs.net/demo/x20110910/jquery.BubblePopup-1.1.min.js',function(){
				//console.log('Js has been loaded!')
			})
		})
	})
});
loadCSS('http://labs.abeautifulsite.net/archived/jquery-alerts/demo/jquery.alerts.css',function(){
	loadCSS('http://www.aspxcs.net/statics/css/web/demo.css',function(){
		//console.log('Css has been loaded!')
	})
	
});

// 气泡样式
loadJS('http://craigsworks.com/projects/qtip/packages/1.0.0-rc3/jquery.qtip-1.0.0-rc3.js',function(){

});

// load外部js方法
function loadJS(url, success) {
  var domScript = document.createElement('script');
  domScript.type= "text/javascript"; 
  domScript.src = url;
  success = success || function(){};
  domScript.onload = domScript.onreadystatechange = function() {
    if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
      success();
      this.onload = this.onreadystatechange = null;
      this.parentNode.removeChild(this);
    }
  }
  document.getElementsByTagName('head')[0].appendChild(domScript);
}


// load外部css
function loadCSS(url, success) {
  var domCss = document.createElement('link');
  domCss.type= "text/css"; 
  domCss.href = url;
  domCss.rel = "stylesheet";
  success = success || function(){};
  domCss.onload = domCss.onreadystatechange = function() {
    if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
      success();
      this.onload = this.onreadystatechange = null;
    }
  }
  document.getElementsByTagName('head')[0].appendChild(domCss);
}