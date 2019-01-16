var tpl = require("./heatstation.html");
Vue.component("heatstation",{
	template : tpl,
	data : function(){
		return {
			heatStationIndex : -1,
			heatStationData : [],
			heatStationColumns : [
				{title : "名称",field : 'name',formatter : function(v){
					return "<a href='javascript:void(0)' data-method='name' data-field='name'>"+v+"</a>";
				}},
				{title : "供热面积",field : 'a1'},
				{title : "总户数",field : 'totalHousing'},
				{title : "室温监测户数",field : 'roomTempHouses'},
				{title : "超高温",field : 'ultraHighTempStations',style : {color : "#D9534F"}},
				{title : "高温",field : 'highTempStations',style : {color : "#F0AD4E"}},
				{title : "常温",field : 'normalTempStation',style : {color : "#5BC0DE"}},
				{title : "低温",field : 'lowTempStation',style : {color : "#337AB7"}}
			],
			area : '--',
			totalHousing : '--',
			roomTempHouses : '--',
			ultraHighTempStations : '--',
			heatExchangeStation : [],
			highTempStations : '--',
			normalTempStation : '--',
			lowTempStation : '--'
		};
	},
	props : {
		show : {type : Boolean,default : false},
		toExchange : {type : Function,default : function(){}}
	},
	methods : {
		setData : function(heatStationData){
			this.heatStationData = heatStationData;
			this.heatStationIndex = 0;
		},
		reload : function(heatZoneId){
			Vue.ajaxPost(PATH.baseUri + "web/heatingQuality/heatBalance/heatingStationInfo",{
				heatZoneId
			},(result) => {
				result = result.length ? result[0] : result;
				this.$refs.heatExchangeStationTb.loadFrontPageData(result.heatExchangeStation);
				Vue.me.mix(this,result);
			});
		},
		clickTdBtn(method,el,row){
			if(method === 'name'){
				//查看换热站详细信息
				this.toExchange(Vue.me.mix({},row,{
					name : this.heatStationData[this.heatStationIndex].name + " -> " + row.name
				}));
			}
		}
	},
	watch : {
		heatStationIndex(index){
			if(index === -1) return;
			var target = this.heatStationData[index];
			this.reload(target.heatZoneId);
		}
	}
});