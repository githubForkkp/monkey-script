// ==UserScript==
// @name        APIscript
// @namespace   detail.setup
// @description win.TShop._TMD_Config
// @include     http://detail1.pre.tmall.com/item.htm*
// @include     http://detail2.pre.tmall.com/item.htm*
// @include     http://detail.daily.tmall.net/item.htm*
// @include     http://detail.tmall.com/item.htm*
// @version     1
// ==/UserScript==

// 推荐使用unsafeWindow代替window

var win = unsafeWindow || window;
function matchNode(xpath, context) {
	return document.evaluate(context ? (xpath.indexOf('.') == 0 ? xpath : '.'
			+ xpath) : xpath, context || document, null,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
}

// 监听事件触发时执行
var checkDetail = function(){

	// 关注公共变量window.* 如：window.g_config
	var ks = win.KISSY,T;
	T = win.TShop;
	var txt="";
	// 根据url传参来控制开关
	var debug = 'detail-test' in ks.unparam(location.search.slice(1))
	var runCookie = 'cookie' in ks.unparam(location.search.slice(1))
	// 购物车对象
	var cart = matchNode('//a[@id = "J_LinkBasket"]').snapshotLength
	// 吊顶用户名位置
	var nickname = matchNode('//p[@id = "login-info"]/a/text()').snapshotItem(0);
	// TMD_config
	var config = T._TMD_Config;
	// 若支持taobaoBuy，则不展示购物车(tradeType:1 集市交易；2天猫交易)
	var tradeType = config.tradeType;
	

	if (tradeType !== 2){
		if (cart == 1){
			winAlert("\u96C6\u5E02\u4EA4\u6613\u4E0D\u652F\u6301\u8D2D\u7269\u8F66!!");
		}
	}
	// 验证宝贝买家是否不能看：config.itemDO.canView
	// 验证宝贝卖家是否不能看：config.detail.isItemAllowSellerView
	if (!config.itemDO.canView){
		winAlert('\u6B64\u5546\u54C1\u4E70\u5BB6\u4E0D\u80FD\u770B!!');

	}else if (!config.detail.isItemAllowSellerView) {
		winAlert('\u6B64\u5546\u54C1\u5356\u5BB6\u4E0D\u80FD\u770B!!');
	}
	
	
	// 全局变量：TB
	// 校验登录后吊顶展示用户名
	var tb = win.TB
	// cookie参数控制执行
	// if (runCookie) {	
	// 更新登录信息
	//tb.Global.updateLoginInfo();
	
	setTimeout(function(){
		if (tb.userInfo.isLogin) {
			// 吊顶用户名位置
			var nickname = matchNode('//a[@class="j_UserNick sn-user-nick"]/text()').snapshotItem(0);
			if(!nickname  || tb.userInfo.nick != nickname.wholeText){
				winAlert('\u540A\u9876\u7528\u6237\u540D\u9A8C\u8BC1\u5931\u8D25!!');
			}
			// 拿cookie值尝试校验（线上对nick进行了url编码）
			if(document.cookie.indexOf("login=true") == -1 || document.cookie.indexOf("login=true") == 0){
				winAlert('cookie \u672A\u540C\u6B65!!')
			}

		}},1200)

	//用于捕捉网页上的js报错
	
	win.onerror = function(msg,url,l){
		txt="本页中存在错误。\n\n"
		txt+="错误：" + msg + "\n"
		txt+="URL: " + url + "\n"
		txt+="行：" + l + "\n\n"
		txt+="点击“ok”继续。\n\n"
		if (document.readyState == "complete") {
		winAlert(txt);
		}
		//throw new Error("1111")
	}	
	
	// };
//最后清除监听器
window.removeEventListener('load', checkDetail , true);
console.info("API脚本执行结束")
}
window.addEventListener('load', checkDetail , true);

// 全局变量设置方法
// var getValue = function(n,v){var gmv=GM_getValue(n);return (gmv==undefined || gmv.length < 1) ? v : gmv;};
// var setValue = function(n,v){var gmv=GM_setValue(n,v);};
// GM_deleteValue('tradeType')

// 重写alert方法
function winAlert(msg){
	if (typeof jAlert != "undefined")
	{
		win.jAlert(msg,"警告！");
	}else{
		alert(msg);
	}
}
