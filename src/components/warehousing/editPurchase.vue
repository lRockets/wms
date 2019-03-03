<template>
  <el-dialog title="编辑商品明细" :visible.sync="editDetailsdia"  :modal-append-to-body="false" class="editDetailsdia" @close='resetEditDetailsdia'>
    <el-row  type="flex" justify="space-between">
      <el-col class="leftTree" :span="4">
        <el-input size="small" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
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
        <el-table ref="goodsList" border :data="goodsList" height="400px" @select-all='selectionChange' @select="selectionChange">
          <el-table-column align="center" type="selection" width="44"></el-table-column>
          <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="skuCode" label="sku" width="110"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="barcode" label="商品条码"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsName" label="商品名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="brandName" label="品牌"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="properties" label="规格属性"></el-table-column>
          <template slot="empty">
            <div class="noData">
              <div class="noData-img"></div>
              <p>暂无数据</p>
            </div>
          </template>
        </el-table>
      </el-col>
      <el-col class="rightTable" :span="9">
        <el-row class="tableTop">
          <p>选择的商品</p>
        </el-row>
        <el-table ref="checkedGoodsList" border :data="checkedGoodsList" height="400px">
          <el-table-column align="center" label='移除全部'>
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="removeGood(scope)">移除</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="skuCode" label="sku" width="110"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="barcode" label="商品条码"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsName" label="商品名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="brandName" label="品牌"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="properties" label="规格属性"></el-table-column>
          <template slot="empty">
            <div class="noData">
              <div class="noData-img"></div>
              <p>暂无数据</p>
            </div>
          </template>
        </el-table> 
        <div class="el-form-item__error" v-if="errorTip" style="position: initial;">请至少选择一个商品</div>
      </el-col>
    </el-row>
    <div style="text-align:right;margin-top:10px;">
      <el-button size="small" @click="concelEditGoods">取消</el-button>
      <el-button size="small" @click="saveEditGoods" class="total">保存</el-button>
    </div> 
  </el-dialog>
</template>

<script>
  export default {
    props:{
      checkedList:{
        type:Array,
        default:[],
      },
      detailData:{
        type:Object,
        default:{},
      },
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
        goodsListScroll: null,
        goodsListScrollFlag: true,
        pageSize:15,
        pageNum:1,
        isFoot:false,
      }
    },
    methods:{
      resetEditDetailsdia(){
        this.goodsList = [];
        this.isFoot = false;
        this.pageNum = 1;
        this.errorTip=false;
      },
      //获取类目树
      getCategoryTree(){
        let json_param=JSON.stringify({})
        this.$ajaxPost('wms/category/selectCategoryTree.do',{reqParam:json_param}).then(({data}) => {
          if (data.code == 200) {
            this.elData=data.data.categoryList
            this.getCheckedList();
            this.goodsList = [];
            this.isFoot = false;
            this.pageNum = 1;
            this.getGoodsList(this.categoryId.id);
            // 设置默认选中的节点
            this.$nextTick(() => {
              if (this.$refs.storeTree) {
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
        this.checkedList.forEach((item)=>{
          this.aloneId.set(item.id,item);
        })
        let json_param=JSON.stringify({categoryId:c_Id,keyword:this.$refs.e_qSearch.inputValue,pageSize:this.pageSize,pageNum:this.pageNum })
        this.$ajaxPost('wms/goodsSku/selectPageGoodsSkuByCategoryId.do',{reqParam:json_param}).then(({data}) => {
          if (data.code == 200) {
            if(data.data.dataList.length<15){
              this.isFoot = true;
            }
            this.goodsList=[
              ...this.goodsList,
              ...data.data.dataList
            ];
            this.judgeGoods()
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      //获取已选商品
      getCheckedList(){
        this.checkedList.forEach(item=>{
          this.checkedGoodsList.push(
            {
              skuCode:item.skuCode,
              barcode:item.barcode,
              goodsName:item.goodsName,
              brandName:item.brandName,
              properties:item.properties,
              goodsId:item.goodsId,
              id:item.id,
              skuId:item.id,
              price:item.price,
              cost:item.cost,
            }
          )
        })
        this.$nextTick(()=>{
          this.checkedGoodsList.forEach(item=>{
            this.aloneId.set(item.id,item)
          })
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
     //选择
      selectionChange(selection){
        [...this.currentList].forEach((item) => {
          let has = false;
          for (const i of selection) {
            if(i.id === item[0]) {
              has = true;
              break;
            }
          } 
          if (has) { 
            let obj = {};
            obj.skuCode = item[1].skuCode;
            obj.barcode = item[1].barcode;
            obj.goodsName = item[1].goodsName;
            obj.brandName = item[1].brandName;
            obj.properties = item[1].properties;
            obj.goodsId = item[1].goodsId;
            obj.id = item[1].id;
            obj.skuId = item[1].id;
            obj.price = item[1].price;
            obj.cost = item[1].cost;
            this.aloneId.set(item[0],obj);
          } else {
            this.aloneId.delete(item[0])
          }
        })
        this.judgeGoods();
      },
      //移除已选择的商品
      removeGood(scope){
        if(this.checkedGoodsList.length<2){
          this.$message.error('请至少保留一条商品信息')
        }else{
          this.aloneId.delete(scope.row.id);
          this.judgeGoods();
        }
      },
      judgeGoods(){
        this.checkedGoodsList = [...this.aloneId].map((item)=>{
          return item[1]
        })
        this.currentList = new Map();
        this.goodsList.forEach((item) => {
          this.currentList.set(item.id, item);
          this.$nextTick(() => {
            const check = this.aloneId.has(item.id);
            this.$refs.goodsList.toggleRowSelection(item,check);
          })
        });
      },
      //取消
      concelEditGoods(){
        this.editDetailsdia=false;
        this.categoryId.id='';
      },
      //保存
      saveEditGoods(){
        if(this.checkedGoodsList.length>0){
          this.errorTip=false;
          let json_param=JSON.stringify({purinId:this.detailData.id,purinDetailList:this.checkedGoodsList})
          this.$ajaxPost('wms/in/purinDetail/insertPurinDetailList.do',{reqParam:json_param}).then(({data}) => {
            if (data.code == 200) {
              this.$parent.declareVariable();
              this.$message.success('保存成功')
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
      myAddEvent(obj, ev, fn){
        if(obj.attachEvent) {
            obj.attachEvent("on" + ev, fn);
        }
        else {
            obj.addEventListener(ev, fn, false);
        }
      }
    },
    watch: {
      filterText(val){
        this.$refs.storeTree.filter(val);
      },
      editDetailsdia() {
        this.$nextTick(() => {
          if (this.goodsListScrollFlag) {
            this.goodsListScrollFlag = false;
            this.goodsListScroll = this.$refs.goodsList.$el.childNodes[2];
            let _this = this
            this.goodsListScroll.myAddEvent('scroll', function (e) {
              const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
              if (scrollDistance == 0) {
                if(!_this.isFoot){
                  _this.pageNum ++
                  _this.getGoodsList(_this.categoryId.id);
                }
              }
            })
          } 
        })
      },
    },
    components: {},
    mounted() {
      
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
