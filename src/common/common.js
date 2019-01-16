window.DEBUG = true;
window.imgError = function(img,sizeStr){
	sizeStr = sizeStr || "168_168";
	img.src = "image/viomi_" + sizeStr + ".png";
	img.classList.add("img_err");
	img.onerror = null;
};
window.PATH = {
	baseUri : window.DEBUG ? "http://47.105.175.156:8080/" : "http://47.105.175.156:8080/"
};
require("./vuebootstrap");
Vue.filter("percent",function(value){
	if(isNaN(value) || typeof value !== 'number') return '--';
	return parseInt(value * 100) + "%";
});
Vue.me.ajaxSetting = function(setting){
	var token = localStorage.getItem("rd_token");
	if(token){
		if(setting.headers){
			setting.headers.token = token;
		}else{
			setting.headers = {token : token};
		}
	}
};
Vue.me.ajaxLoadFilter = function(err,resp,errorHandler){
	if(err){
		// console.log("load error",err);
		Vue.me.toast("加载失败,请稍候再试");
		return false;
	}
	if(resp.errCode === '200'){
		return resp.result;
	}else if(resp.errCode === '1011'){
		//重新登录
		location.href = '/login.html';
		return false;
	}
	if(errorHandler){
		if(typeof errorHandler === 'string'){
			Vue.me.toast(errorHandler);
		}else{
			errorHandler(resp);
		}
	}else{
		Vue.me.toast("请求失败["+resp.info+"]");
	}
	return false;
};