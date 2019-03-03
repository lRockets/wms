<template>
<div class='totalInventory'>
  <header class="top-head">
    <el-button size="small"  @click="batchExport" class="total">导出</el-button>
    <div class="header-right f-fr">
      <search placeholder="请输入商品编码，SKU，条码，名称进行搜索" @on-search="qSearch" :width="'320px'" :showIcon="false" ref="qSearch" style="width:350px"></search>
      <el-button size="small" @click="goSearch" class="total">高级搜索</el-button>
    </div>
  </header>
  <div class="total_inventory">
    <div class="leftTree" >
      <el-button type="text" style="color:#39b9fe;" @click="expandOrContract">展开 | 收缩</el-button>
      <el-tree
        :data="treeData"
        :props="defaultProps"
        :default-expand-all='isOpenTree'
        @node-click="handleNodeClick"
        node-key="id"
        ref="totalTree"
        :default-expanded-keys="defaultExpandArray"
        :highlight-current="true"
        :expand-on-click-node='false'
      ></el-tree>
    </div>
    <div class="rightMain">
      <el-table ref="totalList" border :data="totalList" height=500px  @selection-change="handleSelectionChange" >
        <el-table-column align="center" type="selection" width="44"></el-table-column>
        <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
        <!-- <el-table-column align="center" prop="name" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="checkDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="图片" width="74">
          <template slot-scope="scope">
            <img :src="$Util.formatImageUrl(scope.row.imageUrl)" style="height:45px;width: 100%;display:block; margin-top:5px;"/>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsCode" label="商品编码" width="90"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="skuCode" label="SKU" width="90"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="barcode" label="商品条码" width="120"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsName" label="商品名称" width="120"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="brandName" label="品牌"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="properties" label="规格属性" width="150"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="companyName" label="商品货主"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="stockQty" label="实际库存" sortable width="100"></el-table-column>
        <el-table-column align="center" prop="enableQty" label="可用库存" sortable width="100"></el-table-column>
        <el-table-column align="center" prop="lockQty" label="锁定库存" sortable width="100"></el-table-column>
        <el-table-column align="center" prop="freezeQty" label="冻结库存" sortable width="100"></el-table-column>
        <el-table-column align="center" prop="transitQty" label="在途库存" sortable width="100"></el-table-column>
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
      <el-dialog title="高级筛选" :visible.sync="advancedFilter"  :modal-append-to-body="false" class="totalIn">
        <el-form :model="filterParam" label-width="90px" :rules="filterParamRule" size="small">
          <div  class="range">
            <el-form-item prop="stockQtyMix" label="实际库存：">
              <el-input size="small" v-model="filterParam.stockQtyMix" maxlength="6" onkeyup="value=value.replace(/^(00+)|[^\d]+/g,'')"></el-input>
            </el-form-item>
            <i></i>
            <el-form-item prop="stockQtyMax" label-width="0">
              <el-input size="small" v-model="filterParam.stockQtyMax" maxlength="6" onkeyup="value=value.replace(/^(00+)|[^\d]+/g,'')"></el-input>
            </el-form-item>
          </div>
          <div  class="range">
            <el-form-item prop="enableQtyMix" label="可用库存：">
              <el-input size="small" v-model="filterParam.enableQtyMix" maxlength="6" onkeyup="value=value.replace(/^(00+)|[^\d]+/g,'')"></el-input>
            </el-form-item>
            <i></i>
            <el-form-item prop="enableQtyMax" label-width="0">
              <el-input size="small" v-model="filterParam.enableQtyMax" maxlength="6" onkeyup="value=value.replace(/^(00+)|[^\d]+/g,'')"></el-input>
            </el-form-item>
          </div>
          <div  class="range">
            <el-form-item prop="lockQtyMix" label="锁定库存：">
              <el-input size="small" v-model="filterParam.lockQtyMix" maxlength="6" onkeyup="value=value.replace(/^(00+)|[^\d]+/g,'')"></el-input>
            </el-form-item>
            <i></i>
            <el-form-item prop="lockQtyMax" label-width="0">
              <el-input size="small" v-model="filterParam.lockQtyMax" maxlength="6" onkeyup="value=value.replace(/^(00+)|[^\d]+/g,'')"></el-input>
            </el-form-item>
          </div>
          <div  class="range">
            <el-form-item prop="freezeQtyMix" label="冻结库存：">
              <el-input size="small" v-model="filterParam.freezeQtyMix" maxlength="6" onkeyup="value=value.replace(/^(00+)|[^\d]+/g,'')"></el-input>
            </el-form-item>
            <i></i>
            <el-form-item prop="freezeQtyMax" label-width="0">
              <el-input size="small" v-model="filterParam.freezeQtyMax" maxlength="6" onkeyup="value=value.replace(/^(00+)|[^\d]+/g,'')"></el-input>
            </el-form-item>
          </div>
          <el-form-item prop="ownerId" label="商品货主：">
            <el-select size="small" v-model="filterParam.ownerId" style="width:280px;">
              <template v-for="(item,index) in companyNameList">
                <el-option :label="item.ownerName" :value="item.id" :key="index" ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <div style="width:100%;text-align:right;">
            <el-button size="small" @click="concelTerm">清空条件</el-button>
            <el-button size="small" @click="submitSearch" class="total">查询</el-button>
          </div>
        </el-form>
      </el-dialog>
      <el-dialog title="库存详情" :visible.sync="inventoryDetail"  :modal-append-to-body="false">
        <el-form :model="detailInfor" label-width="100px" class="detailInfor" >
          <el-form-item label="商品编码：">{{detailInfor.goodsCode}}</el-form-item>
          <el-form-item label="SKU：">{{detailInfor.skuCode}}</el-form-item>
          <el-form-item label="商品条码：">{{detailInfor.barcode}}</el-form-item>
          <el-form-item label="商品名称：">{{detailInfor.goodsName}}</el-form-item>
          <el-form-item label="品牌：">{{detailInfor.brandName}}</el-form-item>
          <el-form-item label="规格属性：">{{detailInfor.properties}}</el-form-item>
        </el-form>
        <el-table ref="detailList" border :data="detailList" height="300">
          <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="optNo" label="入库单号" width="180"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="stockQty" label="实际库存" sortable></el-table-column>
          <el-table-column align="center" prop="enableQty" label="可用库存" sortable></el-table-column>
          <el-table-column align="center" prop="lockQty" label="锁定库存" sortable></el-table-column>
          <el-table-column align="center" prop="freezeQty" label="冻结库存" sortable></el-table-column>
          <template slot="empty">
            <div class="noData">
              <div class="noData-img"></div>
              <p>暂无数据</p>
            </div>
          </template>
        </el-table>
        <!--分页-->
        <el-pagination background :page-sizes="[15,30,50,100]"
                       :page-size="param_detail.pageSize"
                       :total="param_detail.total"
                       layout="total, prev, pager, next, sizes, jumper"
                       @size-change="sizeChange_detail"
                       @current-change="currentChange_detail"
                       :current-page.sync="param_detail.pageNum"
                       style="margin-top: 20px;text-align: center;">
        </el-pagination>
      </el-dialog>
    </div>
  </div>
  <export-file :idsArrary='ids' ref="exportFile"></export-file>
</div>
</template>

<script>
import exportFile from '@/components/export/index'; 
  export default {
    props:{},
    data(){
      return{
        isOpenTree:false,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'categoryName',
        },
        defaultExpandArray:[],
        companyNameList:[], //货主列表
        advancedFilter:false,
        filterParam:{
         stockQtyMix:'',
         stockQtyMax:'',
         enableQtyMix:'',
         enableQtyMax:'',
         lockQtyMix:'',
         lockQtyMax:'',
         freezeQtyMix:'',
         freezeQtyMax:'',
         ownerId:'',
        },
        filterParamRule:{
          stockQtyMix:[{trigger: 'change',  validator:(rule, value, callback)=>this.$Util.RegExp.QtyMix(rule, value, callback,this.filterParam.stockQtyMax)}],
          stockQtyMax:[{trigger: 'change',  validator:(rule, value, callback)=>this.$Util.RegExp.QtyMax(rule, value, callback,this.filterParam.stockQtyMix)}],
          enableQtyMix:[{trigger: 'change',  validator:(rule, value, callback)=>this.$Util.RegExp.QtyMix(rule, value, callback,this.filterParam.enableQtyMax)}],
          enableQtyMax:[{trigger: 'change',  validator:(rule, value, callback)=>this.$Util.RegExp.QtyMax(rule, value, callback,this.filterParam.enableQtyMix)}],
          lockQtyMix:[{trigger: 'change',  validator:(rule, value, callback)=>this.$Util.RegExp.QtyMix(rule, value, callback,this.filterParam.lockQtyMax)}],
          lockQtyMax:[{trigger: 'change',  validator:(rule, value, callback)=>this.$Util.RegExp.QtyMax(rule, value, callback,this.filterParam.lockQtyMix)}],
          freezeQtyMix:[{trigger: 'change',  validator:(rule, value, callback)=>this.$Util.RegExp.QtyMix(rule, value, callback,this.filterParam.freezeQtyMax)}],
          freezeQtyMax:[{trigger: 'change',  validator:(rule, value, callback)=>this.$Util.RegExp.QtyMax(rule, value, callback,this.filterParam.freezeQtyMix)}],
        },
        ids:[],
        totalList:[],
        inventoryDetail:false, //库存详情
        detailInfor:{
          goodsCode:'',
          skuCode:'',
          barcode:'',
          goodsName:'',
          brandName:'',
          properties:'',
        },
        detailList:[],
        detailSkuId:'',
        param: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
          categoryId:'',
        },
        total: 10,
        param_detail: {
          pageNum: 1,
          pageSize: 15,
          total: 10,
        },
      }
    },
    methods:{
      //获取库存
      getTotalList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/stock/skuStock/selectSearchPageByCategoryId.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.totalList=data.data.dataList
            this.total=data.data.totalNum
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //查询货主列表
      getCompanyNameList(){
        let json_param=JSON.stringify({pageNum:1,pageSize:9999,keyword:'',status:''})
        this.$ajaxPost('wms/owner/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.companyNameList=JSON.parse(JSON.stringify(data.data.dataList))
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //获取类目树
      getCategoryTree(){
        this.$ajaxPost('wms/category/selectCategoryTree.do',{}).then(({data})=>{
          if(data.code==200){
            this.treeData=data.data.categoryList
            this.searchWay=0;
            if(this.treeData.length>0){
              this.treeData=this.filterStatus(this.treeData)
              console.log(this.treeData);
              this.treeData.forEach(item=>{
                this.defaultExpandArray.push(item.id)
              })
              this.getTotalList();
            }
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //过滤掉状态为禁用的类目
      filterStatus(obj) {
        obj = obj.filter(item => {
          if(item.children.length > 0){
            item.children = this.filterStatus(item.children);
          }
          return item.status == 0;
        })
        return obj
      },
      //展开或者收缩
      expandOrContract(){
        this.treeData = this.treeData.concat([])
        this.isOpenTree=!this.isOpenTree
        this.$refs.totalTree.store.defaultExpandAll = this.isOpenTree
      },
      handleNodeClick(data) {
        this.param.categoryId=data.id
        this.searchWay=0
        this.getTotalList()
      },
        //批量导出
      batchExport(){
        this.$refs.exportFile.export('库存总量','/stock/skuStock/selectByCategoryIdForExport.do',this.param,this.filterParam)
      },
      //快速搜索
      qSearch(){
        this.param.keyword=this.$refs.qSearch.inputValue
        this.searchWay=0
        this.getTotalList()
        this.advancedFilter=false;
      },
      //高级搜索
      goSearch(){
        this.advancedFilter=true;
      },
      submitSearch(){
        this.param.keyword='';
        this.$refs.qSearch.inputValue='';
        this.searchWay=1;
        this.getTotalList()
        this.advancedFilter=false;
      },
      //清空搜索条件
      concelTerm(){
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.param.keyword='';
        this.$refs.qSearch.inputValue=''
        this.getTotalList();
      },
      // //查看详情
      // checkDetail(row){
      //   for(let key in this.detailInfor){
      //     if(row[key]!=null){
      //       this.detailInfor[key]=row[key]
      //     }
      //   }
      //   this.detailSkuId=row.skuId;
      //   this.getDetailList();
      // },
      //获取库存详情
      getDetailList(){
        let json_param=JSON.stringify({pageSize:this.param_detail.pageSize,pageNum:this.param_detail.pageNum,skuId:this.detailSkuId})
        this.$ajaxPost('wms/stock/skuStock/selectSearchPageBySkuId.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.detailList=data.data.dataList
            this.param_detail.total=data.data.totalNum
            this.inventoryDetail=true;
          }else{
            this.$message.error(data.msg)
          }
        })
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
        this.getTotalList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getTotalList();
      },
      //每页数量改变
      sizeChange_detail(v) {
        this.param_detail.pageSize = v;
        this.getDetailList();
      },
      //当前页改变
      currentChange_detail(v) {
        this.param_detail.pageNum = v;
        this.getDetailList();
      },
    },
    components: {
      'exportFile':exportFile
    },
    mounted(){
      this.getCategoryTree();
      this.getCompanyNameList();
    }
  }
</script>

<style lang="scss">
  .total_inventory{
    display: flex;
    flex-wrap: nowrap;
    box-sizing: border-box;
    .leftTree{
      width: 16%;
      padding: 0 10px;
      margin-right: 2%;
      height: 602px;
      background-color: #ffffff;
      border: solid 1px #e5e5e5;
      overflow: auto;
    }
    .rightMain{
      width: 82%;
    }
    .addlocation{
      .el-form{
        display:flex;
        flex-wrap: wrap;
        .el-form-item{
          width: 49%;
          margin-right: 1%;
        }
        .el-input.is-disabled .el-input__inner{
          background-color: #ffffff;
          border: none !important;
        }
        .codeRule .el-form-item__content{
          display: flex;
          align-items: center;
          span{
            width: 120px;
          }
        }
      }
    }
    .tscDia.el-dialog{
      width: 1072px;
    }
    .el-form.tsc{
      .el-form-item{
        height: 32px;
        margin-bottom: 15px;
      }
      .el-form-item__label{
        height: 32px;
        line-height: 32px;
      }
      .el-form-item__content{
        line-height: 32px;
      }
      .moduleBox{
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        .tscLeft{
          width: 52%;
        }
        .tscRight{
          width: 46%;
        }
        .module{
          width: 100%;
          height:120px;
          border: 1px solid #eeeeee;
          padding: 30px;
        }
      }
    }
    .detailInfor .el-form-item{
      width: 33%;
    }
    .totalIn{
      .el-dialog{
        width: 850px;
      }
      .el-form{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .el-form-item__label,.el-form-item__content{
          height: 32px;
          line-height: 32px;
        }
        .range{
          width: 50%;
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          height: 65px;
          .el-input{
            width: 120px;
          }
          i{
            width: 15px;
            height: 1px;
            background-color: #666666;
            margin: 0 12px 22px 12px;
          }
        }
      }
    } 
  }
</style>
