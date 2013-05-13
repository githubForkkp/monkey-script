// ==UserScript==
// @name        detail-常用验证
// @namespace   detail.setup
// @include     http://detail1.pre.tmall.com/item.htm*
// @include     http://detail2.pre.tmall.com/item.htm*
// @include  	http://detail.tmall.com/item.htm*
// @include  	http://detail.tmall.com/venus/spu_detail.htm*
// @match     http://detail.daily.tmall.net/item.htm*
// @match     http://detail.daily.tmall.net/venus/spu_detail.htm*	
// @version     1	
// ==/UserScript==

// 推荐unsafeWindow代替window
var win = unsafeWindow || window;

function xpath(query) {
	return document.evaluate(query, document, null,
			XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}
function matchNode(xpath, context) {
	return document.evaluate(context ? (xpath.indexOf('.') == 0 ? xpath : '.'
			+ xpath) : xpath, context || document, null,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
}
		
// detail区块验证
document.onreadystatechange = function(){

	if (document.readyState == "complete") {
		
		var ks = win.KISSY, T;
		T = win.TShop;
		var config = T._TMD_Config;
		
		var header = document.getElementById('header');
		var script = document.getElementsByTagName('script');
		// 
		var Dianbaobao = matchNode('//div[@id = "dianbaobao"]').snapshotLength;
		// 编辑宝贝
		var edit = matchNode('//p[@id = "J_EditItem"]').snapshotLength;
		// 宝贝价格
		var price = matchNode('//strong[@id = "J_StrPrice"]/text()').snapshotLength;
		// 配送区域
		var postAge = matchNode('//a[@id =  "J_dqPostAgeCont"]').snapshotLength;
		var house = matchNode('//a[@id = "J_TreeSelectTrigger"]').snapshotLength;
		// 月销量
		var sold = matchNode('//li[@class = "tb-sold-out tb-clear J_MonSales"]').snapshotLength;
		var _sold = matchNode('//li[@class = "tb-sold-out tm-clear J_MonSales"]').snapshotLength;
		// 累计评价
		var rate = matchNode('//a[@id = "J_MallReviewTabTrigger"]').snapshotLength;
		// 服务承诺
		var service = matchNode('//dl[@class = "tb-serPromise clearfix"]').snapshotLength;
		var _service = matchNode('//dl[@class = "tb-serPromise tm-clear"]').snapshotLength;
		// 爱分享与收藏
		var ishare = matchNode('//div[@id = "tml-share-trigger"]').snapshotLength;
		var favorite = matchNode('//a[@id = "J_Favorite"]').snapshotLength;

		// 获取detail机器
		var server_id = matchNode('//div[@id = "server-num"]').snapshotItem(0);
		console.info(server_id.innerHTML)
		// 店铺优惠shoppromotion
		var shopPromotion = matchNode('//div[@id= "J_Shoppromotions"]').snapshotLength;
		// 搭配宝优惠
		var mealList = matchNode('//div[@id = "J_SaleCombo"]').snapshotLength;
		
	// 搭配宝优惠
	if(config.isTmallComboSupport && mealList == 0){
		winAlert("搭配宝优惠未展示！！！");
	}

// http请求验证 
// （同域）静态化缓存相关
    var dd= new ks.IO({
        url:win.location.href,
        success: function(){
            var Static = dd.getResponseHeader("X-Static-Cache");
                if (Static == "HIT" || Static == null)
    	   { 
    		  console.info(Static)
    	   }
    	       else{
    		console.info('\u672A\u8D70\u7F13\u5B58!!'+ Static)
    	   }
    
  }
});
// （跨域）属性分流验证,注意有50%分桶：对应bucket_id=1~9
// var ff = new ks.IO({
// 	url:"http://ald.taobao.com/recommend.htm",
// 	data:{
// 		"appId":"09001",
// 		"auctionId":win.TShop._TMD_Config.itemDO.itemId,
// 		'refer':document.referrer
// 	},
// 	dataType: "jsonp",
// 	success: function(data){
// 	data = data || [{}];
// 	// data = data[0];
// 	console.info(data);
//     // if (typeof data[0] != "undefined"){ 
//     	if (data.brandId)
//     	{ 
//     		var BrandAttr = matchNode('//div[@class = "brandLogo"]').snapshotLength;
//     		if(BrandAttr == 0){
//     			console.info('\u7C73\u6709\u5C5E\u6027\u5206\u6D41!!')
//     		}
    		
//     	}
//     // }
//     }
// })
// initExtensionApi接口店铺级优惠
var Extension = new ks.IO({
            url: config.initExtensionApi,
            dataType: "jsonp",
            success: function(d) {
                tuan = d;
                // 店铺级优惠对象
                if(tuan.shopPromotionDO.shopPromotion && shopPromotion == 0){
                    // 展示到商品详情tab下
                    // 有跨店优惠不展示
                    var shop = matchNode('//div[@id = "J_Shoppromotions"]').snapshotLength;
                    var act = matchNode('//div[@id= "J_Activity"]').snapshotLength;
                    if ( act == 1 || shop == 0) return;
                    winAlert("有店铺级优惠未展示！！！！！！")          	
                }
                // 搭配套餐优惠
				var mealResult = matchNode('//div[@id = "J_ComboData"]').snapshotLength;
                if (tuan.mealResult && mealResult == 0) {
                	winAlert("套餐优惠未展示！！！");
                };
                
            }
    });
// Mdskipinit接口获取对象
var wanrentuan = new ks.IO({
            url: config.initApi,
            dataType: "jsonp",
            success: function(d) {
                tuan = d;
                // 万人团对象
                if(tuan.defaultModel.itemPriceResultDO.wanrentuanInfo){
                    // 万人团不支持taobao交易
                    var tradeType = config.tradeType;
                    if (tradeType !== 2){
                        winAlert('\u4E07\u4EBA\u56E2\u4E0D\u652F\u6301taobaoBuy!!')
                    }
                    
                }
                // 优惠对象,针对无sku的商品
                if(tuan.defaultModel.itemPriceResultDO.priceInfo.def.promotionList){
                	var promotions = matchNode('//div[@id = "J_PromoBox"]')
                	if (!tuan.defaultModel.itemPriceResultDO.wanrentuanInfo && promotions.snapshotItem(0).innerHTML == "" ) {
                			console.info(tuan.defaultModel.itemPriceResultDO.priceInfo.def.promotionList)
                			winAlert("接口有优惠但没展示！！");
                		
                	};
                }
                // 月成交记录对象
                if(tuan.defaultModel.sellCountDO.sellCount > 0){
                	// setTimeout(win.scrollTo(0,200),1000)
                	var MonSalesNum = matchNode('//em[@class = "J_MonSalesNum"]')
                	var num = MonSalesNum.snapshotLength;
                	var result = [];
                	for(var i = 0;(i+1)<= num;i++){
                		if(MonSalesNum.snapshotItem(i).innerHTML == "0" || MonSalesNum.snapshotItem(i).innerHTML == ""){
                			result.push("第" + (i+1) + "个位置成交记录未展示！");
                		}
                		if((i+1)== num && result.length > 0){console.info(result);}
                	}
            	}
            	// 3c服务&家装服务
            	if(tuan.defaultModel.serviceDO){
            		var serviceDO = matchNode('//dl[@id = "J_regionSellServer"]').snapshotLength;
            		if (serviceDO == 0) {
            			switch(tuan.defaultModel.serviceDO.serviceType){
            				case "3c":// 3c服务 
            				console.info("3c服务未展示！！");
            				break;
            				case "house":// 家装服务
            				console.info("家装服务未展示！！");
            				break;
            			}
            		};

            	}
            }
    });

console.info("静态化脚本执行结束")


// 首屏区块验证
// 避免特殊情况-可能是找不到宝贝页面

var nofind = function(){
	if (edit == 0 && price == 0) {
			console.info("detail脚本执行结束（找不到宝贝）");
			return true;
		}
	}
// 避免特殊情况-商品可能是下架
var down = function(){
		if (postAge == 0 && _sold == 0 && rate == 0 ||house == 0 && _sold == 0 && rate == 0) {
			return true;
		}
	}

		if (price == 0) {
			// 处理拍卖
			if(T.isBid()) console.info("detail脚本执行结束（拍卖）");return;
			winAlert('\u4EF7\u683C\u5C55\u793A\u4E3A\u7A7A!!');
		}else if (!down && _service == 0 ) {
			// if(_service == 0){
				winAlert('\u670D\u52A1\u627F\u8BFA\u5C55\u793A\u533A\u7F3A\u5931!!');
		}


		if (!down && dit == 0) {
			winAlert('\u4E3E\u62A5\u7F16\u8F91\u5B9D\u8D1D\u8D85\u94FE\u63A5\u4E0D\u5B58\u5728!!');
		}

		if (!down && _sold == 0 ) {
			winAlert('\u6708\u9500\u91CF\u5C55\u793A\u533A\u7F3A\u5931!!');
		}

		if (!down && rate == 0) {
			winAlert('\u7D2F\u8BA1\u8BC4\u4EF7\u951A\u70B9\u7F3A\u5931!!');
		}
		
		if (favorite == 0) {
			winAlert('\u7231\u5206\u4EAB\u6536\u85CF\u533A\u57DF\u7F3A\u5931!!');
		}
		// if (Dianbaobao > 0){
		// winAlert('\u7535\u4FDD\u5305banner');
		// }
		
		if(config.isHouseholdService){
			if (house == 0) {
				winAlert('\u914D\u9001\u533A\u57DF\u63A7\u4EF6\u7F3A\u5931!!');
			}
			console.info("detail脚本执行结束（家装）");
			return;
		}else if(!down && postAge == 0){
			winAlert('\u914D\u9001\u533A\u57DF\u63A7\u4EF6\u7F3A\u5931!!')
		}
		// 车型导购项目
	if(config.skuCascadeMapString){
		var carModel = matchNode('//ul[@class = "tb-clearfix J_TSaleProp tb-carmodel"]').snapshotLength;
		if(carModel == 0){
			winAlert("车型宝贝无多级菜单")
		}
	}
console.info("detail脚本执行结束")


	}
}

// window.addEventListener('load', function() {
// var header = document.getElementById('header');
// var script = document.getElementsByTagName('script');
// var APIscript =
// matchNode('//div[@id="detail"]/script').snapshotItem(0).innerHTML;
// console.info(APIscript);
// APIscript.trim
//	
// // console.info(APIscript.snapshotItem[0].innerHTML);
// if (script.length) {
// winAlert("true");
// } else {
// winAlert("false");
// }
// }, true);

// function testLinks() {
	
// 	// window.location.href = window.location.href.replace(/^http:/, 'https:');

	// var allSrc = matchNode('//iframe')
	// var aa = allSrc.snapshotLength;
	// console.info(aa)
	// for ( var i = 0; i < aa; i++) {
	// 	thisDiv = allSrc.snapshotItem(i);
	// 	if(thisDiv == ""){
	// 		winAlert("src为空："+thisDiv);
	// 	}
	// 	console.info(thisDiv);
	// }

// }
// testLinks();
// 重写alert方法
function winAlert(msg){
	if (typeof jAlert != "undefined")
	{
		win.jAlert(msg,"警告！");
	}else{
		alert(msg);
	}
}