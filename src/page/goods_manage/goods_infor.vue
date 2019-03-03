<template>
  <div>
    <header class="top-head">
      <el-button class="total" size="small" @click="addGoodsBtn">新增</el-button>
      <el-button class="total" size="small" @click="deleteGoodsBtn">删除</el-button>
      <el-button class="total" size="small" @click="startGoodsBtn">启用</el-button>
      <el-button class="total" size="small" @click="forbidGoodsBtn">禁用</el-button>
      <!-- <el-button class="total" size="small" @click="tscBtn">条码打印</el-button> -->
      <div class="header-right f-fr">
        <search placeholder="请输入商品编码，SKU，条码，名称，进行搜索" 
                width="320px" 
                @on-search="qSearch" 
                :showIcon="false" 
                ref="qSearch"></search>
        <el-button class="total" size="small" @click="goSearch">高级搜索</el-button>
      </div>
    </header>
    <div class="storage_location">
      <div class="leftTree">
        <el-button type="text" style="color:#39b9fe;" @click="toggleTree">展开 | 收缩</el-button>
        <el-tree :data="treeData" ref="treeRef"
                :props="defaultProps"
                :default-expand-all="treeBoo"
                @node-click="handleNodeClick"
                node-key="id"
                :expand-on-click-node='true'
                :default-expanded-keys="defaultExpandArray"></el-tree>
      </div>
      <div class="rightMain">
        <el-table ref="goodsList" 
                  border
                  class="goods-table" 
                  :data="goodsList" 
                  height=500px 
                  @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column type="expand" width="60">
              <template slot-scope="scope">
                <el-table
                  class="innerSkuTable"
                  :data="scope.row.tGoodsSkuList"
                  style="width: 100%">
                  <el-table-column
                    width="455">
                  </el-table-column>
                  <el-table-column
                    prop="skuCode"
                    align="center"
                    width="120"
                    label="SKU">
                  </el-table-column>
                  <el-table-column
                    prop="barcode"
                    align="center"
                    width="120"
                    label="商品条码">
                  </el-table-column>
                  <el-table-column
                    prop="properties"
                    align="center"
                    width="120"
                    label="规格属性">
                  </el-table-column>
                  <el-table-column
                    prop="assitBarcode"
                    align="center"
                    width="120"
                    label="辅助条码">
                  </el-table-column>
                  <el-table-column
                    prop="extNo"
                    align="center"
                    width="120"
                    label="外部SKU">
                  </el-table-column>
                  <el-table-column
                    prop="sourceName"
                    align="center"
                    width="120"
                    label="数据来源">
                  </el-table-column>
                  <el-table-column>
                  </el-table-column>
                </el-table>
              </template>
          </el-table-column>
          <el-table-column type="index" align="center" label="行号" width="60"></el-table-column>
          <el-table-column align="center" prop="name" label="操作" width="160">
            <template slot-scope="scope">
              <el-button type="text" @click="editorRow(scope.row)">编辑</el-button>
              <!-- <el-button type="text" @click="copyRow(scope.row)">复制</el-button> -->
            </template>
          </el-table-column>
          <el-table-column align="center" prop="image_url" label="商品图片" width="120">
            <template slot-scope="scope">
              <div class="wrap-img">
                <img :src="scope.row.IMGURL">
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="goodsCode" label="商品编码" width="120"></el-table-column>
          <el-table-column align="center" prop="goodsName" label="商品名称" width="120"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="上级类目" width="120"></el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌" width="120"></el-table-column>
          <!-- <el-table-column align="center" prop="properties" label="规格属性"></el-table-column> -->
          <el-table-column align="center" prop="statusName" label="状态" width="120"></el-table-column>
          <el-table-column align="center" prop="ownerName" label="商品货主" width="120"></el-table-column>
          <el-table-column align="center" prop="goodsExtNo" label="外部编码"></el-table-column>
          <!--<el-table-column align="center" prop="extNo" label="外部编码"></el-table-column>-->
          <!-- <el-table-column align="center" prop="extNo" label="外部SKU"></el-table-column>
          <el-table-column align="center" prop="" label="数据来源"></el-table-column>
          <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
          <el-table-column align="center" prop="updateByname" label="更新人"></el-table-column> -->
        </el-table>
        <!--分页-->
        <el-pagination background :page-sizes="[15,30,50,100]"
                      :page-size="param.pageSize"
                      :total="total"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="sizeChange"
                      @current-change="currentChange"
                      :current-page.sync="param.pageNum"
                      style="margin-top: 20px;text-align: center;">
        </el-pagination>
        <el-dialog title="高级筛选" :visible.sync="advancedFilter" :modal-append-to-body="false" class='filterParam'>
          <el-form :model="filterParam" size="small" label-width='100px'>
            <el-form-item prop="status" label="状态：">
              <el-select v-model="filterParam.status" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="启用" value="0"></el-option>
                <el-option label="禁用" value="-1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="brandId" label="品牌：">
              <el-select v-model="filterParam.brandId" placeholder="请选择品牌">
                <template v-for="(item,index) in brandList">
                  <el-option :label="item.brandName" :value="item.id" :key="index"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item prop="ownerId" label="商品货主：">
              <el-select v-model="filterParam.ownerId" placeholder="请选择货主">
                <template v-for="(item,index) in ownerList">
                  <el-option :label="item.ownerName" :value="item.id" :key="index"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item style="width:100%;text-align:right;">
              <el-button @click="concelTerm">清空条件</el-button>
              <el-button @click="submitSearch" class="total">查询</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog title="条码打印" :visible.sync="tscDia" :modal-append-to-body="false" class="tscDia">
          <el-form :model="tscForm" ref="tscRef" :rules="tscRule" class="tsc">
            <div class="moduleBox">
              <div class="tscLeft">
                <div class="module">
                  <el-form-item prop="barcode_printer" label="目标打印机：">
                    <el-select v-model="tscForm.barcode_printer" placeholder="请选择目标打印机">
                      <el-option label="A" value="0"></el-option>
                      <el-option label="B" value="1"></el-option>
                      <el-option label="C" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="barcode_printer" label="状态：">
                    <p></p>
                  </el-form-item>
                  <el-form-item prop="barcode_printer" label="位置：">
                    <p></p>
                  </el-form-item>
                </div>
              </div>
              <div class="tscRight"></div>
            </div>
            <el-form-item style="width: 100%">
              <el-button>清空条件</el-button>
              <el-button>查询</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { baseURL } from '@/assets/js/uri.js';
export default {
  props: {},
  data () {
    return {
      treeBoo: true,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'categoryName',
      },
      brandList: [],
      ownerList: [],
      defaultExpandArray: [],
      advancedFilter: false,
      filterParam: {
        status: '',
        brandId: '',
        ownerId:'',
        categoryId: '',
      },
      ids: [],
      goodsList: [],
      active: '1',
      tscDia: false,  //条码打印弹窗
      tscForm: {
        barcode_printer: '',
      },
      searchWay: 0,
      tscRule: {},
      param: {
        pageNum: 1,
        pageSize: 15,
        keyword: ''
      },
      total: 10,
    }
  },
  methods: {
    // 展开收缩树
    toggleTree () {
      this.treeData = this.treeData.concat([])
      this.treeBoo = !this.treeBoo
      this.$refs.treeRef.store.defaultExpandAll = this.treeBoo
      //下面这个循环也有效，备用
      /*
          for(var i=0;i<this.$refs.treeRef.store._getAllNodes().length;i++){
            this.$refs.treeRef.store._getAllNodes()[i].expanded=this.treeBoo;
          }*/
    },
    //获取类目树
    getCategoryTree () {
      this.$ajaxPost('wms/category/selectCategoryTree.do', {}).then(({data}) => {
        if (data.code == 200) {
          this.treeData = data.data.categoryList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //获取商品信息
    getGoodsInfor (param) {
      param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay])
      let json_param = JSON.stringify(param)
      this.$ajaxPost('wms/goods/selectGoodsAndContainSkuPage.do', {reqParam: json_param}).then(({data}) => {
        if (data.code == 200) {
          this.goodsList = data.data.dataList.map((item) => {
            return {
              IMGURL: this.$Util.formatImageUrl(item.image_url),
              ...item,
            }
          });
          this.total = data.data.totalNum
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //获取所有品牌
    getBrandList () {
      this.param.pageSize = 10000
      let json_param = JSON.stringify(this.param)
      this.$ajaxPost('wms/brand/selectPage.do', {reqParam: json_param}).then(({data}) => {
        if (data.code == 200) {
          this.brandList = data.data.dataList
          this.param.pageSize = 15
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //获取所有货主
    getOwnerList () {
      let json_param = JSON.stringify({pageSize:9999,pageNum:1})
      this.$ajaxPost('wms/owner/selectPage.do', {reqParam: json_param}).then(({data}) => {
        if (data.code == 200) {
          this.ownerList = data.data.dataList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleNodeClick (data) {
      this.filterParam.categoryId=data.id
      // this.filterParam.typeOf=data.typeOf
      // this.filterParam.categoryId = 1
      this.searchWay = 1
      this.getGoodsInfor()
    },
    //快速搜索
    qSearch () {
      this.searchWay = 0
      this.param.keyword = this.$refs.qSearch.inputValue
      this.getGoodsInfor()
    },
    //高级搜索
    goSearch () {
      this.advancedFilter = true
    },
    submitSearch () {
      this.filterParam.categoryId = ''
      this.searchWay = 1
      this.param.keyword = ''
      this.$refs.qSearch.inputValue = ''
      this.getGoodsInfor()
    },
    //清空搜索条件
    concelTerm () {
      Object.keys(this.filterParam).forEach(key => {
        this.filterParam[key] = ''
      })
      this.filterParam.status = ''
      this.getGoodsInfor()
    },
    //新增
    addGoodsBtn () {
      this.$router.push('/goods_manage/add_goods')
    },
    //删除
    deleteGoodsBtn () {
      if (this.ids.length > 0) {
        this.$confirm('删除商品后，不可恢复，请谨慎操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updStatus(this.ids.toString(),'-2','删除成功')
        }).catch(() => {})
      } else {
        this.$message.warning('请至少选择一条商品信息')
      }
    },
    //启用
    startGoodsBtn () {
      if (this.ids.length > 0) {
        this.updStatus(this.ids.toString(),'0','启用成功')
      } else {
        this.$message.warning('请至少选择一条数据')
      }
    },
    //禁用
    forbidGoodsBtn () {
      if (this.ids.length > 0) {
        this.updStatus(this.ids.toString(),'-1','禁用成功')
      } else {
        this.$message.warning('请至少选择一条数据')
      }
    },
    //批量更新状态
    updStatus (ids, status, msg) {
      this.$ajaxPost('wms/goods/updateBatchStatus.do', {reqParam: JSON.stringify({ids: ids, status: status})}).then(({data}) => {
        if (data.code == 200) {
          this.$message.success(msg)
          this.getGoodsInfor()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //编辑
    editorRow (row) {
      this.$router.push(`/goods_manage/edit_goods/${row.id}`);
    },
    //复制
    copyRow (row) {
      // this.ADD_DYNAMIC_TAGS({
      //   name: '新增商品', 
      //   path: `/goods_manage/edit_goods/${row.id}`,
      // });
      // this.$router.push({ name: 'edit_goods' });
    },
    //选择多条数据
    handleSelectionChange (val) {
      this.ids = val.map(item => {
        return item.id
      })
    },
    //条码打印
    // tscBtn () {
    //   this.tscDia = true
    // },
    //每页数量改变
    sizeChange (v) {
      this.param.pageSize = v
      this.getGoodsInfor()
    },
    //当前页改变
    currentChange (v) {
      this.param.pageNum = v
      this.getGoodsInfor()
    },
  },
  mounted () {
    this.getCategoryTree()
    this.getGoodsInfor()
    this.getBrandList()
    this.getOwnerList()
  },
}
</script>

<style lang="scss">
  .storage_location {
    display: flex;
    flex-wrap: nowrap;
    box-sizing: border-box;
    .leftTree {
      /*flex:0 0 150px;*/
      /*max-width: 150px;*/
      width: 15%;
      padding: 0 10px;
      margin-right: 2%;
      border: solid 1px #e5e5e5;
      overflow: auto;
      height: 545px;
    }
    .rightMain {
      width: 83%;
    }
    .addlocation {
      .el-form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 49%;
          margin-right: 1%;
        }
        .el-input.is-disabled .el-input__inner {
          background-color: #ffffff;
          border: none !important;
        }
        .codeRule .el-form-item__content {
          display: flex;
          align-items: center;
          span {
            width: 120px;
          }
        }
      }
    }
    .tscDia.el-dialog {
      width: 1072px;
    }
    .el-form.tsc {
      .el-form-item {
        height: 32px;
        margin-bottom: 15px;
      }
      .el-form-item__label {
        height: 32px;
        line-height: 32px;
      }
      .el-form-item__content {
        line-height: 32px;
      }
      .moduleBox {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        .tscLeft {
          width: 52%;
        }
        .tscRight {
          width: 46%;
        }
        .module {
          width: 100%;
          height: 120px;
          border: 1px solid #eeeeee;
          padding: 30px;
        }
      }
    }
  }

  #app{
    .innerSkuTable{
      border: none;
      .el-table__expanded-cell{
        padding:0;
      }
      .has-gutter{
        th{
          border:none !important;
          background-image: none !important;
        }
        
      }
      td{
        border:none!important;
      }
    }
  }
  .goods-table{
    .el-table__expanded-cell{
        padding:0;
      }
      .wrap-img{
        padding: 5px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          width: 33px;
          height: 35px;
        }
      }
  }
</style>
<style lang="scss" scoped>
  
</style>

