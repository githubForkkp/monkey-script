// ==UserScript==
// @name        写评价
// @namespace   detail.setup
// @match     http://detail.daily.tmall.net/rate/rate_detail.htm*
// @match    http://detail.tmall.com/rate/rate_detail.htm*
// @version     1
// ==/UserScript==

var win = unsafeWindow || window;
function matchNode(xpath, context) {
	return document.evaluate(context ? (xpath.indexOf('.') == 0 ? xpath : '.'
			+ xpath) : xpath, context || document, null,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
}

document.onreadystatechange = function(){

	if (document.readyState == "complete") {
		// 宝贝价格
		var price = matchNode('//strong[@id = "J_StrPrice"]/text()').snapshotLength;
		// 运费
		var yunfei = matchNode('//li[@class = "tb-delivery tm-clear"]').snapshotItem(0);
		// 月销量
		var sold = matchNode('//em[@class = "J_MonSalesNum"]/text()');
		// 累计评价
		var rate = matchNode('//a[@id = "J_MallReviewTabTrigger"]/em/text()').snapshotItem(0);
		// 购买时间提示
		var tips = matchNode('//div[@class = "ui-msg-con ui-msg-tip"]').snapshotLength;


		// 基本校验
		console.info("运费为：" + yunfei.childNodes.item(2).textContent)
		if( price == 0 || tips == 0){
			console.info("基本信息区域展示有问题！！")
		}

		// 判断评价数
		
		var tab_rate = matchNode('//em[@class = "J_ReviewsCountNum"]/text()').snapshotItem(0);
		if (tab_rate && (rate.data !== tab_rate.data)) {
			console.info("tab处评价数不一致");
		}

		// 判断月销量
		for(var i=0;i<1;i++){
			
			if(sold.snapshotItem(i).data !== sold.snapshotItem(i + 1).data)
			{
				console.info("成交记录数量展示有问题！！");
			}
		}
		
	}
}
	



