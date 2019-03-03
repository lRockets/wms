<template>
  <div ref="charts"></div>
</template>
<script>
  var echarts = require("echarts");
    export default{
        data () {
            return {
              myChart :{}
            }
        },
      watch:{},
      props:{
        option : { // events will be displayed on calendar
          type : Object,
          default : {}
        },
      },
      methods:{
        reload(){   //重新加载表格
          this.myChart.clear();
          this.myChart.setOption(this.option,true);
        }
      },
      mounted:function () {
        this.myChart = echarts.init(this.$refs['charts']);
        this.myChart.setOption(this.option);
      }
    }
</script>
<style scoped>
</style>
