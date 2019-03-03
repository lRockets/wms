<template>
  <div class="storageLocation">
    <header class="top-head">
      <el-button @click="addLocationBtn" class="total" size="small">新增</el-button>
      <el-button @click="deleteLocationBtn" class="total" size="small">删除</el-button>
      <el-button @click="batchAddBtn" class="total" size="small">批量新增</el-button>
      <!-- <el-button  class="total" size="small">条码打印</el-button> -->
      <div class="header-right f-fr">
        <search placeholder="请输入库区编码，进行搜索" @on-search="qSearch" :width="'280px'" :showIcon="false" ref="qSearch" style="width:310px"></search>
        <el-button @click="goSearch" class="total" size="small">高级搜索</el-button>
      </div>
    </header>
    <div class="storage_location">
      <div class="leftTree" >
        <el-button type="text" size="small" style="color:#39b9fe;" @click="expandOrContract">展开 | 收缩</el-button>
        <el-tree
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          node-key="id"
          ref="storeTree"
          :default-expand-all='isOpenTree'
           :highlight-current="true"
          :default-expanded-keys="defaultExpandArray"
          :expand-on-click-node='false'
          accordion
          ></el-tree>
      </div>
      <div class="rightMain">
        <el-table ref="locationList" border :data="locationList" height=500px  @selection-change="handleSelectionChange" >
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" type="index" label="行号" width="60"></el-table-column>
          <el-table-column align="center" prop="name" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="checkDetail(scope.row)" class="color:#39b9fe;" size="small">查看详情</el-button>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="stoareaName" label="库区名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="stoshelfCode" label="货架/地堆编码" width="130"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="locationCode" label="库位编码" width="130"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="locationType" label="类型"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="locationStatuName" label="状态"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="areaTypeName" label="库区类型"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="length" label="库位长(m)" width="85"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="width" label="库位宽(m)" width="85"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="height" label="库位高(m)" width="85"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="maxVolume" label="库位容积(m³)" width="105"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="maxWeight" label="库位承重(kg)" width="100"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="stochannelCode" label="通道编码" width="130"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="layerNum" label="层数编码" width="130"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="columnNum" label="列数编码" width="130"></el-table-column>
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
        <el-dialog title="高级筛选" :visible.sync="advancedFilter"  :modal-append-to-body="false" class="filterParam">
          <el-form :model="filterParam" label-width="110px" >
            <el-form-item prop="locationStatus" label="状态：">
              <el-select v-model="filterParam.locationStatus" placeholder="请选择" size="small">
                <el-option label="全部" value=""></el-option>
                <el-option label="空闲" value="1"></el-option>
                <el-option label="可用" value="2"></el-option>
                <el-option label="饱和" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="areaType" label="库区类型：">
              <el-select v-model="filterParam.areaType" placeholder="请选择" size="small">
                <template v-for="(item,index) in ReservoirTypeList">
                  <el-option :label="item.itemName" :value="item.itemValue" :key="index"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item prop="type" label="类型：">
              <el-select v-model="filterParam.type" placeholder="请选择" size="small">
                <el-option label="全部" value="0"></el-option>
                <el-option label="货架" value="1"></el-option>
                <el-option label="托盘" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width:100%;text-align:right;">
              <el-button @click="concelTerm" size="small">清空条件</el-button>
              <el-button @click="submitSearch" class='total' size="small">查询</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog :title="locationTitle" :visible.sync="addlocationDia"  :modal-append-to-body="false" class="addlocation" @close="resetAdd">
          <el-form :model="addlocation" label-width="130px" :rules="addlocationRule" ref="addlocationRef" size="small">
            <el-form-item prop="type" label="类型：" >
              <el-select v-model="addlocation.type" size="small" placeholder="请选择" @change="changeType" :disabled="locationTitle=='编辑库位'">
                <el-option label="货架" value="1"></el-option>
                <el-option label="托盘" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="stoareaId" label="所在库区：">
              <el-select v-model="addlocation.stoareaId" size="small" placeholder="请选择库区" @change="changeStoarea" :disabled="locationTitle=='编辑库位'">
                <template v-for="(item,index) in reservoirList">
                  <el-option :label="item.stoareaCode" :value="item.id" :key="index"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item prop="stochannelCode" label="所在通道编码：">
              <el-input v-model="addlocation.stochannelCode" size="small" :disabled="locationTitle=='编辑库位'"></el-input >
            </el-form-item>
            <el-form-item prop="stoshelfCode" label="所在货架编码：" v-if="addlocation.type==1">
              <el-input v-model="addlocation.stoshelfCode" size="small" :disabled="locationTitle=='编辑库位'"></el-input>
            </el-form-item>
            <el-form-item prop="layerNum" label="所在层数编码：" v-if="addlocation.type==1">
              <el-input v-model="addlocation.layerNum" size="small" :disabled="locationTitle=='编辑库位'"></el-input>
            </el-form-item>
            <el-form-item prop="columnNum" label="所在列数编码：" v-if="addlocation.type==1">
              <el-input v-model="addlocation.columnNum" size="small" :disabled="locationTitle=='编辑库位'"></el-input>
            </el-form-item>
            <el-form-item prop="stoshelfCode" label="所在托盘编码：" v-else>
              <el-input v-model="addlocation.stoshelfCode" size="small" :disabled="locationTitle=='编辑库位'"></el-input>
            </el-form-item>
            <el-form-item prop="locationCode" label="库位编码：" style="width: 55%">
              <el-input v-model="addlocation.locationCode" size="small" :disabled="true" class="special"></el-input>
            </el-form-item>
            <el-form-item prop="length" label="库位长(m)：" >
              <el-input v-model="addlocation.length" maxlength="5" size="small"></el-input>
            </el-form-item>
            <el-form-item prop="width" label="库位宽(m)：" >
              <el-input v-model="addlocation.width" maxlength="5" size="small"></el-input>
            </el-form-item>
            <el-form-item prop="height" label="库位高(m)：" >
              <el-input v-model="addlocation.height" maxlength="5" size="small"></el-input>
            </el-form-item>
            <el-form-item prop="maxWeight" label="库位承重(kg)：">
              <el-input v-model="addlocation.maxWeight" maxlength="7" size="small"></el-input>
            </el-form-item>
            <el-form-item style="width:100%;text-align:right;">
              <el-button @click="concelEdit" size="small">取消</el-button>
              <el-button class='total' @click="saveAdd" v-if="locationTitle=='新增库位'" size="small">保存</el-button>
              <el-button class='total' @click="saveEdit" v-if="locationTitle=='编辑库位'" size="small">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 批量新增库位 -->
        <batch-add ref="batchAddRef" :numRules='numRule' :reservoirData='reservoirList'></batch-add>
        <el-dialog title="条码打印" :visible.sync="tscDia"  :modal-append-to-body="false" class="tscDia">
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
              <el-button >清空条件</el-button>
              <el-button class='total'>查询</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import batchAdd from '@/components/batchAdd/index';
  export default {
    props:{},
    data(){
      return{
        isOpenTree:true,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          typeOf:'typeOf',
          id: 'id'
        },
        defaultExpandArray:[],
        advancedFilter:false,
        ReservoirType:{
          typeName: "库区类型",
        },
        ReservoirTypeList:[],
        filterParam:{
          locationStatus:'',
          areaType:'',
          type:'',
          id:'',
          typeOf:'',
        },
        ids:[],
        locationList:[],
        addlocationDia:false, //新增，编辑库位弹框
        reservoirList:[],   //启用状态库区列表
        locationTitle:'新增库位',
        addlocation:{       //新增，编辑库位表单
          id:'',
          type:'1',
          stoareaId:'',
          stoareaCode:'',
          stochannelCode:'',
          stoshelfCode:'',
          layerNum:'',
          columnNum:'',
          locationCode:'',
          length:'',
          width:'',
          height:'', 
          maxWeight:'',
        },
        addlocationRule:{
          type:[{required: true, trigger: 'change', message:'请选择类型'}],
          stoareaId:[{required: true, trigger: 'change', message:'请选择库区'}],
          stochannelCode:[{required: true, trigger: 'change', validator:(rule, value, callback)=> this.$Util.RegExp.num1Reg(rule, value, callback,this.numRule,this.numRule.stochannelCodeRule,this.addlocation)}],
          stoshelfCode:[{required: true, trigger: 'change', validator:(rule, value, callback)=> this.$Util.RegExp.num1Reg(rule, value, callback,this.numRule,this.addlocation.type=='1'?this.numRule.stoshelfCodeRule:this.numRule.palletCodeRule,this.addlocation)}],
          layerNum:[{required: true, trigger: 'change', validator:(rule, value, callback)=> this.$Util.RegExp.num1Reg(rule, value, callback,this.numRule,this.numRule.layerCodeRule,this.addlocation)}],
          columnNum:[{required: true, trigger: 'change', validator:(rule, value, callback)=> this.$Util.RegExp.num1Reg(rule, value, callback,this.numRule,this.numRule.columnCodeRule,this.addlocation)}],
          length:[{required: true, trigger: 'change',  validator:this.$Util.RegExp.lengthReg}],
          width:[{required: true, trigger: 'change', validator: this.$Util.RegExp.lengthReg}],
          height:[{required: true, trigger: 'change', validator: this.$Util.RegExp.lengthReg}],
          maxWeight:[{required: true, trigger: 'change', validator: this.$Util.RegExp.length2Reg}],
        },
        numRule:{},   //编码规则
        tscDia:false,  //条码打印弹窗
        tscForm:{
          barcode_printer:'',
        },
        tscRule:{

        },
        edStore:{   //批量更新状态
          ids:'',
          status:'-2',
        },
        param: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        searchWay:0,
        total: 10,
      }
    },
    methods:{
      //获取所有库位
      getStorageList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/storehouseLocation/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.locationList=data.data.dataList
            this.total=data.data.totalNum
            this.advancedFilter=false;
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //查询仓库树
      getStorageTree(){
        this.defaultExpandArray=[];
        this.$ajaxPost('wms/storehouse/selectAllTree.do',{}).then(({data})=>{
          if(data.code==200){
            this.treeData=data.data.storehouseList
            this.searchWay=0;
            if(data.data.storehouseList.length>0){
              this.filterParam.id=this.treeData[0].id;
              // 设置默认选中的节点
              this.$nextTick(() => {
                const node = this.$refs.storeTree.getNode(this.filterParam.id);
                this.$refs.storeTree.setCurrentNode(node.data);
              });
              this.treeData.forEach(item=>{
                this.defaultExpandArray.push(item.id)
              })
              this.getStorageList();
            }else{
              this.locationList=[];
            }
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //获取库区类型
      getReservoirType(){
        let json_ReservoirType=JSON.stringify(this.ReservoirType)
        this.$ajaxPost('wms/dataDict/selectItemName.do',{reqParam:json_ReservoirType}).then(({data})=>{
          if(data.code==200){
            this.ReservoirTypeList=data.data.dataDictList
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //获取所有启用状态库区
      getReservoirList(){
        let param={pageNum:1,pageSize:99999,status:'0',}
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/storehouseArea/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.reservoirList=data.data.dataList
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //查询编码规则
      getLocationRule(){
        let param={
          storehouseId:this.$Cookies.get('storehouseId')
        }
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/storehouseLocationRule/select.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.numRule=data.data
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      handleNodeClick(data) {
        this.filterParam.id=data.id
        this.filterParam.typeOf=data.typeOf
        this.searchWay=1
        this.getStorageList()
      },
      //展开或者收缩
      expandOrContract(){
        this.treeData = this.treeData.concat([])
        this.isOpenTree=!this.isOpenTree
        this.$refs.storeTree.store.defaultExpandAll = this.isOpenTree
      },
      //快速搜索
      qSearch(){
        this.param.pageNum=1;
        this.param.pageSize=15
        this.param.keyword=this.$refs.qSearch.inputValue
        this.searchWay=0
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.getStorageList()
        this.advancedFilter=false;
      },
      //高级搜索
      goSearch(){
        this.advancedFilter=true;
      },
      submitSearch(){
        this.param.pageNum=1;
        this.param.pageSize=15
        this.param.keyword=''
        this.$refs.qSearch.inputValue=''
        this.searchWay=1;
        this.getStorageList()
        this.advancedFilter=false;
      },
      //清空搜索条件
      concelTerm(){
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.param.keyword='';
        this.$refs.qSearch.inputValue=''
        this.getTemplateList();
      },
      //新增
      addLocationBtn(){
        this.addlocationDia=true;
        this.locationTitle='新增库位'
      },
      //取消
      concelEdit(){
        this.addlocationDia=false;
      },
      //改变新增类型
      changeType(val){
        if(this.locationTitle=='新增库位'){
          this.$refs.addlocationRef.resetFields();
          Object.keys(this.addlocation).forEach(key => {
            if(typeof this.addlocation[key] == Array){
              this.addlocation[key] = [];
            }else{
              this.addlocation[key] = '';
            }
          });
          this.addlocation.type=val;
        }
      },
      //选择库区时
      changeStoarea(val){
        this.reservoirList.forEach(item=>{
          if(item.id==val){
            this.addlocation.stoareaCode=item.stoareaCode;
          }
        })
      },
      //保存新增
      saveAdd(){
        this.$refs.addlocationRef.validate((valid,obj) => {
          if (valid) {
            this.addlocation.stochannelCode=this.addlocation.stochannelCode.toUpperCase()
            this.addlocation.stoshelfCode=this.addlocation.stoshelfCode.toUpperCase()
            this.addlocation.layerNum=this.addlocation.layerNum.toUpperCase()
            this.addlocation.columnNum=this.addlocation.columnNum.toUpperCase()
            let json_addlocation=JSON.stringify(this.addlocation)
            this.$ajaxPost('wms/storehouseLocation/add.do',{reqParam:json_addlocation}).then(({data})=>{
              if(data.code==200){
                this.$message.success('新增库位成功')
                 this.param.pageNum=1;
                 this.param.pageSize=15
                this.addlocationDia=false;
                this.getStorageTree();
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //查看详情
      checkDetail(row){
        this.addlocationDia=true;
        this.locationTitle='编辑库位'
        for(let key in this.addlocation){
          if(row[key]!=null){
            this.addlocation[key]=row[key]
          }
        }
        this.addlocation.type=this.addlocation.type+''
        this.addlocation.stoareaId=this.addlocation.stoareaId-0
      },
      //保存编辑
      saveEdit(){
         this.$refs.addlocationRef.validate((valid) => {
          if (valid) {
            let json_addlocation=JSON.stringify(this.addlocation)
            this.$ajaxPost('wms/storehouseLocation/update.do',{reqParam:json_addlocation}).then(({data})=>{
              if(data.code==200){
                this.$message.success('编辑库位成功')
                this.addlocationDia=false;
                this.getStorageList();
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //批量新增
      batchAddBtn(){
        this.$refs.batchAddRef.batch_addDia=true;
      },
      //删除
      deleteLocationBtn(){
        if(this.ids.length>0){
          this.$confirm('删除库位后，不可恢复，请谨慎操作？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // console.log(this.edStore)
            let idString=this.ids.toString();
            this.edStore.ids=idString
            this.edStore.status='-2'
            let json_id=JSON.stringify(this.edStore)
            this.$ajaxPost('wms/storehouseLocation/updateBatchStatus.do',{reqParam:json_id}).then(({data}) => {
              if (data.code == 200) {
                this.$message.success('删除成功');
                 this.param.pageNum=1;
                 this.param.pageSize=15
                this.getStorageList()
              } else {
                this.$message.error(data.msg);
              }
            })
          }).catch(() => {})
        }else{
          this.$message.warning('请至少选择一条库位信息')
        }
      },
      //选择多条数据
      handleSelectionChange(val){
        this.ids = val.map(item => {
          return item.id
        });
      },
      //关闭新增窗口时 表单时重置
      resetAdd(val) {
        this.$refs.addlocationRef.resetFields();
        Object.keys(this.addlocation).forEach(key => {
          this.addlocation[key] = '';
        });
        this.addlocation.type='1';
      },
      
      //条码打印
      tscBtn(){
        this.tscDia=true;
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getStorageList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getStorageList();
      },
    },
    mounted(){
      this.getStorageTree();
      this.getReservoirType();
      this.getReservoirList();
      this.getLocationRule();
    },
    components:{
      'batchAdd':batchAdd
    }
  }
</script>

<style lang="scss">
// .storageLocation{
//   .el-input__inner{
//     line-height: 32px;
//     height: 32px;
//   }
// }
.storage_location{
  display: flex;
  flex-wrap: nowrap;
  box-sizing: border-box;
  .leftTree{
    /*flex:0 0 150px;*/
    /*max-width: 150px;*/
    width: 15%;
    padding: 0 10px;
    margin-right: 2%;
    height:545px;
    overflow: auto;
    border: solid 1px #e5e5e5;
  }
  .rightMain{
    width: 83%;
  }
  .addlocation{
    .el-form{
      display:flex;
      flex-wrap: wrap;
      .el-form-item{
        width: 49%;
        margin-right: 1%;
      }
      .el-input.special.is-disabled .el-input__inner{
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
</style>
