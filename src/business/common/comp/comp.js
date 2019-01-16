var tpl = require("./comp.html");
require("./comp.css");
Vue.me.appendHTML(document.body,tpl);
module.exports = new Vue({
	el : "#comp",
	data : {
		title : '',
		buttons : [],
		content : ''
	},
	mounted : function(){
		Vue.me.mix(Vue.me,{
			loading : this.$refs.loading,
			alert : this.alert,
			confirm : this.confirm
		});
	},
	methods : {
		alert : function(content,title,okFunc,handClose){
			this.content = content;
			this.title = title || '温馨提示';
			this.buttons = [{
				close : !handClose,
				text : '确定',
				handler : okFunc || Vue.me.noop
			}];
			this.$refs.mesDialog.open();
		},
		confirm : function(content,title,okFunc,cancelFunc){
			
		}
	}
});
