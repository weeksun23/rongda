import VueRouter from 'vue-router';
require("../../common/base/base.css");
require("../../common/iconfont/iconfont.css");
require("../../common/bootstrap/css/bootstrap.css");
require("../../common/common");
require("../common/comp/comp");
require("../common/rd");
Vue.use(VueRouter);
var routes,name,navData;
if(SYS === 'htmp'){
  routes = [{
    name : 'htmpIndex',
    path : '/htmp/index',
    component : function(resolve,reject){
      require(['../htmp/index/index.vue'], resolve,reject);
    }
  },{
    name : 'heatqa-type',
    path : '/htmp/heatqa/:type',
    component : function(resolve,reject){
      require(['../htmp/heatqa/heatqa.vue'], resolve,reject);
    }
  },{
    name : 'dataimport',
    path : '/htmp/dataimport',
    component : function(resolve,reject){
      require(['../htmp/dataimport/dataimport.vue'], resolve,reject);
    }
  },{
    name : 'maintain',
    path : '/htmp/maintain',
    component : function(resolve,reject){
      require(['../htmp/maintain/maintain.vue'], resolve,reject);
    }
  },{
    name : 'repair',
    path : '/htmp/repair',
    component : function(resolve,reject){
      require(['../htmp/repair/repair.vue'], resolve,reject);
    }
  },{
    name : 'setting',
    path : '/htmp/setting',
    component : function(resolve,reject){
      require(['../htmp/setting/setting.vue'], resolve,reject);
    }
  }];
  name = '室温监控';
  navData = [{
    title : "室温监管",
    children : [{
      title : '领导总览',$page : '/htmp/index'
    },{
      title : '供热质量',$page : '/htmp/heatqa/balance'
    },{
      title : '设备运维',$page : '/htmp/maintain'
    },{
      title : '维修派单',$page : '/htmp/repair'
    }]
  },{
    title : "系统管理",
    children : [{
      title : '系统配置',$page : '/htmp/setting'
    },{
      title : '数据导入',$page : '/htmp/dataimport'
    }]
  }];
}else if(SYS === 'hmmp'){
  routes = [];
  name = '计量管控';
  navData = [];
}
var router = new VueRouter({
  routes: routes
});
router.beforeEach((to,from,next) => {
  if(app){
    app.selItemByPath(to.path);
  }else{
    initPath = to.path;
  }
  next();
});
router.onReady(function(){
	var r = router.currentRoute;
	if(r.name === null){
		// app.$refs.nav.selectItemByTitle("供热质量",true);
    router.replace('/htmp/heatqa/balance');
	}
});
router.onError(function(err){
  
});
var app,initPath;
export default {
  router,
  data () {
    return {
      name : name,
      navData : navData
    }
  },
  methods : {
    selPage(item){
      if(item.$page){
        router.push(item.$page);
      }
    },
    selItemByPath(path){
      var data = this.navData;
      for(var i=0,ii;ii=data[i++];){
        for(var j=0,jj;jj=ii.children[j++];){
          if(path.indexOf(jj.$page) !== -1){
            this.$refs.nav.selectItemByTitle(jj.title,true);
            return;
          }
        }
      }
    }
  },
  mounted(){
    app = this;
    if(initPath){
      this.selItemByPath(initPath);
    }
    var userInfo = localStorage.getItem("rd_userinfo");
    if(userInfo){
      userInfo = JSON.parse(userInfo);
      if(userInfo.token){
        console.log('userinfo',userInfo);
        //初始化温度范围
        RD.tempScope.init(userInfo.superTemp,userInfo.highTemp,userInfo.normalTemp,
          userInfo.lowerTemp,userInfo.limitTemp);
        return;
      }
    }
    Vue.me.alert("获取用户信息失败,请重新登录",'',() => {
      localStorage.removeItem("rd_userinfo");
      localStorage.removeItem("rd_token");
      location.href = '/login.html';
    });
  }
}