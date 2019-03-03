<template>
<div>
  <header class="top-head">
    <el-button size="small" type="primary" @click="addCategoryBtn">新增</el-button>
  </header>
  <div class="category">
    <div class="leftTree">
      <el-button type="text" style="color:#39b9fe;" @click="expandOrContract">展开 | 收缩</el-button>
      <el-tree 
        :data="elData" 
        :props="defaultProps"
        @node-click="handleNodeClick" 
        node-key="id" 
        show-checkbox
        ref="storeTree"
        :default-expand-all='isOpenTree'
        :highlight-current="true"
        :expand-on-click-node='false'
        ></el-tree>
    </div>
    <div class="rightMain">
      <el-form :model="categoryInfor" label-width="110px" :rules="categoryRule" ref="categoryRef" size="small">
        <div class="subTitle">基本信息</div>
        <div class="inforBox">
          <el-form-item prop="parentId" label="上级类目：">
            <mutiple-tree 
              width="280px" 
              clearable 
              :defaultProps="defaultProps2" 
              :treeData="treeData" 
              show-checkbox
              ref="treeRef"
              @node-click="nodeClick"
              @clear="clearCheck"
              :expand-on-click-node='true'></mutiple-tree>
          </el-form-item>
          <el-form-item prop="categoryCode" label="类目编码：">
            <el-input size="small" style="width:280px;" v-model="categoryInfor.categoryCode" placeholder="不填写时，系统自动生成" maxlength="6"></el-input>
          </el-form-item>
          <el-form-item prop="categoryName" label="类目名称：">
            <el-input size="small" style="width:280px;" v-model="categoryInfor.categoryName" placeholder="" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item prop="sort" label="排序：">
            <el-input size="small" style="width:280px;" v-model="categoryInfor.sort" placeholder="默认100，值越小越靠前"></el-input>
          </el-form-item>
          <el-form-item prop="status" label="状态：">
            <el-switch v-model="categoryInfor.status" active-value="0" inactive-value="-1">
            </el-switch>
          </el-form-item>
        </div>
        <div class="subTitle">关联属性</div>
        <el-form-item label-width="0px" class="transfer">
          <div class="transfer_left">
            <div class="searchBox">
              <search placeholder="请输入属性ID，名称进行搜索" @on-search="qSearch" :width="'268px'" :showIcon="false" ref="qSearch"></search>
              <el-button size="small" @click="refresh" class="total" style="margin-left:10px;">刷新</el-button>
            </div>
            <ul>
              <template v-for="(item,index) in configList">
                <li :key="index">
                  <el-checkbox v-model="item.isChecked" @change="addConfig" @click.native="clickCheckBox(item)">{{item.propertyName}}</el-checkbox>
                  <div class="c_vlaue" ><i>(</i><span>{{item.propertyValue}}</span><i>)</i></div>
                </li>
              </template>
            </ul>
          </div>
          <el-button size="small" type="text" icon="el-icon-d-arrow-right" style="margin: 0 20px"></el-button>
          <div class="transfer_right">
            <div class="searchBox">
              <search placeholder="请输入属性ID，名称进行搜索" @on-search="qSearch2" :width="'268px'" :showIcon="false" ref="qSearch2"></search>
              <el-button size="small" @click="refresh2" class="total" style="margin-left:10px;">刷新</el-button>
            </div>
            <ul>
              <template v-for="(item,index) in isCheckedList">
                <li :key="index">
                  <span class="el-checkbox__label">{{item.propertyName}}</span>
                  <div class="c_vlaue" >
                    <i>(</i>
                    <span>{{item.propertyValue}}</span>
                    <i>)</i>
                    <el-button size="small" type="text" class="removeRow" @click="removeRow(item,index)"></el-button>
                  </div>
                </li>
              </template>
            </ul>
          </div>
        </el-form-item>
        <el-form-item label-width="0" style="width:100%;text-align:right;">
          <el-button size="small" @click="saveEdit" v-if="cateFormTitle=='编辑类目'" class="total">保存</el-button>
          <el-button size="small" @click="saveAdd" v-if="cateFormTitle=='新增类目'" class="total">确认</el-button>
          <el-button size="small" @click="detele" v-if="cateFormTitle=='编辑类目'">删除</el-button>
          <el-button size="small" @click="concelAdd" v-if="cateFormTitle=='新增类目'">取消</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</div>
</template>

<script>
  export default {
    props:{},
    data(){
      const parentIdReg = (rule, value, callback) => {
        let v = value.toString().trim();
        if (!v) {
          if (callback) callback(new Error('请选择上级类目'));
        } else if(this.categoryData.parentId!==this.categoryInfor.parentId) {
          let param = JSON.stringify({categoryId: this.categoryInfor.parentId})
          setTimeout(() => {
            this.$ajaxPost('wms/goods/select.do', {reqParam: param}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前类目存在商品信息，不可添加子类目'))
              } else {
                callback()
              }
            })
          }, 10)
        }else{
          callback()
        }
      };
      const codeReg = (rule, value, callback) => {
        let v = value.toString().trim();
        let flag =/^[A-z0-9]{1,6}$/.test(v);
        if(v){
          if (!flag) {
            if (callback) callback(new Error('请输入1-6位数字/字母'));
          } else if(this.categoryData.categoryCode!==this.categoryInfor.categoryCode) {
            let param = JSON.stringify({categoryCode: this.categoryInfor.categoryCode})
            setTimeout(() => {
              this.$ajaxPost('wms/category/select.do', {reqParam: param}).then(({data}) => {
                if (data.code == 200 && data.data) {
                  callback(new Error('当前编码已存在，不可重复添加'))
                } else {
                  callback()
                }
              })
            }, 10)
          }else{
            callback()
          }
        }else{
          callback()
        }
      };
      const nameReg = (rule, value, callback) => {
        let v = value.toString().trim();
        if (v.length<2||v.length>20) {
          if (callback) callback(new Error('请输入2-20个字'));
        } else if(this.categoryData.categoryName!==this.categoryInfor.categoryName) {
          let param = JSON.stringify({categoryName: this.categoryInfor.categoryName})
          setTimeout(() => {
            this.$ajaxPost('wms/category/select.do', {reqParam: param}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前名称已存在，不可重复添加'))
              } else {
                callback()
              }
            })
          }, 10)
        }else{
          callback()
        }
      };
      return{
        isOpenTree:true,
        treeData:[],
        elData: [],
        defaultCheckedKeys:[2],
        defaultProps: {
          children: 'children',
          label: 'categoryName',
        },
        defaultProps2: {
          children: 'children',
          label: 'categoryName',
        },
        categoryId:{
          id:'',
        },
        categoryInfor:{
          id:'',
          parentId:'',
          parentName:'',
          categoryCode:'',
          categoryName:'',
          sort:'',
          status:'0',
          propertyIdList:[],
        },
        categoryRule:{
           parentId:{required: true, trigger: 'change', validator:parentIdReg},
           categoryCode:{trigger: 'change', validator:codeReg},
           categoryName:{required: true,trigger: 'change', validator:nameReg},
           sort:[{trigger: 'change', validator: this.$Util.RegExp.pureSort}],
        },
        cateFormTitle:'编辑类目',
        categoryData:{},
        configList:[],
        configStatus:'',
        isCheckedList:[],
      }
    },

    methods:{
      //获取类目树
      getCategoryTree(){
        this.$ajaxPost('wms/category/selectCategoryTree.do',{}).then(({data}) => {
          if (data.code == 200) {
            if(data.data.categoryList!=null&&data.data.categoryList!=[]){
              this.elData=data.data.categoryList
              if(!this.categoryInfor.id){
                this.categoryId.id=this.elData[0].id;
              }else{
                this.categoryId.id=this.categoryInfor.id;
              }
              // 设置默认选中的节点
              this.$nextTick(() => {
                const node = this.$refs.storeTree.getNode(this.categoryId.id);
                this.$refs.storeTree.setCurrentNode(node.data);
              });
              this.addDisabled2(this.elData)   //状态status为-1的要置灰
              this.getCategoryInfor();  //右侧信息
              this.getIsCheckedArr(this.categoryId.id)  //已选关联属性
            }else{
              this.cateFormTitle='新增类目'
              this.elData=[];
              this.treeData=[];
              this.$refs['treeRef'].result.names='';
              this.$refs.categoryRef.resetFields();
              Object.keys(this.categoryInfor).forEach(key => {
                this.categoryInfor[key] = '';
              });
              this.categoryInfor.status='0'
              this.categoryInfor.propertyIdList=[];
              this.categoryData={};
              this.isCheckedList=[];
              this.judageProperty()
              this.treeData.push({
                categoryName:'无',
                children:[],
                id:0,
                categoryCode:'',
              })
            }
          } else {
            this.$message.error(data.msg);
          }
        })
        
      },
       //展开或者收缩
      expandOrContract(){
        this.elData = this.elData.concat([])
        this.isOpenTree=!this.isOpenTree
        this.$refs.storeTree.store.defaultExpandAll = this.isOpenTree
      },
      //获取右侧信息
      getCategoryInfor(){
        let firstData=JSON.parse(JSON.stringify(this.elData[0]))
        this.treeData=JSON.parse(JSON.stringify(this.elData))
        this.treeData.unshift(firstData)
        this.treeData[0].categoryName='无'
        this.treeData[0].children=[];
        this.treeData[0].id=0;
        this.treeData[0].categoryCode='';
        // 第四层和当前类目禁用
        this.addDisabled(this.treeData,this.categoryId.id)
        let json_categoryId=JSON.stringify({id:this.categoryId.id})
        this.$ajaxPost('wms/category/selectPage.do',{reqParam:json_categoryId}).then(({data})=>{
          if(data.code==200){
            if(data.data.dataList.length>0){
              for(let key in this.categoryInfor){
                if(data.data.dataList[0][key]!=null){
                  this.categoryInfor[key]=data.data.dataList[0][key]
                }
              }
              this.categoryInfor.propertyIdList=[]
              this.categoryData=JSON.parse(JSON.stringify(data.data.dataList[0]))
              this.$refs['treeRef'].result.objs.ids= this.categoryInfor.parentId;
              if(this.categoryInfor.parentId>0){
                this.$refs['treeRef'].result.names=this.categoryInfor.parentName;
              }else{
                this.$refs['treeRef'].result.names='无';
              }
              this.categoryInfor.status=this.categoryInfor.status+''
            }
          }else{
            this.$message.error(data.msg);
          }
        })
      },
      //获取所有关联属性
      getAttrList(word){
        word = word || '';
        let json_param=JSON.stringify({pageNum:1,pageSize:9999,keyword:word})
        this.$ajaxPost('wms/property/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.configList=data.data.dataList
            this.judageProperty();
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      // 获取已选择的属性
      getIsCheckedArr(arrId){
        let json_param=JSON.stringify({pageNum:1,pageSize:9999,categoryId:arrId})
        this.$ajaxPost('wms/property/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.isCheckedList=data.data.dataList
            this.judageProperty()
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //点击左侧树搜索
      handleNodeClick(data) {
        this.cateFormTitle='编辑类目'
        this.categoryId.id=data.id
        this.categoryData=JSON.parse(JSON.stringify(data))
        this.getCategoryInfor()
        this.getIsCheckedArr(this.categoryId.id)
      },
      //穿梭款左侧搜索
      qSearch(){
        this.getAttrList(this.$refs.qSearch.inputValue);
      },
      //左侧刷新
      refresh(){
        this.$refs.qSearch.inputValue=''
        this.getAttrList()
      },
      //移除选中的属性
      removeRow(item,index2){
        this.isCheckedList.splice(index2,1)
        this.configList.forEach((a,index1)=>{
          if(a.propertyName==item.propertyName){
            this.configList[index1].isChecked=false;
          }
        })
      },
      addConfig(val){},
      //判断
      judageProperty(){
        if(this.isCheckedList.length>0){
          for(let i=0;i<this.configList.length;i++){
            for(let t=0;t<this.isCheckedList.length;t++){
              if(this.isCheckedList[t].propertyName == this.configList[i].propertyName){
                this.$set(this.configList[i],'isChecked',true)
                break;
              }else{
                this.configList[i].isChecked=false;
              }
            }
          }
        }else{
          for(let i=0;i<this.configList.length;i++){
            this.configList[i].isChecked=false;
          }
        }
      },
      clickCheckBox(item){
        setTimeout(() => {
          if(item.isChecked){
            this.isCheckedList.push(item);
            this.isCheckedList= this.isCheckedList.filter((element,index,self)=>{
                return self.indexOf(element) === index;
             });
          }else{
            this.isCheckedList.forEach((a,index)=>{
              if(a.propertyName==item.propertyName){
                this.isCheckedList.splice(index,1)
              }
            })
          }
        },10)
      },
      //穿梭框右侧搜索
      qSearch2(){
        if(this.$refs.qSearch2.inputValue){
          this.isCheckedList= this.isCheckedList.filter((element)=>{
            return element.propertyName.match(this.$refs.qSearch2.inputValue)
          });
          this.judageProperty();
        }else{
          this.getIsCheckedArr(this.categoryId.id)
        }
      },
      //右侧刷新
      refresh2(){
        this.$refs.qSearch2.inputValue=''
        if(this.cateFormTitle=='编辑类目'){
          this.getIsCheckedArr(this.categoryId.id)
        }
      },
      // 树节点点击事件
      nodeClick (item) {
        this.categoryInfor.parentId = item.id
      },
      // 树节点清空选择
      clearCheck () {
        this.categoryInfor.parentId = ''
        this.categoryInfor.parentName=''
      },
      //新增
      addCategoryBtn(){
        this.cateFormTitle='新增类目'
        this.$refs['treeRef'].result.names='';
        this.$refs.categoryRef.resetFields();
        Object.keys(this.categoryInfor).forEach(key => {
          this.categoryInfor[key] = '';
        });
        this.categoryInfor.status='0'
        this.categoryInfor.propertyIdList=[];
         this.categoryData={};
        this.isCheckedList=[];

        let firstData=JSON.parse(JSON.stringify(this.elData[0]))
        this.treeData=JSON.parse(JSON.stringify(this.elData))
        this.treeData.unshift(firstData)
        this.treeData[0].categoryName='无'
        this.treeData[0].children=[];
        this.treeData[0].id=0;
        this.treeData[0].categoryCode='';
        // 第四层和自己禁用
        this.addDisabled(this.treeData,this.categoryId.id)
        this.judageProperty()
      },
      //保存新增
      saveAdd(){
        this.$refs.categoryRef.validate((valid) => {
          if (valid) {
            if(this.isCheckedList.length>0){
              this.isCheckedList.forEach(item=>{
                this.categoryInfor.propertyIdList.push(item.propertyId)
              })
            }else{
              this.$message.error('请至少选择一个关联属性')
              return false
            }
            let json_param=JSON.stringify(this.categoryInfor)
            this.$ajaxPost('wms/category/add.do',{reqParam:json_param}).then(({data})=>{
              if(data.code==200){
                this.$message.success('新增类目成功')
                this.categoryInfor.id=data.data
                this.getCategoryTree()
                this.cateFormTitle='编辑类目'
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //保存编辑
      saveEdit(){
        this.$refs.categoryRef.validate((valid) => {
          if (valid) {
            if(this.isCheckedList.length>0){
              this.isCheckedList.forEach(item=>{
                this.categoryInfor.propertyIdList.push(item.propertyId)
              })
            }else{
              this.$message.error('请至少选择一个关联属性')
              return false
            }
            let json_param=JSON.stringify(this.categoryInfor)
            this.$ajaxPost('wms/category/update.do',{reqParam:json_param}).then(({data})=>{
              if(data.code==200){
                this.$message.success('修改类目信息成功')
                this.getCategoryTree()
                this.getIsCheckedArr(this.categoryId.id)
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //删除
      detele(){
        this.$confirm('删除后，不可恢复，请谨慎操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let json_param=JSON.stringify({ids:this.categoryInfor.id,status:-2})
          this.$ajaxPost('wms/category/updateBatchStatus.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              this.categoryId.id='';
              this.categoryInfor.id='';
              this.getCategoryTree()
              this.getAttrList();
              this.$message.success('删除类目成功')
            }else{
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      //取消新增
      concelAdd(){
        this.cateFormTitle='编辑类目'
        this.categoryInfor.id=this.categoryId.id
        this.getCategoryTree()
      },
      addDisabled(arr,cateId){
        arr.forEach(item => {
          //编辑类目时，不能点击自己，以及子目录
          if(this.cateFormTitle=='编辑类目'){
            if(item.id==cateId){
              this.$set(item, 'disabled', true)
            }
            if(item.disabled==true && item.children.length>0){
              item.children.forEach(c_item=>{
                this.$set(c_item, 'disabled', true)
              })
            }
          }
          //第四层禁用
          if (item.level<4) {
            if(item.children.length>0){
              this.addDisabled(item.children,cateId)
            }
          }else{
            this.$set(item, 'disabled', true)
          }
        })
      },
      addDisabled2(arr){
         arr.forEach(item => {
          if(item.status=='-1'){
            this.$set(item, 'disabled', true)
          }
          if(item.disabled==true && item.children.length>0){
            item.children.forEach(c_item=>{
              this.$set(c_item, 'disabled', true)
            })
          }
          if(item.children.length>0){
            this.addDisabled2(item.children)
          }
        })
      }
    },
    mounted(){
      this.getCategoryTree()
      this.getAttrList();
    },
  }
</script>

<style lang="scss">
  .category {
    display: flex;
    flex-wrap: nowrap;
    box-sizing: border-box;
    .leftTree {
      width: 13%;
      padding: 0 10px;
      margin-right: 2%;
      height: 682px;
      background-color: #ffffff;
      border: solid 1px #e5e5e5;
      overflow: auto;
      .el-tree-node__content >.el-checkbox{
        display: none;
      }
      .el-tree-node__content {
        .el-checkbox.is-disabled + span.el-tree-node__label{
          opacity: 0.4;
        }
      }
    }
    .rightMain {
      width: 85%;
      .el-tree-node__content >.el-checkbox{
        display: none;
      }
      .el-tree-node__content {
        .el-checkbox.is-disabled + span.el-tree-node__label{
          opacity: 0.4;
          cursor: not-allowed;
        }
      }
    }
    .inforBox{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .el-form-item{
        width: 35%;
        margin-right: 5%;
      }
    }
    .transfer .el-form-item__content{
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      .transfer_left ,.transfer_right{
        width: 370px;
        height: 372px;
        padding: 20px;
        border: 1px solid #ccc;
      }
      .searchBox{
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
      }
      ul{
        padding:10px;
        height: 320px;
        overflow: auto;
        margin-top: 10px;
        li{
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          line-height: 40px;
          .c_vlaue{
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            span{
              max-width: 180px;
              overflow: hidden;
              text-overflow:ellipsis;//文本溢出显示省略号
              white-space:nowrap;//文本不会换行（单行文本溢出）
              display: inline-block;
              line-height: 32px;
              height: 32px;
            }
            i{
              display: inline-block;
              line-height: 32px;
              height: 32px;
            }
            .removeRow{
              background: url('../../assets/images/sprite.png')0 -126px no-repeat;
              width: 21px;
              margin-left: 58px;
            }
          }
        }
      }

    }
  }

   
</style>
