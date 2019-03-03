<template>
    <div class="invoice_config">
      <header class="top-head">
        <el-button size="small" @click="addInvoiceBtn" class="total">新增</el-button>
        <el-button size="small" @click="deleteRow">删除</el-button>
        <div class="header-right f-fr">
          <search placeholder="请输入销售方名称、账号、税号进行搜索" @on-search="qSearch" :width="'300px'" :showIcon="false" ref="qSearchRef"></search>
          <el-button size="small" @click="goSearch" class="total">高级搜索</el-button>
        </div>
      </header>
      <el-table ref="invoiceList" :data="invoiceList" height="500px" border @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" type="index" label="行号" width="55"></el-table-column>
        <el-table-column align="center" label="操作" width="160px">
          <template slot-scope="scope">
            <el-button type="text" @click="editorUser(scope.row)">编辑</el-button>
            <el-button type="text" @click="startRow(scope.row)" v-if="scope.row.status=='-1'">启用</el-button>
            <el-button type="text" @click="forbidRow(scope.row)" v-if="scope.row.status=='0'">禁用</el-button>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="sellerName" label="销售方名称"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="sellerTaxno" label="销售方税号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="onlstoreName" label="关联店铺"></el-table-column>
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
        <el-form :model="filterParam" label-width="100px" size="small">
          <el-form-item prop="status" label="状态：">
            <el-select size="small" v-model="filterParam.status" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" value="0"></el-option>
              <el-option label="禁用" value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="onlstoreId" label="店铺名称：">
            <el-select size="small" v-model="filterParam.onlstoreId" placeholder="请选择" >
              <template v-for="(item,index) in shipList">
                <el-option :label="item.storeName" :value="item.id" :key="index" ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item style="width:100%;text-align:right;">
            <el-button size="small" @click="concelTterm">清空条件</el-button>
            <el-button size="small" @click="submitSearch" class="total">查询</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog :title="invoiceFormTitle" :visible.sync="invoiceFormDia"  :modal-append-to-body="false" class="filterParam" @close="resetForm">
        <el-form :model="invoiceForm" label-width="130px" :rules="invoiceRule" ref='invoiceRef' size="small">
          <el-form-item prop="sellerName" label="销售方名称：">
            <el-input size="small" v-model="invoiceForm.sellerName"></el-input>
          </el-form-item>
          <el-form-item prop="onlstoreId" label="关联店铺：">
            <el-select size="small" v-model="invoiceForm.onlstoreId" placeholder="请选择" multiple @change="selectShip">
              <template v-for="(item,index) in shipList"> 
               <el-option :key="index" :label="item.storeName" :value="item.id" :disabled="item.isAssociateInvoice==0"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="depositBank" label="销售方开户行：">
            <el-input size="small" v-model="invoiceForm.depositBank" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item prop="depositAccount" label="销售方账号：">
            <el-input size="small" v-model="invoiceForm.depositAccount" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item prop="sellerTaxno" label="销售方税号：">
            <el-input size="small" v-model="invoiceForm.sellerTaxno" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item prop="address" label="销售方地址：">
            <el-input size="small" v-model="invoiceForm.address" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item prop="contactPhone" label="销售方电话：">
            <el-input size="small" v-model="invoiceForm.contactPhone" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item style="width:100%;text-align:right;">
            <el-button size="small" @click="concelEdit">取消</el-button>
            <el-button size="small" @click="saveAdd" v-if="invoiceFormTitle=='新增发票配置'" class="total">保存</el-button>
            <el-button size="small" @click="saveEdit" v-else class="total">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    props:{},
    data(){
      const name1Reg = (rule, value, callback) => {  
        let v = value.toString().trim();
        // let flag = /^[a-zA-Z0-9_]{8,16}$/.test(v);
        if (v.length>=2&&v.length<=20) {
          callback();
        } else {
          if (callback) callback(new Error('请输入2-20个字'));
        }
      };
      const num1Reg = (rule, value, callback) => { 
        let v = value.toString().trim();
        // let flag = /^[a-zA-Z0-9_]{8,16}$/.test(v);
        if (v.length>=2&&v.length<=30) {
          callback();
        } else {
          if (callback) callback(new Error('请输入2-30个字'));
        }
      };
      const num2Reg = (rule, value, callback) => { 
        let v = value.toString().trim();
        // let flag = /^[a-zA-Z0-9_]{8,16}$/.test(v);
        if (v.length>=5&&v.length<=30) {
          callback();
        } else {
          if (callback) callback(new Error('请输入5-30个字'));
        }
      };
      const num3Reg = (rule, value, callback) => { 
        let v = value.toString().trim();
        // let flag = /^[a-zA-Z0-9_]{8,16}$/.test(v);
        if (v.length>=10&&v.length<=20) {
          callback();
        } else {
          if (callback) callback(new Error('请输入10-20个字'));
        }
      };
      return{
        ids:[],
        shipList:[],  //店铺列表
        invoiceList:[{}],
        searchWay:0,  //0为快速搜索，1为高级搜索
        advancedFilter:false,
        filterParam:{
          status:'',
          onlstoreId:'',
        },
        invoiceFormDia:false,
        invoiceFormTitle:'新增发票配置',
        invoiceForm:{
          id:'',
          sellerName:'',
          onlstoreId:[],
          onlstoreName:[],
          depositBank:'',
          depositAccount:'',
          sellerTaxno:'',
          address:'',
          contactPhone:'',
        },
        invoiceRule:{
          sellerName:{required: true, trigger: 'change', validator: name1Reg},
          onlstoreId:{required: true, trigger: 'change',message:'请选择关联店铺'},
          depositBank:{required: true, trigger: 'change', validator: num1Reg},
          depositAccount:{required: true, trigger: 'change', validator: num2Reg},
          sellerTaxno:{required: true, trigger: 'change', validator: num3Reg},
          address:{required: true, trigger: 'change', validator: num2Reg},
          contactPhone: [{required: true, trigger: 'change', validator:this.$Util.RegExp.dotPhone2}],
        },
        param: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        total: 10,
      }
    },
    methods:{
      //查询所有
      getInvoiceList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/confInvoice/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.invoiceList=data.data.dataList
            this.total=data.data.totalNum
          }else{
            this.$message.error(data.msg);
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
      //新增发票配置
      addInvoiceBtn(){
        this.invoiceFormDia=true;
        this.invoiceFormTitle='新增发票配置'
      },
      //选择店铺
      selectShip(val){
        this.invoiceForm.onlstoreName=[];
        if(val){
          for(var i=0;i<val.length;i++){
            this.shipList.forEach(item=>{
              if(val[i]==item.id){
                this.invoiceForm.onlstoreName.push(item.storeName)
              }
            })
          }
        }
      },
      //保存新增
      saveAdd(){
         this.$refs.invoiceRef.validate((valid) => {
          if (valid) {
            this.invoiceForm.onlstoreId=this.invoiceForm.onlstoreId.toString()
            this.invoiceForm.onlstoreName=this.invoiceForm.onlstoreName.toString()
            let json_param = JSON.stringify(this.invoiceForm)
            this.$ajaxPost('wms/confInvoice/add.do', {reqParam: json_param}).then(({data}) => {
              if (data.code == 200) {
                this.invoiceFormDia=false;
                this.$message.success('新增成功')
                this.getInvoiceList();
                this.getShipList();
              } else {
                this.$message.error(data.msg)
              }
            })
          }
         })
      },
      //关闭表单
      resetForm(){
        this.$refs.invoiceRef.resetFields()
        Object.keys(this.invoiceForm).forEach(key => {
          this.invoiceForm[key] = ''
        })
        this.invoiceForm.onlstoreId=[]
        this.invoiceForm.onlstoreName=[]
      },
      //快速搜索
      qSearch(){
        this.param.keyword=this.$refs.qSearchRef.inputValue
        this.searchWay=0;
        this.getInvoiceList()
      },
      //高级搜索
      goSearch(){
        this.advancedFilter=true;
        this.searchWay=1;
      },
      submitSearch(){
        this.param.keyword='';
        this.$refs.qSearchRef.inputValue=''
        this.searchWay=1;
        this.getInvoiceList()
        this.advancedFilter=false;
      },
      //清空搜索条件
      concelTterm(){
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.param.keyword='';
        this.$refs.qSearchRef.inputValue=''
        this.getInvoiceList();
      },
      //删除
      deleteRow(){
        if(this.ids.length>0){
          this.$confirm('删除发票配置后，不可恢复，请谨慎操作？', '删除发票配置', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updStatus(this.ids.toString(),-2,'删除成功');
          }).catch(() => {})
        }else{
          this.$message.warning('请至少选择一条要删除的数据')
        }

      },
      //取消
      concelEdit(){
        this.invoiceFormDia=false;
      },
      //选择多条数据
      handleSelectionChange(val){
        this.ids = val.map(item => {
          return item.id
        });
      },
      //编辑
      editorUser(row){
        let invoiceObj=JSON.parse(JSON.stringify(row))
        for(let key in this.invoiceForm){
          if(invoiceObj[key]!=null){
            this.invoiceForm[key]=invoiceObj[key];
          }
        }
        let onlstoreIdArray=invoiceObj.onlstoreId.split(',')
        this.invoiceForm.onlstoreId=[];
        onlstoreIdArray.forEach(item=>{
          this.invoiceForm.onlstoreId.push(item-0)
        })
        this.invoiceForm.onlstoreName=invoiceObj.onlstoreName.split(',')
        this.invoiceFormDia=true;
        this.invoiceFormTitle='编辑发票配置'
      },
      //保存编辑
      saveEdit(){
        this.$refs.invoiceRef.validate((valid) => {
          if (valid) {
            this.invoiceForm.onlstoreId=this.invoiceForm.onlstoreId.toString()
            this.invoiceForm.onlstoreName=this.invoiceForm.onlstoreName.toString()
            let json_param = JSON.stringify(this.invoiceForm)
            this.$ajaxPost('wms/confInvoice/update.do', {reqParam: json_param}).then(({data}) => {
              if (data.code == 200) { 
                this.invoiceFormDia=false;
                this.$message.success('编辑成功')
                this.getInvoiceList();
                 this.getShipList();
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //启用
      startRow(row){
        this.updStatus(row.id,0,'启用成功');
      },
      //禁用
      forbidRow(row){
        this.updStatus(row.id,-1,'禁用成功');
      },
      // 更新状态
      updStatus (ids, status, msg) {
        this.$ajaxPost('wms/confInvoice/updateBatchStatus.do', {reqParam: JSON.stringify({ids: ids, status: status})}).then(({data}) => {
          if (data.code == 200) {
            this.$message.success(msg)
            this.getInvoiceList()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getInvoiceList()
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getInvoiceList()
      },
    },
    components: {},
    mounted() {
      this.getInvoiceList()
      this.getShipList();
    }
  }
</script>

<style lang="scss">
.invoice_config{
  .filterParam{
    .el-dialog{
      width: 900px;
    }
  }
}
  
</style>
