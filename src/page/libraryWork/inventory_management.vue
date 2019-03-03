<template>
  <div>
    <div class="inventory" v-if="isDetail">
      <header class="top-head">
        <el-button size="small" type="primary" @click="addInventoryBtn">新增盘点单</el-button>
        <!-- <el-button size="small" type="primary" @click="">打印盘点单</el-button> -->
        <el-button size="small" type="primary" @click="allocatingTaskBtn">分配任务</el-button>
        <el-button size="small" type="primary" @click="closeBtn">关闭</el-button>

        <div class="header-right f-fr">
          <search placeholder="请输入盘点单号，进行搜索" @on-search="qSearch" :showIcon="false" ref="qSearch" :width="'280px'" style="width:310px"></search>
          <el-button type="primary" @click="goSearch" size="small">高级搜索</el-button>
        </div>
      </header>
      <el-table :key="1" 
                border
                ref="ShelfList" 
                :data="tableList" height="500px" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" type="index" label="行号" width="120"></el-table-column>
        <el-table-column align="center" prop="name" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="checkDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" width="120"></el-table-column>
        <el-table-column align="center" prop="inventoryNo" label="盘点单号" width="120"></el-table-column>
        <el-table-column align="center" prop="stoareaName" label="盘点库区" width="120"></el-table-column>
        <el-table-column align="center" prop="skuNum" label="商品种类"></el-table-column>
        <el-table-column align="center" prop="inventoryQty" label="商品总数"></el-table-column>
        <el-table-column align="center" prop="actQty" label="盘点数量"></el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <div slot-scope="scope">
            <span v-if="scope.row.status === 1">待分配</span>
            <span v-if="scope.row.status === 2">待盘点</span>
            <span v-if="scope.row.status === 3">盘点中</span>
            <span v-if="scope.row.status === 4">已完成</span>
            <span v-if="scope.row.status === -1">关闭</span>
            <span v-if="scope.row.status === -2">删除</span>
          </div>
        </el-table-column>
        <el-table-column align="center" prop="optByname" label="操作员"></el-table-column>
        <el-table-column align="center" prop="note" label="备注"></el-table-column>
        <el-table-column align="center" prop="dataMode" label="数据来源" width="200">
          <div slot-scope="scope">
            <span v-if="scope.row.dataMode === 0">自动</span>
            <span v-if="scope.row.dataMode === 1">手动</span>
          </div>
        </el-table-column>
        <el-table-column align="center" prop="optTime" label="完成时间" width="200"></el-table-column>
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
          <el-form-item prop="type" label="盘点库区：">
            <el-select v-model="filterParam.storeareaId" placeholder="请选择">
              <el-option 
                v-for="item in storehouse" 
                :key="item.id"
                :label="item.typeName" 
                :value="item.id"/>
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
      <el-dialog title="分配任务" :visible.sync="allocatingTaskDia"  :modal-append-to-body="false" class="addGoods" @close="resetAdd">
        <el-form :model="allocatingTask" label-width="110px" :rules="allocatingTaskRule" ref="allocatingTaskRef">
          <el-form-item style="width:100%" prop="man" label="操作员">
            <el-select filterable v-model="allocatingTask.man" placeholder="请选择" clearable>
              <el-option 
                v-for="item in operatorList" 
                :key="item.id"
                :label="`${item.userName}(${item.jobNum})`" 
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 100%; text-align: right;">
            <el-button size="small">取消</el-button>
            <el-button type="primary" size="small" @click="submit">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog 
        v-if="addInventoryDia"
        title="新建盘点单" 
        width="1150px" 
        @close="resetAddInventory"
        :visible.sync="addInventoryDia">
        <el-form :model="addInventory" label-width="100px" size="small" :rules="addInventoryRule" ref="addInventoryRef" class="addInventoryForm">
          <el-row type="flex" justify="space-between">
            <el-col :span="8" class="form_left">
              <p style="margin-bottom: 20px">选择盘点商品</p>
                <el-form-item prop="stoareaIds" label="盘点库区：">
                  <el-select size="small" v-model="addInventory.stoareaIds" multiple @change="selectInvtype" placeholder="请选择（多选）" style="width: 250px;margin-right: 20px;">
                    <template v-for="(item,index) in reservoirList">
                      <el-option :label="item.stoareaName" :value="item.id" :key="index"></el-option>
                    </template>
                  </el-select>
                  <!-- <jc-dropdown-tree
                        initUrl='wms/storehouse/selectAllTree.do'
                        initDataPath='data.storehouseList'
                        ref="jc-dropdown-tree"
                        @check="addCheck"
                        :defaultProps='defaultProps'/>
                  <el-tag
                        v-for="tag in addCheckList"
                        v-if="tag.typeOf === 'shelf' || tag.typeOf === 'pallet'"
                        style="margin: 4px;"
                        :key="tag.id"
                        @close="tagClose(tag)"
                        closable>
                        {{tag.name}}
                      </el-tag> -->
                </el-form-item>
                <el-form-item prop="note" label="备注信息: ">
                  <el-input type="textarea" v-model="addInventory.note"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="16" class="form_right">
              <p style="margin-bottom: 20px">盘点商品</p>
              <el-form-item prop=""  label-width="0px">
                <div @click="commodityClick">
                  <el-row class="tableTop">
                    <search placeholder="请输入关键字进行搜索" @on-search="e_qSearch" :showIcon="false" ref="e_qSearch" style="width:300px" class="e_qSearch" :width="'250px'"></search>
                  </el-row>
                  <el-table ref="InventoryList" height="500px" border :data="InventoryList" style="width: 98%" @selection-change="handleSelectionGoods">
                    <el-table-column align="center" type="selection" width="44"></el-table-column>
                    <el-table-column align="center" label="行号" type="index" ></el-table-column>
                    <el-table-column align="center" prop="skuCode" label="sku" width="110"></el-table-column>
                    <el-table-column align="center" prop="barcode" label="商品条码"></el-table-column>
                    <el-table-column align="center" prop="goodsName" label="商品名称"></el-table-column>
                    <el-table-column align="center" prop="locationCode" label="库位"></el-table-column>
                    <el-table-column align="center" prop="brandName" label="品牌"></el-table-column>
                    <el-table-column align="center" prop="properties" label="规格属性"></el-table-column>
                    <el-table-column align="center" prop="stockQty" label="数量" width="50"></el-table-column>
                    <!-- <el-table-column align="center" label="操作">
                      <template slot-scope="scope">
                        <el-button type="text" @click="deleteRow(scope)">删除</el-button>
                      </template>
                    </el-table-column> -->
                  </el-table>
                  <div class="el-form-item__error" v-if="tableErrorTip" style="position: initial;">请至少选择一个商品</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="diaFooter" style="text-align: right">
          <el-button @click="resetAddInventory">取消</el-button>
          <el-button @click="addSave">保存</el-button>
        </div>
        <!-- <editCommodity 
          ref="editCommodity"
          :model="'inventory'"
          :checkedList="GoodsInventoryList"
          @save="editCommoditySave"/> -->
      </el-dialog>
    </div>
    <div class="inventoryDetail" v-else>
      <header class="top-head">
        <el-button type="text">盘点单详情</el-button>
        <div class="header-right f-fr">
          <el-button @click="goBack">返回</el-button>
        </div>
      </header>
      <header class="top-head detail">
        <el-form :model="detailInfor" label-width="110px" class="detailInfor" >
          <el-form-item label="盘点单号：">{{ this.detailObj.inventoryNo }}</el-form-item>
          <el-form-item label="状态：">
            <span v-if="this.detailObj.status === 1">待分配</span>
            <span v-if="this.detailObj.status === 2">待上架</span>
            <span v-if="this.detailObj.status === 3">上架中</span>
            <span v-if="this.detailObj.status === 4">已完成</span>
            <span v-if="this.detailObj.status === -1">关闭</span>
            <span v-if="this.detailObj.status === -2">删除</span>
          </el-form-item>
          <el-form-item label="完成时间：">{{ this.detailObj.optTime }}</el-form-item>
          <el-form-item label="操作员：">{{ this.detailObj.optByname }}</el-form-item>
        </el-form>
      </header>
      <el-row style="margin-bottom: 10px">
        <div class=" f-fl">
          <span><i>商品总数：</i>{{ this.detailObj.inventoryQty }}</span>
        </div>
        <div class="header-right f-fr">
          <search placeholder="请输入商品编码，SKU，条形码，商品名称，进行搜索" @on-search="detail_qSearch" :showIcon="false" ref="detail_qSearch" style="width:400px" class="detail_qSearch" :width="'370px'"></search>
        </div>
      </el-row>
      <el-table :key="2" ref="detailList" :data="detailTableList" height="500px" >
        <el-table-column align="center" type="index" label="行号" width="120"></el-table-column>
        <el-table-column align="center" prop="goodsCode" label="商品编码"></el-table-column>
        <el-table-column align="center" prop="skuCode" label="SKU"></el-table-column>
        <el-table-column align="center" prop="barcode" label="商品条码"></el-table-column>
        <el-table-column align="center" prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="brandName" label="品牌"></el-table-column>
        <el-table-column align="center" prop="properties" label="规格属性"></el-table-column>
        <el-table-column align="center" prop="locationCode" label="盘点库位"></el-table-column>
        <el-table-column align="center" prop="invertoryQty" label="数量"></el-table-column>
        <el-table-column align="center" prop="actQty" label="盘点数量"></el-table-column>
        <el-table-column align="center" prop="address" label="差异量">
          <div slot-scope="scope">
            <span>
              {{ scope.row.actQty - scope.row.invertoryQty}}
            </span>
          </div>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination background :page-sizes="[15,30,50,100]"
                     :page-size="detailParam.pageSize"
                     :total="detailTotal"
                     layout="total, prev, pager, next, sizes, jumper"
                     @size-change="detail_sizeChange"
                     @current-change="detail_currentChange"
                     :current-page.sync="detailParam.pageNum"
                     style="margin-top: 20px;text-align: center;">
      </el-pagination>
    </div>
  </div>

</template>

<script>
import jcDropdownTree from '@/components/Tree/jcDropdownTree.vue';
import editCommodity from '@/components/warehousing/editPurchase1.vue';
  export default {
    name: 'inventoryManagement',
    props:{},
    components: {
      jcDropdownTree,
      editCommodity,
    },
    data(){
      return{
        isDetail:true,
        ids:[],
        ShelfList:[{}],
        advancedFilter:false,
        allocatingTaskDia:false,
        addInventoryDia:false,
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
          storeareaId: '',
        },
        allocatingTask:{
          man:'',
        },
        allocatingTaskRule:{
          man:[{required: true, trigger: 'change',message:'请选择操作员'}],
        },
        addInventory:{
          stoareaIds:[],
          note:'',
        },
        addInventoryRule:{
          stoarea: [{
            trigger: 'blur', message: '请至少选择一个库区', validator: (rule, value, callback) => {
              if (this.addCheckList.length === 0) {
                callback(new Error());
                return;
              }
              callback();
            },
          }],
          note: [{
            trigger: 'change', message: '备注信息支持0-1000个字', max: 1000,
          }]
        },
        addGoodsList:[],  //选择盘点商品列表
        GoodsInventoryList:[],  //盘点商品列表
        InventoryList:[],
        searchWay:0,
        param: {
          pageNum: 1,
          pageSize: 15,
          inventoryNo:'',
        },
        total: 10,
        detailInfor:{},
        detailTotal: 10,
        tableList: [],
        storehouse: [],
        detailLoading: false,
        detailObj: {},
        detailTableList: [],
        detailParam: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        selectStatus: [],
        operatorList: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          key: 'id',
        },
        addCheckList: [],
        tableErrorTip: false,
        reservoirList: [],  //库区列表
      }
    },
    methods:{
      addSave() {
        if (this.GoodsInventoryList.length === 0) {
          this.tableErrorTip = true;
          return;
        }
        this.tableErrorTip = false;
        const addInventoryRef = this.$refs.addInventoryRef;
        addInventoryRef.validate((err) => {
          if (!err) return;
          // let stoareaIds = [];
          // this.addCheckList.forEach((item) => {
          //   if (item.typeOf === "area") {
          //     stoareaIds.push(item.id);
          //   }
          // })
          // const param = {
          //   skuIds: this.GoodsInventoryList.map((item) => item.id).join(','),
          //   stoareaIds: stoareaIds.join(','),
          //   note: this.addInventory.note,
          // }
          let skuIdArr = [];
          this.addCheckList.forEach(item => {
            let arr = [];
            for (const skuObj of this.GoodsInventoryList){
              if(skuObj.stoareaId == item){
                arr.push(
                  {
                    skuId:skuObj.skuId,
                    stockQty:skuObj.stockQty,
                    locationId:skuObj.locationId,
                    locationCode:skuObj.locationCode,
                    goodsId:skuObj.goodsId,
                  }
                )
              }
            }
            if(arr.length > 0){
              skuIdArr.push(
                {
                  stoareaId:item,
                  skuIdList:arr
                }
              )
            }
          })
          const param = {
            inventoryList:skuIdArr,
            note: this.addInventory.note,
          }
          let json_param=JSON.stringify(param)
          this.$ajaxPost('wms/inventory/inventory/insertInventory.do',{reqParam:json_param})
            .then(({data})=>{
              if(data.code==200){
                this.$message.success('新增成功');
                this.getTableList();
                this.resetAddInventory();
              }else{
                this.$message.error(data.msg)
              }
            })
          })
        
        
      },
      // editCommoditySave(val) {
      //   this.GoodsInventoryList = val;
      // },
       //获取所有库区
      getReservoirList(){
        let json_param=JSON.stringify({pageNum:1,pageSize:9999})
        this.$ajaxPost('wms/storehouseArea/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.reservoirList=data.data.dataList
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //选择商品
      handleSelectionGoods(val){
        if(val){
          this.GoodsInventoryList = val.map(item => {
            return item    
          });
        }else{
          this.GoodsInventoryList = [];
        }
      },
      //多选库区
      selectInvtype(val){
        this.addCheckList = []
        if(val.length == 0){
          this.InventoryLis = [];
          return
        }
        this.addCheckList = val
        this.getInventoryList();
      },
      //搜索商品
      e_qSearch(){
        if(this.addCheckList.length == 0){
          return 
        }
        this.getInventoryList();
      },
      //根据已选库区和关键字获取商品
      getInventoryList(){
        let json_param=JSON.stringify({stoareaIds:this.addCheckList,keyword:this.$refs.e_qSearch.inputValue})
        this.$ajaxPost('wms/stock/skuStock/selectSearchByArea.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.InventoryList=data.data
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //关闭新增盘点单商品时
      resetAddInventory(){
        this.addInventoryDia = false;
        this.$refs.addInventoryRef.resetFields();
        this.InventoryList = []
        this.GoodsInventoryList = [];
        this.addInventory.stoareaIds = [];
      },
      commodityClick() {
        // this.$refs.editCommodity.editDetailsdia = true;
      },
      // tagClose(tag) {
      //   const jcDropdownTree = this.$refs["jc-dropdown-tree"];
      //   this.addCheckList.splice(this.addCheckList.indexOf(tag), 1);
      //   jcDropdownTree.setVal([tag.id], false);
      // },
      // addCheck(currentNode, allData) {
      //   this.addCheckList = [];
      //   [...allData.checkedNodes, ...allData.halfCheckedNodes].forEach((item) => {
      //     // if (item.typeOf === 'area') {
      //       this.addCheckList.push(item);
      //     // }
      //   })

      // },
      //获取所有上架单
      getTableList(param){
        param = {
          ...this.param,
          ...this.filterParam,
          ...param
        }
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/inventory/inventory/selectSearchPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.tableList=data.data.dataList
            this.total=data.data.totalNum
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //新增盘点单
      addInventoryBtn(){
        this.getReservoirList();
        this.addInventoryDia=true;
      },
      //分配任务
      allocatingTaskBtn(){
        console.log(this.selectStatus)
        if(this.selectStatus.length === 0) {
          this.$message.error('请勾选需分配的盘点单');
          return;
        }
        if (this.selectStatus.find((item) => item !== 1)) {
          this.$message.error('只有【待分配】盘点单，才可分配');
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
        this.$ajaxPost('wms/inventory/inventory/updateInventoryListById.do', {reqParam: json_param})
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
        this.param.inventoryNo=this.$refs.qSearch.inputValue;
        this.clearFilterParams();
        this.getTableList();
      },
      //高级搜索
      goSearch(){
        this.advancedFilter=true;
        if (this.storehouse.length === 0) {
          const param = {}
          let json_param=JSON.stringify(param)
          this.$ajaxPost('wms/storehouseArea/selectPage.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              this.storehouse=data.data.dataList
            }else{
              this.$message.error(data.msg)
            }
          })
        }
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
        this.param.inventoryNo = '';
        this.getTableList();
        this.advancedFilter = false;
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
          this.$ajaxPost('wms/inventory/inventory/updateOptInfoById.do', {reqParam: json_param})
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
          invertoryId: row.id,
          pageNum: 1,
          pageSize: 15,
        }
        const json_param = JSON.stringify(params)
        this.$ajaxPost('wms/inventory/inventoryDetail/selectSearchPageByInventoryId.do', {reqParam: json_param})
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
      //选择盘点商品
      selectionChange(val){

      },
      //快速搜素盘点商品
      qSearchGoods(){

      },
      //删除盘点商品
      deleteRow(scope){
        this.$confirm('删除商品后，不可恢复，请谨慎操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        }).catch(() => {})
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
        this.detailParam.keyword = val;
        this.getDetailTableList();
      },
      getDetailTableList(param) {
        this.detailLoading = true;
        param = {
          ...this.detailParam,
          ...param,
          invertoryId: this.detailObj.id,
        }
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/inventory/inventoryDetail/selectSearchPageByInventoryId.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.detailLoading = false;
            this.detailTableList = data.data.dataList;
            this.detailTotal = data.data.totalNum;
          }else{
            this.$message.error(data.msg)
          }
        })
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
        this.detailParam.pageSize = v;
        this.getDetailTableList();
      },
      //当前页改变
      detail_currentChange(v) {
        this.detailParam.pageNum = v;
        this.getDetailTableList();
      },
    },
    mounted() {
      this.getTableList();
    }
  }
</script>

<style lang="scss">
  .addInventoryForm{
    .form_left{
      padding-right:20px;
      margin-right: 20px;
      border-right: 1px dashed #CCCCCC;
    }
    .print__label{
      display: inline-block;
      width: 100%;
      text-align: right;
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
