<template>
  <div class="safe_picking_stock">
    <!-- <header class="top-head safeStock">
      <div class="cardBox">
        <span :class="{active:isActive}" @click="safePickingBtn">安全拣货库存</span>
        <span :class="{active:!isActive}" @click="inventoryConfig">库存配置</span>
      </div>
    </header> -->
    <header class="top-head" v-show="isActive">
      <el-button size="small" @click="addInventoryBtn" class="total">新增</el-button>
      <el-button size="small" @click="batchExport">导出</el-button>
      <el-button size="small" @click="deleteRows">删除</el-button>
      <div class="header-right f-fr">
        <search placeholder="请输入商品编码，SKU，条码，名称进行搜索" @on-search="qSearch" :width="'320px'" :showIcon="false" ref="qSearch" style="width:350px"></search>
        <el-button size="small" @click="goSearch" class="total">高级搜索</el-button>
      </div>
    </header>
    <div class="safePicking" v-if="isActive" key="safePicking">
      <div class="leftTree" >
        <el-button type="text" style="color:#39b9fe;" @click="expandOrContract">展开 | 收缩</el-button>
        <el-tree
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          node-key="id"
          ref="cateTree"
          :default-expanded-keys="defaultExpandArray"
          :default-expand-all='isOpenTree'
          :highlight-current="true"
          :expand-on-click-node='false'
        ></el-tree>
      </div>
      <div class="rightMain">
        <el-table ref="safeStockList" border :data="safeStockList" height=500px  @selection-change="handleSelectionChange" >
          <el-table-column align="center" type="selection" width="44"></el-table-column>
          <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
          <el-table-column align="center" prop="name" label="操作" width="140">
            <template slot-scope="scope">
              <el-button type="text" @click="editStockRow(scope)">编辑</el-button>
              <el-button type="text" @click="deleteStockRow(scope)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="图片" width="74">
            <template slot-scope="scope">
              <img :src="$Util.formatImageUrl(scope.row.imageUrl)" style="height:45px;width:100%;display:block; margin-top:5px;"/>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsCode" label="商品编码" width="90"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="skuCode" label="SKU" width="90"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="barcode" label="商品条码" width="120"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsName" label="商品名称" width="120"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="brandName" label="品牌"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="properties" label="规格属性" width="150"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="secureStockQty" label="安全库存" sortable width="110"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="stoareaNames" label="库存区域" width="100"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="updateTime" label="更新时间"  width="170"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="updateByname" label="更新人" ></el-table-column>
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
              <el-form-item prop="startSecureStockQty" label="安全库存：">
                <el-input size="small" v-model="filterParam.startSecureStockQty" maxlength="6" onkeyup="value=value.replace(/^(00+)|[^\d]+/g,'')"></el-input>
              </el-form-item>
              <i></i>
              <el-form-item prop="endSecureStockQty" label-width="0">
                <el-input size="small" v-model="filterParam.endSecureStockQty" maxlength="6" onkeyup="value=value.replace(/^(00+)|[^\d]+/g,'')"></el-input>
              </el-form-item>
            </div>
            <div style="width: 100%;text-align:right;">
              <el-button size="small" @click="concelTerm">清空条件</el-button>
              <el-button size="small" @click="submitSearch" class="total">查询</el-button>
            </div>
          </el-form>
        </el-dialog>
        <el-dialog :title="stockInforTitle" :visible.sync="safeInventoryDia"  :modal-append-to-body="false" @close='resetStockDia' class="stockInfor">
          <el-form :model="stockInfor" label-width="100px" class="detailInfor" :rules="stockInforRule" ref="stockInforRef" size="small">
            <el-form-item prop="skuCode" label="商品SKU：" style="width: 100%">
              <el-input size="small" v-model="stockInfor.skuCode" style="width:280px"></el-input>
            </el-form-item>
            <el-form-item label="商品编码：" style="width: 33%">{{stockInfor.goodsCode}}</el-form-item>
            <el-form-item label="商品条码：" style="width: 33%">{{stockInfor.barcode}}</el-form-item>
            <el-form-item label="商品名称：" style="width: 33%">{{stockInfor.goodsName}}</el-form-item>
            <el-form-item label="品牌：" style="width: 33%">{{stockInfor.brandName}}</el-form-item>
            <el-form-item label="规格属性：" style="width: 33%">{{stockInfor.properties}}</el-form-item>
            <el-form-item prop="secureStockQty" label="安全库存：" style="width: 48%">
              <el-input size="small" v-model="stockInfor.secureStockQty" style="width:280px" maxlength="5"></el-input>
            </el-form-item>
            <el-form-item prop="stoareaIds" label="库存区域：" style="width: 48%">
              <el-select size="small" v-model="stockInfor.stoareaIds" multiple style="width:280px" placeholder="请选择（可多选）">
                <template v-for="(item,index) in reservoirList">
                  <el-option :label="item.stoareaName" :value="item.id" :key="index"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <div style="width: 100%;text-align:right;">
              <el-button size="small" @click="concelAddStock">取消</el-button>
              <el-button size="small" @click="saveAddStock" class="total" v-if="stockInforTitle=='安全库存'">保存</el-button>
              <el-button size="small" @click="saveEditStock" class="total" v-if="stockInforTitle=='编辑安全库存'">保存</el-button>
            </div>
          </el-form>
        </el-dialog>
      </div>
    </div>
    <div class="InventoryConfig" v-else key="InventoryConfig">
      <el-form :model="configParam" label-width="120px" :rules="configParamRule" ref="configParamRef" size="small">
        <el-form-item prop="stoareaIds" label="默认库存区域：" class="range">
          <el-select size="small" v-model="configParam.stoareaIds" multiple style="width:200px" placeholder="请选择（可多选）">
            <template v-for="(item,index) in reservoirList">
              <el-option :label="item.stoareaName" :value="item.id" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label-width="20px" prop="isAutoOnshelf">
          <el-checkbox v-model="configParam.isAutoOnshelf" true-label='0' false-label='-1'>自动生成补货上架单</el-checkbox>
        </el-form-item>
        <el-form-item label-width="20px" prop="confStockQty">
          <p>当商品库存数 - 安全库存的差值小于等于 <el-input size="small" maxlength="3" style="width: 70px;margin: 0 20px" v-model="configParam.confStockQty"></el-input>时，自动生成补货上架单</p>
          <p class="note">其中商品库存数=可用库存数+锁定库存数</p>
        </el-form-item>
        <el-form-item label-width="20px">
          <el-button size="small" @click="saveConfigBtn" class="total">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
     <export-file :idsArrary='ids' ref="exportFile"></export-file>
  </div>
</template>

<script>
import exportFile from '@/components/export/index';
  export default {
    props:{},
    data(){
      const skuCodeReg = (rule, value, callback) => {
        let v = value.trim();
        if(v){
          if(this.stockRowdata.skuCode!==this.stockInfor.skuCode){
            this.stockInfor.goodsCode=''
            this.stockInfor.barcode=''
            this.stockInfor.goodsName=''
            this.stockInfor.brandName=''
            this.stockInfor.properties=''
            //校验商品sku是否合法
            let json_param=JSON.stringify({skuCode:value})
            this.$ajaxPost('wms/secureStock/checkSkuCode.do',{reqParam:json_param}).then(({data})=>{
              if(data.code==200){
                if(data.data.result==1){
                  callback();
                  //根据商品sku查询商品信息
                  this.$ajaxPost('wms/goodsSku/selectGoodsSkuBySkuCode.do',{reqParam:json_param}).then(({data})=>{
                    if(data.code==200){
                      this.stockInfor.goodsCode=data.data.goodsCode
                      this.stockInfor.barcode=data.data.barcode
                      this.stockInfor.goodsName=data.data.goodsName
                      this.stockInfor.brandName=data.data.brandName
                      this.stockInfor.properties=data.data.properties
                    }else{
                      this.$message.error(data.msg)
                    }
                  })
                }else{
                  callback(new Error(data.data.msg));
                }
              }else{
                this.$message.error(data.msg)
              }
            })
          }else{
            callback();
          }
        }else{
          callback(new Error('请输SKU'));
        }
      };
      const secureStockQtyReg = (rule, value, callback) => {
        let v = value.toString().trim();
        let flag = /^(\d|[1-9]\d{0,4})$/.test(v);
        if (!flag) {
          callback(new Error('请输入0-99999的整数'));
        } else {
          callback();
        }
      };
      const num1Reg = (rule, value, callback) => {
        let v = value.toString().trim();
        let flag = /^(\d|[1-9]\d|100)$/.test(v);
        if (this.configParam.isAutoOnshelf=='0') {
          if (!flag) {
            callback(new Error('请输入0-100的整数'));
          } else {
            callback();
          }
        }else {
          callback();
        }
      };
      return{
        isActive:true,
        isOpenTree:false,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'categoryName',
        },
        defaultExpandArray:[],
        advancedFilter:false,
        reservoirList:[],  //库区列表
        filterParam:{
          startSecureStockQty:'',
          endSecureStockQty:'',
          categoryId:'',
        },
        filterParamRule:{
          startSecureStockQty:[{trigger: 'change',  validator:(rule, value, callback)=>this.$Util.RegExp.QtyMix(rule, value, callback,this.filterParam.endSecureStockQty)}],
          endSecureStockQty:[{trigger: 'change',  validator:(rule, value, callback)=>this.$Util.RegExp.QtyMax(rule, value, callback,this.filterParam.startSecureStockQty)}],
        },
        ids:[],
        safeStockList:[],
        safeInventoryDia:false, //安全库存
        stockInforTitle:'安全库存',
        stockInfor:{
          skuCode:'',
          goodsCode:'',
          barcode:'',
          goodsName:'',
          brandName:'',
          properties:'',
          secureStockQty:'',
          stoareaIds:[],
        },
        stockRowdata:{},  
        stockInforRule:{
          skuCode:[{required: true, trigger: 'change', validator:skuCodeReg}],
          secureStockQty:[{required: true, trigger: 'change', validator:secureStockQtyReg}],
          stoareaIds:[{required: true, trigger: 'change', message:'请选择库存区域'}],
        },
        configParam:{  //安全库存表单
          stoareaIds:'',
          isAutoOnshelf:'0',
          confStockQty:'',
        },
        configParamRule:{
          confStockQty:[{trigger: 'change', validator: num1Reg}],
        },
        param: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        total: 10,
        param_detail: {
          pageNum: 1,
          pageSize: 15,
        },
        total_detail: 10,
      }
    },
    methods:{
      resetStockDia(val){
        this.$refs.stockInforRef.resetFields()
        Object.keys(this.stockInfor).forEach(key => {
          this.stockInfor[key] = ''
        })
        this.stockInfor.stoareaIds=[];
      },
      //安全拣货Btn
      safePickingBtn(){
        this.isActive=true;
        for(let key in this.configParam){
          this.configParam[key]=''
        }
        this.configParam.isAutoOnshelf='0'
        this.getCategoryTree();
      },
      //库存配置
      inventoryConfig(){
        this.isActive=false;
        let json_param=JSON.stringify({})
        this.$ajaxPost('wms/confStock/select.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            if(data.data!=null){
              for(let key in this.configParam){
                if(data.data[key]!=null){
                  this.configParam[key]=data.data[key]
                }
              }
              this.configParam.isAutoOnshelf=this.configParam.isAutoOnshelf+''
              this.configParam.stoareaIds=data.data.stoareaIds.split(',')
              for(var i=0;i<this.configParam.stoareaIds.length;i++){
                this.configParam.stoareaIds[i]=this.configParam.stoareaIds[i]-0
              }
            }
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //批量删除
      deleteRows(){
        if(this.ids.length>0){
          this.$confirm('删除数据后，不可恢复，请谨慎操作？', '删除安全库存', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updStatus(this.ids.toString(),'-2','删除成功')
          }).catch(() => {})
        }else{
          this.$message.error('请勾选需删除的数据')
        }
      },
      //删除单行
      deleteStockRow(scope){
        this.$confirm('删除数据后，不可恢复，请谨慎操作？', '删除安全库存', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          this.updStatus(scope.row.skuCode,'-2','删除成功')
        }).catch(() => {})
      },
      //获取安全库存列表
      getsafeStockList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/secureStock/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.safeStockList=data.data.dataList
            this.total=data.data.totalNum
            this.advancedFilter=false;
          }else{
            this.$message.error(data.msg)
          }
        })
      },
       //批量导出
      batchExport(){
        this.$refs.exportFile.export('安全库存','/secureStock/export.do',this.param,this.filterParam)
      },
     //获取类目树
      getCategoryTree(){
        this.$ajaxPost('wms/category/selectCategoryTree.do',{}).then(({data})=>{
          if(data.code==200){
            this.treeData=data.data.categoryList
            this.searchWay=0;
            // this.filterParam.categoryId=this.treeData[0].id;
            // 设置默认选中的节点
            this.$nextTick(() => {
              // const node = this.$refs.cateTree.getNode(this.treeData[0].id);
              // this.$refs.cateTree.setCurrentNode(node.data);
            });
            this.getsafeStockList();
          }else{
            this.$message.error(data.msg)
          }
        })
      },
       //展开或者收缩
      expandOrContract(){
        this.treeData = this.treeData.concat([])
        this.isOpenTree=!this.isOpenTree
        this.$refs.cateTree.store.defaultExpandAll = this.isOpenTree
      },
      handleNodeClick(data) {
        this.filterParam.categoryId=data.id
        this.searchWay=1
        this.getsafeStockList()
      },
       //获取所有库区
      getReservoirList(){
        let json_param=JSON.stringify({pageNum:1,pageSize:9999,keyword:''})
        this.$ajaxPost('wms/storehouseArea/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.reservoirList=data.data.dataList
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //新增库存
      addInventoryBtn(){
        this.safeInventoryDia=true;
        this.stockInforTitle='安全库存'
      },
      //编辑库存
      editStockRow(scope){
        for(let key in this.stockInfor){
          if(scope.row[key]!=null){
            this.stockInfor[key]=scope.row[key]
          }
        }
        this.stockInfor.stoareaIds=this.stockInfor.stoareaIds.split(',')
        for(var i=0;i<this.stockInfor.stoareaIds.length;i++){
          this.stockInfor.stoareaIds[i]=this.stockInfor.stoareaIds[i]-0
        }
        this.stockRowdata=JSON.parse(JSON.stringify(scope.row))
        this.safeInventoryDia=true;
        this.stockInforTitle='编辑安全库存'
      },
      //取消
      concelAddStock(){
        this.safeInventoryDia=false;
      },
      //保存新增
      saveAddStock(){
        this.$refs.stockInforRef.validate((valid) => {
          if (valid) {
            let stoareaId= JSON.parse(JSON.stringify(this.stockInfor.stoareaIds));
            let json_param = JSON.stringify({secureStockQty:this.stockInfor.secureStockQty,skuCode:this.stockInfor.skuCode,stoareaIds:stoareaId.toString()})
            this.$ajaxPost('wms/secureStock/add.do', {reqParam: json_param}).then(({data}) => {
              if (data.code == 200) {
                this.$message.success('新增成功')
                this.safeInventoryDia = false
                this.getsafeStockList()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            return false
          }
        })
      },
      //保存编辑
      saveEditStock(){
        this.$refs.stockInforRef.validate((valid) => {
          if (valid) {
            let stoareaId= JSON.parse(JSON.stringify(this.stockInfor.stoareaIds));
            let json_param = JSON.stringify({
              secureStockQty:this.stockInfor.secureStockQty,
              skuCode:this.stockInfor.skuCode,
              stoareaIds:stoareaId.toString(),
              oldSkuCode:this.stockRowdata.skuCode})
            this.$ajaxPost('wms/secureStock/update.do', {reqParam: json_param}).then(({data}) => {
              if (data.code == 200) {
                this.$message.success('编辑成功')
                this.safeInventoryDia = false
                this.getsafeStockList()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            return false
          }
        })
      },
      //快速搜索
      qSearch(){
        this.param.keyword=this.$refs.qSearch.inputValue
        this.searchWay=0
        this.getsafeStockList()
        this.advancedFilter=false;
        this.$refs.cateTree.setCurrentNode([]);
      },
      //高级搜索
      goSearch(){
        this.advancedFilter=true;
      },
      submitSearch(){
        this.param.keyword='';
        this.$refs.qSearch.inputValue='';
        this.searchWay=1;
        this.getsafeStockList()
        this.advancedFilter=false;
      },
      //清空搜索条件
      concelTerm(){
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.param.keyword='';
        this.$refs.qSearch.inputValue=''
        this.stockInfor.stoareaIds=[];
        this.getsafeStockList();
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
        this.getsafeStockList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getsafeStockList();
      },
      //批量更新状态
      updStatus (codes, status, msg) {
        this.$ajaxPost('wms/secureStock/updateBatchStatus.do', {reqParam: JSON.stringify({oldSkuCodes: codes, status: status})}).then(({data}) => {
          if (data.code == 200) {
            this.$message.success(msg)
            this.getsafeStockList()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      //每页数量改变
      sizeChange_detail(v) {
        this.param_detail.pageSize = v;
        // this.getTotalList();
      },
      //当前页改变
      currentChange_detail(v) {
        this.param_detail.pageNum = v;
        // this.getTotalList();
      },
      //保存配置
      saveConfigBtn(){
        this.$refs.configParamRef.validate((valid) => {
          if (valid) {
            let stoareaId= JSON.parse(JSON.stringify(this.configParam.stoareaIds));
            let json_param = JSON.stringify({
              confStockQty:this.configParam.confStockQty,
              isAutoOnshelf:this.configParam.isAutoOnshelf,
              stoareaIds:stoareaId.toString()})
            this.$ajaxPost('wms/confStock/update.do', {reqParam: json_param}).then(({data}) => {
              if (data.code == 200) {
                this.$message.success('编辑成功')
                this.inventoryConfig();
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
    },
    components: {
      'exportFile':exportFile
    },
    mounted(){
      this.getCategoryTree();
      this.getReservoirList();
    }
  }
</script>

<style lang="scss">
  .safePicking{
    display: flex;
    flex-wrap: nowrap;
    box-sizing: border-box;
    .leftTree{
      width: 16%;
      padding: 0 10px;
      margin-right: 2%;
      height:550px;
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
  }
  .top-head.safeStock{
    border-bottom:1px dashed #d8dfe3;
    padding: 0 0 5px 0;
    margin-bottom: 20px;
  }
  .totalIn{
    .el-dialog{
      width: 425px;
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
        width: 100%;
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
  .stockInfor .el-dialog{
    width: 850px;
  }
</style>
