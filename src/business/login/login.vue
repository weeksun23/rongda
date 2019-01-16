<template>
  <div id="app">
    <div class="container">
      <form class="form-signin">
        <h2 class="form-signin-heading">供热管理</h2>
        <input type="text" ref='account' class="form-control" placeholder="请输入账号" name='account' v-model="account" @keyup.enter="login">
        <input type="password" ref='pwd' class="form-control" placeholder="请输入密码" name='pwd' v-model='pwd' @keyup.enter="login">
        <!-- <div class="checkbox">
          <label>
            <input type="checkbox" :duplex='@remember' value='1'> 记住我
          </label>
        </div> -->
        <button class="btn btn-lg btn-primary btn-block" type="button" @click="login" :disabled='loading'>
          {{loading ? '登录中...' : '登录'}}
        </button>
        <p class='text-success' v-show='logined'>登录成功，跳转中...</p>
      </form> 
    </div>
    <div class='copyright text-center text-muted'>
      佛山融达信息科技有限公司版权所有
    </div>
  </div>
</template>
<style src="./login.css"></style>
<script>
require("../../common/base/base.css");
require("../../common/iconfont/iconfont.css");
require("../../common/bootstrap/css/bootstrap.css");
require("../../common/common");
require("../common/comp/comp");
export default {
  data () {
    return {
      account : '',
      pwd : '',
      loading : false,
      logined : false
    };
  },
  methods : {
    login(){
      if(!this.account){
        this.$refs.account.focus();
        return Vue.me.toast("请输入账号");
      }
      if(!this.pwd){
        this.$refs.pwd.focus();
        return Vue.me.toast("请输入密码");
      }
      var me = this;
      Vue.ajaxPost(PATH.baseUri + "web/user/loginUser",{
        username : this.account,
        password : this.pwd
      },(result) => {
        localStorage.setItem("rd_token",result.token);
        localStorage.setItem("rd_userinfo",JSON.stringify(result));
        me.logined = true;
        location.href = 'htmp.html';
      },{
        errorHandler(resp){
          if(resp.errCode === '500'){
            Vue.me.toast("账号或密码错误，请重新输入");
            me.pwd = '';
            me.account = '';
            me.$refs.account.focus();
          }else{
            Vue.me.toast("加载失败,请稍候再试");
          }
        }
      });
    }
  },
  mounted(){
    this.$refs.account.focus();
  }
}
</script>
</script>