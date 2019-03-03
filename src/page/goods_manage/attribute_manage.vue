<template>
  <div class="attribute_manage">
    <header class="top-head">
      <el-button size="small" class="total" @click="addAttributeBtn">新增</el-button>
      <div class="header-right f-fr">
        <search placeholder="请输入属性名称，ID，进行搜索" :width="'280px'" @on-search="qSearch" :showIcon="false" ref="qSearch" style="width:310px"></search>
      </div>
    </header>
    <el-table ref="attributeList" :data="attributeList" height="500px" border @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="44"></el-table-column>
      <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
      <el-table-column align="center" prop="name" label="操作" width="120">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="editorRow(scope.row)">编辑</el-button>
          <el-button size="small" type="text" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="propertyId" label="属性ID"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="propertyName" label="属性名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="propertyValue" label="属性值"></el-table-column>
      <el-table-column align="center" prop="isRequired" label="是否必填">
        <template slot-scope='scope'>
          {{scope.row.isRequired==0?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="sourceName" label="数据来源"></el-table-column>
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
    <el-dialog :title="attrDiaTitle" :visible.sync="addAttrDia"  :modal-append-to-body="false" @close="resetRules" class="filterParam">
      <el-form :model="AttrInfor" label-width="100px" :rules="AttrRule" ref="AttrRef" size="small">
        <el-form-item prop="propertyName" label="属性名称：">
          <el-input size="small" v-model="AttrInfor.propertyName" :disabled="attrDiaTitle=='编辑属性'" placeholder="" maxlength="20" style="width:280px"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="isRequired" label="是否必填：">
          <el-radio-group v-model="AttrInfor.isRequired">
            <el-radio label="0">是</el-radio>
            <el-radio label="-1">否</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item prop="sort" label="排序：">
          <el-input size="small" v-model="AttrInfor.sort" placeholder="默认100，值越小越靠前" maxlength="4" style="width:280px"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="type" label="填写方式：">
          <el-radio-group v-model="AttrInfor.type">
            <el-radio label="1">下拉选择</el-radio>
            <el-radio label="2">手动填写</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item prop="propertyValueList" label="属性值：" style="width:100%" class="propertyValue">
          <template v-for="(item,index) in propertyList">
            <el-row type="flex"  style="width:50%" :key="index">
              <el-input size="small" v-model="item.propertyValue" style="width:280px" maxlength="10"></el-input>
              <el-button size="small" type="text" class="el-icon-delete" style="font-size:20px;padding:0 5px;height:32px" v-if="index>0" @click="removePro(item,index)"></el-button>
            </el-row>
          </template>
        </el-form-item>
        <el-form-item style="width:100%">
          <el-row style="display: flex;align-items: center;">
            <el-button size="small" icon="el-icon-plus" style="font-size: 20px;height: 32px;padding:0 5px;" @click="addPro"></el-button>
            <span style="height: 32px;line-height: 32px;display: inline-block;margin-left: 10px;">新增一行</span>
          </el-row>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="concelSubmit">取消</el-button>
          <el-button size="small"  @click="saveAdd" v-if="attrDiaTitle=='新增属性'" class="total">保存</el-button>
          <el-button size="small"  @click="saveEditor" v-else class="total">保存</el-button>
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
        if (v.length<2||v.length>20) {
          if (callback) callback(new Error('请输入2-20个字'));
          
        } else if(this.rowData.propertyName!==this.AttrInfor.propertyName){
          let json_obj=JSON.stringify({propertyName:this.AttrInfor.propertyName})
          setTimeout(() => {
            this.$ajaxPost('wms/property/select.do', {reqParam: json_obj}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前面属性名称已存在，不可重复添加'))
              } else {
                callback()
              }
            })
          }, 10)
        }else{
          callback();
        }
      };
      const propertyReg=(rule, value, callback)=>{
        let flag=true
        let arr=[];
        arr = this.filterPropArr(this.propertyList, 'propertyValue');
        this.propertyList.forEach(item=>{
          if(item.propertyValue.toString().trim().length<1){
            flag=false
          }
        })
        if(flag){
          if(arr.length!=this.propertyList.length){
            if (callback) callback(new Error('请不要输入重复的属性值'));
          }else{
            callback();
          }
        }else{
          if (callback) callback(new Error('属性值请输入1-10个字'));
        }
      };
      return{
        ids:[],  //选中的id
        attributeList:[],
        addAttrDia:false,
        attrDiaTitle:'新增属性',
        filterParam:{
          keyword:'',
        },
        searchWay:0,
        AttrInfor:{  //新增，编辑
          id:'',
          propertyName:'',
          sort:'',
          isRequired:'-1',
          type:'1',
          propertyValueList:[],
        },
        propertyList:[{propertyValue:''}],
        AttrRule:{
          propertyName:[{required: true, trigger: 'change', validator: nameReg}],
          sort:[{trigger: 'change', validator: this.$Util.RegExp.pureSort}],
          propertyValueList:[{required: true, trigger: 'change', validator: propertyReg}],
        },
        rowData:{},
        param: {
          pageNum: 1,
          pageSize: 15,
        },
        total: 10,
      }
    },
    methods:{
      //获取所有属性
      getAttrList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
         this.$ajaxPost('wms/property/selectPage.do',{reqParam:json_param}).then(({data})=>{
           if(data.code==200){
             this.attributeList=data.data.dataList
             this.total=data.data.totalNum
           }else{
             this.$message.error(data.msg)
           }
         })
      },
      //新增
      addAttributeBtn(){
        this.addAttrDia=true;
        this.attrDiaTitle='新增属性'
      },
      //删除属性值
      removePro(item,index){
        this.propertyList.splice(index,1)
      },
      //新增属性值
      addPro(){
        this.propertyList.push({propertyValue:''})
      },
      //保存新增
      saveAdd(){
        this.$refs.AttrRef.validate((valid) => {
          if (valid) {
            this.AttrInfor.propertyValueList=[]
            this.propertyList.forEach(item=>{
              this.AttrInfor.propertyValueList.push(item.propertyValue)
            })
            let json_AttrInfor=JSON.stringify(this.AttrInfor)
            this.$ajaxPost('wms/property/add.do',{reqParam:json_AttrInfor}).then(({data})=>{
              if(data.code==200){
                this.$message.success('新增属性成功')
                this.param.pageNum=1
                this.param.pageSize=15
                this.addAttrDia=false;
                this.getAttrList();
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //取消
      concelSubmit(){
        this.addAttrDia=false;
      },
      //删除
      deleteRow(row){
        this.$confirm('删除属性后，不可恢复，请谨慎操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param=JSON.stringify({ids:row.propertyId,status:'-2'})
          this.$ajaxPost('wms/property/updateBatchStatus.do',{reqParam:param}).then(({data})=>{
            if(data.code==200){
              this.$message.success('删除属性成功')
              this.param.pageNum=1
              this.param.pageSize=15
              this.getAttrList();
            }else{
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      //编辑
      editorRow(row){
        for( let key in this.AttrInfor){
          if(row[key]!=null){
            this.AttrInfor[key]=row[key]
          }
        }
        this.propertyList=row.propertyValueList
        this.addAttrDia=true;
        this.attrDiaTitle='编辑属性'
        this.rowData=row;
        this.AttrInfor.isRequired=this.AttrInfor.isRequired+''
        this.AttrInfor.type='1'
        this.AttrInfor.id=row.propertyId
      },
      //保存编辑
      saveEditor(){
        this.$refs.AttrRef.validate((valid) => {
          if (valid) {
            this.AttrInfor.propertyValueList=[]
            this.propertyList.forEach(item=>{
              this.AttrInfor.propertyValueList.push(item)
            })
            let json_AttrInfor=JSON.stringify(this.AttrInfor)
            this.$ajaxPost('wms/property/update.do',{reqParam:json_AttrInfor}).then(({data})=>{
              if(data.code==200){
                this.$message.success('编辑属性成功')
                this.addAttrDia=false;
                this.getAttrList();
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //快速搜索
      qSearch(){
        this.searchWay=1;
        this.filterParam.keyword=this.$refs.qSearch.inputValue
        this.getAttrList();
      },
      //选择多条数据
      handleSelectionChange(val){
        this.ids = val.map(item => {
          return item.id
        });
      },
      //关闭表单时重置
      resetRules(val) {
        this.$refs.AttrRef.resetFields();
        Object.keys(this.AttrInfor).forEach(key => {
          this.AttrInfor[key] = '';
        });
        this.AttrInfor.isRequired='-1';
        this.AttrInfor.type='1';
        this.AttrInfor.propertyValueList=[];
        this.propertyList=[{propertyValue:''}];
      },
       filterPropArr(array, type = false) {
        if (array.length === 0) {
            return array;
        } else {
            if(type) {
                let obj = {};
                let newArray = array.reduce((current, next) => {
                    obj[next[type]] ? "" : 
                    obj[next[type]] = true && current.push(next);
                    return current;
                },[]);
                return newArray;
            } else {
                return Array.from(new Set(array));
            }
        }
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getAttrList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getAttrList();
      },
    },
    components: {},
    mounted() {
      this.getAttrList();
    }
  }
</script>

<style lang='scss'>
.propertyValue{
  .el-form-item__content{
    display: flex;
    flex-wrap: wrap;
    .el-input{
      margin-bottom:20px;
    }
  }
}
.attribute_manage{
  .el-dialog{
    width: 864px;
  }
}

</style>
