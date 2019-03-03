<template>
  <div class="storage_location">
    <div class="leftTree" >
      <el-form :model="scanOutageForm">
        <el-form-item label="待出库订单：">
          <span>23</span>笔
        </el-form-item>
        <el-form-item label="物流单号/销售单号：" prop="num2">
          <div class="thisRow">
            <el-input v-model="scanOutageForm.num2"></el-input>
            <el-button>Enter</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="scanOutageForm.checked1">出库前进行拦截扫描</el-checkbox>
          <el-checkbox v-model="scanOutageForm.checked2">自动提交</el-checkbox>
        </el-form-item>
        <el-form-item style="width: 100%" label-width="0">
          <el-button>确认出库装车</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="rightMain">
      <el-button @click="goback">返回</el-button>
      <div class="topForm">
        <el-form label-width="110px" class="detailInfor" >
          <el-form-item label="当前订单总数：">
            <span>15</span>笔
          </el-form-item>
        </el-form>
      </div>
      <el-table ref="scanOutageList" :data="scanOutageList" height=500px>
        <el-table-column align="center" type="index" label="行号" width="60"></el-table-column>
        <el-table-column align="center" prop="" label="操作">
          <template slot-scope="scope">
            <el-button @click="" type="text">移除</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="订单号"></el-table-column>
        <el-table-column align="center" prop="" label="物流商"></el-table-column>
        <el-table-column align="center" prop="" label="物流单号"></el-table-column>
        <el-table-column align="center" prop="" label="收货人"></el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination background :page-sizes="[15,30,50,100]"
                     :page-size="param.pageSize"
                     :total="total"
                     layout="total, prev, pager, next, sizes, jumper"
                     @size-change="sizeChange"
                     @current-change="currentChange"
                     :current-page.sync="param.pageNum"
                     style="margin-top: 20px;text-align: center;">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
       scan:{
        type: Boolean,
        default: true,
      },
    },
    data(){
      return{
        scanOutageList:[],
        scanOutageForm:{
          num:'',
          num2:'',
          checked2:'',
          checked1:''
        },
        param: {
          pageNum: 1,
          pageSize: 15,
        },
        total: 10,
      }
    },
    methods:{
      //获取所有库位
      getStorageList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        /*this.$ajaxPost('wms/storehouseLocation/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.locationList=data.data.dataList
            this.total=data.data.totalNum
            this.advancedFilter=false;
          }else{
            this.$message.error(data.msg)
          }
        })*/
      },
      goback(){
        // this.$emit();
        this.$parent.isScan=true
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        // this.getStorageList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        // this.getStorageList();
      },
    },
    mounted(){
    }
  }
</script>

<style lang="scss">
  .storage_location{
    display: flex;
    flex-wrap: nowrap;
    box-sizing: border-box;
    .leftTree{
      width: 19%;
      padding: 0 10px;
      margin-right: 1%;
      max-height:700px;
      overflow: hidden;
      border-right: 1px dashed #dddddd;
      .el-form{
        .el-form-item__content{
          .thisRow{
            width: 100%;
            display: flex;
            .el-button{
              padding: 0 6px !important;
              margin-left: 5px;
            }
          }
        }
      }
    }
    .rightMain{
      width: 80%;
    }
  }
</style>
