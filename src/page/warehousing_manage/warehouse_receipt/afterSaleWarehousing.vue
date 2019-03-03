<template>
  <div class="afterSaleWarehouse">
      <header class="top-head">
        <el-button size="small" @click="batchExport" class="total">导出</el-button>
        <div class="header-right f-fr">
          <search placeholder="请输入预约单号，售后单号，入库单号，运单号进行搜索" @on-search="qSearch" :showIcon="false" ref="qSearch" :width="'380px'"></search>
          <el-button size="small" @click="goSearch" class="total">高级搜索</el-button>
        </div>
      </header>
      <el-table ref="afterSaleList" :highlight-current-row='true' border :data="afterSaleList" height="500px" @selection-change="handleSelectionChange" @row-click='rowClick'>
        <el-table-column align="center" type="selection" width="44"></el-table-column>
        <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="createTime" label="入库时间" width="170"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="inboundNo" label="入库单号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="type" label="入库类型">
          <template slot-scope="scope">
            {{['','退货入库','换货入库','维修入库','其它入库'][scope.row.type]}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="buyerId" label="买家ID"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="extNo" label="售后订单号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="onlstoreName" label="店铺名称"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="备注"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="saleinNo" label="预约单号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="createByname" label="操作员"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="dataMode" label="数据来源">
          <template slot-scope="scope">
            {{['','PDA','PC'][scope.row.dataMode]}}
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
          <el-table ref="inventory" border :data="inventory" height="230px">
            <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
            <el-table-column align="center" label="图片" width="74">
              <template slot-scope="scope">
                <img :src="$Util.formatImageUrl(scope.row.imageUrl)" style="height:45px;width: 100%;margin-top:5px;display:block;"/>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsCode" label="商品编码"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="skuCode" label="SKU"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="barcode" label="条码"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="brandName" label="品牌"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="properties" label="规格属性"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ownerName" label="商品货主"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="purinQty" label="预约数量"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="inboundQty" label="实际入库数量"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="入库库位明细" width="150px">
              <template slot-scope="scope">
                <el-button type="text" @click="editDetail(scope)">编辑</el-button>
                <el-button type="text" @click="checkDetail(scope)">查看</el-button>
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
            <el-form-item label="入库单号：">{{detailInfor.inboundNo}}</el-form-item>
            <el-form-item v-show="!isEditorTabs" label="入库类型：">{{['','退货入库','换货入库','维修入库','其它入库'][detailInfor.type]}}</el-form-item>
            <el-form-item v-show="!isEditorTabs" label="买家ID：">{{detailInfor.buyerId}}</el-form-item>
            <el-form-item v-show="!isEditorTabs" label="售后订单号：">{{detailInfor.extNo}}</el-form-item>
            <el-form-item v-show="!isEditorTabs" label="店铺名称：">{{detailInfor.onlstoreName}}</el-form-item>
            <el-form-item v-show="!isEditorTabs" label="入库单备注：">{{detailInfor.note}}</el-form-item>

            <el-form-item v-show="isEditorTabs" label="入库类型：" prop="type">
              <el-select size="small" v-model="detailInfor.type" clearable >
                <template v-for="(item,index) in warehousingTypeList">
                  <el-option :label="item.itemName" :value="item.itemValue" :key="index"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item v-show="isEditorTabs" label="买家ID：" prop="buyerId">
              <el-input size="small" v-model="detailInfor.buyerId" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="入库时间：">{{detailInfor.createTime}}</el-form-item>
            <el-form-item v-show="isEditorTabs" label="售后订单号：" prop="extNo">
              <el-input size="small" v-model="detailInfor.extNo"></el-input>
            </el-form-item>
            <el-form-item v-show="isEditorTabs" label="店铺名称：" prop="onlstoreId">
              <el-select size="small" v-model="detailInfor.onlstoreId" clearable @change="selectShip">
                <template v-for="(item,index) in shipList">
                  <el-option :label="item.storeName" :value="item.id" :key="index"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item v-show="isEditorTabs" label="入库单备注：" prop="note">
              <el-input size="small" v-model="detailInfor.note"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="tabTip" name="three" disabled></el-tab-pane>
      </el-tabs>
      <div class="buttonBox" v-if="activeName2=='second'">
        <el-button type="text" v-if="!isEditorTabs" @click="editorTabs">编辑</el-button>
        <el-button type="text" v-if="isEditorTabs" @click="concelEditorTabs">取消</el-button>
        <el-button type="text" v-if="isEditorTabs" @click="saveEditDetail">保存</el-button>
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
        <el-form-item prop="buyerId" label="买家ID：">
          <el-input size="small" v-model="filterParam.buyerId" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="onlstoreName" label="店铺名称：">
          <el-input size="small" v-model="filterParam.onlstoreName" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="time" label="入库时间：">
          <el-date-picker
            v-model="filterParam.time1"
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
        <el-form-item prop="createByname" label="操作员：">
          <el-input size="small" v-model="filterParam.createByname" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="dataMode" label="数据来源：">
          <el-select size="small" v-model="filterParam.dataMode" placeholder="请选择" clearable>
            <el-option label="PDA" value="1"></el-option>
            <el-option label="PC" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="concelTerm">清空条件</el-button>
          <el-button size="small" @click="submitSearch" class="total">查询</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="storehouseTitle" :visible.sync="storehouseDia" height='400px'  :modal-append-to-body="false">
      <el-form :model="storehouseData" label-width="110px" class="detailInfor storehouse" size="small">
        <el-form-item label="商品编码：">{{storehouseData.goodsCode}}</el-form-item>
        <el-form-item label="SKU：">{{storehouseData.skuCode}}</el-form-item>
        <el-form-item label="预约数量：">{{storehouseData.purinQty}}</el-form-item>
        <el-form-item label="商品名称：">{{storehouseData.goodsName}}</el-form-item>
        <el-form-item label="品牌：" >{{storehouseData.brandName}}</el-form-item>
        <el-form-item label="规格属性：">{{storehouseData.properties}}</el-form-item>
      </el-form>
       <el-table ref="storehouseList2" border :data="storehouseList2" height="500px" >
        <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="locationCode" label="入库库位"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop='' label="实际入库数量">
          <template slot-scope="scope">
            <el-input size="small" v-if="storehouseTitle=='编辑入库明细'" maxlength="5" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" style="margin:10px 0;width:80%;text-align:center;" v-model="scope.row.inboundQty"></el-input>
            <p v-else>{{scope.row.inboundQty}}</p>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop='' label="操作" v-if="storehouseTitle=='编辑入库明细'">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteRow(scope)">删除</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="noData">
            <div class="noData-img"></div>
            <p>暂无数据</p>
          </div>
        </template>
      </el-table>
      <el-row style="text-align:right;margin-top:10px;" v-show="storehouseTitle=='编辑入库明细'">
        <el-button size="small" @click="concelEdit">取消</el-button>
        <el-button size="small" @click="submitEdit" class="total">保存</el-button>
      </el-row>
      <!--分页-->
      <el-pagination background :page-sizes="[15,30,50,100]"
                     :page-size="s_param.pageSize"
                     :total="s_param.total"
                     layout="total, prev, pager, next, sizes, jumper"
                     @size-change="s_sizeChange"
                     v-if="storehouseTitle=='入库库位明细'"
                     @current-change="s_currentChange"
                     :current-page.sync="s_param.pageNum"
                     style="margin-top: 20px;text-align: center;">
      </el-pagination>
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
        if(value!=null){
          let v = value.toString().trim();
          if(v.length<5||v.length>30){
            if (callback) callback(new Error('请输入5-30个字'));
          }else{
            callback();
          }
        }
      };
      return{
        ids:[],  //选中的id
        afterSaleList:[],
        afterSaleRowId:-1,
        advancedFilter:false,
        filterParam:{
          goodsName:'',
          goodsCodeAndSkuCode:'',
          buyerId:'',
          onlstoreName:'',
          time1:'',
          createStartDate:'',
          createEndDate:'',
          type:'',
          status:'',
          createByname:'',
          dataMode:'',
        },
        warehousingTypeList:[],  //入库类型列表
        shipList:[],  //店铺列表
        tabTip:'预约入库数量为：    实际入库数量为：',
        detailInfor:{
          id:'',
          inboundNo:'',
          type:'',
          buyerId:'',
          extNo:'',
          createTime:'',
          onlstoreId:'',
          onlstoreName:'',
          note:'',
        },
        detailInforRule:{
          type:[{required: true, trigger: 'change', message:'请选择入库类型'}],
          buyerId:[{required: true, trigger: 'change', validator:buyerReg}],
          extNo:[{required: true, trigger: 'change', validator:this.$Util.RegExp.strLengthReg2}],
          onlstoreId:[{required: true, trigger: 'change', message:'请选择店铺'}],
          note:[{trigger: 'change',validator:this.$Util.RegExp.noteReg}],
        },
        searchWay:0,
        activeName2: 'first',
        inventory:[{}], //商品明细表格
        isEditorTabs:false,  //是否在编辑tab页
        param: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        total: 10,
        storehouseTitle:'入库库位明细',
        storehouseDia:false,
        storehouseData:{},
        storehouseList:[],
        storehouseList2:[],  //isDelete为0的显示  为1为已删除，不显示（模拟删除）
        s_param:{   //入库库位明细翻页
          pageNum: 1,
          pageSize: 15,
          total: 10,
        },
        saleinboundDetailRow:{}, //点击查看或编辑入库库位明细时那一行的数据
        preRow:0,
      }
    },
    methods:{
      //获取所有
      getAfterSaleList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/inbound/saleinbound/selectSearchPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.afterSaleList=data.data.dataList
            this.total=data.data.totalNum
            if(this.afterSaleList.length==0){
              this.inventory=[]
              for(let key in this.detailInfor){
                this.detailInfor[key]=''
              }
            }else{
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
      //点击表格某一行时
      rowClick(row, event, column){
        this.afterSaleRowId=row.id;
        //获取当前选中行的index
        this.preRow = this.getRowIndex(this.afterSaleRowId)
        this.getDetailInfor(row);
         //订单信息
        for(let key in this.detailInfor){
          if(row[key]!=null){
            this.detailInfor[key]=row[key]
          }
        } 
      },
       //获取售后预约单详情
      getDetailInfor(RowData){
        //商品明细
        let json_param = JSON.stringify({pageSize:9999,pageNum:1,inboundId:RowData.id})
        this.$ajaxPost('wms/inbound/saleinboundDetail/selectPageByInboundIdForPC.do', {reqParam: json_param}).then(({data}) => {
          if (data.code == 200) {
            this.inventory = data.data.dataList
          } else {
            this.$message.error(data.msg)
          }
        })
        this.tabTip='预约入库数量为：'+RowData.purinQty+'  实际入库数量为：'+RowData.inboundQty;
      },
        //批量导出
      batchExport(){
        this.$refs.exportFile.export('售后入库单','/inbound/saleinbound/selectForExport.do',this.param,this.filterParam)
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
        if(this.filterParam.time1!=null){
          this.filterParam.createStartDate=this.filterParam.time1[0]
          this.filterParam.createEndDate=this.filterParam.time1[1]
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
        this.filterParam.time1=[];
        this.getAfterSaleList();
      },
      //选择多条数据
      handleSelectionChange(val){
        this.ids = val.map(item => {
          return item.id
        });
      },
      handleClick(tab, event) {
        this.isEditorTabs=false;
        if(this.afterSaleList.length!=0){
         this.getDetailInfor(this.afterSaleList[this.preRow]);
          //订单信息
          for(let key in this.detailInfor){
            if(this.afterSaleList[this.preRow][key]!=null){
              this.detailInfor[key]=this.afterSaleList[this.preRow][key]
            }
          } 
        }
      },
       //编辑入库库位明细
      editDetail(scope){
        this.storehouseTitle='编辑入库明细'
        this.s_param.pageNum=1;
        this.s_param.pageSize=9999
        this.saleinboundDetailRow=scope.row
        // 判断有没有编辑权限
        let json_param2=JSON.stringify({
          inboundDate:scope.row.inboundDate,
          inboundId:this.afterSaleRowId,
          skuId:scope.row.id
        })
        this.$ajaxPost('wms/inbound/saleinboundDetail/selectNotPageByInboundIdAndSkuId.do',{reqParam:json_param2}).then(({data})=>{
          if(data.code==200){
            this.getSaleinboundDetail(scope.row)
          }else{
            this.$message.error(data.msg)
            return false;
          }
        })
      },
      //查看入库库位明细
      checkDetail(scope){
        this.storehouseTitle='入库库位明细'
        this.s_param.pageNum=1;
        this.s_param.pageSize=15
        this.saleinboundDetailRow=scope.row
        this.getSaleinboundDetail(scope.row)
      },
       //获取入库库位明细
      getSaleinboundDetail(GoodsRow){
        this.storehouseData = GoodsRow
        this.storehouseData.properties.replace(/,/g,'\n')
        let json_param=JSON.stringify({
          pageNum:this.s_param.pageNum,
          pageSize:this.s_param.pageSize,
          inboundId:this.afterSaleRowId,
          skuId:GoodsRow.id
        })
        this.$ajaxPost('wms/inbound/saleinboundDetail/selectPageByInboundIdAndSkuId.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.storehouseList=data.data.dataList
            for(let key in  this.storehouseList){
              this.$set(this.storehouseList[key],'isDelete','0')
            }
            this.storehouseList2=JSON.parse(JSON.stringify(this.storehouseList))
            this.s_param.total=data.data.totalNum
            this.storehouseDia=true;
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //删除
      deleteRow(scope){
        if(this.storehouseList2.length>1){
          this.storehouseList2.splice(scope.$index,1)
          for(let key in this.storehouseList){
            if(this.storehouseList[key].id==scope.row.id){
              this.storehouseList[key].isDelete='1'
            }
          }
        }else{
          this.$message.error('请至少保留一个商品信息')
        }
      },
       //取消
      concelEdit(){
        this.storehouseDia=false;
        this.getAfterSaleList();
      },
      //保存
      submitEdit(){
        let detailList=[]
        let flag=true;
        //未被删除的
        this.storehouseList2.forEach(item=>{
          detailList.push({
            id:item.id,
            inboundQty:item.inboundQty,
            isDelete:'0'
          })
          if(item.inboundQty==0||item.inboundQty==''){
            flag=false;
          }
        })
        // 被删除的
        this.storehouseList.forEach(item=>{
          if(item.isDelete=='1'){
            detailList.push({
              id:item.id,
              inboundQty:item.inboundQty,
              isDelete:'1'
            })
          }
        })
        if(flag){
          let json_param=JSON.stringify({saleinboundDetailList:detailList})
          this.$ajaxPost('wms/inbound/saleinboundDetail/updateDetailById.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              this.$message.success('保存成功')
              this.storehouseDia=false;
              this.getAfterSaleList();
            }else{
              this.$message.error(data.msg)
            }
          })
        }else{
          this.$message.error('商品数量仅支持1-99999的整数')
          return false;
        }
      },
      //编辑订单信息
      editorTabs(){
        if(this.afterSaleList.length!=0){
          // 判断有没有编辑权限
          let json_param=JSON.stringify({
            inboundId:this.afterSaleRowId,
          })
          this.$ajaxPost('wms/inbound/saleinboundDetail/selectSaleinByIdForUpdate.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              this.isEditorTabs=true;
            }else{
              this.$message.error(data.msg)
              return false;
            }
          })
        }
      },
      //取消编辑订单信息
      concelEditorTabs(){
        this.isEditorTabs=false;
         //订单信息
        for(let key in this.detailInfor){
          if(this.afterSaleList[this.preRow][key]!=null){
            this.detailInfor[key]=this.afterSaleList[this.preRow][key]
          }
        } 
        this.getAfterSaleList();
      },
      //选择店铺
      selectShip(val){
        this.shipList.forEach(item=>{
          if(item.id==val){
            this.detailInfor.onlstoreName=item.storeName
          }
        })
      },
      //保存编辑订单信息
      saveEditDetail(){
        let json_param=JSON.stringify(this.detailInfor)
        this.$refs.detailInforRef.validate((valid) => {
          if (valid) {
            this.$ajaxPost('wms/inbound/saleinboundDetail/updateSaleinboundById.do',{reqParam:json_param}).then(({data})=>{
              if(data.code==200){
                this.isEditorTabs=false;
                this.getAfterSaleList();
                for(let key in this.detailInfor){
                  this.detailInfor[key]=data.data[key]
                }
                this.$message.success('保存成功')
              }else{
                this.$message.error(data.msg)
                return false;
              }
            })
          }else{
            return false
          }
        })
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
        //每页数量改变
      s_sizeChange(v) {
        this.s_param.pageSize = v;
        this.getSaleinboundDetail(this.saleinboundDetailRow);
      },
      //当前页改变
      s_currentChange(v) {
        this.s_param.pageNum = v;
        this.getSaleinboundDetail(this.saleinboundDetailRow);
      },
    },
    components: {
      'exportFile':exportFile
    },
    mounted() {
      this.getAfterSaleList();
      this.getWarehousingType();
      this.getShipList();
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
  .detailInfor.storehouse{
    .el-form-item{
      width: 33%;
    }
  }
  .afterSaleWarehouse{
    .el-input.is-disabled .el-input__inner{
      background-color: #ffffff;
      border: none !important;
    }
    .filterParam .el-dialog{
      width: 900px;
    }
  }
</style>
