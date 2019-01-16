<template>
  <div id="app">
    <div class='top box box-center'>
      <div class='top-logo'>
        <img src="../../image/rd.png">
        <span>{{name}}</span>
      </div>
      <div class='top-center box-flex'>

      </div>
    </div>
    <div class='left'>
      <v-accordion ref='nav' :init-data="navData" :on-select-item="selPage" :multipleSel='true'></v-accordion>
    </div>
    <div class='center'>
      <router-view></router-view>
    </div>
  </div>
</template>
<style>
#app{
  width: 100%;height: 100%;position: relative;
}
.top{position: fixed;top: 0;left: 0;right: 0;height: 60px;}
.top-logo{width: 200px;background-color: #00284D;line-height: 60px;font-size: 0;color: #CFD3D6;text-align: center;}
.top-logo img{height: 26px;vertical-align: middle;margin-right: 5px;}
.top-logo span{vertical-align: middle;font-size: 20px;}
.top-center{border-bottom: 1px solid #ddd;height: 100%;}
.left{
  position: fixed;top: 60px;left: 0;bottom: 0;width: 200px;background-color: #f2f2f2;
  border-right: 1px solid #ddd;
}
.left .panel-group{margin-right: -1px;}
.center{position: fixed;top: 60px;left: 200px;right: 0;bottom: 0;background-color: #fff}
</style>
<script src='./main.js'></script>