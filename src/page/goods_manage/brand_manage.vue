<template>
  <div class="brand_manage">
    <header class="top-head">
      <el-button size="small" class="total" @click="addBrandBtn">新增</el-button>
      <div class="header-right f-fr">
        <search placeholder="请输入品牌名称，ID，进行搜索" @on-search="qSearch" :width="'280px'" :showIcon="false" ref="qSearch" style="width:310px"></search>
      </div>
    </header>
    <el-table ref="brandList" :data="brandList" height="500px" border @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="44"></el-table-column>
      <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
      <el-table-column align="center" prop="name" label="操作" width="120">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="editorRow(scope.row)">编辑</el-button>
          <el-button size="small" type="text" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="id" label="品牌ID"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="brandName" label="品牌名称"></el-table-column>
      <el-table-column align="center" prop="sort" label="排序"></el-table-column>
      <el-table-column align="center" prop="source" label="数据来源">
         <template slot-scope="scope">
          {{scope.row.source==0?'手动添加':'接口同步'}}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="updateTime" label="更新时间" width="170"></el-table-column>
      <el-table-column align="center" prop="updateByname" label="更新人"></el-table-column>
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

    <el-dialog :title="brandDiaTitle" 
               :visible.sync="addBrandDia"  
               width="30%"
               :modal-append-to-body="false" 
               :close-on-click-modal="false"
               @close="resetRules">
      <el-form :model="BrandInfor" label-width="100px" :rules="BrandRule" ref="BrandRef" size="small">
        <el-form-item prop="brandName" label="品牌名称：">
          <el-input size="small" v-model="BrandInfor.brandName" placeholder="" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="sort" label="排序：">
          <el-input size="small" v-model="BrandInfor.sort" placeholder="默认100，值越小越靠前"></el-input>
        </el-form-item>
        <el-row type="flex" justify="end">
          <el-form-item style="margin-bottom: 0px;">
            <el-button size="small" @click="addBrandDia = false">取消</el-button>
            <el-button size="small" type="primary" @click="saveAdd" v-if="brandDiaTitle=='新增品牌'">保存</el-button>
            <el-button size="small" type="primary" @click="saveEditor" v-else>保存</el-button>
          </el-form-item>
        </el-row>
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
          
        } else if(this.rowData.brandName!==this.BrandInfor.brandName){
          let json_obj=JSON.stringify({brandName:this.BrandInfor.brandName})
          setTimeout(() => {
            this.$ajaxPost('wms/brand/select.do', {reqParam: json_obj}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前面品牌名称已存在，不可重复添加'))
              } else {
                callback()
              }
            })
          }, 10)
        }else{
          callback();
        }
      };
      return{
        ids:[],  //选中的id
        brandList:[],
        addBrandDia:false,
        brandDiaTitle:'新增品牌',
        filterParam:{
          keyword:'',
        },
        searchWay:0,
        BrandInfor:{  //新增，编辑品牌
          id:'',
          brandName:'',
          sort:'',
        },
        BrandRule:{
          brandName:[{required: true, trigger: 'change', validator: nameReg}],
          sort:[{trigger: 'change', validator: this.$Util.RegExp.pureSort}],
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
      //获取所有品牌
      getBrandList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/brand/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.brandList=data.data.dataList
            this.total=data.data.totalNum
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //新增品牌
      addBrandBtn(){
        this.addBrandDia=true;
        this.brandDiaTitle='新增品牌'
      },
      //保存新增
      saveAdd(){
        this.$refs.BrandRef.validate((valid) => {
          if (valid) {
            let json_BrandInfor=JSON.stringify(this.BrandInfor)
            this.$ajaxPost('wms/brand/add.do',{reqParam:json_BrandInfor}).then(({data})=>{
              if(data.code==200){
                this.$message.success('新增品牌成功')
                this.param.pageNum=1
                this.param.pageSize=15
                this.addBrandDia=false;
                this.getBrandList();
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //删除
      deleteRow(row){
        this.$confirm('删除品牌后，不可恢复，请谨慎操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param=JSON.stringify({ids:row.id,status:'-2'})
          this.$ajaxPost('wms/brand/updateBatchStatus.do',{reqParam:param}).then(({data})=>{
            if(data.code==200){
              this.$message.success('删除品牌成功')
              this.param.pageNum=1
              this.param.pageSize=15
              this.getBrandList();
            }else{
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      //编辑
      editorRow(row){
        for( let key in this.BrandInfor){
          if(row[key]!=null){
            this.BrandInfor[key]=row[key]
          }
        }
        this.addBrandDia=true;
        this.brandDiaTitle='编辑品牌'
        this.rowData=row
      },
      //保存编辑
      saveEditor(){
        this.$refs.BrandRef.validate((valid) => {
          if (valid) {
            let json_BrandInfor=JSON.stringify(this.BrandInfor)
            this.$ajaxPost('wms/brand/update.do',{reqParam:json_BrandInfor}).then(({data})=>{
              if(data.code==200){
                this.$message.success('修改品牌成功')
                this.addBrandDia=false;
                this.getBrandList();
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
        this.getBrandList();
      },
      //选择多条数据
      handleSelectionChange(val){
        this.ids = val.map(item => {
          return item.id
        });
      },
      //关闭表单时重置
      resetRules(val) {
        this.$refs.BrandRef.resetFields();
        Object.keys(this.BrandInfor).forEach(key => {
          this.BrandInfor[key] = '';
        });
      },
      //每页数量改变
      sizeChange(v) {
        this.param.pageSize = v;
        this.getBrandList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getBrandList();
      },
    },
    components: {},
    mounted() {
      this.getBrandList();
    }
  }
</script>