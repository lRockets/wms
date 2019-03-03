<template>
  <div class="purchasing_warehousing">
    <div class="purchasing" v-if="isDetail" key="purchasing">
      <header class="top-head">
        <el-button size="small" @click="batchExport" class="total">导出</el-button>
        <div class="header-right f-fr">
          <search placeholder="请输入入库单号，预约单号，进行搜索" @on-search="qSearch" :showIcon="false" ref="qSearch" :width="'280px'" style="width:310px"></search>
          <el-button size="small" @click="goSearch" class="total">高级搜索</el-button>
        </div>
      </header>
      <el-table ref="purchaseList" border :data="purchaseList" height="500px" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="44"></el-table-column>
        <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
        <el-table-column align="center" prop="name" label="操作" width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="checkPurDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="createTime" label="入库时间" width="170"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="inboundNo" label="入库单号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="type" label="入库类型">
          <template slot-scope="scope">
            {{'采购入库'}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="supplierName" label="供应商"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="备注"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="purinNo" label="预约单号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="createByname" label="操作员"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="dataMode" label="数据来源">
          <template slot-scope="scope">
            {{['','PDA','PC'][scope.row.dataMode]}}
          </template>
        </el-table-column>
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
    </div>
    <div class="purchasDetail" v-else key="purchasDetail">
      <header class="top-head">
        <el-button type="text">入库单详情</el-button>
        <div class="header-right f-fr">
          <el-button size="small" @click="goBack">返回</el-button>
        </div>
      </header>
      <header class="top-head detail">
        <el-form :model="detailInfor" label-width="110px" class="detailInfor " size="small">
          <el-form-item label="入库单号：">{{detailInfor.inboundNo}}</el-form-item>
          <el-form-item label="入库类型：">{{'采购入库'}}</el-form-item>
          <el-form-item label="供应商：">{{detailInfor.supplierName}}</el-form-item>
          <el-form-item label="入库时间：">{{detailInfor.createTime}}</el-form-item>
          <el-form-item label="预约单号：" >{{detailInfor.purinNo}}</el-form-item>
          <el-form-item label="预约单备注：">{{detailInfor.purinNote}}</el-form-item>
          <el-form-item label="入库单备注：">{{detailInfor.note}}</el-form-item>
        </el-form>
      </header>
      <el-row >
        <div class="warehousingNum f-fl">
          <span><i>预约入库数量为：</i>{{detailInfor.purinQty}}</span>
          <span><i>实际入库数量为：</i>{{detailInfor.inboundQty}}</span>
        </div>
        <div class="header-right f-fr">
          <search placeholder="请输入商品编码，SKU，条形码，商品名称，进行搜索" @on-search="detail_qSearch" :showIcon="false" ref="detail_qSearch" style="width:400px" class="detail_qSearch" :width="'370px'"></search>
        </div>
      </el-row>
      <el-table ref="detailList" border :data="detailList" height="500px" >
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
        <el-table-column :show-overflow-tooltip="true" align="center" prop="ownerName" label="商品货主"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="purinQty" label="预约数量"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="inboundQty" label="实际入库数量"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="入库库位明细" width="150px">
          <template slot-scope="scope">
            <el-button type="text" @click="editDetail(scope)">编辑</el-button>
            <el-button type="text" @click="checkDetail(scope)">查看</el-button>
          </template>
        </el-table-column>
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
        <el-form-item prop="time1" label="入库时间：">
          <el-date-picker
            v-model="filterParam.time1"
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
        <el-form-item prop="supplierId" label="供应商：">
          <el-select size="small" v-model="filterParam.supplierId" placeholder="请选择" clearable>
            <template v-for="(item,index) in supplierList">
              <el-option :label="item.supplierName" :value="item.id" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="createByname" label="操作员：">
          <el-input size="small" v-model="filterParam.createByname" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="dataMode" label="数据来源：">
          <el-select size="small" v-model="filterParam.dataMode" placeholder="请选择" clearable>
            <el-option label="PDA" value="1"></el-option>
            <el-option label="PC" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align:right;width:100%">
          <el-button size="small" @click="concelTerm">清空条件</el-button>
          <el-button size="small" @click="submitSearch" class="total">查询</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="storehouseTitle" :visible.sync="storehouseDia" height='400px'  :modal-append-to-body="false">
      <el-form :model="storehouseData" label-width="110px" class="detailInfor storehouse">
        <el-form-item label="商品编码：">{{storehouseData.goodsCode}}</el-form-item>
        <el-form-item label="SKU：">{{storehouseData.skuCode}}</el-form-item>
        <el-form-item label="预约数量：">{{storehouseData.purinQty}}</el-form-item>
        <el-form-item label="商品名称：">{{storehouseData.goodsName}}</el-form-item>
        <el-form-item label="品牌：" >{{storehouseData.brandName}}</el-form-item>
        <el-form-item label="规格属性：">{{storehouseData.properties}}</el-form-item>
      </el-form>
       <el-table ref="storehouseList2" border :data="storehouseList2" height="300px" >
        <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
        <el-table-column align="center" prop="locationCode" label="入库库位"></el-table-column>
        <el-table-column align="center" prop='inboundQty' label="实际入库数量">
          <template slot-scope="scope">
            <el-input size="small" v-if="storehouseTitle=='编辑入库明细'" maxlength="5" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" style="margin:10px 0;width:80%;text-align:center;" v-model="scope.row.inboundQty"></el-input>
            <p v-else>{{scope.row.inboundQty}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop='' label="操作" v-if="storehouseTitle=='编辑入库明细'">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteRow(scope)">删除</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="noData">
            <div class="noData-img"></div>
            <p>暂无数据</p>
          </div>
        </template>
      </el-table>
      <el-row style="text-align:right;" v-show="storehouseTitle=='编辑入库明细'">
        <el-button size="small" @click="concelEdit">取消</el-button>
        <el-button size="small" @click="submitEdit" class="total">保存</el-button>
      </el-row>
      <!--分页-->
      <el-pagination background :page-sizes="[15,30,50,100]"
                     :page-size="s_param.pageSize"
                     :total="s_param.total"
                     layout="total, prev, pager, next, sizes, jumper"
                     @size-change="s_sizeChange"
                     v-if="storehouseTitle=='入库库位明细'"
                     @current-change="s_currentChange"
                     :current-page.sync="s_param.pageNum"
                     style="margin-top: 20px;text-align: center;">
      </el-pagination>
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
        purchaseList:[],
        purchaseRowData:{},
        advancedFilter:false,
        filterParam:{
          goodsName:'',
          goodsCodeAndSkuCode:'',
          time1:[],
          inboundStartDate:'',
          inboundEndDate:'',
          supplierId:'',
          createByname:'',
          dataMode:'',
        },
        supplierList:[],  //供应商列表
        detailInfor:{},
        searchWay:0,
        detailList:[],  //详情列表
        param: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        total: 10,
        storehouseTitle:'入库库位明细',
        storehouseDia:false,
        storehouseData:{},
        storehouseList:[],
        storehouseList2:[],  //isDelete为0的显示  为1为已删除，不显示（模拟删除）
        detail_param:{
          pageNum: 1,
          pageSize: 15,
          total: 10,
        },
        s_param:{   //入库库位明细翻页
          pageNum: 1,
          pageSize: 15,
          total: 10,
        }
      }
    },
    methods:{
      //查询采购入库单列表
      getPurchasList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/inbound/purinbound/selectSearchPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.purchaseList=data.data.dataList
            this.total=data.data.totalNum
          }else{
            this.$message.error(data.msg)
          }
        })
      },
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
       //批量导出
      batchExport(){
        this.$refs.exportFile.export('采购入库单','/inbound/purinbound/selectForExport.do',this.param,this.filterParam)
      },
      //快速搜索
      qSearch(){
        this.param.keyword=this.$refs.qSearch.inputValue
        this.searchWay=0;
        this.getPurchasList();
      },
      //高级搜索
      goSearch(){
        this.advancedFilter=true;
      },
      submitSearch(){
        this.param.keyword='';
        this.$refs.qSearch.inputValue='';
        this.searchWay=1;
        if(this.filterParam.time1!=null){
          this.filterParam.inboundStartDate=this.filterParam.time1[0]
          this.filterParam.inboundEndDate=this.filterParam.time1[1]
        }else{
          this.filterParam.inboundStartDate=''
          this.filterParam.inboundEndDate=''
        }
        this.getPurchasList();
      },
      //清空搜索条件
      concelTerm(){
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.filterParam.time1=[];
        this.getPurchasList();
      },
      //选择多条数据
      handleSelectionChange(val){
        this.ids = val.map(item => {
          return item.id
        });
      },
      //查看详情
      checkPurDetail(row){
        this.isDetail=false;
        this.purchaseRowData=row
        this.detailInfor=this.purchaseRowData;
        this.$nextTick(()=>{
          this.getDetailInfor();
        })
      },
      //获取采购入库单详情
      getDetailInfor(){
        let json_param = JSON.stringify({
          pageSize:this.detail_param.pageSize,
          pageNum:this.detail_param.pageNum,
          inboundId:this.purchaseRowData.id,
          keyword:this.$refs.detail_qSearch.inputValue})
        this.$ajaxPost('wms/inbound/purinboundDetail/selectPageByInboundIdForPC.do', {reqParam: json_param}).then(({data}) => {
          if (data.code == 200) {
            this.detailList = data.data.dataList
            this.detail_param.total=data.data.totalNum
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      //快速搜索详情列表
      detail_qSearch(){
        this.getDetailInfor();
      },
      //返回
      goBack(){
        this.isDetail=true;
      },
      //编辑详情明细
      editDetail(scope){
        this.storehouseTitle='编辑入库明细'
        this.s_param.pageNum=1;
        this.s_param.pageSize=9999
        // 判断有没有编辑权限
        let json_param2=JSON.stringify({
          inboundDate:scope.row.inboundDate,
          inboundId:this.purchaseRowData.id,
          skuId:scope.row.id
        })
        this.$ajaxPost('wms/inbound/purinboundDetail/selectNotPageByInboundIdAndSkuId.do',{reqParam:json_param2}).then(({data})=>{
          if(data.code==200){
            this.getPurinboundDetail(scope.row)
          }else{
            this.$message.error(data.msg)
            return false;
          }
        })
      },
      //查看详情明细
      checkDetail(scope){
        this.storehouseTitle='入库库位明细'
        this.s_param.pageNum=1;
        this.s_param.pageSize=15
        this.getPurinboundDetail(scope.row)
      },
      //获取入库库位明细
      getPurinboundDetail(GoodsRow){
        this.storehouseData=GoodsRow
        let json_param=JSON.stringify({
          pageNum:this.s_param.pageNum,
          pageSize:this.s_param.pageSize,
          inboundId:this.purchaseRowData.id,
          skuId:GoodsRow.id
        })
        this.$ajaxPost('wms/inbound/purinboundDetail/selectPageByInboundIdAndSkuId.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.storehouseList=data.data.dataList
            for(let key in  this.storehouseList){
              this.$set(this.storehouseList[key],'isDelete','0')
            }
            this.storehouseList2=JSON.parse(JSON.stringify(this.storehouseList))
            this.s_param.total=data.data.totalNum
            this.storehouseDia=true;
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //删除入库库位明细
      deleteRow(scope){
        if(this.storehouseList2.length>1){
          this.storehouseList2.splice(scope.$index,1)
          for(let key in this.storehouseList){
            if(this.storehouseList[key].id==scope.row.id){
              this.storehouseList[key].isDelete='1'
            }
          }
        }else{
          this.$message.error('请至少保留一个商品信息')
        }
      },
      //取消
      concelEdit(){
        this.storehouseDia=false;
        this.getDetailInfor();
      },
      //保存
      submitEdit(){
        let detailList=[]
        let flag=true;
        //未被删除的
        this.storehouseList2.forEach(item=>{
          detailList.push({
            id:item.id,
            inboundQty:item.inboundQty,
            isDelete:'0'
          })
          if(item.inboundQty==0||item.inboundQty==''){
            flag=false;
          }
        })
        // 被删除的
        this.storehouseList.forEach(item=>{
          if(item.isDelete=='1'){
            detailList.push({
              id:item.id,
              inboundQty:item.inboundQty,
              isDelete:'1'
            })
          }
        })
        if(flag){
          let json_param=JSON.stringify({purinboundDetailList:detailList})
          this.$ajaxPost('wms/inbound/purinboundDetail/updateDetailById.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              this.$message.success('保存成功')
              this.storehouseDia=false;
              this.detailInfor.inboundQty=data.data.inboundQty
              this.getDetailInfor();
            }else{
              this.$message.error(data.msg)
            }
          })
        }else{
          this.$message.error('商品数量仅支持1-99999的整数')
          return false;
        }
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getPurchasList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getPurchasList();
      },
      //每页数量改变
      detail_sizeChange(v) {
        this.detail_param.pageSize = v;
        this.getDetailInfor();
      },
      //当前页改变
      detail_currentChange(v) {
        this.detail_param.pageNum = v;
        this.getDetailInfor();
      },
       //每页数量改变
      s_sizeChange(v) {
        this.s_param.pageSize = v;
        this.getPurinboundDetail();
      },
      //当前页改变
      s_currentChange(v) {
        this.s_param.pageNum = v;
        this.getPurinboundDetail();
      },
    },
    components: {
      'exportFile':exportFile
    },
    mounted() {
      this.getPurchasList();
      this.getSupplier();
    }
  }
</script>

<style lang="scss">
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
  .detailInfor.storehouse{
    .el-form-item{
      width: 33%;
    }
  }
  .purchasing_warehousing{
    .el-input.is-disabled .el-input__inner{
      background-color: #ffffff;
      border: none !important;
    }
    .filterParam .el-dialog{
      width: 900px;
    }
  }
</style>
