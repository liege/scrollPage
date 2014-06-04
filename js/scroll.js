/*
 *Author: liege
 *Email: liegemove@live.com
 *Date: 2014-6-4 18:41:14
 *gitHub:
 *remark:兼容IE6+及标准浏览器，支持扩展内容模块（div class="module"）,扩展模块为黑色时，可添加data-color="black"
 */
$(function(){	
	$("html").css("overflow","hidden");
	var $wrap = $("#container"),
		$allModule = $('[data-scroll="module"]'),
		$ContModule = $wrap.find(".module"),
		$ContModule_height = 0,
		$progress = $("#progress_nav");
		page = 0,
		timer=null;
	autoSize();
	$wrap.css("position","absolute");
	//拷贝导航内容到副本导航
	$("#header").find(".container").eq(0)
	.clone().appendTo($("#cloneMenu"))
	.find(".logo").html("");
	//.html($cont).find(".logo").html("");
	//设置内容模块高度为浏览器窗口高度
	function autoSize(){
		$ContModule_height = $(window).height();
		$ContModule.css("height",$ContModule_height);
	};
	$(window).resize(function(){
		//缩放浏览器时，重置模块高度
		autoSize();	 
		//缩放浏览器时，重置模块位置
		//如果当前显示的是内容模块
		if(page>1&&page<$allModule.size()-1){  
			$wrap.css("top",-(page-1)*$ContModule_height-$allModule.eq(0).height()+"px");  
		 }
		 //如果是最后一个模块
		 if(page==$allModule.size()-1){
			$wrap.css("top",-($allModule.size()-3)*$ContModule_height-$allModule.eq(0).height()-$allModule.eq(-1).height()+"px");
		 }
	});
	//鼠标滚轮事件
	$(document).on("mousewheel",function(event, delta){  	
		if(page==0&&delta==1){ 
			return;
		}
		if(page==$allModule.size()-1 && delta == -1){
			return;
		}
		//连续滚动时，清除上次滚动触发的定时器
		window.clearTimeout(timer);
		//滚动停止后，延迟0.4秒执行动画
		effect($ContModule.eq(page).find("p"));
		timer = window.setTimeout(function(){
			var h;
			if(page==1&&delta==1){
			//当往上滚动（delta==1）快翻到头部时（page ==1），滑动的距离设置为头部高度						
				h = $allModule.eq(page-1).height();
				$("#cloneMenu").slideUp();
			}else if(page==$allModule.size()-2&&delta==-1){
			//当往下滚动（delta==-1）快翻到底部时（page ==$allModule.size()-2），滑动的距离设置为头部高度						
				h = $allModule.eq(page+1).height();
			}else{
				h = $allModule.eq(page).height();
				$("#cloneMenu").slideDown(300);
			}
		
			//调用滚动函数
			scroll(delta,h);
		},400);
	});
	//鼠标滚动后执行函数，参数delta为滚动方向，参数height为滚动距离
	function scroll(delta,height){
		var top = $wrap.position().top;		
		//往下
		if(delta==-1){
			page++;
			top-=height;
			$wrap.stop().animate({"top":top+"px"},{
                easing: "easeInOutExpo",
                duration: 1000});	
		}
		//往上
		if(delta==1){
			page--;
			top+=height;
			$wrap.stop().animate({"top":top+"px"},{
                easing: "easeInOutExpo",
                duration: 1000});
		}
		//黑色模块变黑，其他模块变白
		if($ContModule.eq(page-1).data("color")){
			$("#cloneMenu").animate({"opacity":"0"},500).animate({"opacity":"0.95"},500).addClass("black_bg");
		}else{
			$("#cloneMenu").removeClass("black_bg");
		}			
		//点击切换按钮
		if(!page || page>$allModule.size()-2){
			$progress.hide();
		}else{
			$progress.show();
		}
		//进度条样式设置
		$progress.find("li").eq(page-1).addClass("current")
		.find("a").animate({"width":"8px","height":"8px"},500)
		.end().siblings().removeClass("current")
		.find("a").animate({"width":"6px","height":"6px"},500);
		// document.title = "page:"+page;			
	}
	//点击切换内容
	$progress.find("li").click(function(){
		var index = $(this).index()+1;
		var p = page;
		if(index>page){
			page = index-1;	
			scroll(-1, $ContModule_height*(index-p));	//jump(page,"down")
		}
		if(index<page){
			page = index+1;
			scroll(1, $ContModule_height*(p-index));	
		}	
	});
	//文字动画
	function effect(obj){
		// var val = obj.position().top;
		var oldVal = obj.height();
		obj.css({"bottom":-oldVal+"px","opacity":"0"});
		obj.fadeTo(1000,1).animate({"bottom":"10%"},500);
	}
//第三方缓动扩展	
$.easing.jswing=$.easing.swing;
jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});

});