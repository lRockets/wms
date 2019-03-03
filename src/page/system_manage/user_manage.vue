<template>
  <div class="userManage">
    <div class="user_manage" v-if="isAdd">
      <header class="top-head">
        <el-button size="small" @click="addUserBtn" class="total">新增用户</el-button>
        <div class="header-right f-fr">
          <search placeholder="请输入工号，姓名，手机号进行搜索" @on-search="qSearch" :width="'280px'" :showIcon="false" ref="qSearchRef" style="width:310px"></search>
          <el-button size="small" @click="goSearch" class="total">高级搜索</el-button>
        </div>
      </header>
      <el-table ref="usersList" :data="usersList" height="500px" border>
        <el-table-column align="center" type="index" label="行号" width="55"></el-table-column>
        <el-table-column align="center" label="操作" width="246">
          <template slot-scope="scope">
            <el-button type="text" @click="editorUser(scope.row)">编辑</el-button>
            <el-button type="text" @click="resetPassBtn(scope.row)">重置密码</el-button>
            <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="userName" label="姓名" width="105"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="phone" label="手机号" width="152"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="jobNum" label="工号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="companyName" label="所属公司"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="roleNames" label="已分配角色" width="360"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="storehouseNames" label="管辖仓库"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="updateTime" label="更新时间" width="175"></el-table-column>
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
        <el-form :model="filterParam" size="small">
          <el-form-item prop="status" label="状态：">
            <el-select size="small" v-model="filterParam.type" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" value="0"></el-option>
              <el-option label="禁用" value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width:100%;text-align:right;">
            <el-button size="small" @click="concelTterm">清空条件</el-button>
            <el-button size="small" @click="submitSearch"  class="total">查询</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--<el-dialog title="修改密码" :visible.sync="alterPassDia"  :modal-append-to-body="false">
        <el-form :model="alterPassForm" label-width="80px" :rules="alterPassRule">
          <el-form-item prop="new_pwd" label="新密码：">
            <el-input size="small" placeholder="请输入新密码" type="password" clearable maxlength="20" v-model="alterPassForm.new_pwd"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 0;" prop="again_pwd" label="确认密码">
            <el-input size="small" placeholder="请再次输入密码：" type="password" clearable maxlength="20" v-model="alterPassForm.again_pwd"></el-input>
          </el-form-item>
          <el-form-item class="handle-btn-wrap">
            <el-button size="small" class="f-fl">取消</el-button>
            <el-button class="f-fr">确认修改</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>-->
    </div>
    <div class="addUser" v-else>
      <header class="top-head">
        <el-button type="text">{{userTitle}}</el-button>
        <div class="header-right f-fr">
          <el-button type="text" @click="goBack">返回</el-button>
        </div>
      </header>
      <el-form :model="addUserForm" label-width="100px" :rules="addUserRule" class="addUserForm" key="addUser" ref="addUserRef">
        <el-form-item prop="userName" label="姓名：" class="special" size="small">
          <el-input size="small" placeholder="请输入姓名" clearable minlength="2" maxlength="10" v-model="addUserForm.userName"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号：" class="special">
          <el-input size="small" placeholder="请输入手机号" clearable maxlength="11" v-model="addUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="jobNum" label="工号：" class="special">
          <el-input size="small" placeholder="请输入工号" clearable  v-model="addUserForm.jobNum"></el-input>
        </el-form-item>
        <el-form-item  prop="companyName" label="所属公司：" class="special">
          <el-input size="small" placeholder="请输入所属公司" clearable minlength="2" maxlength="30" v-model="addUserForm.companyName"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="登录密码：" class="special" v-if="isEdit">
          <el-input size="small" placeholder="请输入登录密码" type="password" clearable maxlength="20" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item prop="again_pwd" label="确认密码：" class="special" v-if="isEdit">
          <el-input size="small" placeholder="请再次输入密码" type="password" clearable maxlength="20" v-model="addUserForm.again_pwd"></el-input>
        </el-form-item>
        <el-form-item  label="管辖仓库：" style="width: 100%"  prop="storehouseIdList">
          <el-checkbox-group v-model="addUserForm.storehouseIdList" @change="changeEvent">
            <template v-for="(item,index) in storeList">
              <el-checkbox :label="item.id" :key="index">{{item.storehouseName}}</el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item  label="分配角色：" style="width: 71%" >
          <el-table ref="tableRole" :data="roleList"  @selection-change="handleSelectionChange">
            <el-table-column :selectable="checkboxT" align="center" type="selection" width="55"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="roleName" label="角色名称" width="200"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="角色职责" ></el-table-column>
            <template slot="empty">
              <div class="noData">
                <div class="noData-img"></div>
                <p>暂无数据</p>
              </div>
            </template>
          </el-table>
        </el-form-item>
        <el-form-item class="handle-btn-wrap" style="width: 100%">
          <el-button size="small" @click="saveAddUser" v-if="isEdit" class="total">保存</el-button>
          <el-button size="small" @click="saveEditorUser" v-else class="total">确认</el-button>
          <el-button size="small" @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    props:{},
    data(){
      const checkPassword2 = (rule, value, callback) => {  //确认密码
        let v = value.toString().trim();
        if (v.length>0) {
          if (v != this.addUserForm.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        }else {
          callback(new Error('请再次确认密码'));
        }
      };
      const storehouseIdReg = (rule, value, callback) => {  //确认是否选中仓库
        if (value.length>0) {
          callback();
        } else {
          if (callback) callback(new Error('请至少选择一个仓库'));
        }
      };
      const userNameReg = (rule, value, callback) => {  //确认姓名
        let v = value.toString().trim();
        // let flag = /^[a-zA-Z0-9_]{8,16}$/.test(v);
        if (v.length>=2&&v.length<=10) {
          callback();
        } else {
          if (callback) callback(new Error('请输入2-10个字'));
        }
      };
      const companyNameReg = (rule, value, callback) => {  //所属公司
        let v = value.toString().trim();
        // let flag = /^[a-zA-Z0-9_]{8,16}$/.test(v);
        if(v.length>0){
          if (v.length>=2&&v.length<=30) {
            callback();
          } else {
            if (callback) callback(new Error('请输入2-30个字'));
          }
        }else{
          callback();
        }
      };
      return{
        isAdd:true,
        isEdit:true,
        usersList:[], //用户列表
        storeList:[],  //仓库列表
        roleList:[],  //角色列表
        searchWay:0,  //0为快速搜索，1为高级搜索
        advancedFilter:false,
        filterParam:{
          type:'',
        },
       /* alterPassDia:false ,//修改密码
        alterPassForm:{
          new_pwd:'',
          again_pwd:'',
        },
        alterPassRule:{
          new_pwd: [{required: true, trigger: 'change', validator: this.$Util.RegExp.passwordReg}],
          again_pwd: [{required: true, trigger: 'change', validator: checkPassword}]
        },*/
        addUserForm:{ // 新增，编辑用户
          id:'',
          userName:'',
          phone:'',
          jobNum:'',
          companyName:'',
          storehouseIdList:[],
          storehouseIds:'',
          password:'',
          again_pwd:'',
          roleId:[],
        },
        addUserId:{
          id:''
        },
        addUserRule:{
          userName:[{required: true, trigger: 'change', validator: userNameReg}],
          phone:[{required: true, trigger: 'change', validator: this.$Util.RegExp.phoneReg}],
          companyName:[{trigger: 'change',validator: companyNameReg}],
          password:[{required: true, trigger: 'change', validator: this.$Util.RegExp.passwordReg}],
          again_pwd:[{required: true, trigger: 'change', validator: checkPassword2}],
          storehouseIdList:[{required: true, trigger: 'change', validator: storehouseIdReg}],
        },
        userTitle:'新增用户',
        param: {
          pageNum: 1,
          pageSize: 15,
          keyword:'',
        },
        total: 10,
      }
    },
    methods:{
      //第一条数据不能编辑复选框
      checkboxT(row,index){
        if(index==0){
          return 0;
        }else{
          return 1;
        }
      },
      changeEvent(val){},
      //查询所有用户
      getUsersList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/user/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.usersList=data.data.dataList
            this.total=data.data.totalNum
          }else{
            this.$message.error(data.msg);
          }
        })
      },
      //查询当前用户所属机构所有仓库
      getStoreHouseList(){
        this.$ajaxPost('wms/storehouse/selectAll.do',{}).then(({data})=>{
          if(data.code==200){
            this.storeList=data.data.storehouseList
          }else{
            this.$message.error(data.msg);
          }
        })
      },
      //获取所有角色列表
      getRoleList(){
        this.param.pageSize=99999
        let json_param=JSON.stringify(this.param)
        this.$ajaxPost('wms/role/selectAll.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.roleList=data.data.roleList
          }else{
            this.$message.error(data.msg)
          }
        })
        this.param.pageSize=15
      },
      //快速搜索
      qSearch(){
        this.param.keyword=this.$refs.qSearchRef.inputValue
        this.searchWay=0;
        this.getUsersList()
      },
      //高级搜索
      goSearch(){
        this.advancedFilter=true;
      },
      submitSearch(){
        this.param.keyword='';
        this.$refs.qSearchRef.inputValue=''
        this.searchWay=1;
        this.getUsersList()
        this.advancedFilter=false;
      },
      //清空搜索条件
      concelTterm(){
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.param.keyword='';
        this.$refs.qSearchRef.inputValue=''
        this.getUsersList();
      },
      resetPassBtn(row){
        this.addUserId.id=row.id
        let json_id=JSON.stringify(this.addUserId)
        this.$ajaxPost('wms/user/resetPassword.do',{reqParam:json_id}).then(({data}) => {
          if (data.code == 200) {
            this.$message.success('密码重置成功，初始密码：aa123456');
            this.getUsersList()
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      //删除
      deleteRow(row){
        this.$confirm('删除用户后，不可恢复，请谨慎操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.addUserId.id=row.id
          let json_id=JSON.stringify(this.addUserId)
          this.$ajaxPost('wms/user/delete.do',{reqParam:json_id}).then(({data}) => {
            if (data.code == 200) {
              this.$message.success('删除成功');
              this.param.pageSize = 15;
              this.param.pageNum = 1;
              this.getUsersList()
            } else {
              this.$message.error(data.msg);
            }
          })
        }).catch(() => {})
      },
      //新增用户
      addUserBtn(){
        console.log(this.addUserForm.storehouseIdList);
        this.isAdd=false
        this.isEdit=true;
        this.userTitle='新增用户'
        this.$nextTick(() => {
          this.checked();
          this.addUserForm.roleId.push(this.roleList[0].id)
        })
      },
      //编辑用户
      editorUser(row){
        console.log(this.addUserForm.storehouseIdList);
        this.isAdd=false
        this.isEdit=false;
        this.userTitle='编辑用户'
        for( let key in this.addUserForm){
          if(row[key]!=null && row[key]!=undefined){
            this.addUserForm[key]=row[key]
          }
        }
        if(row.storehouseIds!=null){
          this.addUserForm.storehouseIdList=row.storehouseIds.split(',')
          Object.keys(this.addUserForm.storehouseIdList).forEach(key => {
            this.addUserForm.storehouseIdList[key] =this.addUserForm.storehouseIdList[key]-0;
          });
        }else{
          this.addUserForm.storehouseIdList=[];
        }
        this.addUserForm.storehouseIds='';
        this.$nextTick(() => {
          this.checked();
          if(row.roleIds!=null){
            this.addUserForm.roleId=row.roleIds.split(',')
            this.addUserForm.roleId.forEach((item,index)=>{
              let i = this.roleIds.indexOf(item-0)
              if(i>-1){
                this.$refs.tableRole.toggleRowSelection(this.roleList[i],true);
              }
            })
          }
        })
      },
      //保存添加
      saveAddUser(){
        this.$refs.addUserRef.validate((valid) => {
          if (valid) {
            this.addUserForm.storehouseIds=this.addUserForm.storehouseIdList.toString()
            if(this.addUserForm.roleId.length>0){
              this.addUserForm.roleId=this.addUserForm.roleId.toString()
            }
            this.addUserForm.password=this.$md5(this.addUserForm.password)
            this.addUserForm = {
              ...this.addUserForm,
              storehouseIdList: [],
              again_pwd: '',
              id: '',
            }
            let json_addUserForm=JSON.stringify(this.addUserForm)
            this.$ajaxPost('wms/user/userAdd.do',{reqParam:json_addUserForm}).then(({data})=>{
              if(data.code==200){
                this.$message.success('添加新用户成功')
                this.goBack()
              }else{
                this.$message.error(data.msg);
              }
            })
          }
        })
      },
      //保存修改
      saveEditorUser(){
        this.$refs.addUserRef.validate((valid) => {
          if (valid) {
            this.addUserForm.storehouseIds=this.addUserForm.storehouseIdList.toString()
            if(this.addUserForm.roleId.length>0){
              this.addUserForm.roleId=this.addUserForm.roleId.toString()
            }
            let json_addUserForm=JSON.stringify(this.addUserForm)
            this.$ajaxPost('wms/user/userUpdate.do',{reqParam:json_addUserForm}).then(({data})=>{
              if(data.code==200){
                this.$message.success('修改新用户成功')
                this.goBack()
              }else{
                this.$message.error(data.msg);
              }
            })
          }
        })
      },
      //返回
      goBack(){
        // 重置表单
        this.$refs.addUserRef.resetFields();
        Object.keys(this.addUserForm).forEach(key => {
          this.addUserForm[key] = '';
        });
        // console.log()
        // this.$set(this.addUserForm, 'storehouseIdList', []);
        this.addUserForm.storehouseIdList=[]
        this.addUserForm.roleId=[]
        this.isAdd=true
        this.isEdit=true;
        this.getUsersList()
      },
      //分配角色
      handleSelectionChange(val){
        this.addUserForm.roleId = val.map(item => {
          return item.id
        });
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getUsersList()
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getUsersList()
      },
      checked(){
        this.$refs.tableRole.toggleRowSelection(this.roleList[0],true);
      },
    },
    computed: {
      roleIds:function () {
        let arr=[];
        this.roleList.forEach(item=>{
          arr.push(item.id)
        })
        return arr;
      },
    },
    components: {},
    mounted() {
      this.getUsersList()
      this.getStoreHouseList()
      this.getRoleList()
    }
  }
</script>

<style lang="scss">
.userManage{
  .addUserForm{
    display: flex;
    flex-wrap: wrap;
    .el-form-item.special{
      width: 35%;
      margin-right: 20px;
    }
  }
}

</style>
