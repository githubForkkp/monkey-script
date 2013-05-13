// ==UserScript==
// @name        Sourcediff
// @namespace   detail.setup
// @include     http://detail.tmall.com/item.htm*
// @version     1
// @grant GM_xmlhttpRequest
// ==/UserScript==
// if(!GM_xmlhttpRequest){
//   alert("GM_xmlhttpRequest is not defined.")
//   return;
// }

var win = unsafeWindow || window;
var  actual_host = "http://detail1.pre.tmall.com/item.htm"+ win.location.search;

// 对比方法
function runDiff(actual_source){
  //document.body.innerHTML = diffString(original_source,actual_source);
  //实例化DOMParser并将actual_source转换为dom对象
  var vParser = new DOMParser();
  //var dom1 = vParser.parseFromString(original_source,"text/html");
  var dom2 = vParser.parseFromString(actual_source,"text/html");
  //node filterFunction
  function ElementChecker (node) {
            if (node.id || node.className) {
                return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
        }

  //当前页面dom的walker
  var treeWalker_first = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_ELEMENT,
  ElementChecker,
  false
  );
 
var nodeList_first = [];
 
while(treeWalker_first.nextNode()) nodeList_first.push(treeWalker_first.currentNode);



// 比较页面dom的walker
var treeWalker_second = dom2.createTreeWalker(
  dom2.body,
  NodeFilter.SHOW_ELEMENT,
  ElementChecker,
  false
);
 
var nodeList_second = [];
 
while(treeWalker_second.nextNode()) nodeList_second.push(treeWalker_second.currentNode);
// var length = nodeList_first.length <= nodeList_second.length ? nodeList_first.length : nodeList_second.length

for(var i = 0;i <= nodeList_first.length - 1;i++){
  for (var j in nodeList_second) {
      // 两DOM对象中id相同的进行比较
      if( nodeList_first[i].id !== "" && nodeList_first[i].id == nodeList_second[j].id ){
        // 节点都有子节点
        if(nodeList_first[i].childElementCount>0 && nodeList_second[j].childElementCount>0){
          // 节点下有text文本，要比较
          if (nodeList_first[i].text && nodeList_second[j].text ) {
            if (nodeList_first[i].text !== nodeList_second[j].text) {
              console.info("green",i,nodeList_first[i],j,nodeList_second[j])
              nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].text+"\n预期："+nodeList_second[j].text)
              nodeList_first[i].setAttribute('style','background:green')
              delete nodeList_second[j];
              break;
            }
            delete nodeList_second[j];
            break;
          }
          //其中一个没有文本
          else if (nodeList_first[i].text && !nodeList_second[j].text){
            console.info("second没有文本",nodeList_first[i],nodeList_second[j])
            nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].text+"\n预期："+nodeList_second[j].text)
            nodeList_first[i].setAttribute('style','background:green')
            delete nodeList_second[j];
            break;
          }
          else if(!nodeList_first[i].text && nodeList_second[j].text){
            console.info("first没有文本",nodeList_first[i],nodeList_second[j])
            nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].text+"\n预期："+nodeList_second[j].text)
            nodeList_first[i].setAttribute('style','background:green')   
            delete nodeList_second[j];
            break;
          }
          // 节点下只有1个子节点时，还需要对比下outerHtml
          else if (nodeList_first[i].childElementCount ==1 && nodeList_second[j].childElementCount ==1 
            && nodeList_first[i].children.item(0).childElementCount + nodeList_second[j].children.item(0).childElementCount ==0) 
          {
 
          if(nodeList_first[i].outerHTML !== nodeList_second[j].outerHTML){
            console.info("purple",nodeList_first[i],nodeList_second[j]);
            nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].outerHTML+"\n预期："+nodeList_second[j].outerHTML)
            nodeList_first[i].setAttribute('style','background:purple')
            
            delete nodeList_second[j];
            break;
          }
          delete nodeList_second[j];
          break;
        }
        
        }

        // 该节点都没有子节点
        else if (nodeList_first[i].childElementCount + nodeList_second[j].childElementCount ==0) {
          if(nodeList_first[i].outerHTML !== nodeList_second[j].outerHTML){
            console.info("purple",nodeList_first[i],nodeList_second[j]);
            nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].outerHTML+"\n预期："+nodeList_second[j].outerHTML)
            nodeList_first[i].setAttribute('style','background:purple')
            
            delete nodeList_second[j];
            break;
          }
          delete nodeList_second[j];
          break;
        }
        // 其中一个节点没有子节点
        else if (nodeList_first[i].childElementCount + nodeList_second[j].childElementCount >0){
            console.info("orange",nodeList_first[i],nodeList_second[j]);
            nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].outerHTML+"\n预期："+nodeList_second[j].outerHTML)
            nodeList_first[i].setAttribute('style','background:orange');
            
            delete nodeList_second[j];
            break;
        }
        
      }
      // 扩展到class属性相同进行比较
      else if( nodeList_first[i].className !== "" && nodeList_first[i].className == nodeList_second[j].className
        && !checkPosition(nodeList_first[i],nodeList_second[j]) && nodeList_first[i].tagName == nodeList_second[j].tagName)
      {

        // 节点都有子节点
        if(nodeList_first[i].childElementCount>0 && nodeList_second[j].childElementCount>0){
          // 节点下有text文本，要比较
          
          if (nodeList_first[i].text && nodeList_second[j].text && nodeList_first[i].childElementCount !==1) {
            if (nodeList_first[i].text !== nodeList_second[j].text) {
              console.info("green",i,nodeList_first[i],j,nodeList_second[j]);
              nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].text+"\n预期："+nodeList_second[j].text);
              nodeList_first[i].setAttribute('style','background:green');
              
              delete nodeList_second[j];
              break;
            }
            
            delete nodeList_second[j];
            break;
          }
          
          //其中一个没有文本
          else if (nodeList_first[i].text && !nodeList_second[j].text){
            nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].text+"\n预期："+nodeList_second[j].text);
            nodeList_first[i].setAttribute('style','background:green');
            console.info("预期页没有文本",nodeList_first[i],nodeList_second[j]);
            
            delete nodeList_second[j];
            break;
          }
          else if(!nodeList_first[i].text && nodeList_second[j].text){
            nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].text+"\n预期："+nodeList_second[j].text);
            nodeList_first[i].setAttribute('style','background:green');
            console.info("当前页没有文本",nodeList_first[i],nodeList_second[j]);
            
            delete nodeList_second[j];
            break;
          }
          // 节点下只有1个子节点且没有text属性时，还需要对比下outerHtml
          else if (nodeList_first[i].childElementCount ==1 && nodeList_second[j].childElementCount ==1 
            && nodeList_first[i].children.item(0).childElementCount + nodeList_second[j].children.item(0).childElementCount ==0) 
          {
 
          if(nodeList_first[i].outerHTML !== nodeList_second[j].outerHTML){
            console.info("purple",nodeList_first[i],nodeList_second[j]);
            setTips(nodeList_first[i])
            nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].outerHTML+"\n预期："+nodeList_second[j].outerHTML);
            nodeList_first[i].setAttribute('style','background:purple');
            delete nodeList_second[j];
            break;
          }
          
          delete nodeList_second[j];
          break;
        }
        }
        // 该节点都没有子节点
        else if (nodeList_first[i].childElementCount + nodeList_second[j].childElementCount ==0 
          && nodeList_first[i].textContent == nodeList_second[j].textContent) {
          if(nodeList_first[i].outerHTML !== nodeList_second[j].outerHTML){
            console.info("purple",nodeList_first[i],nodeList_second[j]);
            setTips(nodeList_first[i])
            nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].outerHTML+"\n预期："+nodeList_second[j].outerHTML);
            nodeList_first[i].setAttribute('style','background:purple');
            delete nodeList_second[j];
            break;
          }
          
          delete nodeList_second[j];
          break;
        }
        // 其中一个节点没有子节点
        else if (nodeList_first[i].childElementCount + nodeList_second[j].childElementCount >0 && checkPosition(nodeList_first[i],nodeList_second[j])){
            console.info("orange",nodeList_first[i],nodeList_second[j]);
            nodeList_first[i].setAttribute('title',"当前："+nodeList_first[i].outerHTML+"\n预期："+nodeList_second[j].outerHTML);
            nodeList_first[i].setAttribute('style','background:orange');
            delete nodeList_second[j];
            break;
        }

      }
      // 如果在同一个位置classname不相等
      // else if( nodeList_first[i].className !== "" && nodeList_first[i].className !== nodeList_second[j].className
      //   && checkPosition(nodeList_first[i],nodeList_second[j]) && nodeList_first[i].tagName == nodeList_second[j].tagName)
      // { 

      // }
      // 没有id相等的情况
      else{
        continue;
      }
  }
  }
  // 把dom1.body塞到当前页中 
  //win.document.body.outerHTML = dom1.body.outerHTML;
}


// document.onreadystatechange = function(){
  
   // if (document.readyState == "complete") {
  //用跨域方法  
      // GM_xmlhttpRequest({
      //       method: 'GET',
      //       url: document.location.href,
      //       overrideMimeType: 'text/html; charset=' + document.characterSet,
      //       onload: function(html1){
      //       GM_xmlhttpRequest({
      //       method: 'GET',
      //       url: actual_host,
      //       overrideMimeType: 'text/html; charset=' + document.characterSet,
      //       onload: function(html2){

      //         runDiff(html1.responseText,html2.responseText);
              
      //       }

      //         })
            
      //       }
      //     })

      /* 
      *如果直接新开窗口拿innerHTML可以解决初始化渲染的问题，但新开窗口体验不好。
      */
      var win2 = win.open(actual_host);
      
      
      document.onreadystatechange = function(){

            if (document.readyState == "complete") {
              setTimeout(
                    function setHtml2(){
                    var outerHTML_2 = win2.document.body.outerHTML;
                    runDiff(outerHTML_2);
              },2000);
            }}
      

//   }
// }

// 获取节点的位置
function checkPosition(node1,node2){
  if(node1.getBoundingClientRect().left == node2.getBoundingClientRect().left 
            && node1.getBoundingClientRect().top == node2.getBoundingClientRect().top)
  {
    return true;
  }else{
    return false;
  }
}
// 处理结果
function doStyle(node1,node2){
  node1.setAttribute('title',"当前："+node1.outerHTML+"\n预期："+node2.outerHTML);

}

// 对比逻辑
// function doDiff(i,j){
//     }



// 设置气泡样式
function setTips(node){
    win.$(node).qtip({
               content:"此处有不同。"+escape(node.outerHTML), // Set the tooltip content to the current corner
                show: {
                  when: false, // Don't specify a show event
                  ready: true
               },
               hide: false, // Don't specify a hide event
               style: {
                  border: {
                     width: 5,
                     radius: 10
                  },
                  padding: 10, 
                  textAlign: 'center',
                  tip: true, // Give it a speech bubble tip with automatic corner detection
                  name: 'blue'// Style it according to the preset 'cream' style
               }
            });

}

win.$('.qtip\\ qtip-cream\\ qtip-active').css("z-index","9999999");



function escape(s) {
    var n = s;
    n = n.replace(/&/g, "&amp;");
    n = n.replace(/</g, "&lt;");
    n = n.replace(/>/g, "&gt;");
    n = n.replace(/"/g, "&quot;");

    return n;
}





