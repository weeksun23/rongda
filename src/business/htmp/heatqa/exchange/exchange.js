var tpl = require("./exchange.html");
Vue.component("exchange",{
	template : tpl,
	data : function(){
		return {
			chooseExchange : {
				name : 'xxx换热站',
				totalHousing : '--',
				roomTempHouses : '--',
				ultraHighTempStations : '--',
				highTempStations : '--',
				normalTempStation : '--',
				lowTempStation : '--'
			},
			roomData : []
		};
	},
	props : {
		show : {type : Boolean,default : false},
		hide : {type : Function,default : function(){}}
	},
	methods : {
		dealRoomData(data){
			for(var i=0,ii;ii=data[i++];){
				var info = RD.tempScope.getInfo(ii.houseTemp);
				ii.cls = info.cls;
				ii.color = info.color;
				var owe = RD.getOweStatusInfo(ii.oweStatus);
				ii.oweStatusTxt = owe.text;
				ii.oweColor = owe.color;
				var heat = RD.getHeatStatusInfo(ii.heatStatus);
				ii.heatStatusTxt = heat.text;
				ii.heatColor = heat.color;
			}
		},
		loadRoomData(){
			var data = [
				{number : '101',houseTemp : 26,oweStatus : 1,heatStatus : 0},
				{number : '102',houseTemp : 23,oweStatus : 0,heatStatus : 1},
				{number : '103',houseTemp : 18,oweStatus : 2,heatStatus : 3},
				{number : '202',houseTemp : 26,oweStatus : 2,heatStatus : 2},
				{number : '203',houseTemp : 21,oweStatus : 0,heatStatus : 4},
				{number : '204',houseTemp : 15,oweStatus : 2,heatStatus : 5},
				{number : '205',houseTemp : 16,oweStatus : 1,heatStatus : 1}
			];
			this.dealRoomData(data);
			this.roomData = data;
		},
		init : function(data){
			Vue.me.mix(this.chooseExchange,data);
			this.loadRoomData();
		}
	},
	watch : {
		
	}
});