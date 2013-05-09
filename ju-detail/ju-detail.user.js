// ==UserScript==
// @name        ju-detail
// @namespace   detail.setup
// @include     http://item.taobao.com/item.htm*
// @version     1
// ==/UserScript==
function matchNode(xpath, context) {
	return document.evaluate(context ? (xpath.indexOf('.') == 0 ? xpath : '.'
			+ xpath) : xpath, context || document, null,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
}
var checkStart = function(){
	var buy = matchNode('//a[@class = "J_ClickCatcher J_LinkBuy"]');
	if (buy.snapshotLength == 1) {
		buy.snapshotItem(0).click(this);
	};

}
window.addEventListener('load', checkStart , true);