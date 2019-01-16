require("./toast.css");
var transitionend = (function(){
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
})();
Vue.me.toast = function(mes){
	var node = document.createElement("div");
	node.className = 'toast';
	node.innerHTML = "<span>" + mes + "</span>";
	document.body.appendChild(node);
	node.addEventListener(transitionend,function(e){
		if(e.propertyName !== 'opacity'){
			return;
		}
		if(this.style.opacity === '0.8'){
			var me = this;
			setTimeout(function(){
				me.style.opacity = 0;
			},1200);
		}else{
			this.parentNode.removeChild(this);
		}
	});
	node.offsetWidth;
	node.style.opacity = 0.8;
	node.classList.add("toast-show");
};