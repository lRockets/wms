<template>
  <div class="allocating_reservations">
    <div class="allocating" v-if="isDetail" key="allocating">
      <header class="top-head">
        <!-- <el-button size="small" class="total">打印入库预约单</el-button> -->
        <el-button size="small" @click="batchExport" class="total">批量导出</el-button>
        <div class="header-right f-fr">
          <search placeholder="请输入入库单号，预约单号，进行搜索" @on-search="qSearch" :showIcon="false" ref="qSearch" :width="'280px'" style="width:310px"></search>
          <el-button size="small" @click="goSearch" class="total">高级搜索</el-button>
        </div>
      </header>
      <el-table ref="allocatingList" border :data="allocatingList" height="500px" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="44"></el-table-column>
        <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
        <el-table-column align="center" prop="name" label="操作" width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="checkDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="createTime" label="创建时间" width="170"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="alloinNo" label="预约单号" width="140"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="typeName" label="入库类型">
          <template slot-scope="scope">{{'调拨入库'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="allooutStorehouseName" label="调出仓库"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="status" label="状态">
          <template slot-scope="scope">
            {{scope.row.status=='-2'?'删除':['','在途','部分收货','收货完成'][scope.row.status]}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="logcompName" label="物流商"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="expbillNo" label="物流单号" width="140"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="extNo" label="外部单号" width="140"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="updateTime" label="更新时间" width="170"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="updateName" label="更新人"></el-table-column>
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
    </div>
    <div class="all_detail" v-else key="all_detail">
      <header class="top-head">
        <el-button type="text">预约单详情</el-button>
        <div class="header-right f-fr">
          <el-button size="small" @click="goBack">返回</el-button>
        </div>
      </header>
      <header class="top-head detail">
        <el-form :model="detailInfor" label-width="110px" class="detailInfor" size="small">
          <el-form-item label="预约单号：">{{detailInfor.alloinNo}}</el-form-item>
          <el-form-item label="入库状态：">{{detailInfor.status=='-2'?'删除':['','在途','部分收货','收货完成'][detailInfor.status]}}</el-form-item>
          <el-form-item label="调出仓库">{{detailInfor.allooutStorehouseName}}</el-form-item>
          <el-form-item label="入库类型：">调拨入库</el-form-item>
          <el-form-item label="外部单号">{{detailInfor.extNo}}</el-form-item>
          <el-form-item label="物流商" >{{detailInfor.logcompName}}</el-form-item>
          <el-form-item label="物流单号">{{detailInfor.expbillNo}}</el-form-item>
        </el-form>
      </header>
      <el-row >
        <div class="warehousingNum f-fl">
          <span><i>预约入库数量为：</i>{{detailInfor.alloinQty}}</span>
          <span><i>实际入库数量为：</i>{{detailInfor.inboundQty}}</span>
        </div>
        <div class="header-right f-fr">
          <search placeholder="请输入商品编码，SKU，条形码，商品名称，进行搜索" @on-search="detail_qSearch" :showIcon="false" ref="detail_qSearch" style="width:400px" class="detail_qSearch" :width="'370px'"></search>
        </div>
      </el-row>
      <el-table ref="detailList" border :data="detailList" height="500px" >
        <el-table-column align="center" type='index' label="行号" width="48"></el-table-column>
        <el-table-column align="center" label="图片" width="74">
          <template slot-scope="scope">
            <img :src="$Util.formatImageUrl(scope.row.imageUrl)" style="height:45px;width:100%;margin-top:5px;display:block; "/>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsCode" label="商品编码" width="140"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="skuCode" label="SKU"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="barcode" label="条码"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="brandName" label="品牌"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="properties" label="规格属性" width="170"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="ownerName" label="商品货主"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="inQty" label="预约数量"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="inboundQty" label="实际入库数量"></el-table-column>
        <template slot="empty">
          <div class="noData">
            <div class="noData-img"></div>
            <p>暂无数据</p>
          </div>
        </template>
      </el-table>
      <!--分页-->
      <el-pagination background :page-sizes="[15,30,50,100]"
                     :page-size="detail_param.pageSize"
                     :total="detail_param.total"
                     layout="total, prev, pager, next, sizes, jumper"
                     @size-change="detail_sizeChange"
                     @current-change="detail_currentChange"
                     :current-page.sync="detail_param.pageNum"
                     style="margin-top: 20px;text-align: center;">
      </el-pagination>
    </div>
    <el-dialog title="高级筛选" :visible.sync="advancedFilter"  :modal-append-to-body="false" class="filterParam">
      <el-form :model="filterParam" label-width="130px" size="small">
        <el-form-item prop="goodsName" label="商品名称：">
          <el-input size="small" v-model="filterParam.goodsName" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="goodsCodeAndSkuCode" label="商品编码/SKU：">
          <el-input size="small" v-model="filterParam.goodsCodeAndSkuCode" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="time" label="预约单创建时间">
          <el-date-picker
            v-model="filterParam.time"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 280px"
            size="small"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="status" label="入库状态：">
          <el-select size="small" v-model="filterParam.status" placeholder="请选择" clearable>
            <el-option label="在途" value="1"></el-option>
            <el-option label="部分收货" value="2"></el-option>
            <el-option label="收货完成" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="allooutStorehouseId" label="调出仓库">
          <el-select size="small" v-model="filterParam.allooutStorehouseId" placeholder="请选择" clearable>
            <template v-for="(item,index) in storesList">
              <el-option :label="item.storehouseName" :value="item.id" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="concelTerm">清空条件</el-button>
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
        isDetail:true,
        ids:[],  //选中的id
        allocatingList:[],
        advancedFilter:false,
        filterParam:{
          goodsName:'',
          goodsCodeAndSkuCode:'',
          time:'',
          createStartDate:'',
          createEndDate:'',
          status:'',
          allooutStorehouseId:'',
        },
        supplierList:[],  //供应商列表
        storesList:[],   //仓库列表
        detailInfor:{},
        searchWay:0,
        detailList:[],  //详情列表
        param: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        total: 10,
        detail_param:{
          pageNum: 1,
          pageSize: 15,
          total: 10,
          keyword:'',
        }
      }
    },
    methods:{
      //查询采购入库单列表
      getAllocatList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/in/alloin/selectSearchPagePC.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.allocatingList=data.data.dataList
            this.total=data.data.totalNum
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //获取所有物流商
      getSupplier () {
        let json_param = JSON.stringify({pageNum:1,pageSize:9999})
        this.$ajaxPost('wms/supplier/selectPage.do', {reqParam: json_param}).then(({data}) => {
          if (data.code == 200) {
            this.supplierList = data.data.dataList
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      //获取所有仓库
      getStoresList(){
        let json_param=JSON.stringify({pageNum:1,pageSize:9999})
        this.$ajaxPost('wms/storehouse/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.storesList=data.data.dataList
          }else{
            this.$message.error(data.msg)
          }
        })
      },
       //批量导出
      batchExport(){
        this.$refs.exportFile.export('调拨预约单','/in/alloin/selectForExport.do',this.param,this.filterParam)
      },
      //快速搜索
      qSearch(){
        this.param.keyword=this.$refs.qSearch.inputValue
        this.searchWay=0;
        this.getAllocatList();
      },
      //高级搜索
      goSearch(){
        this.advancedFilter=true;
      },
      submitSearch(){
        this.param.keyword=''
        this.$refs.qSearch.inputValue=''
        this.searchWay=1;
        if(this.filterParam.time!=null){
          this.filterParam.createStartDate=this.filterParam.time[0]
          this.filterParam.createEndDate=this.filterParam.time[1]
        }else{
          this.filterParam.createStartDate=''
          this.filterParam.createEndDate=''
        }
        this.getAllocatList();
      },
      //清空搜索条件
      concelTerm(){
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.filterParam.time=[];
        this.getAllocatList();
      },
      //选择多条数据
      handleSelectionChange(val){
        this.ids = val.map(item => {
          return item.id
        });
      },
      //查看详情
      checkDetail(row){
        this.isDetail=false;
        this.detailInfor=row
        this.$nextTick(()=>{
         this.declareVariable();
        })
      },
      declareVariable(){
        let word= this.$refs.detail_qSearch.inputValue
        let json_param=JSON.stringify({pageNum:this.detail_param.pageNum,pageSize:this.detail_param.pageSize,alloinId:this.detailInfor.id,keyword:word})
        this.$ajaxPost('wms/in/alloinDetail/selectPageByAlloinIdForPC.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.detailList=data.data.dataList
            this.detail_param.total=data.data.totalNum
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //快速搜索详情列表
      detail_qSearch(){
        this.declareVariable()
      },
      //返回
      goBack(){
        this.isDetail=true;
      },
      //关闭表单时重置
      resetRules(val) {
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getAllocatList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getAllocatList();
      },
      //每页数量改变
      detail_sizeChange(v) {
        this.detail_param.pageSize = v;
        this.declareVariable()
      },
      //当前页改变
      detail_currentChange(v) {
        this.detail_param.pageNum = v;
        this.declareVariable()
      },
    },
    components: {
      'exportFile':exportFile
    },
    mounted() {
      this.getAllocatList();
      this.getSupplier();
      this.getStoresList();
    }
  }
</script>

<style lang="scss">
.allocating_reservations{
  .warehousingNum{
    span{
      line-height: 40px;
      font-size: 14px;
      margin-right: 40px;
    }
    i{
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
  .filterParam .el-dialog{
    width: 900px;
  }
}
  
</style>
