<template>
  <div>
    <header class="top-head clearfix">
      <div class="header-right f-fr">
        <search placeholder="请输入盘商品编码，SKU，条码，名称，进行搜索" @on-search="qSearch" :showIcon="false" ref="qSearch" :width="'350px'" style="width:380px"></search>
        <el-button type="primary" @click="goSearch" size="small">高级搜索</el-button>
      </div>
    </header>
    <el-table ref="movementList"
              border
              :data="tableList" height="500px">
      <el-table-column align="center" type="index" label="行号" width="120"></el-table-column>
      <el-table-column align="center" prop="imageUrl" label="图片" width="120">
        <template slot-scope="scope">
          <div class="wrap-img">
            <img :src="scope.row.IMGURL">
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="120"></el-table-column>
      <el-table-column align="center" prop="goodsCode" label="商品编码" width="120"></el-table-column>
      <el-table-column align="center" prop="skuCode" label="SKU" width="120"></el-table-column>
      <el-table-column align="center" prop="barcode" label="条码"></el-table-column>
      <el-table-column align="center" prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column align="center" prop="transferQty" label="移库数量"></el-table-column>
      <el-table-column align="center" prop="orilocationCode" label="来源库位"></el-table-column>
      <el-table-column align="center" prop="tarlocationCode" label="目标库位"></el-table-column>
      <el-table-column align="center" prop="updateByname" label="操作员"></el-table-column>
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
    <el-dialog 
      title="高级筛选" 
      :visible.sync="advancedFilter"  
      :close-on-click-modal="false"
      :modal-append-to-body="false" 
      class="filterParam">
      <el-form :model="filterParam" label-width="110px">
        <el-form-item label="创建时间：">
          <el-date-picker
            v-model="filterParam.startTime"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00']"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作员：">
          <el-input v-model="filterParam.updateByname"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%; text-align: right;">
          <el-button @click="clearFilterParams" size="small">清空条件</el-button>
          <el-button @click="submitSearch" type="primary" size="small">查询</el-button>
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
        tableList:[],
        advancedFilter:false,
        filterParam:{
          startTime:'',
          updateByname:'',
        },
        searchWay:0,
        param: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        total: 10,
      }
    },
    methods:{
      //获取所有上架单
      getTableList(param){
        param = {
          ...this.param,
          ...this.filterParam,
          ...param
        }
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/transfer/transfer/selectSearchPageForPC.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.tableList=data.data.dataList.map((item) => {
              return {
                IMGURL: this.$Util.formatImageUrl(item.imageUrl),
                ...item,
              }
            })
            this.total=data.data.totalNum
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //快速搜索
      qSearch(){
        this.param.keyword=this.$refs.qSearch.inputValue;
        this.clearFilterParams();
        this.getTableList();
      },
      //高级搜索
      goSearch(){
        this.advancedFilter=true;
      },
      submitSearch(){
        if (this.filterParam.startTime && this.filterParam.startTime.length > 0) {
          this.filterParam.createStime = this.filterParam.startTime[0];
          this.filterParam.createEtime = this.filterParam.startTime[1];
        } else {
          this.filterParam.createStime = '';
          this.filterParam.createEtime = '';
        }
        this.param.keyword = '';
        this.getTableList();
        this.advancedFilter = false;
      },
      //清空搜索条件
      clearFilterParams(){
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getTableList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getTableList();
      },
    },
    components: {},
    mounted() {
      this.getTableList();
    }
  }
</script>

<style lang="scss">
@import '../../styles/mixin.scss';
@import '../../styles/common.scss';
</style>
