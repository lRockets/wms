<template>
  <div class="express_bill_manage">
    <header class="top-head">
      <el-button size="small" @click="addExpress" class='total'>新增</el-button>
      <el-button size="small" @click="deleteExpress" >删除</el-button>
      <el-button size="small" @click="startExpress" >启用</el-button>
      <el-button size="small" @click="forbidExpress" >禁用</el-button>
      <div class="header-right f-fr">
        <search placeholder="请输入模板名称，编码，进行搜索" @on-search="qSearch" :showIcon="false" :width="'300px'" ref="qSearch"></search>
        <el-button size="small" @click="goSearch" class='total'>高级搜索</el-button>
      </div>
    </header>
    <el-table ref="expressList" border :data="expressList" height="500px" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="44"></el-table-column>
      <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="checkDetail(scope.row)" style="color:#39b9fe;">查看详情</el-button>
          <el-button size="small" type="text" @click="startRow(scope.row)" v-if="scope.row.status=='-1'">启用</el-button>
          <el-button size="small" type="text" @click="forbidRow(scope.row)" v-if="scope.row.status=='0'">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="logcompName" label="物流商"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="tplCode" label="面单模板编码" width="140"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="tplName" label="模板名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="tplUrl" label="模板地址" width="220"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="isDefaultName" label="是否默认模板" width="100"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="typeName" label="模板类型"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="isThermalName" label="是否启用热敏" width="100"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="statusName" label="状态"></el-table-column>
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
      <el-form :model="filterParam" label-width="90px" size="small">
        <el-form-item prop="type" label="物流商">
          <el-select size="small" v-model="filterParam.logcompId"  placeholder="请选择物流商"  clearable>
            <el-option label="全部物流商" value=""></el-option>
            <template v-for="(item,index) in LogisticList">
              <el-option :label="item.logcompName" :value="item.id" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态：">
          <el-select size="small" v-model="filterParam.status" placeholder="请选择" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="type" label="模板类型：">
          <el-select size="small" v-model="filterParam.type" placeholder="请选择模板类型"  clearable>
            <template v-for="(item,index) in TemplateTypeList">
              <el-option :label="item.itemName" :value="item.itemValue" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="concelTerm">清空条件</el-button>
          <el-button size="small" @click="submitSearch" class='total'>查询</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="templateTitle" :visible.sync="addExpressDia"  :modal-append-to-body="false" @close="resetAdd">
      <el-form :model="templateInfor" label-width="130px" ref="templateRef" :rules="templateRule">
          <el-form-item prop="logcompId" label="所属物流商：" size="small">
            <el-select size="small" v-model="templateInfor.logcompId" placeholder="请选择物流商"  clearable @change="selectLog">
              <template v-for="(item,index) in LogisticList">
                <el-option :label="item.logcompName" :value="item.id" :key="index"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="tplName" label="模板名称：">
            <el-input size="small" v-model="templateInfor.tplName" placeholder="请输入模板名称" maxlength="10"  clearable></el-input>
          </el-form-item>
          <el-form-item prop="tplCode" label="模板编码：">
            <el-input size="small" v-model="templateInfor.tplCode" placeholder="不填写时，系统自动生成" maxlength="10"  clearable></el-input>
          </el-form-item>
          <el-form-item prop="type" label="模板类型：">
            <el-select size="small" v-model="templateInfor.type" placeholder="请选择模板类型"  clearable>
              <template v-for="(item,index) in TemplateTypeList">
                <el-option :label="item.itemName" :value="item.itemValue" :key="index"></el-option>
              </template>
            </el-select>
          </el-form-item>
        <el-form-item prop="tplUrl" label="模板地址：">
          <el-input size="small" v-model="templateInfor.tplUrl" placeholder="" maxlength="50"  clearable></el-input>
        </el-form-item>
        <el-form-item prop="isThermal" label="是否启用热敏：">
          <el-switch v-model="templateInfor.isThermal" active-value="1" inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item prop="isDefault" label="是否默认模板：">
          <el-switch v-model="templateInfor.isDefault" active-value="1" inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="concelSubmit">取消</el-button>
          <el-button size="small" @click="saveAdd" v-if="templateTitle=='新增面单模板'" class='total'>保存</el-button>
          <el-button size="small" @click="saveEdit" v-if="templateTitle=='编辑面单模板'" class='total'>保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props:{},
    data(){
      const nameReg = (rule, value, callback) => {
        let v = value.toString().trim();
        let flag = /^[a-zA-Z0-9_`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{2,10}$/.test(v);
          if(v){
            if (!flag) {
              if (callback) callback(new Error('请输入2-10个字母/数字/符号'))
            } else if (this.BillRow.tplCode !== this.templateInfor.tplCode) {
              let param = JSON.stringify({tplCode: this.templateInfor.tplCode})
              setTimeout(() => {
                this.$ajaxPost('wms/expbillTpl/select.do', {reqParam: param}).then(({data}) => {
                  if (data.code == 200 && data.data) {
                    callback(new Error('当前面单模板编码已存在，不可重复添加'))
                  } else {
                    callback()
                  }
                })
              }, 10)
            } else {
              callback()
            }
          }else{
            if(this.templateTitle=='新增面单模板'){
              callback()
            }else{
              if (callback) callback(new Error('请输入2-10个字母/数字/符号'))
            }
          }
      };
      const nametemplateNameReg = (rule, value, callback) => {  
        let v = value.toString().trim();
        if (v.length<2||v.length>10) {
          if (callback) callback(new Error('请输入2-10个字'))
        } else if (this.BillRow.tplName !== this.templateInfor.tplName) {
          let param = JSON.stringify({tplName: this.templateInfor.tplName})
          setTimeout(() => {
            this.$ajaxPost('wms/expbillTpl/select.do', {reqParam: param}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前面单模板名称已存在，不可重复添加'))
              } else {
                callback()
              }
            })
          }, 10)
        } else {
          callback()
        }
      };
      const tplUrlReg = (rule, value, callback) => {
        if(value){
          let v = value.toString().trim();
          if (v.length<5||v.length>50) {
            if (callback) callback(new Error('请输入5-50个字'));
          } else {
            callback();
          }
        }else{
          callback();
        }
      };
      return{
        ids:[],
        expressList:[],
        LogisticList:[], //物流商列表
        advancedFilter:false,
        addExpressDia:false,
        templateTitle:'新增面单模板',
        searchWay:0,
        TemplateType:{
          typeName: "面单模板类型",
        },
        TemplateTypeList:[],
        filterParam:{
          status:'',
          type:'',
          keyword:'',
          logcompId:'',
        },
        templateInfor:{  //新增，编辑面单模板
          id:'',
          logcompId:'',
          logcompName:'',
          tplCode:'',
          tplName:'',
          tplUrl:'',
          isDefault:0,
          isThermal:0,
        },
        templateRule:{
          logcompId:[{required: true, trigger: 'change', message:'请选择所属物流商'}],
          tplCode:[{trigger: 'change', validator: nameReg}],
          tplName:[{required: true, trigger: 'change', validator: nametemplateNameReg}],
          tplUrl:[{trigger: 'change', validator: tplUrlReg}],
        },
        updateBatch:{
          ids:'',
          status:'-2'
        },
        BillRow:{},  //编辑一行时，那一行的数据
        param: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        total: 10,
      }
    },
    methods:{
      //查询所有模板
      getTemplateList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/expbillTpl/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.expressList=data.data.dataList
            this.total=data.data.totalNum
          }else{
            this.$message.error(data.msg);
          }
        })
      },
      //获取模板类型列表
      getTemplateType(){
        let json_TemplateType=JSON.stringify(this.TemplateType)
        this.$ajaxPost('wms/dataDict/selectItemName.do',{reqParam:json_TemplateType}).then(({data})=>{
          if(data.code==200){
            this.TemplateTypeList=data.data.dataDictList
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //获取所有物流商
      getLogisticList(){
        let p_size=this.param.pageSize
        this.param.pageSize=99999
        let json_param=JSON.stringify(this.param)
        this.$ajaxPost('wms/logisticsCompany/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.param.pageSize=p_size
            this.LogisticList=data.data.dataList
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //新增面单模板
      addExpress(){
        this.addExpressDia=true;
        this.templateTitle='新增面单模板'
      },
      //取消
      concelSubmit(){
        this.addExpressDia=false;
      },
      //选取物流商
      selectLog(val){
        if(val){
          this.LogisticList.forEach(item=>{
            if(item.id==val){
              this.templateInfor.logcompName=item.logcompName
            }
          })
        }else{
          this.templateInfor.logcompName=''
        }
      },
      //保存新增
      saveAdd(){
        this.$refs.templateRef.validate((valid) => {
          if (valid) {
            let json_templateInfor=JSON.stringify(this.templateInfor)
            this.$ajaxPost('wms/expbillTpl/add.do',{reqParam:json_templateInfor}).then(({data})=>{
              if(data.code==200){
                this.$message.success('新增面单模板成功')
                this.param.pageNum=1;
                this.param.pageSize=15
                this.addExpressDia=false;
                this.getTemplateList();
              }else{
                this.$message.error(data.msg)
              }
            })
          }else{
            return false
          }
        })
      },
      //关闭新增窗口时 表单时重置
      resetAdd(val) {
        this.$refs.templateRef.resetFields();
        Object.keys(this.templateInfor).forEach(key => {
          this.templateInfor[key] ='';
        });
        this.templateInfor.isDefault='0';
        this.templateInfor.isThermal='0';
      },
      //删除
      deleteExpress(){
        if(this.ids.length>0){
          this.$confirm('删除面单模板后，不可恢复，请谨慎操作？', '删除面单模板', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updateBatch.ids=this.ids.toString()
            this.updateBatch.status='-2'
            let json_id=JSON.stringify(this.updateBatch)
             this.$ajaxPost('wms/expbillTpl/updateBatchStatus.do',{reqParam:json_id}).then(({data}) => {
               if (data.code == 200) {
                 this.$message.success('删除成功');
                 this.param.pageNum=1;
                 this.param.pageSize=15
                 this.getTemplateList();
               } else {
                 this.$message.error(data.msg);
               }
             })
          }).catch(() => {})
        }else{
          this.$message.warning('请至少选择一条数据')
        }
      },
      //启用
      startExpress(){
        if(this.ids.length>0){
          this.updateBatch.ids=this.ids.toString()
          this.updateBatch.status='0'
          let json_id=JSON.stringify(this.updateBatch)
          this.$ajaxPost('wms/expbillTpl/updateBatchStatus.do',{reqParam:json_id}).then(({data}) => {
            if (data.code == 200) {
              this.$message.success('启用成功');
              this.getTemplateList();
            } else {
              this.$message.error(data.msg);
            }
          })
        }else{
          this.$message.warning('请至少选择一条数据')
        }
      },
      //禁用
      forbidExpress(){
        if(this.ids.length>0){
          this.updateBatch.ids=this.ids.toString()
          this.updateBatch.status='-1'
          let json_id=JSON.stringify(this.updateBatch)
          this.$ajaxPost('wms/expbillTpl/updateBatchStatus.do',{reqParam:json_id}).then(({data}) => {
            if (data.code == 200) {
              this.$message.success('禁用成功');
              this.getTemplateList();
            } else {
              this.$message.error(data.msg);
            }
          })
        }else{
          this.$message.warning('请至少选择一条数据')
        }
      },
      //快速搜索
      qSearch(){
        this.param.pageNum=1;
        this.param.pageSize=15
        this.param.keyword=this.$refs.qSearch.inputValue
        this.searchWay=0;
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.getTemplateList();
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
        this.getTemplateList();
        this.advancedFilter=false;
      },
      //清空搜索条件
      concelTerm(){
        this.param.pageNum=1;
        this.param.pageSize=15
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.param.keyword=''
        this.$refs.qSearch.inputValue=''
        this.getTemplateList();
      },
      //查看详情
      checkDetail(row){
        this.addExpressDia=true;
        this.templateTitle='编辑面单模板'
        for(let key in this.templateInfor){
          if (row[key]!=null) {
            this.templateInfor[key]=row[key]
          }
        }
        this.BillRow=row;
        this.templateInfor.isDefault=this.templateInfor.isDefault+'';
        this.templateInfor.isThermal=this.templateInfor.isThermal+'';
      },
      //保存编辑
      saveEdit(){
        this.$refs.templateRef.validate((valid) => {
          if (valid) {
            let json_templateInfor=JSON.stringify(this.templateInfor)
            this.$ajaxPost('wms/expbillTpl/update.do',{reqParam:json_templateInfor}).then(({data})=>{
              if(data.code==200){
                this.$message.success('编辑面单模板成功')
                this.addExpressDia=false;
                this.getTemplateList();
              }else{
                this.$message.error(data.msg)
              }
            })
          }else{
            return false
          }
        })
      },
      //启用
      startRow(row){
        let rowId=row.id;
        this.updateBatch.ids=rowId.toString()
        this.updateBatch.status='0'
        let json_id=JSON.stringify(this.updateBatch)
        this.$ajaxPost('wms/expbillTpl/updateBatchStatus.do',{reqParam:json_id}).then(({data}) => {
          if (data.code == 200) {
            this.$message.success('启用成功');
            this.getTemplateList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      //禁用
      forbidRow(row){
        let rowId=row.id;
        this.updateBatch.ids=rowId.toString()
        this.updateBatch.status='-1'
        let json_id=JSON.stringify(this.updateBatch)
        this.$ajaxPost('wms/expbillTpl/updateBatchStatus.do',{reqParam:json_id}).then(({data}) => {
          if (data.code == 200) {
            this.$message.success('禁用成功');
            this.getTemplateList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      //选择多条数据
      handleSelectionChange(val){
        this.ids = val.map(item => {
          return item.id
        });
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getTemplateList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getTemplateList();
      },
    },
    components: {},
    mounted() {
      this.getTemplateList();
      this.getTemplateType();
      this.getLogisticList();
    }
  }
</script>

<style lang="scss">
.express_bill_manage{
  .el-dialog{
    width: 864px;
    .el-input,.el-select {
      width: 280px;
    }
  }
  .el-dialog__body .el-form{
    display: flex;
    flex-wrap: wrap;
    .el-form-item{
      width: 48%;
    }
  }
}
</style>
