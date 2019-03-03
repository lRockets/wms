<template>
  <div>
    <div class="shelf" v-if="isDetail">
      <header class="top-head">
        <el-button size="small" type="primary">打印上架单</el-button>
        <el-button size="small" type="primary" @click="allocatingTaskBtn">分配任务</el-button>
        <el-button size="small" type="primary" @click="closeBtn">关闭</el-button>
        <div class="header-right f-fr">
          <search placeholder="请输入上架单号，进行搜索" @on-search="qSearch" :showIcon="false" ref="qSearch" :width="'280px'" style="width:310px"></search>
          <el-button type="primary" @click="goSearch" size="small">高级搜索</el-button>
        </div>
      </header>
      <el-table v-loading="tableLoading" 
                border
                :key="1" ref="ShelfList" :data="tableList" height="500px" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" type="index" label="行号" width="120"></el-table-column>
        <el-table-column align="center" prop="name" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="checkDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" width="120"></el-table-column>
        <el-table-column align="center" prop="onshelfNo" label="上架单号" width="120"></el-table-column>
        <el-table-column align="center" prop="oristoareaName" label="来源库区"></el-table-column>
        <el-table-column align="center" prop="tarstoareaName" label="目标库区"></el-table-column>
        <el-table-column align="center" prop="onshelfQty" label="商品总数"></el-table-column>
        <el-table-column align="center" prop="unshelfQty" label="待上架数" width="200"></el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <div slot-scope="scope">
            <span v-if="scope.row.status === 1">待分配</span>
            <span v-if="scope.row.status === 2">待上架</span>
            <span v-if="scope.row.status === 3">上架中</span>
            <span v-if="scope.row.status === 4">部分完成</span>
            <span v-if="scope.row.status === 5">已完成</span>
            <span v-if="scope.row.status === -1">关闭</span>
            <span v-if="scope.row.status === -2">删除</span>
          </div>
        </el-table-column>
        <el-table-column align="center" prop="optByname" label="操作员"></el-table-column>
        <el-table-column align="center" prop="updateTime" label="完成时间" width="200"></el-table-column>
        <el-table-column align="center" prop="dataMode" label="数据来源" width="200">
          <div slot-scope="scope">
            <span v-if="scope.row.dataMode === 0">自动</span>
            <span v-if="scope.row.dataMode === 1">手动</span>
          </div>
        </el-table-column>
        <el-table-column align="center" prop="createByname" label="创建人"></el-table-column>
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
          <el-form-item prop="time1" label="创建时间：">
            <el-date-picker
              v-model="filterParam.createTime"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00']"
              style="width: 100%">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="time2" label="完成时间：">
            <el-date-picker
              v-model="filterParam.endTime"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00']"
              style="width: 100%">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="type" label="状态：">
            <el-select v-model="filterParam.status" placeholder="请选择">
              <el-option label="待分配" value="1"></el-option>
              <el-option label="待上架" value="2"></el-option>
              <el-option label="上架中" value="3"></el-option>
              <el-option label="部分完成" value="4"></el-option>
              <el-option label="已完成" value="5"></el-option>
              <el-option label="已关闭" value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="type" label="数据来源：">
            <el-select v-model="filterParam.dataMode" placeholder="请选择">
              <el-option label="系统生成" value="0"></el-option>
              <el-option label="手动添加" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="man" label="操作员：">
            <el-input v-model="filterParam.optByname"></el-input>
          </el-form-item>
          <el-form-item prop="man" label="创建人：" >
            <el-input v-model="filterParam.createByname"></el-input>
          </el-form-item>
          <el-form-item style="width: 100%; text-align: right;">
            <el-button @click="clearFilterParams" size="small">清空条件</el-button>
            <el-button @click="submitSearch" type="primary" size="small">查询</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog 
        title="分配任务" 
        :visible.sync="allocatingTaskDia"  
        :modal-append-to-body="false" 
        :close-on-click-modal="false"
        class="addGoods" @close="resetAdd">
        <el-form  
          v-loading="taskLoading" 
          :model="allocatingTask" 
          label-width="110px" 
          :rules="allocatingTaskRule" 
          ref="allocatingTaskRef">
          <el-form-item style="width:100%" prop="man" label="操作员">
            <el-select filterable v-model="allocatingTask.man" placeholder="请选择" clearable>
              <el-option 
                v-for="item in operatorList" 
                :key="item.id"
                :label="item.jobNum ? `${item.userName}(${item.jobNum})` : `${item.userName}`" 
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 100%; text-align: right;">
            <el-button size="small">取消</el-button>
            <el-button type="primary" size="small" @click="submit">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div v-loading="detailLoading" class="shelfDetail" v-if="!isDetail">
      <header class="top-head">
        <el-button type="text">上架单详情</el-button>
        <div class="header-right f-fr">
          <el-button @click="goBack">返回</el-button>
        </div>
      </header>
      <header class="top-head detail">
        <el-form :model="detailObj" label-width="110px" class="detailInfor" >
          <el-form-item label="上架单号：">{{ this.detailObj.onshelfNo }}</el-form-item>
          <el-form-item label="状态：">
            <span v-if="this.detailObj.status === 1">待分配</span>
            <span v-if="this.detailObj.status === 2">待上架</span>
            <span v-if="this.detailObj.status === 3">上架中</span>
            <span v-if="this.detailObj.status === 4">部分完成</span>
            <span v-if="this.detailObj.status === 5">已完成</span>
            <span v-if="this.detailObj.status === -1">关闭</span>
            <span v-if="this.detailObj.status === -2">删除</span>
          </el-form-item>
          <el-form-item label="完成时间：">{{ this.detailObj.optTime }}</el-form-item>
          <el-form-item label="操作员：">{{ this.detailObj.optByname }}</el-form-item>
        </el-form>
      </header>
      <el-row >
        <div class="warehousingNum f-fl">
          <span><i>商品总数：</i> {{ this.detailObj.onshelfQty }}</span>
          <span><i>待上架数：</i> {{ this.detailObj.unshelfQty }}</span>
        </div>
        <div class="header-right f-fr">
          <search placeholder="请输入商品编码，SKU，条形码，商品名称，进行搜索" @on-search="detail_qSearch" :showIcon="false" ref="detail_qSearch" style="width:400px" class="detail_qSearch" :width="'370px'"></search>
        </div>
      </el-row>
      <el-table :key="2" ref="detailList" :data="detailTableList" height="500px" >
        <el-table-column align="center" type="index" label="行号" width="120"></el-table-column>
        <el-table-column align="center" prop="goodCode" label="商品编码"></el-table-column>
        <el-table-column align="center" prop="skuCode" label="SKU"></el-table-column>
        <el-table-column align="center" prop="barcode" label="条码"></el-table-column>
        <el-table-column align="center" prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="brandName" label="品牌"></el-table-column>
        <el-table-column align="center" prop="properties" label="规格属性"></el-table-column>
        <el-table-column align="center" prop="onshelfQty" label="需上架总数"></el-table-column>
        <el-table-column align="center" prop="unshelfQty" label="待上架数"></el-table-column>
        <el-table-column align="center" prop="orilocationCode" label="来源库位"></el-table-column>
        <el-table-column align="center" prop="tarlocationCode" label="目标库位"></el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination background :page-sizes="[15,30,50,100]"
                     :page-size="detailParams.pageSize"
                     :total="detailTotal"
                     layout="total, prev, pager, next, sizes, jumper"
                     @size-change="detail_sizeChange"
                     @current-change="detail_currentChange"
                     :current-page.sync="detailParams.pageNum"
                     style="margin-top: 20px;text-align: center;">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  export default {
    props:{},
    data(){
      return{
        isDetail:true,
        ids:[],
        advancedFilter:false,
        allocatingTaskDia:false,
        filterParam:{
          createTime: '',
          createStime: '',
          createEtime: '',
          endTime: '',
          updateStime: '',
          updateEtime: '',
          status: '',
          dataMode: '',
          optByname: '',
          createByname: '',
        },
        allocatingTask:{
          man:'',
        },
        allocatingTaskRule:{
          man:[{required: true, trigger: 'change',message:'请选择操作员'}],
        },
        param: {
          pageNum: 1,
          pageSize: 15,
          onshelfNo:'',
        },
        total: 10,
        detailInfor:{},
        detailList:[],
        detailParams: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        detailTotal: 10,
        tableList: [],
        selectStatus: [],
        taskLoading: false,
        detailLoading: false,
        operatorList: [],
        detailTableList: [],
        detailObj: {},
        tableLoading: false,
      }
    },
    methods:{
      /**
       * @method 根据字典表获取高级搜索中的列表数据
       * @param { string } typeNameCN: 字典参数的中文描述
       * @param { string } typeNameEN: 字典参数的英文描述
       */
      async getDictData(typeNameCN, typeNameEN) {
        const { data } = await this.$ajaxPost('wms/dataDict/selectItemName.do', {
          reqParam: JSON.stringify({
            typeName: typeNameCN,
          }),
        });
        if (data.code === 200) {
          this[typeNameEN] = data.data.dataDictList;
        } else {
          this.$message.error(data.msg);
        }
      },
      //获取所有上架单
      getTableList(param){
        param = {
          ...this.param,
          ...this.filterParam,
          ...param
        }
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/onshelf/onshelf/selectSearchPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.tableList=data.data.dataList
            this.total=data.data.totalNum
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      getDetailTableList(param) {
        this.detailLoading = true;
        param = {
          ...this.detailParams,
          ...param,
          onshelfId: this.detailObj.id,
        }
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/onshelf/onshelfDetail/selectSearchPageByIdForPC.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.detailLoading = false;
            this.detailTableList = data.data.dataList;
            this.detailTotal = data.data.totalNum;
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //分配任务
      allocatingTaskBtn(){
        if(this.selectStatus.length === 0) {
          this.$message.error('请勾选需分配的上架单');
          return;
        }
        if (this.selectStatus.find((item) => item !== 1)) {
          this.$message.error('只有【待分配】上架单，才可分配');
          return;
        }
        if (this.operatorList.length === 0) {
          this.taskLoading = true;
          const json_param = JSON.stringify({})
          this.$ajaxPost('wms/user/selectUserByNameAndJobnum.do', {reqParam: json_param})
            .then(({ data }) => {
              if(data.code==200){
                this.operatorList = data.data;
                this.taskLoading = false;
              }else{
                this.$message.error(data.msg);
              }
            })
        }
        this.allocatingTaskDia=true;
      },
      //关闭
      closeBtn(){
        if (this.ids.length === 0) {
          this.$message.error('请勾选需关闭的上架单');
          return;
        }
        if (this.selectStatus.find((item) => item === 5)) {
          this.$message.error('已完成上架单不可关闭');
          return;
        }
        this.tableLoading = true;
        const params = {
          ids: this.ids.join(','),
        }
        const json_param = JSON.stringify(params)
        this.$ajaxPost('wms/onshelf/onshelf/updateOnshelfListById.do', {reqParam: json_param})
          .then(({ data }) => {
            if(data.code==200){
              this.getTableList();
              this.tableLoading = false;
              this.$message.success('关闭成功');
            }else{
              this.$message.error(data.msg);
            }
          })
      },
      //快速搜索
      qSearch(){
        this.param.onshelfNo=this.$refs.qSearch.inputValue;
        this.clearFilterParams();
        this.getTableList();
      },
      //高级搜索
      goSearch(){
        this.advancedFilter=true;
      },
      submit() {
        const form = this.$refs.allocatingTaskRef;
        form.validate((err) => {
          if (!err) return;
          this.taskLoading = true;
          const params = {
            ids: this.ids.join(','),
            optBy: this.allocatingTask.man,
            optByname: this.operatorList.find((item) => item.id === this.allocatingTask.man).userName
          }
          const json_param = JSON.stringify(params)
          this.$ajaxPost('wms/onshelf/onshelf/updateOptInfoById.do', {reqParam: json_param})
            .then(({ data }) => {
              if(data.code==200){
                this.$message.success('分配成功');
                this.taskLoading = false;
                this.allocatingTaskDia = false;
                this.getTableList();
              }else{
                this.$message.error(data.msg);
              }
            })
        })
      },
      submitSearch(){
        if (this.filterParam.createTime && this.filterParam.createTime.length > 0) {
          this.filterParam.createStime = this.filterParam.createTime[0];
          this.filterParam.createEtime = this.filterParam.createTime[1];
        } else {
          this.filterParam.createStime = '';
          this.filterParam.createEtime = '';
        }
        if (this.filterParam.endTime && this.filterParam.endTime.length > 0) {
          this.filterParam.updateStime = this.filterParam.endTime[0];
          this.filterParam.updateEtime = this.filterParam.endTime[1];
        } else {
          this.filterParam.updateStime = '';
          this.filterParam.updateEtime = '';
        }
        this.param.onshelfNo = '';
        this.getTableList();
        this.advancedFilter = false;
      },
      //清空搜索条件
      clearFilterParams(){
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
      },
      //查看详情
      checkDetail(row){
        this.isDetail=false;
        this.detailLoading = true;
        this.detailObj = row;
        const params = {
          onshelfId: row.id,
          pageNum: 1,
          pageSize: 15,
        }
        const json_param = JSON.stringify(params)
        this.$ajaxPost('wms/onshelf/onshelfDetail/selectSearchPageByIdForPC.do', {reqParam: json_param})
          .then(({ data }) => {
            if(data.code == 200){
              this.detailLoading = false;
              this.detailTableList = data.data.dataList;
              this.detailTotal = data.data.totalNum;
            }else{
              this.$message.error(data.msg);
            }
          })
      },
      //选择多条数据
      handleSelectionChange(val){
        this.selectStatus = [];
        this.ids = val.map(item => {
          this.selectStatus.push(item.status);
          return item.id
        });
      },
      //关闭分配任务窗口时 表单时重置
      resetAdd(val) {
        this.$refs.allocatingTaskRef.resetFields();
        Object.keys(this.allocatingTask).forEach(key => {
          this.allocatingTask[key] = '';
        });
      },
      //返回
      goBack(){
        this.isDetail=true;
      },
      //详情搜索
      detail_qSearch(val){
        this.detailParams.keyword = val;
        this.getDetailTableList();
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
      //每页数量改变
      detail_sizeChange(v) {
        this.detailParams.pageSize = v;
        this.getDetailTableList();
      },
      //当前页改变
      detail_currentChange(v) {
        this.detailParams.pageNum = v;
        this.getDetailTableList();
      },
    },
    mounted() {
      this.getTableList();
    }
  }
</script>

<style lang="scss">

</style>
