//swipe插件by linyz 2015-07-11
"use strict";
require("./swipe.css");
function extend(obj,opts){
	opts = opts || {};
	for(var i in opts){
		obj[i] = opts[i];
	}
	return obj;
}
var support = (function(){
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;
	//Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Mobile Safari/537.36
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);
	var isMobile = deviceIsAndroid || deviceIsIOS;
	return {
		deviceIsAndroid : deviceIsAndroid,
		deviceIsIOS : deviceIsIOS,
		isMobile : isMobile,
		touchEventNames : isMobile ? ["touchstart","touchmove","touchend","touchcancel"] : ["mousedown","mousemove","mouseup",""],
		transitionend : (function(){
			var el = document.createElement('div');
			var transEndEventNames = {
				WebkitTransition: 'webkitTransitionEnd',
				MozTransition: 'transitionend',
				OTransition: 'oTransitionEnd otransitionend',
				transition: 'transitionend'
			};
			for (var name in transEndEventNames) {
				if (el.style[name] !== undefined) {
					return transEndEventNames[name];
				}
			}
			return false;
		})(),
		transformName : 'transform' in document.documentElement.style ? 'transform' : 'webkitTransform'
	};
})();
//核心代码
function Swipe(el,options){
	this.el = typeof el == 'string' ? document.querySelector(el) : el;
	this.swipeData = {};
	this.curIndex = 0;
	this.options = extend({
		//滑动方向
		direction : "y",
		onTouchStart : null,
		onTouchEnd : null,
		//每次切换页后触发
		onChangeItem : function(inIndex,outIndex,inEl,inElInit,outEl){},
		//是否显示导航点
		dot : false,
		//导航点方向
		dotPosition : 'right',
		//是否自动播放
		autoPlay : false,
		//自动播放周期
		duration : 3000
	},options);
	this.transitioning = false;
	this.autoPlayInterval = null;
	this.itemLen = null;
	this.init();
}
extend(Swipe,{
	getPos : function(e){
		if(support.isMobile){
			var touch = e.changedTouches[0];
			return {
				x : touch.pageX,
				y : touch.pageY
			};
		}else{
			return {
				x : e.pageX,
				y : e.pageY
			};
		}
	},
	timeInterval : 400,
	swipeDistance : 30,
	hasParentNodeByCls : function(el,cls){
		if(el.tagName.toLowerCase() === 'body'){
			return el.classList.contains(cls) ? el : false;
		}
		var p = el.parentNode;
		while(p && p.tagName && p.tagName.toLowerCase() !== 'body'){
			if(p.classList.contains(cls)) return p;
			p = p.parentNode;
		}
		return false;
	},
	getChildren : function(el){
		var children = [];
		var nodes = el.childNodes;
		for(var i=0,ii;ii=nodes[i++];){
			ii.nodeType === 1 && children.push(ii);
		}
		return children;
	},
	prepend : function(pNode,el){
		var chs = Swipe.getChildren(pNode);
		pNode.insertBefore(el,chs[0]);
	}
});
var initTouchStart = false;
Swipe.prototype = {
	constructor : Swipe,
	//获取元素当前的translate值
	getTranslate : function(){
		var transform = this.el.querySelector(".swipe-inner").style[support.transformName];
    if(!transform){
    	return 0;
    }
    var match = transform.match(/\(.*\)/);
    var str = match[0];
    str = str.substring(1,str.length - 1);
    var match = str.split(",")[this.options.direction === 'y' ? 1 : 0].match(/\-?[0-9]+\.?[0-9]*/g);
    return +match[0];
	},
	setTranslate : function(value){
		this.el.querySelector(".swipe-inner").style[support.transformName] = this.options.direction === 'y' 
			? ('translate3d(0,'+value+'px,0)') : ('translate3d('+value+'px,0,0)');
	},
	setTranslateAnimate : function(value){
		this.transitioning = true;
		this.el.querySelector(".swipe-inner").classList.add("swipe-transition");
		this.setTranslate(value);
	},
	_move : function(e){
		var ePos = Swipe.getPos(e);
		var swipeData = this.swipeData;
		var sPos = swipeData.startPos;
		var direction = this.options.direction;
		var dd = ePos[direction] - sPos[direction];
		if((dd > 0 && this.curIndex === 0) || 
			(dd < 0 && this.curIndex === this.itemLen - 1)){
			dd = dd / 2;
		}
		// if(Math.abs(dd) > 0){
		// 	e.preventDefault();
		// }
		// if(direction === 'x'){
		// 	if(Math.abs(ePos.y - sPos.y) > 20){
		// 		return;
		// 	}
		// }
		this.setTranslate(swipeData.startD + dd);
	},
	_end : function(e){
		var endPos = Swipe.getPos(e);
		var data = this.swipeData;
		var dd = data.startPos[this.options.direction] - endPos[this.options.direction];
		var size = data.itemSize;
		if(+new Date - data.startTime > Swipe.timeInterval || Math.abs(dd) < Swipe.swipeDistance){
			if(Math.abs(dd) < size / 2){
				this.setTranslateAnimate(data.startD);
				this.goon();
				return;
			}
		}
		// if((this.curIndex === this.itemLen - 1 && dd > 0) || (this.curIndex === 0 && dd < 0)){
		// 	this.setTranslateAnimate(data.startD);
		// }else{
			
		// }
		this._swipeTo(this.curIndex + (dd > 0 ? 1 : -1));
		this.goon();
	},
	init : function(){
		var me = this;
		var swipeEl = this.el;
		swipeEl._swipe = this;
		swipeEl.classList.add("swipe-" + this.options.direction);
		var inner = swipeEl.querySelector(".swipe-inner");
		//复制头尾 实现循环轮播
		var chs = Swipe.getChildren(inner);
		var first = chs[0];
		var last = chs[chs.length - 1];
		inner.insertBefore(last.cloneNode(true),first);
		inner.appendChild(first.cloneNode(true));
		//更新inner的size
		this.updateItemLen();
		this._swipeToStatic(1);
		inner.addEventListener(support.transitionend,function(e){
			me.transitioning = false;
			e.preventDefault();
			e.stopPropagation();
			if(this.classList.contains("swipe-transition")){
				this.classList.remove('swipe-transition');
			}
			if(me.curIndex === me.itemLen - 1 || me.curIndex === 0){
				if(me.curIndex === 0){
					me.curIndex = me.itemLen - 2;
					me.setTranslate(-me.swipeData.itemSize * me.curIndex);
				}else{
					me.curIndex = 1;
					me.setTranslate(-me.swipeData.itemSize);
				}
			}
		});
		if(this.options.autoPlay){
			this._setAutoPlay(true);
		}
		if(!initTouchStart){
			initTouchStart = true;
			document.addEventListener(support.touchEventNames[0],function(e){
				var swipeEl = Swipe.hasParentNodeByCls(e.target,"swipe");
				if(!swipeEl){
					return;
				}
				me.options.onTouchStart && me.options.onTouchStart.call(me);
				// var tagName = e.target.tagName.toLowerCase();
				// if(tagName !== 'embed' && tagName !== 'iframe'){
				// 	e.preventDefault();
				// 	e.stopPropagation();
				// }
				var _swipe = swipeEl._swipe;
				_swipe.pause();
				if(_swipe.transitioning) {
					swipeEl.querySelector(".swipe-inner").classList.remove("swipe-transition");
					_swipe.transitioning = false;
				}
				var data = _swipe.swipeData;
				data.startPos = Swipe.getPos(e);
				data.startD = _swipe.getTranslate();
				if(me.curIndex === me.itemLen - 1){
					// console.log(data.startD);
					// console.log(data.itemSize);
					me.curIndex = 1;
					data.startD = -data.itemSize;
					me.setTranslate(-data.itemSize);
				}else if(me.curIndex === 0){
					me.curIndex = me.itemLen - 2;
					data.startD = -me.swipeData.itemSize * me.curIndex
					me.setTranslate(-me.swipeData.itemSize * me.curIndex);
				}
				data.startTime = +new Date;
				_swipe.updateItemSize();
				function move(e){
					_swipe._move(e);
				}
				function end(e){
					document.removeEventListener(support.touchEventNames[1],move);
					document.removeEventListener(support.touchEventNames[2],end);
					support.touchEventNames[3] && document.removeEventListener(support.touchEventNames[3],end);
					_swipe._end(e);
					me.options.onTouchEnd && me.options.onTouchEnd.call(me);
				}
				document.addEventListener(support.touchEventNames[1],move);
				document.addEventListener(support.touchEventNames[2],end);
				support.touchEventNames[3] && document.addEventListener(support.touchEventNames[3],end);
			});
		}
	},
	updateItemSize : function(){
		this.swipeData.itemSize = this.options.direction === 'y' ? this.el.offsetHeight : this.el.offsetWidth;
	},
	updateItemLen : function(){
		var newLen = Swipe.getChildren(this.el.querySelector(".swipe-inner")).length;
		if(this.itemLen === newLen) return;
		this.itemLen = newLen;
		this.el.querySelector(".swipe-inner").style[this.options.direction === 'y' ? "height" : "width"] = 
			this.itemLen * 100 + "%";
			//this.itemLen * (this.options.direction === 'y' ? this.el.offsetHeight : this.el.offsetWidth) + "px";
		if(this.options.dot){
			var len = this.itemLen;
			var html = [];
			for(var i=1;i<len-1;i++){
				html.push("<span class='swipe-nav-dot'></span>");
			}
			var el = this.el;
			var nav = el.querySelector(".swipe-nav");
			if(nav){
				nav.innerHTML = html.join("");
			}else{
				nav = document.createElement("div");
				nav.className = "swipe-nav swipe-nav-" + this.options.dotPosition;
				nav.innerHTML = html.join("");
				el.appendChild(nav);
			}
			this._toggleDot(0,true);
		}
	},
	_toggleDot : function(index,isSel){
		var el = this.el;
		var nav = el.querySelector(".swipe-nav");
		var dots = nav.querySelectorAll(".swipe-nav-dot");
		//0 1 2 3 4
		//  0 1 2
		//第一个 和 最后一个 只是占位的图 为了实现循环轮播
		if(index === this.itemLen - 1){
			index = index - 2;
		}else if(index !== 0){
			index--;
		}
		var target = dots[index];
		if(isSel !== undefined){
			target.classList[isSel ? "add" : "remove"]("selected");
		}else{
			var sel = nav.querySelector(".selected");
			if(sel && sel !== target){
				sel.classList.remove("selected");
			}
			if(sel !== target){
				target.classList.add("selected");
			}
		}
	},
	//立即显示指定区域
	_swipeToStatic : function(i){
		//
		this.curIndex = i;
		this.updateItemSize();
		this.setTranslate(-this.swipeData.itemSize * i);
		this._toggleDot(i);
	},
	_swipeTo : function(i){
		var data = this.swipeData;
		var outIndex = this.curIndex;
		this.curIndex = i;
		this.setTranslateAnimate(-data.itemSize * i);
		var target = this.getItem(i);
		this.options.onChangeItem.call(this,i,outIndex,target,target._swipeInit,this.getItem(outIndex));
		target._swipeInit = true;
		if(this.options.dot){
			if(i === 0){
				this._toggleDot(this.itemLen - 2);
			}else if(i === this.itemLen - 1){
				this._toggleDot(1);
			}else{
				this._toggleDot(i);
			}
		}
	},
	_setAutoPlay : function(isAutoPlay){
		clearInterval(this.autoPlayInterval);
		this.autoPlayInterval = null;
		if(isAutoPlay){
			var me = this;
			this.autoPlayInterval = setInterval(function(){
				if(!me.autoPlayInterval) return;
				var nxtIndex = me.curIndex + 1;
				if(nxtIndex === me.itemLen){
					nxtIndex = 0;
				}
				me.swipeTo(nxtIndex);
			},this.options.duration);
		}
	},
	/*方法*/
	//设置是否自动播放
	setAutoPlay : function(isAutoPlay){
		this._setAutoPlay(this.options.autoPlay = isAutoPlay);
	},
	//暂停自动播放
	pause : function(){
		if(this.options.autoPlay){
			this._setAutoPlay(false);
		}
	},
	//继续自动播放
	goon : function(){
		if(this.options.autoPlay){
			this._setAutoPlay(true);
		}
	},
	//根据页索引滑动到目标页
	swipeTo : function(i){
		this.updateItemSize();
		this._swipeTo(i);
	},
	//重新调整尺寸
	resize : function(){
		this.updateItemSize();
		this.setTranslate(-this.swipeData.itemSize * this.curIndex);
	},
	//更新页数量 并调整尺寸
	update : function(){
		this.updateItemLen();
		this.resize();
	},
	getItem : function(i){
		if(i === undefined){
			i = this.curIndex;
		}
		var items = Swipe.getChildren(this.el.querySelector(".swipe-inner"));
		return items[i];
	}
};
module.exports = Swipe;