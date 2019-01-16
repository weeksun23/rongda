var reqwest = require("./reqwest");
var defaultSetting = {
	crossOrigin : true,
	withCredentials : false
};
//
function doAjax(url,param,callback,loadingVm,setting,method){
	param = param || {};
	if(loadingVm !== null){
		loadingVm = loadingVm || Vue.me.loading;
	}
	loadingVm && loadingVm.show();
	Vue.me.log("发送参数",url,param);
	setting = Vue.me.mix({
		url : url,
		data : param,
		type : 'json',
		error : function(req){
			loadingVm && loadingVm.hide();
			Vue.me.log('接收错误',url,req);
			var text = req.responseText;
			try{
				var result = JSON.parse(text);
				if(Vue.me.ajaxLoadFilter){
					result = Vue.me.ajaxLoadFilter(result,null,setting.errorHandler,url,param);
				}
				callback && result !== false && callback(result);
				return;
			}catch(ex){}
			if(Vue.me.ajaxLoadFilter){
				req = Vue.me.ajaxLoadFilter(req,null,setting.errorHandler,url,param);
				callback && req !== false && callback(req);
			}else{
				callback && callback(req);
			}
		},
		success : function(resp){
			loadingVm && loadingVm.hide();
			Vue.me.log("接收数据",url,resp);
			if(Vue.me.ajaxLoadFilter){
				resp = Vue.me.ajaxLoadFilter(null,resp,setting.errorHandler,url,param);
				callback && resp !== false && callback(resp);
			}else{
				callback && callback(null,resp);
			}
		}
	},defaultSetting,setting);
	setting.method = method;
	if(setting.method === 'POST' || setting.method === 'PUT'){
		setting.contentType = "application/json;charset=UTF-8";
		setting.data = JSON.stringify(setting.data);
	}
	Vue.me.ajaxSetting && Vue.me.ajaxSetting(setting);
	reqwest(setting);
}
['Post','Get'].forEach(function(el){
	Vue['ajax' + el] = function(url,param,callback,loadingVm,setting){
		if(loadingVm && !loadingVm.show){
			//loadingVm是setting
			setting = loadingVm;
			loadingVm = void 0;
		}
		doAjax(url,param,callback,loadingVm,setting,el.toUpperCase());
	};
});