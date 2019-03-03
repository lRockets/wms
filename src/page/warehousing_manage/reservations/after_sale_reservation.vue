<template>
  <div class="afterSaleReservation">
      <header class="top-head">
        <!-- <el-button size="small" class="total">打印入库预约单</el-button> -->
        <el-button size="small" @click="batchExport" class="total">批量导出</el-button>
        <el-button size="small" @click="deleteSales">删除</el-button>
        <div class="header-right f-fr">
          <search placeholder="请输入预约单号，售后单号，入库单号，运单号进行搜索" @on-search="qSearch" :showIcon="false" ref="qSearch" :width="'380px'"></search>
          <el-button size="small" @click="goSearch" class="total">高级搜索</el-button>
        </div>
      </header>
      <el-table ref="afterSaleList" :highlight-current-row='true' border :data="afterSaleList" height="500px" @selection-change="handleSelectionChange" @row-click='clickSaleList'>
        <el-table-column align="center" type="selection" width="44"></el-table-column>
        <el-table-column align="center" type='index' label="行号" width="48"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="createTime" label="创建时间" width="170"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="saleinNo" label="预约单号" width="140"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="type" label="入库类型">
          <template slot-scope="scope">
            {{['','退货入库','换货入库','维修入库','其它入库'][scope.row.type]}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="status" label="入库状态">
          <template slot-scope="scope">
            {{scope.row.status=='-2'?'删除':['','在途','部分收货','收货完成'][scope.row.status]}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="buyerId" label="买家ID"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="extNo" label="售后订单号" width="140"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="onlstoreName" label="店铺名称" width="140"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="备注"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="extNo" label="外部单号" width="140"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="logcompName" label="物流商"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="expbillNo" label="物流单号" width="140"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="dataMode" label="数据来源">
          <template slot-scope="scope">
            {{['','接口同步','手动添加'][scope.row.dataMode]}}
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
    <div class="tabBox">
      <el-tabs v-model="activeName2" @tab-click="handleClick" type="border-card" style="margin-top: 20px;height: 320px;">
        <el-tab-pane label="商品明细" name="first">
          <el-table ref="inventoryList" border :data="inventoryList" >
            <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
            <el-table-column align="center" prop="address" label="图片" width="74">
              <template slot-scope="scope">
                <img :src="$Util.formatImageUrl(scope.row.imageUrl)" style="height:50px;max-width: 100%;margin:10px 0 5px "/>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsCode" label="商品编码"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="skuCode" label="SKU"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="barcode" label="条码"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="brandName" label="品牌"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="properties" label="规格属性"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ownerName" label="商品货主"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="inQty" label="预约数量">
              <template slot-scope="scope">
                <el-input size="small" v-if="isEditorTabs" style="margin:10px 0;width:80%" v-model="scope.row.inQty"></el-input>
                <p v-else>{{scope.row.inQty}}</p>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="inboundQty" label="实际入库数量"></el-table-column>
            <el-table-column align="center" v-if="isEditorTabs">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-delete" @click="deleteInventory(scope)"></el-button>
              </template>
            </el-table-column>
            <template slot="empty">
              <div class="noData">
                <div class="noData-img"></div>
                <p>暂无数据</p>
              </div>
            </template>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="订单信息" name="second">
          <el-form :model="detailInfor" label-width="110px" class="detailInfor" ref="detailInforRef" :rules="detailInforRule" size="small">
              <el-form-item label="预约单号：">{{detailInfor.saleinNo}}</el-form-item>
              <el-form-item v-show="!isEditorTabs" label="入库类型：">{{['','退货入库','换货入库','维修入库','其它入库'][detailInfor.type]}}</el-form-item>
              <el-form-item v-show="!isEditorTabs" label="买家ID：">{{detailInfor.buyerId}}</el-form-item>
              <el-form-item v-show="!isEditorTabs" label="售后订单号：">{{detailInfor.extNo}}</el-form-item>
              <el-form-item v-show="!isEditorTabs" label="店铺名称：">{{detailInfor.onlstoreName}}</el-form-item>
              <el-form-item v-show="!isEditorTabs" label="外部单号：">{{detailInfor.extNo}}</el-form-item>
              <el-form-item v-show="!isEditorTabs" label="物流商：">{{detailInfor.logcompName}}</el-form-item>
              <el-form-item v-show="!isEditorTabs" label="物流单号：">{{detailInfor.expbillNo}}</el-form-item>
              <el-form-item v-show="!isEditorTabs" label="备注：">{{detailInfor.note}}</el-form-item>
              <el-form-item v-show="isEditorTabs" label="入库类型：" prop="type">
                <el-select size="small" v-model="detailInfor.type" clearable >
                  <template v-for="(item,index) in warehousingTypeList">
                    <el-option :label="item.itemName" :value="item.itemValue" :key="index"></el-option>
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item v-show="isEditorTabs" label="买家ID：" prop="buyerId">
                <el-input size="small" v-model="detailInfor.buyerId"></el-input>
              </el-form-item>
              <el-form-item v-show="isEditorTabs" label="售后订单号：" prop="saleinNo">
                <el-input size="small" v-model="detailInfor.saleinNo"></el-input>
              </el-form-item>
              <el-form-item v-show="isEditorTabs" label="店铺名称：" prop="onlstoreId" >
                <el-select size="small" v-model="detailInfor.onlstoreId" clearable @change='selectShip'>
                  <template v-for="(item,index) in shipList">
                    <el-option :label="item.storeName" :value="item.id" :key="index"></el-option>
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item v-show="isEditorTabs" label="外部单号：" prop="extNo">
                <el-input size="small" v-model="detailInfor.extNo"></el-input>
              </el-form-item>
              <el-form-item v-show="isEditorTabs" label="物流商：" prop="logcompId" >
                <el-select size="small" v-model="detailInfor.logcompId" clearable @change="selectLog">
                  <template v-for="(item,index) in LogisticsList">
                    <el-option :label="item.logcompName" :value="item.id" :key="index"></el-option>
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item v-show="isEditorTabs" label="物流单号：" prop="expbillNo">
                <el-input size="small" v-model="detailInfor.expbillNo"></el-input>
              </el-form-item>
              <el-form-item v-show="isEditorTabs" label="备注：" prop="note" style="width:80%">
                <el-input size="small" v-model="detailInfor.note" type="textarea"></el-input>
              </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="tabTip" name="three" disabled></el-tab-pane>
      </el-tabs>
      <div class="buttonBox">
        <el-button  type="text" v-if="!isEditorTabs" @click="editorTabs">编辑</el-button>
        <el-button  type="text" v-if="isEditorTabs" @click="concelEditorTabs">取消</el-button>
        <el-button  type="text" v-if="isEditorTabs" @click="saveEditDetail">保存</el-button>
      </div>
    </div>
    <el-dialog title="高级筛选" :visible.sync="advancedFilter"  :modal-append-to-body="false" class="filterParam">
      <el-form :model="filterParam" label-width="130px" size="small">
        <el-form-item prop="goodsName" label="商品名称：">
          <el-input size="small" v-model="filterParam.goodsName" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="goodsCodeAndSkuCode" label="商品编码/SKU：">
          <el-input size="small" v-model="filterParam.goodsCodeAndSkuCode" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="time" label="预约单创建时间：">
          <el-date-picker
            v-model="filterParam.time"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00']"
            style="width: 280px"
            size="small"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="type" label="入库类型：">
          <el-select size="small" v-model="filterParam.type" placeholder="请选择" clearable>
            <template v-for="(item,index) in warehousingTypeList">
              <el-option :label="item.itemName" :value="item.itemValue" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="入库状态：">
          <el-select size="small" v-model="filterParam.status" placeholder="请选择" clearable>
            <el-option label="在途" value="1"></el-option>
            <el-option label="部分收货" value="2"></el-option>
            <el-option label="收货完成" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="buyerId" label="买家ID：">
          <el-input size="small" v-model="filterParam.buyerId" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="onlstoreId" label="店铺名称：">
          <el-select size="small" v-model="filterParam.onlstoreId" placeholder="请选择" clearable>
            <template v-for="(item,index) in shipList">
              <el-option :label="item.storeName" :value="item.id" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="dataMode" label="数据来源：">
          <el-select size="small" v-model="filterParam.dataMode" placeholder="请选择" clearable>
            <el-option label="接口同步" value="1"></el-option>
            <el-option label="手动添加" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  style="width:100%;text-align:right;">
          <el-button size="small" @click="concelTerm">清空条件</el-button>
          <el-button size="small" @click="submitSearch" class="total">查询</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <export-file :idsArrary='ids' ref="exportFile"></export-file>
  </div>
</template>
<script>
import exportFile from '@/components/export/index'; 
  export default {
    props:{},
    data(){
      const buyerReg = (rule, value, callback) => {
        let v = value.toString().trim();
        if(v.length<2||v.length>20){
          if (callback) callback(new Error('请输入2-30个字'));
        }else{
          callback();
        }
      };
      return{
        warehousingTypeList:[],  //入库类型列表
        shipList:[],  //店铺列表
        LogisticsList:[],  //物流商列表
        ids:[],  //选中的id
        afterSaleList:[],
        afterSaleRowId:-1,
        advancedFilter:false,
        filterParam:{
          goodsName:'',
          goodsCodeAndSkuCode:'',
          time:'',
          createStartDate:'',
          createEndDate:'',
          type:'',
          status:'',
          buyerId:'',
          onlstoreId:'',
          dataMode:'',
        },
         tabTip:'预约入库数量为：    实际入库数量为：',
        detailInfor:{
          id:'',
          saleinNo:'',
          type:'',
          buyerId:'',
          saleinNo:'',
          onlstoreId:'',
          onlstoreName:'',
          extNo:'',
          logcompId:'',
          logcompName:'',
          expbillNo:'',
          note:'',
        },
        detailInforRule:{
          type:[{required: true, trigger: 'change', message:'请选择入库类型'}],
          buyerId:[{required: true, trigger: 'change', validator:buyerReg}],
          saleinNo:[{required: true, trigger: 'change', validator:this.$Util.RegExp.strLengthReg2}],
          onlstoreId:[{required: true, trigger: 'change', message:'请选择店铺'}],
          extNo:[{required: true,trigger: 'change',validator:this.$Util.RegExp.strLengthReg2}],
          logcompId:[{required: true, trigger: 'change',message:'请选择物流商'}],
          expbillNo:[{required: true,trigger: 'change',validator:this.$Util.RegExp.strLengthReg2}],
          note:[{trigger: 'change',validator:this.$Util.RegExp.noteReg}],
        },
        searchWay:0,
        activeName2: 'first',
        inventory:[], //商品明细表格
        inventoryList:[],   //商品明细表格 状态为0的显示，为1的不显示（模拟删除）
        isEditorTabs:false,  //是否在编辑tab页
        param: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        total: 10,
        deleteRowData:{},//被删除那一行的数据
        preRow:0,
      }
    },
    methods:{
      //获取所有
      getAfterSaleList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/in/salein/selectSearchPagePC.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.afterSaleList=data.data.dataList
            this.total=data.data.totalNum
            if(this.afterSaleList.length==0){
              this.inventory=[]
              this.inventoryList=[];
              for(let key in this.detailInfor){
                this.detailInfor[key]=''
              }
              this.isEditorTabs=false; 
            }else{
              // this.preRow = 0;
              if(this.afterSaleRowId == -1){
                this.afterSaleRowId = this.afterSaleList[0].id;
              }else{
                //获取当前选中行的index
                this.preRow = this.getRowIndex(this.afterSaleRowId)
              }
              //默认选择一行
              this.$refs.afterSaleList.setCurrentRow(this.afterSaleList[this.preRow]);
              this.getDetailInfor(this.afterSaleList[this.preRow]);
            }
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      getRowIndex(id) {
        let rowIndex = 0;
        this.afterSaleList.forEach( (item,index) => {
          if(id == item.id){
            rowIndex = index
          }
        })
        return rowIndex
      },
      //获取入库类型列表
      getWarehousingType(){
        let json_param=JSON.stringify({typeName:'入库类型'})
        this.$ajaxPost('wms/dataDict/selectItemName.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.warehousingTypeList=data.data.dataDictList
          }else{
            this.$message.error(data.msg)
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
      //获取所有物流商
      getLogisticList(){
        let json_param=JSON.stringify({pageSize:9999,pageNum:1})
        this.$ajaxPost('wms/logisticsCompany/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.LogisticsList=data.data.dataList
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //批量导出
      batchExport(){
        this.$refs.exportFile.export('售后预约','/in/salein/selectForExport.do',this.param,this.filterParam)
      },
      //快速搜索
      qSearch(){
        this.param.keyword=this.$refs.qSearch.inputValue
        this.searchWay=0;
        this.getAfterSaleList();
      }, 
      //高级搜索
      goSearch(){
        this.advancedFilter=true;
      },
      submitSearch(){
        this.param.keyword=''
        this.$refs.qSearch.inputValue=''
        this.searchWay=1;
        if(this.filterParam.time!=null){
          this.filterParam.createStartDate=this.filterParam.time[0]
          this.filterParam.createEndDate=this.filterParam.time[1]
        }else{
          this.filterParam.createStartDate=''
          this.filterParam.createEndDate=''
        }
        this.getAfterSaleList();
      },
      //清空搜索条件
      concelTerm(){
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.filterParam.time=[];
        this.getAfterSaleList();
      },
      //选择多条数据
      handleSelectionChange(val){
        this.ids = val.map(item => {
          return item.id
        });
      },
      clickSaleList(row, event, column){
        this.afterSaleRowId=row.id;
        //获取当前选中行的index
        this.preRow = this.getRowIndex(this.afterSaleRowId)
         //订单信息
        for(let key in this.detailInfor){
          this.detailInfor[key]=row[key] ? row[key] : '';
        }
        this.getDetailInfor(row);
      },
      //获取售后预约单详情
      getDetailInfor(RowData){
        //商品明细
        let json_param = JSON.stringify({pageSize:9999,pageNum:1,saleinId:RowData.id})
        this.$ajaxPost('wms/in/saleinDetail/selectPageBySaleinIdForPC.do', {reqParam: json_param}).then(({data}) => {
          if (data.code == 200) {
            this.inventory = data.data.dataList
            for(let key in  this.inventory){
              this.$set(this.inventory[key],'isDelete','0')
            }
            this.inventoryList=JSON.parse(JSON.stringify(this.inventory))
          } else {
            this.$message.error(data.msg) 
          }
        })
        this.tabTip='预约入库数量为：'+ RowData.saleinQty +'  实际入库数量为：'+RowData.inboundQty;
      },
      handleClick(tab, event) {
        this.isEditorTabs=false;
        if(this.afterSaleList.length!=0){
          this.getDetailInfor(this.afterSaleList[this.preRow]);
          //订单信息
          for(let key in this.detailInfor){
            this.detailInfor[key]=this.afterSaleList[this.preRow][key] ? this.afterSaleList[this.preRow][key] : '';
          }
        }
      },
      //编辑tabs页
      editorTabs(){
        if(this.afterSaleList.length!=0){
          let json_param = JSON.stringify({saleinId:this.afterSaleRowId})
          this.$ajaxPost('wms/in/saleinDetail/selectPageForUpdate.do', {reqParam: json_param}).then(({data}) => {
            if (data.code == 200) {
              this.isEditorTabs=true;
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      },
      //批量删除入库预约单
      deleteSales(){
        if(this.ids.length>0){
          let json_param=JSON.stringify({ids:this.ids.toString()})
          this.$ajaxPost('wms/in/salein/updateSaleinListById.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              this.$message.success('删除成功')
              this.param.pageNum=1;
              this.param.pageSize=15;
              this.getAfterSaleList();
            }else{
              this.$message.error(data.msg)
            }
          })
        }else{
          this.$message.error('请选择要删除的入库预约单')
        }
      },
      //删除这一行商品明细
      deleteInventory(scope){
        if(this.inventoryList.length<2){
          this.$message.error('请至少保留一条商品信息')
        }else{
          this.inventoryList.splice(scope.$index,1)
          for(let key in this.inventory){
            if(this.inventory[key].id==scope.row.id){
              this.inventory[key].isDelete='1'
            }
          }
        }
      },
      //取消编辑
      concelEditorTabs(){
        this.isEditorTabs=false;
        //订单信息
        for(let key in this.detailInfor){
          this.detailInfor[key] = this.afterSaleList[this.preRow][key] ? this.afterSaleList[this.preRow][key] : ''
        }
        this.getAfterSaleList();
      },
      selectShip(val){
        this.shipList.forEach(item=>{
          if(item.id==val){
            this.detailInfor.onlstoreName=item.storeName
          }
        })
      },
      selectLog(val){
        this.LogisticsList.forEach(item=>{
          if(item.id==val){
            this.detailInfor.logcompName=item.logcompName
          }
        })
        
      },
      //保存编辑详情
      saveEditDetail(){
        if(this.activeName2=='first'){
          let detailList=[]
          this.inventoryList.forEach(item=>{
            detailList.push({
              id:item.id,
              saleinQty:item.inQty,
              isDelete:'0',
              detailId:item.detailId
            })
          })
          this.inventory.forEach(item=>{
            if(item.isDelete=='1'){
              detailList.push({
                id:item.id,
                saleinQty:item.inQty,
                isDelete:'1',
                detailId:item.detailId
              })
            }
          })
          let json_param=JSON.stringify({saleinDetailList:detailList})
          this.$ajaxPost('wms/in/saleinDetail/updateSaleinDetailForSaleinid.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              this.$message.success('保存成功')
              this.isEditorTabs=false;
               this.getAfterSaleList();
            }else{
              this.$message.error(data.msg)
            }
          })
        }else{
          this.$refs.detailInforRef.validate((valid) => {
            if (valid) {
              let json_param=JSON.stringify(this.detailInfor)
              this.$ajaxPost('wms/in/salein/updateBySaleinId.do',{reqParam:json_param}).then(({data})=>{
                if(data.code==200){
                  this.$message.success('保存成功')
                  this.isEditorTabs=false;
                  this.getAfterSaleList();
                  for(let key in this.detailInfor){
                    this.detailInfor[key]=data.data[key]
                  }
                }else{
                  this.$message.error(data.msg)
                }
              })
            }else{
              return false
            }
          })
        }
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getAfterSaleList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getAfterSaleList();
      },
    },
    components: {
      'exportFile':exportFile
    },
    mounted() {
      this.getAfterSaleList();
      this.getWarehousingType();
      this.getShipList();
      this.getLogisticList();
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
  .afterSaleReservation{
    .el-input.is-disabled .el-input__inner{
      background-color: #ffffff;
      border: none !important;
    }
    .filterParam .el-dialog{
      width: 900px;
    }
  }
</style>
