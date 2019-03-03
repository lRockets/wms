<template>
  <div class="logistics_management">
    <header class="top-head">
      <el-button size="small" @click="addLogistics" class="total">新增</el-button>
      <el-button size="small" @click="deleteLogistics">删除</el-button>
      <div class="header-right f-fr">
        <search placeholder="请输入物流商名称，编码，进行搜索" @on-search="qSearch" :width="'280px'" :showIcon="false" ref="qSearch" style="width:310px"></search>
      </div>
    </header>
    <el-table ref="LogisticsList" border :data="LogisticsList" height="500px" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="44"></el-table-column>
      <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="checkDetail(scope.row)" style="color:#39b9fe;">查看详情</el-button>
          <el-button size="small" type="text" @click="startDotInfor(scope.row)">网点信息</el-button>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="logcompCode" label="物流商编码" width="220"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="logcompName" label="物流商名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="sort" label="排序" width="80"></el-table-column>
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
    <el-dialog :title="logisticsTitle" :visible.sync="logisticsdio"  :modal-append-to-body="false" class="filterParam" @close="resetForm">
      <el-form :model="logisticsInfor" label-width="120px" :rules="logisticsInforRule" ref="logisticsInforRef" size="small">
        <el-form-item prop="logcompCode" label="物流商编码：">
          <el-input size="small" v-model="logisticsInfor.logcompCode" placeholder="" maxlength="10" :disabled="logisticsTitle=='编辑物流商'"></el-input>
        </el-form-item>
        <el-form-item prop="logcompName" label="物流商名称：">
          <el-input size="small" v-model="logisticsInfor.logcompName" placeholder="" minlength="2" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="sort" label="排序：">
          <el-input size="small" v-model="logisticsInfor.sort"  placeholder="默认100，值越小越靠前" maxlength="4"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="concellogistics">取消</el-button>
          <el-button size="small" @click="saveAddBtn" v-if="logisticsTitle=='新增物流商'" class="total">保存</el-button>
          <el-button size="small" @click="saveEditBtn" v-if="logisticsTitle=='编辑物流商'" class="total">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="网点信息" :visible.sync="dotInforDia"  :modal-append-to-body="false">
      <el-row style="margin-bottom: 20px;">
        <el-button size="small" @click="addDotInforBtn" class="total">新增网点</el-button>
      </el-row>
      <el-table ref="dotInforRef" border :data="dotInforList" height="300px">
        <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="networkName" label="网点名称" width="100"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="" label="网点地址" width="300">
          <template slot-scope="scope">
            <span style="margin-right: 10px;">{{scope.row.provinceName}}</span>
            <span style="margin-right: 10px;">{{scope.row.cityName}}</span>
            <span style="margin-right: 10px;">{{scope.row.districtName}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="contactName" label="联系人"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="contactPhone" label="联系电话"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="editorDot(scope.row)">编辑</el-button>
            <el-button size="small" type="text" @click="deleteDot(scope.row)">删除</el-button>
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
                     :page-size="param_dot.pageSize"
                     :total="total_dot"
                     layout="total, prev, pager, next, sizes, jumper"
                     @size-change="sizeChange_dot"
                     @current-change="currentChange_dot"
                     :current-page.sync="param_dot.pageNum"
                     style="margin-top: 20px;text-align: center;">
      </el-pagination>
    </el-dialog>
    <el-dialog :title="DotInforTitle" :visible.sync="addDotInforDia"  :modal-append-to-body="false" @close="resetDialog">
      <el-form :model="addDotInfor" label-width="100px" :rules="addDotInforRule" ref="addDotInforRef" size="small">
        <el-form-item prop="networkName" label="网点名称：" style="width: 48%">
          <el-input style="width:280px;" size="small" v-model="addDotInfor.networkName" placeholder="请输入2-20个字" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="网点地址：" class="city" prop="districtId">
          <div class="addressChoice">
            <el-select style="width:220px;" size="small" v-model="addDotInfor.provinceId" placeholder="请选择省"  clearable @change="checkProvince">
              <template v-for="(item,index) in provinceList">
                <el-option :label="item.regionName" :value="item.id" :key="index"></el-option>
              </template>
            </el-select>
            <el-select style="width:220px;" size="small" v-model="addDotInfor.cityId" placeholder="请选择市"  clearable @change="getCityList">
              <template v-for="(item,index) in cityList">
                <el-option :label="item.regionName" :value="item.id" :key="index"></el-option>
              </template>
            </el-select>
            <el-select style="width:220px;" size="small" v-model="addDotInfor.districtId" placeholder="请选择区"  clearable @change="getDistrictList">
              <template v-for="(item,index) in districtList">
                <el-option :label="item.regionName" :value="item.id" :key="index"></el-option>
              </template>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item prop="address">
          <el-input style="width:280px;" size="small" v-model="addDotInfor.address" placeholder="请输入详细地址：" maxlength="30"></el-input>
        </el-form-item>
        <div class="thisRow_base">
          <el-form-item prop="contactName" label="联系人：">
            <el-input style="width:280px;" size="small" v-model="addDotInfor.contactName" placeholder=""></el-input>
          </el-form-item>
          <el-form-item prop="contactPhone" label="联系电话：">
            <el-input style="width:280px;" size="small" v-model="addDotInfor.contactPhone" placeholder="" maxlength="11"></el-input>
          </el-form-item>
        </div>
        <el-form-item prop="note" label="备注：">
          <el-input size="small" v-model="addDotInfor.note"  type="textarea" maxlength="1000"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="concel">取消</el-button>
          <el-button size="small" @click="saveAddDot" v-if="DotInforTitle=='新增网点'" class="total">保存</el-button>
          <el-button size="small" @click="saveEditorDot" v-else class="total">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props:{},
    data(){
      const codeReg = (rule, value, callback) => {
        let v = value.toString().trim();
        let flag =/^[^\u4e00-\u9fa5]{1,10}$/.test(v);
        if (!flag) {
          if (callback) callback(new Error('请输入1-10个字母、数字、符号'));
        } else if(this.logisticsRow.logcompCode!==this.logisticsInfor.logcompCode) {
          let param = JSON.stringify({logcompCode: this.logisticsInfor.logcompCode})
          setTimeout(() => {
            this.$ajaxPost('wms/logisticsCompany/select.do', {reqParam: param}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前物流商编码已存在，不可重复添加'))
              } else {
                callback()
              }
            })
          }, 10)
        }else{
          callback()
        }
      };
      const userNameReg = (rule, value, callback) => {
        let v = value.toString().trim();
        if (v.length<2||v.length>20) {
          if (callback) callback(new Error('请输入2-20个字'));
        } else if(this.logisticsRow.logcompName!==this.logisticsInfor.logcompName) {
          let param = JSON.stringify({logcompName: this.logisticsInfor.logcompName})
          setTimeout(() => {
            this.$ajaxPost('wms/logisticsCompany/select.do', {reqParam: param}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前物流商名称已存在，不可重复添加'))
              } else {
                callback()
              }
            })
          }, 10)
        }else{
          callback()
        }
      };
      const networkReg = (rule, value, callback) => {
        let v = value.toString().trim();
        if (v.length<2||v.length>20) {
          if (callback) callback(new Error('请输入2-20个字'));
        }else if(this.networkRow.networkName!== this.addDotInfor.networkName){
          let param = JSON.stringify({networkName: this.addDotInfor.networkName})
          setTimeout(() => {
            this.$ajaxPost('wms/logcompNetwork/select.do', {reqParam: param}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前网点名称已存在，不可重复添加'))
              } else {
                callback()
              }
            })
          }, 10)
        } else {
          callback();
        }
      };
      const stiAdressReg = (rule, value, callback) => {
        let v = value.toString().trim();
        if(v){
          if (v.length>=5&&v.length<=30) {
            callback();
          } else {
            if (callback) callback(new Error('请输入5-30个字'));
          }
        }else{
          callback();
        }
      };
      const contactPhoneReg=(rule, value, callback)=>{
        let v = value.toString().trim();
        let flag =/^\d{5,11}$/.test(v);
        if(v){
          if(!flag){
            if (callback) callback(new Error('请输入5-11个数字'));
          }else{
            callback();
          }
        }else{
          callback();
        }
      }
      return{
        ids:[],
        LogisticsList:[],
        filterParam:{
          keyword:'',
        },
        searchWay:0,

        logisticsdio:false,   //新增物流商
        logisticsTitle:'新增物流商',
        logisticsInfor:{
          id:'',
          logcompCode:'',
          logcompName:'',
          sort:'',
        },
        logisticsInforRule:{
          logcompCode:[{required: true, trigger: 'blur', validator:codeReg}],
          logcompName:[{required: true, trigger: 'blur', validator: userNameReg}],
          sort:[{trigger: 'change', validator: this.$Util.RegExp.pureSort}],
        },
        logisticsRow:{},  //点击编辑物流商，那一行的数据
        deleteLog:{
          ids:'',
          status:'-2',
        },

        addLogisticsDia:false,
        dotInforDia:false,  //网点信息弹框
        dotInforList:[],//网点信息列表
        addDotInforDia:false, //新增网点弹框
        checkNetName:{
          networkName:'',
        },
        networkRow:{},   //点击编辑网点信息时，那一行的数据
        DotInforTitle:'新增网点',
        addDotInfor:{   //新增，编辑网点表单
          id:'',
          logcompId:'',
          logcompName:'',
          networkName:'',
          provinceId:'',
          provinceName:'',
          cityId:'',
          cityName:'',
          districtId:'',
          districtName:'',
          address:'',
          contactName:'',
          contactPhone:'',
          note:'',
        },
        provinceList: [], //省
        cityList: [],     //市
        districtList: [],  //区
        addDotInforRule:{
          networkName:[{required: true, trigger: 'blur', validator: networkReg}],
          // districtId:[{trigger: 'change', message:'请选择地址'}],
          address:[{trigger: 'change', validator: stiAdressReg}],
          contactName:[{trigger: 'change', validator:this.$Util.RegExp.pureName}],
          contactPhone:[{trigger: 'change',validator:contactPhoneReg }],
        },

        areaParam:{
          type:"1",
          id:"0"
        },
        param: {
          pageNum: 1,
          pageSize: 15,
        },
        total: 10,
        param_dot: {
          pageNum: 1,
          pageSize: 15,
          logcompId:'',
        },
        total_dot: 10,
      }
    },
    methods:{
      //获取所有物流商
      getLogisticList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/logisticsCompany/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.LogisticsList=data.data.dataList
            this.total=data.data.totalNum
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //获取物流商下的网点信息
      getlogcompNetwork(param){
        let json_param_dot=JSON.stringify(this.param_dot)
        this.$ajaxPost('wms/logcompNetwork/selectPage.do',{reqParam:json_param_dot}).then(({data})=>{
          if(data.code==200){
            this.dotInforList=data.data.dataList
            this.total_dot=data.data.totalNum
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //新增
      addLogistics(){
        this.logisticsdio=true;
        this.logisticsTitle='新增物流商'
      },
      //保存新增
      saveAddBtn(){
        this.$refs.logisticsInforRef.validate((valid) => {
          if (valid) {
            let json_logisticsInfor=JSON.stringify(this.logisticsInfor)
            this.$ajaxPost('wms/logisticsCompany/add.do',{reqParam:json_logisticsInfor}).then(({data})=>{
              if(data.code==200){
                this.$message.success('新增物流商成功')
                this.param.pageNum=1;
                this.param.pageSize=15
                this.logisticsdio=false;
                this.getLogisticList();
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //删除
      deleteLogistics(){
        if(this.ids.length>0){
          this.$confirm('删除物流商后，不可恢复，请谨慎操作？', '删除物流商', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let logIds=this.ids.toString();
            this.deleteLog.ids=logIds
            let json_deleteLog=JSON.stringify(this.deleteLog)
            this.$ajaxPost('wms/logisticsCompany/updateBatchStatus.do',{reqParam:json_deleteLog}).then(({data})=>{
              if(data.code==200){
                this.$message.success('删除物流商成功')
                this.param.pageNum=1;
                this.param.pageSize=15
                this.getLogisticList();
              }else{
                this.$message.error(data.msg)
              }
            })
          }).catch(() => {})
        }else{
          this.$message.error('请选择要删除的物流商')
        }
      },
      //快速搜索
      qSearch(){
        this.param.pageNum=1;
        this.param.pageSize=15
        this.filterParam.keyword=this.$refs.qSearch.inputValue
        this.searchWay=1;
        this.getLogisticList()
      },
      //查看详情
      checkDetail(row){
        this.logisticsRow=row
        this.logisticsdio=true;
        this.logisticsTitle='编辑物流商'
        for(let key in this.logisticsInfor){
          if(row[key]!=null){
            this.logisticsInfor[key]=row[key]
          }
        }
      },
      //保存编辑
      saveEditBtn(){
        this.$refs.logisticsInforRef.validate((valid) => {
          if (valid) {
            let json_logisticsInfor=JSON.stringify(this.logisticsInfor)
            this.$ajaxPost('wms/logisticsCompany/update.do',{reqParam:json_logisticsInfor}).then(({data})=>{
              if(data.code==200){
                this.$message.success('修改物流商信息成功')
                this.logisticsdio=false;
                this.getLogisticList();
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //取消
      concellogistics(){
        this.logisticsdio=false;
      },
      //关闭物流商表单时重置
      resetForm(){
        this.$refs.logisticsInforRef.resetFields();
        /*Object.keys(this.logisticsInfor).forEach(key => {
          this.logisticsInfor[key] = '';
        });*/ 
      },
      //网点信息
      startDotInfor(row){
        this.param_dot.logcompId=row.id;
        this.addDotInfor.logcompId=row.id
        this.addDotInfor.logcompName=row.logcompName
        this.getlogcompNetwork()
        this.dotInforDia=true;
      },
      //新增网点信息
      addDotInforBtn(){
        this.DotInforTitle='新增网点'
        this.addDotInforDia=true;
      },
      //保存新增网点
      saveAddDot(){
        this.$refs.addDotInforRef.validate((valid) => {
          if (valid) {
            let json_addDotInfor=JSON.stringify(this.addDotInfor)
            this.$ajaxPost('wms/logcompNetwork/add.do',{reqParam:json_addDotInfor}).then(({data})=>{
              if(data.code==200){
                this.$message.success('新增网点信息成功')
                this.addDotInforDia=false;
                this.getlogcompNetwork();
              }else{
                this.$message.error(data.msg)
              }
            })
          }else{
            return false
          }
        })
      },
      //选择多条数据
      handleSelectionChange(val){
        this.ids = val.map(item => {
          return item.id
        });
      },
      //编辑网点
      editorDot(row){
        this.DotInforTitle='编辑网点'
        if(row.provinceId!==null&&row.provinceId!==''){
          this.getProvinceList(row.provinceId,2)
        }
        this.addDotInforDia=true;
        this.networkRow=row;
        for (let key in this.addDotInfor){
          if(row[key]!=null){
            this.addDotInfor[key]=row[key];
          }
        }
        setTimeout(() => {
          if(row.cityId!==null&&row.cityId!==''){
             this.getProvinceList(row.cityId,3)
          }
        }, 10)
      },
      //保存编辑网点
      saveEditorDot(){
        this.$refs.addDotInforRef.validate((valid) => {
          if (valid) {
            let json_addDotInfor=JSON.stringify(this.addDotInfor)
            this.$ajaxPost('wms/logcompNetwork/update.do',{reqParam:json_addDotInfor}).then(({data})=>{
              if(data.code==200){
                this.$message.success('修改网点信息成功')
                this.addDotInforDia=false;
                this.getlogcompNetwork();
              }else{
                this.$message.error(data.msg)
              }
            })
          }else{
            return false
          }
        })
      },
      //删除网点
      deleteDot(row){
        this.$confirm('删除网点后，不可恢复，请谨慎操作？', '删除网点', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let deleteId={
            id:row.id,
          }
          let json_id=JSON.stringify(deleteId)
          this.$ajaxPost('wms/logcompNetwork/delete.do',{reqParam:json_id}).then(({data}) => {
            if (data.code == 200) {
              this.$message.success('删除成功');
              this.param_dot.pageNum=1;
              this.param_dot.pageSize=15
              this.getlogcompNetwork()
            } else {
              this.$message.error(data.msg);
            }
          })
        }).catch(() => {})
      },
      //取消新增，编辑网点
      concel(){
        this.addDotInforDia=false;
      },
      //关闭新增，编辑网点弹框时重置表单
      resetDialog(){
        this.$refs.addDotInforRef.resetFields();
        let thisLogcompId =this.addDotInfor.logcompId
        let thisLogcompName= this.addDotInfor.logcompName
        for(let key in this.addDotInfor){
          this.addDotInfor[key]=''
        }
        this.addDotInfor.logcompId=thisLogcompId
        this.addDotInfor.logcompName=thisLogcompName
        this.cityList=[];
        this.districtList=[];
      },
      //获取所有的省/市/区
      getProvinceList(ID,type){
        this.areaParam.type=type;
        this.areaParam.id=ID;
        let json_areaParam=JSON.stringify(this.areaParam)
        this.$ajaxPost("wms/region/selectAll.do",{reqParam:json_areaParam}).then(({data})=>{
          if (data.code==200){
            if(this.areaParam.type==1){
              this.provinceList = data.data
            }else if(this.areaParam.type==2){
              this.cityList = data.data
            }else if(this.areaParam.type==3){
              this.districtList = data.data
            }
          } else{
            this.$message.error(data.msg)
          }
        })
      },
      //选择省份时获取市列表
      checkProvince(val){
        this.cityList=[];
        this.addDotInfor.cityId='';
        this.addDotInfor.cityName='';
        this.districtList=[];
        this.addDotInfor.districtId='';
        this.addDotInfor.districtName='';
        if(val){
          this.getProvinceList(val,2)
          this.provinceList.forEach(item=>{
            if(item.id==val){
              this.addDotInfor.provinceName=item.regionName
            }
          })
        }else{
          this.addDotInfor.provinceName='';
        }
      },
      //选择市时回去区
      getCityList(val){
        this.districtList=[];
        this.addDotInfor.districtId='';
        this.addDotInfor.districtName='';
        if(val){
          this.getProvinceList(val,3)
          this.cityList.forEach(item=>{
            if(item.id==val){
              this.addDotInfor.cityName=item.regionName
            }
          })
        }else{
          this.addDotInfor.cityName='';
        }
      },
      //点击区时
      getDistrictList(val){
        if(val){
          this.districtList.forEach(item=>{
            if(item.id==val){
              this.addDotInfor.districtName=item.regionName
            }
          })
        }else{
          this.addDotInfor.districtName='';
        }
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getLogisticList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getLogisticList();
      },
      //每页数量改变
      sizeChange_dot(v) {
        this.param_dot.pageSize = v;
        this.getlogcompNetwork()
      },
      //当前页改变
      currentChange_dot(v) {
        this.param_dot.pageNum = v;
        this.getlogcompNetwork()
      },
    },
    components: {},
    mounted() {
      this.getLogisticList()
      this.getProvinceList('0','1');
    }
  }
</script>

<style lang="scss">
.logistics_management{
  .el-dialog{
    width: 864px;
  }
}
 
</style>
