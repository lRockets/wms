<template>
  <el-dialog 
    title="编辑商品明细" 
    :visible.sync="editDetailsdia"  
    append-to-body
    :close-on-click-modal='false'
    class="editDetailsdia" 
    @close='resetEditDetailsdia'>
    <el-row  type="flex" justify="space-between">
      <el-col class="leftTree" :span="4">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <div class="treeBox">
          <el-button type="text" style="color:#39b9fe;" @click="expandOrContract">展开 | 收缩</el-button>
          <el-tree 
            :data="elData" 
            :props="defaultProps"
            @node-click="handleNodeClick" 
            node-key="id" 
            ref="storeTree"
            :default-expand-all='isOpenTree'
            :filter-node-method="filterNode"
            :highlight-current="true"
            :expand-on-click-node='false'
            ></el-tree>
        </div>
      </el-col>
      <el-col class="middleTable" :span="10">
        <el-row class="tableTop">
          <search placeholder="请输入关键字进行搜索" @on-search="e_qSearch" :showIcon="false" ref="e_qSearch" style="width:280px" class="e_qSearch" :width="'250px'"></search>
        </el-row>
        <el-table ref="goodsList" border :data="goodsList" height="400px" @select-all='select' @select="select">
          <el-table-column align="center" type="selection" width="44"></el-table-column>
          <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsName" label="商品名称" width="240"></el-table-column>
          <el-table-column align="center" prop="skuCode" label="sku" width="110"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="barcode" label="商品条码"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="brandName" label="品牌"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="properties" label="规格属性"></el-table-column>
        </el-table>
      </el-col>
      <el-col class="rightTable" :span="9">
        <el-row class="tableTop">
          <p>选择的商品</p>
        </el-row>
        <el-table ref="checkedGoodsList" border :data="checkedGoodsList" height="400px">
          <el-table-column align="center" label='移除全部'>
            <template slot-scope="scope">
              <el-button type="text" @click="removeGood(scope)">移除</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
          <el-table-column  :show-overflow-tooltip="true" align="center" prop="goodsName" label="商品名称" width="240"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="skuCode" label="sku" width="110"></el-table-column>
          <el-table-column  :show-overflow-tooltip="true" align="center" prop="barcode" label="商品条码"></el-table-column>
          <el-table-column  :show-overflow-tooltip="true" align="center" prop="brandName" label="品牌"></el-table-column>
          <el-table-column  :show-overflow-tooltip="true" align="center" prop="properties" label="规格属性"></el-table-column>
        </el-table> 
        <div class="el-form-item__error" v-if="errorTip" style="position: initial;">请至少选择一个商品</div>
      </el-col>
    </el-row>
    <div style="text-align:right;margin-top:10px;">
      <el-button @click="concelEditGoods">取消</el-button>
      <el-button @click="saveEditGoods">保存</el-button>
    </div> 
  </el-dialog>
</template>

<script>
  export default {
    props:{
      checkedList:{
        type:Array,
        default() {
          return [];
        },
      },
      detailData:{
        type:Object,
        default() {
          return {};
        },
      },
      model: {
        type: String,
        default: '',
      }
    },
    data(){
      return{
        editDetailsdia:false,
        filterText: '',
        isOpenTree:true,
        elData: [],
        defaultProps: {
          children: 'children',
          label: 'categoryName',
        },
        categoryId:{
          id:'',
        },
        goodsList:[],  //全部商品列表
        checkedGoodsList:[],  //选择商品列表
        errorTip:false,
        aloneId: new Map(),
        currentList: new Map(),
        goodsListScroll:null,
        pageSize:15,
        pageNum:1,
        isFoot:false,
      }
    },
    methods:{
      resetEditDetailsdia(){
        this.pageNum = 1;
        this.goodsList = [];
        this.isFoot = false;
        this.errorTip=false;
      },
      //获取类目树
      getCategoryTree(){
        let json_param=JSON.stringify({})
        this.$ajaxPost('wms/category/selectCategoryTree.do',{reqParam:json_param}).then(({data}) => {
          if (data.code == 200) {
            this.elData=data.data.categoryList
            // this.categoryId.id=this.elData[0].id;
            this.goodsList = [];
            this.isFoot = false;
            this.getGoodsList(this.categoryId.id);
            // 设置默认选中的节点
            this.$nextTick(() => {
              if (!this.$refs.storeTree) {
                return;
              }
              const node = this.$refs.storeTree.getNode(this.categoryId.id);
              this.$refs.storeTree.setCurrentNode(node.data);
            });
          } else {
            this.$message.error(data.msg);
          }
        })
      },
       //展开或者收缩
      expandOrContract(){
        this.elData = this.elData.concat([])
        this.isOpenTree=!this.isOpenTree
        this.$refs.storeTree.store.defaultExpandAll = this.isOpenTree
      },
      //点击左侧树搜索
      handleNodeClick(data) {
        this.categoryId.id=data.id
        this.pageNum = 1;
        this.goodsList = [];
        this.isFoot = false;
        this.getGoodsList(this.categoryId.id);
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.categoryName.indexOf(value) !== -1;
      },
      //根据类目查询商品
      getGoodsList(c_Id){
        let json_param=JSON.stringify({pageSize:this.pageSize,pageNum:this.pageNum,categoryId:c_Id,keyword: this.$refs.e_qSearch? this.$refs.e_qSearch.inputValue : ''})
        this.$ajaxPost('wms/goodsSku/selectPageGoodsSkuByCategoryId.do',{reqParam:json_param}).then(({data}) => {
          if (data.code == 200) {
            if(data.data.dataList.length<15){
              this.isFoot = true;
            }
            this.goodsList=[
              ...this.goodsList,
              ...data.data.dataList
            ];
            this.tableRender();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      e_qSearch(){
        this.pageNum = 1;
        this.goodsList = [];
        this.isFoot = false;
        this.categoryId.id = '';
        this.$refs.storeTree.setCurrentNode([]);
        this.getGoodsList(this.categoryId.id)
      },
      // 渲染函数
      tableRender() {
        this.checkedGoodsList = [...this.aloneId].map((item) => {
          return item[1];
        });
        this.currentList = new Map();
        this.goodsList.forEach((item) => {
          this.currentList.set(item.id, item);
          const goodsList = this.$refs.goodsList;
          if (goodsList) {
            this.$nextTick(() => {
              const check = this.aloneId.has(item.id);
              this.$refs.goodsList.toggleRowSelection(item, check);
            })
          }
        })
      },
      // 选择
      select(selection){
        [...this.currentList].forEach((item) => {
          let has = false;
          for (const i of selection) {
            if (i.id === item[0]) {
              has = true;
              break;
            }
          }
          if (has) {
            this.aloneId.set(item[0], item[1]);
            return;
          }
          this.aloneId.delete(item[0])
        })
        this.tableRender();
      },
      //移除已选择的商品
      removeGood(scope){
        this.aloneId.delete(scope.row.id);
        this.tableRender();
      },
      //取消
      concelEditGoods(){
        this.editDetailsdia=false;
      },
      //保存
      saveEditGoods(){
        if (this.model === 'inventory') {
          this.$emit('save', this.checkedGoodsList);
          this.editDetailsdia=false;
          return;
        }
        if(this.checkedGoodsList.length>0){
          this.errorTip=false;
          for(let key in this.checkedGoodsList){
            delete this.checkedGoodsList[key].skuCode
            delete this.checkedGoodsList[key].barcode
            delete this.checkedGoodsList[key].goodsName
            delete this.checkedGoodsList[key].brandName
            delete this.checkedGoodsList[key].properties
          }
          let json_param=JSON.stringify({purinId:this.detailData.id,purinDetailList:this.checkedGoodsList})
          this.$ajaxPost('wms/in/purinDetail/insertPurinDetailList.do',{reqParam:json_param}).then(({data}) => {
            if (data.code == 200) {
              this.$parent.declareVariable();
              this.$message.success('新增商品成功')
              this.editDetailsdia=false;
            } else {
              this.$message.error(data.msg);
            }
          })
        }else{
          this.errorTip=true;
          return false
        }
      },
    },
    watch: {
      filterText(val){
        this.$refs.storeTree.filter(val);
      },
      editDetailsdia(val) {
        if (val) {
          this.$nextTick(() => {
            this.goodsListScroll = this.$refs.goodsList.$el.childNodes[2];
            let _this = this;
            this.goodsListScroll.addEventListener('scroll', function(e) {
              const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
              if(scrollDistance == 0){
                if(!_this.isFoot){
                  _this.pageNum ++
                  _this.getGoodsList(_this.categoryId.id);
                }
              }
            })  
          })
          this.checkedList.forEach((item) => {
            this.aloneId.set(item.id, item);
          })
          this.tableRender();
        }
      }
    },
    components: {},
    mounted() {
      this.getCategoryTree();
    }
  }
</script>
<style lang="scss">
 .editDetailsdia .el-dialog{
   width: 1253px;
   .treeBox{
     width: 100%;
      border: 1px solid #e5e5e5;
      margin-top: 10px;
      height: 400px;
      .el-tree{
        height: 368px;
        overflow: auto;
      }
   }
   .middleTable{
     border-left:1px dashed #d8dfe3 ;
     border-right:1px dashed #d8dfe3 ;
     padding: 0 28px;
   }
   .tableTop{
     line-height: 32px;
     height: 32px;
     margin:0 0 10px 0;
     p{
       font-size: 16px;
       color: #333333;
     }
   }
 }
</style>
