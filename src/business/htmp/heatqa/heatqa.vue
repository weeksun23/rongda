<template>
  <div class='heatqa'>
  	<div class='box box-center'>
  		<div class='heatqa-nav-left'>
		  	<select class="form-control" v-model='curHeatZoneId'>
			  	<option value='' v-if="heatZoneData.length === 0">{{heatZoneMes}}</option>
			  	<option v-for="el in heatZoneData" :value="el.heatZoneId">{{el.name}}</option>
			  </select>
		  </div>
  		<div class='box-flex'>
  			<ul class="nav nav-tabs">
			    <li :class="{active : type === 'balance'}"><router-link to="/htmp/heatqa/balance">热网平衡</router-link></li>
			    <li :class="{active : type === 'tempanalyse'}"><router-link to="/htmp/heatqa/tempanalyse">室温分析</router-link></li>
			    <li :class="{active : type === 'housestate'}"><router-link to="/htmp/heatqa/housestate">房屋状态</router-link></li>
			  </ul>
  		</div>
  	</div>
	  <div class="tab-content">
	  	<heatstation ref='heatStation' :show="type === 'balance' && !showExchangeDetail" :to-exchange="toExchange"/>
	  	<exchange ref='exchange' :show="type === 'balance' && showExchangeDetail" :hide="hideExchange"/>
	    <div class="tab-pane" :class="{active : type === 'tempanalyse'}">2</div>
	    <div class="tab-pane" :class="{active : type === 'housestate'}">3</div>
	  </div>
  </div>
</template>
<script src="./heatqa.js"></script>
<style src="./heatqa.css"></style>
