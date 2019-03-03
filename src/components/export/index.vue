<template>
    <el-dialog title="导出数据" :visible.sync="batchExportDia"  :modal-append-to-body="false" class="batchExport" @close='resetExportDia'>
      <el-progress :percentage="percentage" color="#1cd8ad"></el-progress>
      <p>下载时间太长或者下载失败时，可以转为后台下载任务，</p>
      <p>下载任务可在【系统管理】——>【导出记录】中，查看进度及下载数据</p>
      <el-button class="total" @click="backstageLoad" size="small " style="margin:20px auto 0;display:block">转为后台下载</el-button>
    </el-dialog>
</template>
<script>
export default {
    props:{
        idsArrary:{
            type:Array,
            default:[],
        }
    },
    data(){
        return{
            batchExportDia:false,  //批量导出
            batchExportStatus:false,
            percentage:0,  //导出进度条
            timer: null,  // 定时器名称 
            exportId:'',
        }
    },
    methods:{
        //批量导出
      export(name,url,param,filterParam){
        this.batchExportDia=true;
        this.percentage = 0;
        let obj=Object.assign({}, param,[param, filterParam][1])
        obj.ids=this.idsArrary;
        obj.typeName=name;
        let json_obj=JSON.stringify(obj)
        this.$ajaxPost('wms'+url,{reqParam:json_obj}).then(({data})=>{
          if(data.code == 200){
            window.open(this.$baseURL+'wms/profile/'+data.data.exportUrl)
            this.timer = setInterval( () => {
              this.percentage ++ ; 
              if (this.percentage > 99) {
                this.percentage = 100;
                clearInterval( this.timer );
                this.timer = null;
              }
            }, 5); 
            this.exportId=data.data.id
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //后台下载
      backstageLoad(){
        let json_param=JSON.stringify({id:this.exportId})
        this.$ajaxPost('wms/exportLog/update.do',{reqParam:json_param}).then(({data})=>{
          if(data.code == 200){
            this.batchExportDia=false;
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      resetExportDia(val){
        this.percentage = 0;
        clearInterval( this.timer );
        this.timer = null;
      },
    },
    mounted(){

    }
}
</script>
<style lang="scss">

</style>


