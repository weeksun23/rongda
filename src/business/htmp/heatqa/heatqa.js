require("./heatstation/heatstation");
require("./exchange/exchange");
export default {
	data(){
		return {
			type : '',
			heatZoneData : [],
			heatZoneMes : '加载中...',
			curHeatZoneId : '',
			balanceInit : false,
			tempanalyseInit : false,
			housestateInit : false,
			showExchangeDetail : false
		};
	},
	beforeRouteUpdate(to, from, next){
		this.type = to.params.type;
		next();
	},
	mounted(){
		this.type = this.$route.params.type || 'balance';
	},
	methods : {
		getHeatStationData(heatZoneId){
			for(var i=0,ii;ii=this.heatZoneData[i++];){
				if(ii.heatZoneId === heatZoneId){
					return ii.heatZoneData;
				}
			}
			return [];
		},
		toExchange(data){
			this.showExchangeDetail = true;
			this.$refs.exchange.init(data);
		},
		hideExchange(){
			this.showExchangeDetail = false;
		}
	},
	watch : {
		type(newVal){
			if(!this[newVal + "Init"]){
				this[newVal + "Init"] = true;
				if(newVal === 'balance'){
					//加载供热区域数据
					Vue.ajaxPost(PATH.baseUri + "web/heatingQuality/heatBalance/heatingAreaList",{},(result) => {
						if(result.length > 0){
							this.heatZoneData = result;
							this.curHeatZoneId = result[0].heatZoneId;
						}else{
							this.heatZoneMes = '暂无供热区域数据';
						}
					});
				}
			}
		},
		curHeatZoneId(id){
			if(this.type === 'balance'){
				this.$refs.heatStation.setData(this.getHeatStationData(id));
			}
		}
	}
}