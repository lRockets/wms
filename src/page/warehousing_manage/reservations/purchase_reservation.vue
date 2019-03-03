<template>
  <div class="purchasingRes">
    <div class="purchasing" v-if="isDetail" key="purchasing">
      <header class="top-head">
        <!-- <el-button size="small" class="total">打印</el-button> -->
        <el-button size="small" @click="batchExport" class="total">批量导出</el-button>
        <el-button size="small" @click="deleteRes">删除</el-button>
        <div class="header-right f-fr">
          <search placeholder="请输入入库预约单号，外部单号，物流单号进行搜索" @on-search="qSearch" :showIcon="false" ref="qSearch" :width="'370px'"></search>
          <el-button size="small" @click="goSearch" class="total">高级搜索</el-button>
        </div>
      </header>
      <el-table ref="puReservaList" border :data="puReservaList" height="500px" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="44"></el-table-column>
        <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
        <el-table-column align="center" prop="name" label="操作" width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="checkDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="createTime" label="创建时间" width="170"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="purinNo" label="预约单号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="入库类型">
          <template slot-scope="scope">{{'采购入库'}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="status" label="入库状态">
          <template slot-scope="scope">
            {{scope.row.status=='-2'?'删除':['','在途','部分收货','收货完成'][scope.row.status]}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="supplierName" label="供应商"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="createByname" label="申请人"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="inboundDate" label="预约入库时间" width="170"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="备注"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="extNo" label="外部单号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="logcompName" label="物流商"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="expbillNo" label="物流单号"></el-table-column>
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
    </div>
    <div class="detail" v-else key="detail">
      <header class="top-head">
        <el-button type="text">{{isEdit==true?'编辑预约单':'预约单详情'}}</el-button>
        <div class="header-right f-fr">
          <el-button size="small" @click="editPurchase" v-if="!isEdit" class="total">编辑</el-button>
          <el-button size="small" @click="goBack" v-if="!isEdit">返回</el-button>
          <el-button size="small" @click="saveEdit" v-if="isEdit" class="total">保存</el-button>
          <el-button size="small" @click="concelBack" v-if="isEdit">取消返回</el-button>
        </div>
      </header>
      <div class="subTitle" v-show="isEdit">基本信息</div>
      <header class="top-head detail" :class="{isEditing:isEdit}">
        <el-form :model="detailInfor" label-width="121px" class="detailInfor" ref="detailInforRef" :rules="detailInforRule" size="small">
          <el-form-item label="预约单号：">{{detailInfor.purinNo}}</el-form-item>
          <el-form-item label="入库状态：">{{detailInfor.status=='-2'?'删除':['','在途','部分收货','收货完成'][detailInfor.status]}}</el-form-item>
          <el-form-item label="入库类型：">采购入库</el-form-item>
          <el-form-item v-show="!isEdit" label="供应商：">{{detailInfor.supplierName}}</el-form-item>
          <el-form-item v-show="isEdit" label="供应商：" prop="supplierId">
            <el-select size="small" v-model="detailInfor.supplierId" placeholder="请选择" @change="selectSupplier">
              <template v-for="(item,index) in supplierList">
                <el-option :label="item.supplierName" :value="item.id" :key="index"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item v-show="!isEdit" label="预约入库时间：">{{detailInfor.inboundDate}}</el-form-item>
          <el-form-item v-show="isEdit" label="预约入库时间：" prop="inboundDate">
            <el-date-picker
              v-model="detailInfor.inboundDate"
              type="datetime"
              placeholder="选择日期时间"
              value-format='yyyy-MM-dd HH:mm:ss'
              default-time="12:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-show="!isEdit" label="外部单号：">{{detailInfor.extNo}}</el-form-item>
          <el-form-item v-show="isEdit" label="外部单号：" prop="extNo">
            <el-input size="small" v-model="detailInfor.extNo"></el-input>
          </el-form-item>
          <el-form-item v-show="!isEdit" label="申请人：">{{detailInfor.createByname}}</el-form-item>
          <el-form-item v-show="isEdit" label="申请人：" prop="createByname">
            <el-input size="small" v-model="detailInfor.createByname"></el-input>
          </el-form-item>
          <el-form-item v-show="!isEdit" label="物流商：">{{detailInfor.logcompName}}</el-form-item>
          <el-form-item v-show="isEdit" label="物流商：" prop="logcompId">
            <el-select size="small" v-model="detailInfor.logcompId" placeholder="请选择" @change="selectLogcomp">
              <template v-for="(item,index) in LogisticsList">
                <el-option :label="item.logcompName" :value="item.id" :key="index"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item v-show="!isEdit" label="物流单号：">{{detailInfor.expbillNo}}</el-form-item>
          <el-form-item v-show="isEdit" label="物流单号：" prop='expbillNo'>
            <el-input size="small" v-model="detailInfor.expbillNo"></el-input>
          </el-form-item>
          <el-form-item v-show="!isEdit" label="备注：">{{detailInfor.note}}</el-form-item>
          <el-form-item v-show='isEdit' label="备注：" prop="note" style="width:80%">
            <el-input size="small" v-model="detailInfor.note" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </header>
      <el-row v-show="!isEdit">
        <div class="warehousingNum f-fl">
          <span><i>预约入库数量为：</i>{{detailInfor.purinQty}}</span>
          <span><i>实际入库数量为：</i>{{detailInfor.inboundQty}}</span>
        </div>
        <div class="header-right f-fr">
          <search placeholder="请输入商品编码，SKU，条形码，商品名称，进行搜索" @on-search="detail_qSearch" :showIcon="false" ref="d_qSearch" class="detail_qSearch" :width="'370px'"></search>
        </div>
      </el-row>
      <div class="subTitle" v-show="isEdit">商品信息</div>
      <el-table ref="detailList" border :data="detailList" height="300px" @row-click='editDia'>
        <el-table-column align="center" type='index' label="行号" width="48"></el-table-column>
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
        <el-table-column :show-overflow-tooltip="true" align="center" prop="purinQty" label="预约数量">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.purinQty" v-if="isEdit" style="text-align:center" maxlength="5" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
            <p v-else>{{scope.row.purinQty}}</p>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="inboundQty" label="实际入库数量" v-show="!isEdit"></el-table-column>
        <el-table-column align="center" label="" width="74" v-if="isEdit">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" @click="removeRow(scope)"></el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="noData">
            <div class="noData-img"></div>
            <p>暂无数据</p>
          </div>
        </template>
      </el-table>
      <!--分页-->
      <el-pagination background :page-sizes="[15,30,50,100]"
                    v-show="!isEdit"
                     :page-size="detail_param.pageSize"
                     :total="detail_param.total"
                     layout="total, prev, pager, next, sizes, jumper"
                     @size-change="detail_sizeChange"
                     @current-change="detail_currentChange"
                     :current-page.sync="detail_param.pageNum"
                     style="margin-top: 20px;text-align: center;">
      </el-pagination>
    </div>
    <el-dialog title="高级筛选" :visible.sync="advancedFilter"  :modal-append-to-body="false" class="filterParam">
      <el-form :model="filterParam" label-width="130px" size="small">
        <el-form-item prop="goodsName" label="商品名称：">
          <el-input size="small" v-model="filterParam.goodsName" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="goodsCodeAndSkuCode" label="商品编码/SKU：">
          <el-input size="small" v-model="filterParam.goodsCodeAndSkuCode" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="time1" label="预约入库时间：">
          <el-date-picker
            v-model="filterParam.time1"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 280px"
            size="small"
            @change="selectTime1"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="time2" label="预约单创建时间：">
          <el-date-picker
            v-model="filterParam.time2"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 280px"
            size="small"
            @change="selectTime2"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="status" label="入库状态：">
          <el-select size="small" v-model="filterParam.status" placeholder="请选择" clearable>
            <el-option label="在途" value="1"></el-option>
            <el-option label="部分收货" value="2"></el-option>
            <el-option label="收货完成" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="supplierId" label="供应商：">
          <el-select size="small" v-model="filterParam.supplierId" placeholder="请选择" clearable>
            <template v-for="(item,index) in supplierList">
              <el-option :label="item.supplierName" :value="item.id" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="createByname" label="操作员：">
          <el-input size="small" v-model="filterParam.createByname" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="dataMode" label="数据来源：">
          <el-select size="small" v-model="filterParam.dataMode" placeholder="请选择" clearable>
            <el-option label="接口同步" value="1"></el-option>
            <el-option label="手动添加" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="concelTerm">清空条件</el-button>
          <el-button size="small" @click="submitSearch" class="total">查询</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <edit-purchase 
      :checkedList='detailList' 
      :detailData='puReservaRow' 
      ref="editPurchaseRef"></edit-purchase>
    <export-file :idsArrary='ids' ref="exportFile"></export-file>
  </div>
</template>

<script>
import editPurchase from '@/components/warehousing/editPurchase'; 
import exportFile from '@/components/export/index'; 
  export default {
    props:{},
    data(){
      const nameRule = (rule, value, callback) => {
        let v = value.toString().trim()
        if (v.length < 2 || v.length > 6) {
          if (callback) callback(new Error('请输入2-6个字'))
        } else {
          callback()
        }
      }
      return{
        isDetail:true,
        ids:[],  //选中的id
        isEdit:false, //是否正在编辑
        puReservaList:[],
        advancedFilter:false,
        filterParam:{
          typeName:'',
          goodsName:'',
          goodsCodeAndSkuCode:'',
          time1:'',
          inboundStartDate:'',
          inboundEndDate:'',
          time2:'',
          createStartDate:'',
          createEndDate:'',
          status:'',
          supplierId:'',
          createByname:'',
          dataMode:'',
        },
        supplierList:[],  //供应商列表
        statusList:[],   //入库状态列表
        LogisticsList:[],  //物流商列表
        detailInfor:{
          id:'',
          purinNo:'',
          status:'',
          supplierId:'',
          supplierName:'',
          inboundDate:'',
          extNo:'',
          createByname:'',
          expbillNo:'',
          logcompId:'',
          logcompName:'',
          note:'',
          purinDetailList:[],
          inboundQty:'',
          purinQty:'',
        },
        detailInforRule:{
          supplierId:{required: true, trigger: 'change', message: '请选择供应商'},
          extNo:{required: true,trigger: 'change', validator: this.$Util.RegExp.strLengthReg2},
          createByname:{required: true,trigger: 'change',validator: nameRule},
          expbillNo:{required: true,trigger: 'change', validator: this.$Util.RegExp.strLengthReg2},
          inboundDate:{required: true,trigger: 'change',message:'请选择入库时间'},
          logcompId:{required: true,trigger: 'change',message:'请选择物流商'},
          note:{trigger: 'change', validator: this.$Util.RegExp.noteReg},
        },
        searchWay:0,
        detailList:[],  //详情列表
        puReservaRow:{}, //采购预约单列表一行的数据
        param: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        total: 10,
        detail_param:{
          pageNum: 1,
          pageSize: 15,
          total: 10,
          keyword:'',
        }
      }
    },
    methods:{
      //查询采购预约单列表
      getPurchasList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/in/purin/selectSearchPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.puReservaList=data.data.dataList
            this.total=data.data.totalNum
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //获取供应商列表
      getSupplier () {
        let json_param = JSON.stringify({pageNum:1,pageSize:9999})
        this.$ajaxPost('wms/supplier/selectPage.do', {reqParam: json_param}).then(({data}) => {
          if (data.code == 200) {
            this.supplierList = data.data.dataList
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      //获取入库状态列表
      getStatusList () {
        let json_param = JSON.stringify({typeName:'入库状态'})
        this.$ajaxPost('wms/dataDict/selectItemName.do', {reqParam: json_param}).then(({data}) => {
          if (data.code == 200) {
            this.statusList = data.data.dataDictList
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
      //删除
      deleteRes(){
        if(this.ids.length>0){
          this.$confirm('删除预约单后，不可恢复，请谨慎操作？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let json_param=JSON.stringify({ids:this.ids.toString()})
            this.$ajaxPost('wms/in/purin/updatePurinListById.do',{reqParam:json_param}).then(({data}) => {
              if (data.code == 200) {
                this.$message.success('删除成功');
                this.param.pageNum=1;
                this.param.pageSize=15;
                this.getPurchasList();
              } else {
                this.$message.error(data.msg);
              }
            })
          }).catch(() => {})
        }else{
          this.$message.error('请选择要删除的预约单')
        }
      },
      //批量导出
      batchExport(){
        this.$refs.exportFile.export('采购预约单','/in/purin/selectForExport.do',this.param,this.filterParam)
      },
      //快速搜索
      qSearch(){
        this.param.keyword=this.$refs.qSearch.inputValue
        this.searchWay=0
        this.getPurchasList();
      },
      //高级搜索
      goSearch(){
        this.advancedFilter=true;
      },
      selectTime1(val){
        if(val==null){
          this.filterParam.inboundStartDate=''
          this.filterParam.inboundEndDate=''
        }else{
          this.filterParam.inboundStartDate=this.filterParam.time1[0]
          this.filterParam.inboundEndDate=this.filterParam.time1[1]
        }
      },
       selectTime2(val){
        if(val==null){
          this.filterParam.createStartDate=''
          this.filterParam.createEndDate=''
        }else{
         this.filterParam.createStartDate=this.filterParam.time2[0]
          this.filterParam.createEndDate=this.filterParam.time2[1]
        }
      },
      submitSearch(){
        this.param.keyword=''
        this.$refs.qSearch.inputValue=''
        this.searchWay=1;
        this.getPurchasList();
      },
      //清空搜索条件
      concelTerm(){
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.filterParam.time1=[]
        this.filterParam.time2=[]
        this.getPurchasList();
      },
      //选择多条数据
      handleSelectionChange(val){
        this.ids = val.map(item => {
          return item.id
        });
      },
      //查看详情
      checkDetail(row){
        this.isDetail=false;
        this.puReservaRow=row;
        for(let key in this.detailInfor){
          if(this.puReservaRow[key]!=null){
            this.detailInfor[key]=this.puReservaRow[key];
          }
        }
        this.declareVariable();
      },
      declareVariable(){
        this.$nextTick(()=>{
          let word= this.$refs.d_qSearch.inputValue
          let json_param=JSON.stringify({pageNum:this.detail_param.pageNum,pageSize:this.detail_param.pageSize,purinId:this.puReservaRow.id,keyword:word})
          this.$ajaxPost('wms/in/purinDetail/selectSearchPageByPurinId.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              this.detailList=data.data.dataList
              this.detail_param.total=data.data.totalNum
            }else{
              this.$message.error(data.msg)
            }
          })
        })
      },
      //编辑详情
      editPurchase(){
        let json_param=JSON.stringify({purinId:this.puReservaRow.id})
        this.$ajaxPost('wms/in/purinDetail/selectByPurinIdForUpdate.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.isEdit=true;
            this.detail_param.pageSize=9999
            this.detail_param.pageNum=1
            this.declareVariable();
          }else{
            this.$message.error(data.msg)
          }
        })
        
      },
      //选择供应商
      selectSupplier(val){
        this.supplierList.forEach(item=>{
          if(val==item.id){
            this.detailInfor.supplierName=item.supplierName
          }
        })
      },
      //选择物流商
      selectLogcomp(val){
        this.LogisticsList.forEach(item=>{
          if(val==item.id){
            this.detailInfor.logcompName=item.logcompName
          }
        })
      },
      // 新增商品弹框
      editDia(row, event, column){
        if(this.isEdit&&column.label!='预约数量' && this.isEdit&&column.label!=''){
          this.$refs.editPurchaseRef.editDetailsdia=true;
          this.$refs.editPurchaseRef.getCategoryTree()
        }
      },
      //移除商品
      removeRow(scope){
        if(this.detailList.length<2){
          this.$message.error('请至少保留一条商品信息')
        }else{
          let json_param=JSON.stringify({detailId:scope.row.detailId})
          this.$ajaxPost('wms/in/purinDetail/updateByDetailId.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              this.declareVariable();
            }else{
              this.$message.error(data.msg)
            }
          })
        }
      },
      //保存编辑
      saveEdit(){
        this.$refs.detailInforRef.validate((valid) => {
          if (valid) {
            this.detailInfor.purinDetailList=[]
            this.detailList.forEach(item=>{
              this.detailInfor.purinDetailList.push({
                detailId:item.detailId,
                purinQty:item.purinQty,
              })
            })
            let json_param=JSON.stringify(this.detailInfor)
            this.$ajaxPost('wms/in/purin/updatePurinById.do',{reqParam:json_param}).then(({data})=>{
              if(data.code==200){
                this.detail_param.pageSize=15
                this.detail_param.pageNum=1
                this.declareVariable();
                this.isEdit=false;
                for(let key in this.detailInfor){
                  this.detailInfor[key]=data.data[key];
                }
                this.$message.success('保存成功')
              }else{
                this.$message.error(data.msg)
              }
            })
          }else{
            return false
          }
        })
      },
      //取消返回
      concelBack(){
        this.isEdit=false;
        this.detail_param.pageSize=15
        this.detail_param.pageNum=1
        for(let key in this.detailInfor){
          if(this.puReservaRow[key]!=null){
            this.detailInfor[key]=this.puReservaRow[key];
          }
        }
        this.detail_param.pageSize=15
        this.detail_param.pageNum=1
        this.declareVariable();
      },
      //快速搜索详情列表
      detail_qSearch(){
        this.declareVariable();
      },
      //返回
      goBack(){
        this.isDetail=true;
        this.getPurchasList();
      },
      //关闭表单时重置
      resetRules(val) {
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getPurchasList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getPurchasList();
      },
      //每页数量改变
      detail_sizeChange(v) {
        this.detail_param.pageSize = v;
        this.declareVariable();
      },
      //当前页改变
      detail_currentChange(v) {
        this.detail_param.pageNum = v;
        this.declareVariable();
      },
    },
    components: {
      'editPurchase':editPurchase,
      'exportFile':exportFile
    },
    mounted() {
      this.getPurchasList();
      this.getSupplier();
      this.getStatusList();
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
  .purchasingRes{
    .detailInfor{
      .el-form-item{
        width: 33%;
      }
    }
    .isEditing{
      border-bottom: none;
      margin-bottom: 0;
    }
    .el-input.is-disabled .el-input__inner{
      background-color: #ffffff;
      border: none !important;
      text-align: center;
    }
     .filterParam .el-dialog{
      width: 900px;
    }
  }
</style>
