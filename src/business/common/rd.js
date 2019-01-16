var tempScope = require("./tempscope");
var oweStatusData = [
	{text : '欠',color : "#D9534F"},
	{text : '清',color : "#5CB85C"}
];
var hearStatusData = [
	{text : '未入网',color : "#888"},
	{text : '供暖',color : "orange"},
	{text : '停暖',color : "#FA716F"},
	{text : '强停',color : "#D9534F"},
	{text : '退网',color : "#777"},
	{text : '空置',color : "#ddd"}
];
window.RD = {
	tempScope,
	getOweStatusInfo(oweStatus){
		if(oweStatus <= 1) return oweStatusData[0];
		return oweStatusData[1]
	},
	getHeatStatusInfo(heatStatus){
		return hearStatusData[heatStatus];
	}
};