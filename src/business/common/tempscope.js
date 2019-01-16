var scopes = [];
var tempScope = {
	init(){
		scopes = [];
		var keys = ['superTemp','highTemp','normalTemp','lowerTemp','limitTemp'];
		var colors = ['#D9534F','#F0AD4E','#337AB7','#5BC0DE','#000'];
		var classes = ['danger','warning','primary','info','default'];
		for(var i=0,ii=keys.length;i<ii;i++){
			var key = keys[i];
			var scope = arguments[i];
			// if(!scope || scope.indexOf("-") === -1) continue
			var target = scope.split("-");
			scopes.push({
				scope : [+target[0],+target[1]],
				color : colors[i],
				cls : classes[i]
			});
		}
	},
	getInfo(temp){
		for(var i=0,ii;ii=scopes[i++];){
			if(temp <= ii.scope[1] && temp > ii.scope[0]){
				return ii;
			}
		}
	}
};
module.exports = tempScope;