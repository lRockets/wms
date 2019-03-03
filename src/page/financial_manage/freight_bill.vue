<template>
  <div class="invoice_manage">
    <header class="top-head">
      <el-button size="small" @click="batchExport" class="total">导出</el-button>
      <div class="header-right f-fr">
        <search placeholder="请输入物流单号，订单号进行搜索" @on-search="qSearch" :width="'280px'" :showIcon="false" ref="qSearchRef" style="width:310px"></search>
        <el-button size="small" @click="goSearch" class="total">高级搜索</el-button>
      </div>
    </header>
    <el-table ref="freightList" :data="freightList" height="500px" border @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" type="index" label="行号" width="55"></el-table-column>
      <el-table-column align="center" prop="optTime" label="出库时间" width="170"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="saleoutNo" label="订单号" width="160"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="logcompName" label="物流商"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="expbillNo" label="物流单号" width="160"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="actWeight" label="称重重量（g）"  width="110"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="expfeeCost" label="运费成本（元）"  width="115"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="onlstoreName" label="店铺名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="onlstorePlatform" label="订单渠道"></el-table-column>
      <template slot="empty">
        <div class="noData">
          <div class="noData-img"></div>
          <p>暂无数据</p>
        </div>
      </template>
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
    <el-dialog title="高级筛选" :visible.sync="advancedFilter"  :modal-append-to-body="false" class="filterParam">
      <el-form :model="filterParam" label-width="100px" size="small">
        <el-form-item prop="time1" label="出库时间：">
          <el-date-picker
            v-model="filterParam.time1"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00']"
            size="small"
            style="width: 280px">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="logcompIds" label="物流商：">
          <el-select size="small" v-model="filterParam.logcompIds" placeholder="请选择" multiple>
            <template v-for="(item,index) in LogisticsList">
              <el-option :label="item.logcompName" :value="item.id" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="onlstoreId" label="店铺名称：">
          <el-select size="small" v-model="filterParam.onlstoreId" placeholder="请选择">
            <template v-for="(item,index) in shipList">
              <el-option :label="item.storeName" :value="item.id" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 100%;text-align:right;">
          <el-button size="small" @click="concelTterm">清空条件</el-button>
          <el-button size="small" @click="submitSearch" class="total">查询</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <export-file :idsArrary='ids' ref="exportFile"></export-file>
  </div>
</template>

<script>
import exportFile from '@/components/export/index'; 
  export default {
    props:{},
    data(){
      return{
        ids:[],
        shipList:[],
        LogisticsList:[],
        freightList:[{}],
        searchWay:0,  //0为快速搜索，1为高级搜索
        advancedFilter:false,
        filterParam:{
          logcompIds :[],
          onlstoreId:'',
          startDate:'',
          endDate:'',
          time1:'',
        },
        param: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        total: 10,
      }
    },
    methods:{
      //查询所有用户
      getInvoiceList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/expfeeBill/selectPage.do',{reqParam:json_param}).then(({data})=>{
           if(data.code==200){
             this.freightList=data.data.dataList
             this.total=data.data.totalNum
           }else{
             this.$message.error(data.msg);
           }
        })
      },
      //查询所有店铺列表
      getShipList () {
        let json_param = JSON.stringify({pageSize:9999,pageNum:1})
        this.$ajaxPost('wms/store/selectPage.do', {reqParam: json_param}).then(({data}) => {
          if (data.code == 200) {
            this.shipList = data.data.dataList
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      //获取所有物流商
      getLogisticList(){
        let json_param=JSON.stringify({pageNum:1,pageSize:9999})
        this.$ajaxPost('wms/logisticsCompany/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.LogisticsList=data.data.dataList
          }else{
            this.$message.error(data.msg)
          }
        })
      },
       //批量导出
      batchExport(){
        this.$refs.exportFile.export('运费账单','/expfeeBill/export.do',this.param,this.filterParam)
      },
      //快速搜索
      qSearch(){
        this.param.keyword=this.$refs.qSearchRef.inputValue
        this.searchWay=0;
        this.getInvoiceList()
      },
      //高级搜索
      goSearch(){
        this.advancedFilter=true;
        this.searchWay=1;
      },
      submitSearch(){
        if(this.filterParam.time1==[]||this.filterParam.time1==null){
          this.filterParam.startDate=''
          this.filterParam.endDate=''
        }else{
          this.filterParam.startDate=this.filterParam.time1[0]
          this.filterParam.endDate=this.filterParam.time1[1]
        }
        this.param.keyword='';
        this.$refs.qSearchRef.inputValue=''
        this.searchWay=1;
        this.getInvoiceList()
        this.advancedFilter=false;
      },
      //清空搜索条件
      concelTterm(){
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.filterParam.logcompIds=[];
        this.filterParam.time1=[];
        this.param.keyword='';
        this.$refs.qSearchRef.inputValue=''
        this.getInvoiceList();
      },
      //选择多条数据
      handleSelectionChange(val){
        this.ids = val.map(item => {
          return item.id
        });
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getInvoiceList()
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getInvoiceList()
      },
    },
    components: {
      'exportFile':exportFile
    },
    mounted() {
      this.getInvoiceList()
      this.getShipList();
      this.getLogisticList();
    }
  }
</script>

<style lang="scss">
  .invoice_manage{
    .detailInfor{
      .el-form-item{
        width: 50%;
      }
    }
  }
</style>
