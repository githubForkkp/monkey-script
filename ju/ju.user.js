// ==UserScript==
// @name        ju
// @namespace   detail.setup
// @include     http://ju.taobao.com/tg/home.htm*
// @version     1
// ==/UserScript==
function matchNode(xpath, context) {
	return document.evaluate(context ? (xpath.indexOf('.') == 0 ? xpath : '.'
			+ xpath) : xpath, context || document, null,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
}
var checkStart = function(){
		for (var i = 1;i <= 3;i++){
			var buy = matchNode('//a[@class ="buy J_BuySubmit"]');
			if (buy.snapshotLength == 1) {
				buy.snapshotItem(0).click(this);
				break;
			}
			else {
				window.location.reload(true);
			}
}
}
window.addEventListener('load', checkStart , true);