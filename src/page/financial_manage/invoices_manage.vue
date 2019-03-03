<template>
  <div class="invoice_manage">
    <header class="top-head">
      <el-button size="small" @click="batchExport" class="total">导出</el-button>
      <div class="header-right f-fr">
        <search placeholder="请输入税号，订单号进行搜索" @on-search="qSearch" :width="'280px'" :showIcon="false" ref="qSearchRef" style="width:310px"></search>
        <el-button size="small" @click="goSearch" class="total">高级搜索</el-button>
      </div>
    </header>
    <el-table ref="invoiceList" :data="invoiceList" height="500px" border @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" type="index" label="行号" width="55"></el-table-column>
      <el-table-column align="center" label="操作" width="80px">
        <template slot-scope="scope">
          <el-button type="text" @click="checkDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="sellerName" label="销售方名称" width="110"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="typeName" label="发票类型" width="110"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="buyerName" label="购买方名称" width="110"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="buyerTaxno" label="购买方税号" width="110"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="invoiceAmount" label="发票总金额（元）" width="130"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="saleoutNo" label="销售单号" width="110"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="extNo" label="外部订单号" width="110"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="onlstoreName" label="店铺名称" ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="invoiceTime" label="更新时间" width="170"></el-table-column>
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
        <el-form-item prop="type" label="类型：">
          <el-select size="small" v-model="filterParam.type" placeholder="请选择">
            <template v-for="(item,index) in typeList">
              <el-option :label="item.itemName" :value="item.itemValue" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="onlstoreId" label="店铺名 称：">
          <el-select size="small" v-model="filterParam.onlstoreId" placeholder="请选择">
            <template v-for="(item,index) in shipList">
              <el-option :label="item.storeName" :value="item.id" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="concelTterm">清空条件</el-button>
          <el-button size="small" @click="submitSearch" class="total">查询</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="发票详情" :visible.sync="invoiceFormDia"  :modal-append-to-body="false" class="filterParam">
      <el-form :model="detailInfor" label-width="110px" class="detailInfor" >
        <el-form-item label="销售单号：">{{detailInfor.saleoutNo}}</el-form-item>
        <el-form-item label="外部订单号：">{{detailInfor.extNo}}</el-form-item>
        <el-form-item label="店铺名称：">{{detailInfor.onlstoreName}}</el-form-item>
        <el-form-item label="发票类型：">{{detailInfor.typeName}}</el-form-item>
        <el-form-item label="购买方名称：">{{detailInfor.buyerName}}</el-form-item>
        <el-form-item label="购买方税号：">{{detailInfor.buyerTaxno}}</el-form-item>
        <el-form-item label="购买方电话：">{{detailInfor.contactPhone}}</el-form-item>
        <el-form-item label="购买方开户行：">{{detailInfor.depositBank}}</el-form-item>
        <el-form-item label="购买方账号：">{{detailInfor.depositAccount}}</el-form-item>
        <el-form-item label="购买方地址：" style="width: 100%">{{detailInfor.address}}</el-form-item>
        <el-form-item label="发票金额：">{{detailInfor.invoiceAmount}}</el-form-item>
        <el-form-item label="发票备注：">{{detailInfor.note}}</el-form-item>
        <el-form-item label="销售方名称：">{{detailInfor.sellerName}}</el-form-item>
        <el-form-item label="销售税号：">{{detailInfor.sellerTaxno}}</el-form-item>
      </el-form>
      <el-row style="text-align: right;">
        <el-button size="small" @click="concelCopy">关闭</el-button>
        <el-button size="small"  
        v-clipboard:copy="copyText"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError" class="total">复制</el-button>
      </el-row>
    </el-dialog>
    <export-file :idsArrary='ids' ref="exportFile"></export-file>
  </div>
</template>

<script>
import exportFile from '@/components/export/index'; 
  export default {
    props:{},
    data(){
      const companyNameReg = (rule, value, callback) => {  //所属公司
        let v = value.toString().trim();
        // let flag = /^[a-zA-Z0-9_]{8,16}$/.test(v);
        if(v.length>0){
          if (v.length>=2&&v.length<=30) {
            callback();
          } else {
            if (callback) callback(new Error('请输入2-30个字'));
          }
        }else{
          callback();
        }
      };
      return{
        ids:[],
        shipList:[],  //店铺列表
        typeList:[],  //发票类型列表
        invoiceList:[{}],
        searchWay:0,  //0为快速搜索，1为高级搜索
        advancedFilter:false,
        filterParam:{
          type:'',
          onlstoreId:'',
        },
        invoiceFormDia:false,
        detailInfor:{},
        copyText:"",
        temp: '',
        aaa:'123',
        param: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        total: 10,
        
      }
    },
    methods:{
      //查询所有
      getInvoiceList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
         this.$ajaxPost('wms/invoiceManage/selectPage.do',{reqParam:json_param}).then(({data})=>{
           if(data.code==200){
             this.invoiceList=data.data.dataList
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
      //查询所有类型
      getAllType(){
         let json_param=JSON.stringify({typeName:'发票类型'})
         this.$ajaxPost('wms/dataDict/selectItemName.do',{reqParam:json_param}).then(({data})=>{
           if(data.code==200){
             this.typeList=data.data.dataDictList
           }else{
             this.$message.error(data.msg);
           }
         })
      },
       //批量导出
      batchExport(){
        this.$refs.exportFile.export('发票管理','/invoiceManage/export.do',this.param,this.filterParam)
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
      //查看详情
      checkDetail(row){
        this.invoiceFormDia=true;
        for(let key in this.invoiceForm){
          this.invoiceForm[key]=row[key];
        }
        this.detailInfor=row;
        this.copyText=JSON.stringify({
          '销售单号：':this.detailInfor.saleoutNo,
          '外部订单号：':this.detailInfor.extNo,
          '店铺名称：':this.detailInfor.onlstoreName,
          '发票类型：':this.detailInfor.typeName,
          '购买方名称：':this.detailInfor.buyerName,
          '购买方税号：':this.detailInfor.buyerTaxno,
          '购买方电话：':this.detailInfor.contactPhone,
          '购买方开户行：':this.detailInfor.depositBank,
          '购买方账号：':this.detailInfor.depositAccount,
          '购买方地址：':this.detailInfor.address,
          '发票金额：':this.detailInfor.invoiceAmount,
          '发票备注：':this.detailInfor.note,
          '销售方名称：':this.detailInfor.sellerName,
          '销售税号：':this.detailInfor.sellerTaxno,
        }).replace(/\"/g,'').replace(/:/g,'').replace(/^{|}$/g,'').replace(/,/g,'\n')
      },
      //取消
      concelCopy(){
        this.invoiceFormDia=false;
      },
      // 复制成功
      onCopy(e){
        // console.log(this.copyText.replace(/:/g,'').replace(/^{|}$/g,'').replace(/,/g,'\n'));
      },
      // 复制失败
      onError(e){
        alert("失败");
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
      this.getAllType();
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
