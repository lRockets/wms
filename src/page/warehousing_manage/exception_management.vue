<template>
  <div class="exception_management">
    <header class="top-head">
      <el-button size="small" @click="deleteExceptionBtn">删除</el-button>
      <div class="header-right f-fr">
        <search placeholder="请输入入库单号，进行搜索" @on-search="qSearch" :showIcon="false" ref="qSearch" :width="'280px'" style="width:310px"></search>
        <el-button size="small" @click="goSearch" class="total">高级搜索</el-button>
      </div>
    </header>
    <el-table ref="exceptionList" border :highlight-current-row='true' :data="exceptionList" height="500px" @selection-change="handleSelectionChange" @row-click='clickExcepList'>
      <el-table-column align="center" type="selection" width="44"></el-table-column>
      <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="createTime" label="创建时间" width="170"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="purreturnNo" label="退货单号"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="supplierName" label="供应商"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="purreturnQty" label="退货数量"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="备注"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="logcompName" label="物流商"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="expbillNo" label="物流单号"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="updateTime" label="更新时间" width="170"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="updateByname" label="更新人"></el-table-column>
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
    <div class="tabBox">
      <el-tabs v-model="activeName2" @tab-click="handleClick" type="border-card" style="margin-top: 20px;height: 320px;">
        <el-tab-pane label="商品明细" name="first">
          <el-table ref="inventory" border :data="inventory" height="230px">
            <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
            <el-table-column align="center" label="图片" width="74">
              <template slot-scope="scope">
                <img :src="$Util.formatImageUrl(scope.row.imageUrl)" style="height:45px;width: 100%;margin-top:5px;display:block;"/>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsCode" label="商品编码"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="skuCode" label="SKU"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="barcode" label="条码"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="brandName" label="品牌"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="properties" label="规格属性"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="companyName" label="商品货主"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="purreturnQty" label="退货数量"></el-table-column>
            <template slot="empty">
              <div class="noData">
                <div class="noData-img"></div>
                <p>暂无数据</p>
              </div>
            </template>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="订单信息" name="second">
          <el-form :model="detailInfor" label-width="110px" class="detailInfor" >
            <el-form-item label="退货单号：">{{detailInfor.purreturnNo}}</el-form-item>
            <el-form-item label="供应商">{{detailInfor.supplierName}}</el-form-item>
            <el-form-item label="物流商：">{{detailInfor.logcompName}}</el-form-item>
            <el-form-item label="物流单号：">{{detailInfor.expbillNo}}</el-form-item>
            <el-form-item label="备注：" >{{detailInfor.note}}</el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="高级筛选" :visible.sync="advancedFilter"  :modal-append-to-body="false" class="filterParam">
      <el-form :model="filterParam" label-width="130px" size="small">
        <el-form-item prop="goodsName" label="商品名称：">
          <el-input size="small" v-model="filterParam.goodsName" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="goodsCodeAndSkuCode" label="商品编码/SKU：">
          <el-input size="small" v-model="filterParam.goodsCodeAndSkuCode" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="concelTerm">清空条件</el-button>
          <el-button size="small" @click="submitSearch" class="total">查询</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props:{},
    data(){
      return{
        ids:[],  //选中的id
        exceptionList:[],
        exceptionRowData:{},
        advancedFilter:false,
        filterParam:{
          goodsName:'',
          goodsCodeAndSkuCode:'',
        },
        searchWay:0,
        activeName2: 'first',
        inventory:[], //商品明细表格
        detailInfor:{
          id:'',
          purreturnNo:'',
          inboundNo:"",
          logcompName:'',
          supplierName:'',
          expbillNo:'',
          note:'',
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
      //获取所有采购退货单
      getExceptionList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/turn/purreturn/selectSearchPageForPC.do',{reqParam:json_param}).then(({data})=>{
           if(data.code==200){
             this.exceptionList=data.data.dataList
             this.total=data.data.totalNum
             if(this.exceptionList.length==0){
              this.inventory=[]
              for(let key in this.detailInfor){
                this.detailInfor[key]=''
              }
            }else{
              this.getDetailInfor();
              this.$nextTick(()=>{
                this.$refs.exceptionList.setCurrentRow(this.exceptionList[0]);
              })
            }
           }else{
             this.$message.error(data.msg)
           }
        })
      },
      //删除
      deleteExceptionBtn(){
        if(this.ids.length>0){
          this.$confirm('删除退货单后，不可恢复，请谨慎操作？', '删除退货单', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let json_param = JSON.stringify({ids:this.ids.toString()})
            this.$ajaxPost('wms/turn/purreturn/updatePurreturnListById.do', {reqParam: json_param}).then(({data}) => {
              if (data.code == 200) {
                this.$message.success('删除成功')
                this.getExceptionList();
              } else {
                this.$message.error(data.msg)
              }
            })
          }).catch(() => {})
        }else{
          this.$message.warning('请至少选择一条数据')
        }

      },
     //快速搜索
      qSearch(){
        this.param.keyword=this.$refs.qSearch.inputValue
        this.searchWay=0;
        this.getExceptionList();
      },
      //高级搜索
      goSearch(){
        this.advancedFilter=true;
      },
      submitSearch(){
        this.param.keyword=''
        this.$refs.qSearch.inputValue=''
        this.searchWay=1;
        this.getExceptionList();
      },
      //清空搜索条件
      concelTerm(){
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.getExceptionList();
      },
      //选择多条数据
      handleSelectionChange(val){
        this.ids = val.map(item => {
          return item.id
        });
      },
      clickExcepList(row, event, column){
        this.exceptionRowData=row;
        this.getDetailInfor();
      },
      //获取采购退货单详情
      getDetailInfor(){
        let RowData='';
        if(JSON.stringify(this.exceptionRowData)=='{}'){
          RowData=this.exceptionList[0]
        }else{
          RowData=this.exceptionRowData
        }
        //商品明细
        let json_param = JSON.stringify({purreturnId:RowData.id})
        this.$ajaxPost('wms/turn/purreturnDetail/selectPageByPurreturnIdForPC.do', {reqParam: json_param}).then(({data}) => {
          if (data.code == 200) {
            this.inventory = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
        //订单信息
        for(let key in this.detailInfor){
          if(RowData[key]!=null){
            this.detailInfor[key]=RowData[key]
          }
        }
      },
      handleClick(tab, event) {
        if(this.exceptionList.length!=0){
         this.getDetailInfor();
        }
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getExceptionList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getExceptionList();
      },
    },
    components: {},
    mounted() {
      this.getExceptionList();
    }
  }
</script>

<style lang='scss'>
.exception_management{
  .filterParam .el-dialog{
    width: 900px;
  }
}
</style>
