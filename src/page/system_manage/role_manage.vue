<template>
  <div class="roleManage">
    <div class="role_manage" v-if="isAdd">
      <header class="top-head">
        <el-button size="small" @click="addRoleBtn" class="total">新增角色</el-button>
        <div class="header-right f-fr">
          <search placeholder="请输入角色名进行搜索" @on-search="qSearch" :showIcon="false" ref="qSearch" :width="'280px'" style="width:310px"></search>
        </div>
      </header>
      <el-table ref="roleList" :data="roleList" height="500px" border>
        <el-table-column align="center" type="index" label="行号" width="55"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="editorUser(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
            <!--<el-button type="text">复制</el-button>-->
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="roleName" label="角色名" width="240"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="角色职责"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="companyName" label="所属公司" width="240"></el-table-column>
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
    <div class="addRole" v-else>
      <header class="top-head">
        <el-button type="text">{{role_title}}</el-button>
        <div class="header-right f-fr">
          <el-button type="text" @click="goBack">返回</el-button>
        </div>
      </header>
      <el-form :model="addRoleForm" label-width="100px" :rules="addRoleRule" class="addRoleForm" key="addRole" ref="addRoleRef" size="small">
        <el-form-item prop="roleName" label="角色名称：" style="width: 60%">
          <el-input size="small" placeholder="请输入角色名称" clearable maxlength="8" v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="note" label="角色职责：" style="width: 60%">
          <el-input size="small" placeholder="请输入角色职责" clearable type="textarea" maxlength="11" v-model="addRoleForm.note"></el-input>
        </el-form-item>
        <el-form-item  label="分配权限：" style="width: 60%">
          <el-checkbox v-model="checkedAll" @change="changeCheckedAll">全选/反选</el-checkbox>
        </el-form-item>
        <el-form-item>
          <div class="permissionBox f-fl">
            <div class="title">PC端权限</div>
            <div class="treeBox" >
              <el-checkbox v-model="checkedAllPC" @change='checkedPC'>全选/反选</el-checkbox>
              <el-tree
                :data="rolePC"
                ref="treePC"
                show-checkbox
                node-key="id"
                :default-checked-keys="defaultCheckedPC"
                @check="handleCheckChangePC"
                :props="treeProps"></el-tree>
            </div>
          </div>
          <div class="permissionBox f-fl">
            <div class="title">PDA端权限</div>
            <div class="treeBox" >
              <el-checkbox v-model="checkedAllPDA" @change='checkedPDA'>全选/反选</el-checkbox>
              <el-tree
                :data="rolePDA"
                ref="treePDA"
                show-checkbox
                node-key="id"
                :default-checked-keys="defaultCheckedPDA"
                @check="handleCheckChangePDA"
                :props="treeProps"></el-tree>
            </div>
          </div>
        </el-form-item>
        <el-form-item class="handle-btn-wrap" style="width: 100%">
          <el-button size="small" @click="saveAddRole" v-if="this.role_title=='新增角色'" class="total">保存</el-button>
          <el-button size="small" @click="saveEditorRole" v-if="this.role_title=='编辑角色'" class="total">保存</el-button>
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
      const nameReg = (rule, value, callback) => {
        let v = value.toString().trim();
        let flag = /^[a-zA-Z0-9\u4e00-\u9fa5]{2,8}$/.test(v);
        if (!flag) {
          if (callback) callback(new Error('请输入2-8个字，支持数字，英文，中文'));
        }else if(this.rowData.roleName!==this.addRoleForm.roleName){
          let json_param=JSON.stringify({roleName:this.addRoleForm.roleName})
          this.$ajaxPost('wms/role/select.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200 && data.data.role){
              if (callback) callback(new Error('当前角色名已经存在'));
            }else{
              callback();
            }
          })
        }else{
          callback();
        }
      };
      const noteReg = (rule, value, callback) => {
        let v = value.toString().trim();
        if(v){
          if (v.length>100) {
            if (callback) callback(new Error('请输入0-100个字'));
          }else {
            callback();
          }
        }else{
          callback();
        }
      };
      return{
        isAdd:true,
        isEdit:true,
        searchWay:0, //0为快速搜索，1为高级搜索
        roleList:[],
        filterParam:{
          keyword:'',
        },
        addRoleForm:{
          id:'',
          roleName:'',
          note:'',
          permissionIds:[],
        },
        addRoleRule:{
          roleName:[{required: true, trigger: 'change', validator: nameReg}],
          note:[{trigger: 'change', validator: noteReg}],
        },
        role_title:'新增角色',
        rolePC: [],     //PC端权限
        rolePDA: [],     //PDA端权限
        treeProps: {
          children: 'children',
          label: 'permissionName'
        },
        checkedAll:false,   //全选
        checkedAllPC:false,  //pc端全选
        checkedAllPDA:false,  //PDA端全选

        defaultCheckedPC: [],  //pc默认选中
        defaultCheckedPDA: [],  //PDA默认选中
        roleId:{
          id:'',
        },
        param: {
          pageNum: 1,
          pageSize: 15,
        },
        total: 10,
        rowData:{},
        treeParent: [],
      }
    },
    methods:{
      //单击改变树时
      handleCheckChangePC(data,checked){
        this.defaultCheckedPC=[];
        this.defaultCheckedPC=JSON.parse(JSON.stringify(checked.checkedKeys));
        this.$nextTick(()=>{
          this.judge()
        })
      },
      handleCheckChangePDA(data,checked){
        this.defaultCheckedPDA=[];
        this.defaultCheckedPDA=JSON.parse(JSON.stringify(checked.checkedKeys));
        this.$nextTick(()=>{
          this.judge()
        })
      },
      getRoleList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/role/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.roleList=data.data.dataList
            this.total=data.data.totalNum
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //获取所有权限树
      getRoleTree(){
        this.$ajaxPost('wms/permission/selectPermission.do',{}).then(({data})=>{
          if(data.code==200){
            this.rolePC = JSON.parse(JSON.stringify(data.data.permissionListPC))
            // this.rolePC = this.filterType(this.rolePC)
            this.rolePDA=data.data.permissionListPDA
            this.expandedParent(this.rolePC);
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //过滤掉type==3的菜单项
      // filterType(obj) {
      //   obj = obj.filter(item => {
      //     if(item.children.length>0){
      //       item.children = this.filterType(item.children)
      //     }
      //     return item.type !== 3
      //   })
      //   return obj
      // },
      //快速搜索
      qSearch(){
        this.searchWay=1;
        this.filterParam.keyword=this.$refs.qSearch.inputValue
        this.getRoleList();
      },
      //删除
      deleteRow(row){
        this.$confirm('删除角色后，不可恢复，请谨慎操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.roleId.id=row.id;
           let json_id=JSON.stringify(this.roleId)
           this.$ajaxPost('wms/role/delete.do',{reqParam:json_id}).then(({data}) => {
             if (data.code == 200) {
               this.$message.success('删除成功');
               this.param.pageSize = 15;
               this.param.pageNum = 1;
               this.getRoleList();
             } else {
               this.$message.error(data.msg);
             }
           })
        }).catch(() => {})
      },
      //新增
      addRoleBtn(){
        this.isAdd=false
        this.isEdit=true;
        this.role_title='新增角色'
      },
      //保存添加
      saveAddRole(){
        this.$refs.addRoleRef.validate((valid) => {
          if (valid) {
            this.addRoleForm.permissionIds = [
              ...this.defaultCheckedPC,
              ...this.defaultCheckedPDA,
              ...this.$refs.treePC.getHalfCheckedKeys(),
            ].join(',')
            let json_addRoleForm=JSON.stringify(this.addRoleForm)
            this.$ajaxPost('wms/role/insert.do',{reqParam:json_addRoleForm}).then(({data})=>{
              if(data.code==200){
                this.$message.success('新增成功')
                this.goBack()
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //编辑
      editorUser(row){
        this.rowData=row
        this.isAdd=false
        this.isEdit=false;
        this.role_title='编辑角色'
        for( let key in this.addRoleForm){
          if(row[key]!=null){
            this.addRoleForm[key]=row[key]
          }
        }
        if(this.addRoleForm.permissionIds.length>0){
          this.addRoleForm.permissionIds=this.addRoleForm.permissionIds.split(',');
          this.addRoleForm.permissionIds.forEach(item=>{
            if(this.rolePCId.indexOf(item-0)>-1){
              this.defaultCheckedPC.push(item-0)
            }
          })
          this.addRoleForm.permissionIds.forEach(item=>{
            if(this.rolePDAId.indexOf(item-0)>-1){
              this.defaultCheckedPDA.push(item-0)
            }
          })
        }
        this.$nextTick(()=>{
          this.$refs.treePC.setCheckedKeys(this.defaultCheckedPC.filter((item) => {
            return this.treeParent.indexOf(item) !== -1;
          }));
          this.judge()
        })
      },
      expandedParent(data) {
        data.forEach((item) => {
            if (item.children.length !== 0) {
                this.expandedParent(item.children);
            }
            if (item.children.length === 0) {
                this.treeParent.push(item.id);
            }
        });
      },
      //保存编辑
      saveEditorRole(){
        this.$refs.addRoleRef.validate((valid) => {
          if (valid) {
           this.addRoleForm.permissionIds = [
              ...this.defaultCheckedPC,
              ...this.defaultCheckedPDA,
              ...this.$refs.treePC.getHalfCheckedKeys(),
            ].join(',');
            let json_addRoleForm=JSON.stringify(this.addRoleForm)
            this.$ajaxPost('wms/role/update.do',{reqParam:json_addRoleForm}).then(({data})=>{
              if(data.code==200){
                this.$message.success('修改成功')
                this.goBack()
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //返回
      goBack(){
        this.$refs.addRoleRef.resetFields();
        this.addRoleForm.permissionIds=[];
        this.addRoleForm.note='';
        this.addRoleForm.roleName='';
        this.defaultCheckedPC=[]
        this.defaultCheckedPDA=[]
        this.isAdd=true
        this.isEdit=true;
        this.getRoleList();
      },
       //PC端全选
      checkedPC(val){
        this.defaultCheckedPC=[]
        if(val){
          this.selectAll(this.rolePC,this.defaultCheckedPC)
        }
        this.$refs.treePC.setCheckedKeys(this.defaultCheckedPC);
        this.$nextTick(()=>{
          this.judge();
        })
      },
      //PDA端全选
      checkedPDA(val){
        this.defaultCheckedPDA=[]
        if(val){
          this.selectAll(this.rolePDA,this.defaultCheckedPDA)
        }
        this.$refs.treePDA.setCheckedKeys(this.defaultCheckedPDA);
        this.$nextTick(()=>{
          this.judge();
        })
      },
      //pc/PDA全选
      selectAll(treeArr,defautArr){
        treeArr.forEach(item=>{
          defautArr.push(item.id)
          if(item.children.length>0){
            return this.selectAll(item.children,defautArr)
          }
        })
      },
      changeCheckedAll(val){
        this.defaultCheckedPC=[]
        this.defaultCheckedPDA=[]
        if(val){
          this.selectAll(this.rolePC,this.defaultCheckedPC)
          this.selectAll(this.rolePDA,this.defaultCheckedPDA)
        }
        this.$refs.treePC.setCheckedKeys(this.defaultCheckedPC);
        this.$refs.treePDA.setCheckedKeys(this.defaultCheckedPDA);
        this.$nextTick(()=>{
          this.judge()
        })
      },
      judge(){
        if(this.rolePDAId.length==this.defaultCheckedPDA.length && this.rolePDAId.length>0){
          this.checkedAllPDA=true;
        }else{
          this.checkedAllPDA=false;
        }
        if(this.rolePCId.length == this.defaultCheckedPC.length && this.rolePCId.length>0){
          this.checkedAllPC=true;
        }else{
          this.checkedAllPC=false;
        }
        setTimeout(()=>{
           if(this.checkedAllPDA && this.checkedAllPC){
            this.checkedAll=true;
          }else{
            this.checkedAll=false;
          }
        },10)
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getRoleList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getRoleList();
      },
    },
    computed: {
      rolePCId:function () {
        let arr=[];
        this.selectAll(this.rolePC,arr)
        return arr;
      },
      rolePDAId:function () {
        let arr=[];
        this.selectAll(this.rolePDA,arr)
        return arr;
      },
    },
    components: {},
    mounted() {
      this.getRoleList();
      this.getRoleTree();
    }
  }
</script>

<style lang="scss">
.permissionBox{
  width: 400px;
  height: 514px;
  border: solid 1px #e5e5e5;
  margin-right: 20px;
  .title{
    width: 400px;
    height: 40px;
    background-image: linear-gradient(0deg, 
      #f3f3f3 0%, 
      #ffffff 100%);
    border-bottom: solid 1px #e9e9e9;
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    line-height: 40px;
    font-weight: 700;
    color: #333333;
    text-align: center;
  }
  .treeBox{
    height: 474px;
    overflow: auto;
    padding-left: 60px;
    .el-tree{
      color: #666666;
    }
  }
}
</style>
