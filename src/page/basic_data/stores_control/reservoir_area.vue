<template>
    <div class="reservoir_area">
      <header class="top-head">
        <el-button @click="addReservoirBtn" class="total" size="small">新增</el-button>
        <el-button @click="deleteReservoir" class="total" size="small">删除</el-button>
        <el-button @click="startStores" class="total" size="small">启用</el-button>
        <el-button @click="forbidStores" class="total" size="small">禁用</el-button>
        <div class="header-right f-fr">
          <search placeholder="请输入库区名称，编码，进行搜索" @on-search="qSearch" :showIcon="false" ref="qSearch" :width="'280px'" style="width:310px"></search>
          <el-button @click="goSearch" class="total" size="small">高级搜索</el-button>
        </div>
      </header>
      <el-table ref="reservoirList" border :data="reservoirList" height="500px" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="44"></el-table-column>
        <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
        <el-table-column align="center" prop="name" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="checkDetail(scope.row)" style="color:#39b9fe;" size="small">查看详情</el-button>
            <el-button type="text" @click="startRow(scope.row)" v-if="scope.row.status=='-1'" size="small">启用</el-button>
            <el-button type="text" @click="forbidRow(scope.row)" v-if="scope.row.status=='0'" size="small">禁用</el-button>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="stoareaCode" label="库区编码"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="stoareaName" label="库区名称"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="typeName" label="库区类型"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="sort" label="排序"></el-table-column>
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
        <el-form :model="filterParam" label-width="90px" >
          <el-form-item prop="status" label="状态：">
            <el-select v-model="filterParam.status" placeholder="请选择" size="small">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" value="0"></el-option>
              <el-option label="禁用" value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="type" label="库区类型：">
            <el-select v-model="filterParam.type" placeholder="请选择" size="small">
              <template v-for="(item,index) in ReservoirTypeList">
                <el-option :label="item.itemName" :value="item.itemValue" :key="index"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item style="width:100%;text-align:right;">
            <el-button @click="concelTterm" size="small">清空条件</el-button>
            <el-button @click="submitSearch" class="total" size="small">查询</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog :title="areaInforTitle" :visible.sync="addReservoirdio"  :modal-append-to-body="false" class="filterParam"  @close="resetAdd">
        <el-form :model="areaInfor" label-width="120px" :rules="areaInforRule" ref="areaInforRef">
          <el-form-item prop="stoareaCode" label="库区编码：">
            <el-input size="small" v-model="areaInfor.stoareaCode" placeholder="不填写时，系统自动生成" maxlength="1" :disabled="areaInforTitle=='编辑库区'"></el-input>
          </el-form-item>
          <el-form-item prop="stoareaName" label="库区名称：">
            <el-input size="small" v-model="areaInfor.stoareaName" placeholder="" minlength="2" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item prop="type" label="库区类型：">
            <el-select size="small" v-model="areaInfor.type" placeholder="请选择">
              <template v-for="(item,index) in ReservoirTypeList">
                <el-option :label="item.itemName" :value="item.itemValue" :key="index"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="sort" label="排序：">
            <el-input size="small" v-model="areaInfor.sort" placeholder="默认100，值越小越靠前" maxlength="4"></el-input>
          </el-form-item>
          <el-form-item style="width:100%;text-align:right;">
            <el-button @click="concelSubmit"  size="small">取消</el-button> 
            <el-button @click="saveAddBtn" v-if="areaInforTitle=='新增库区'" class="total" size="small">保存</el-button>
            <el-button @click="saveEditBtn" v-if="areaInforTitle=='编辑库区'" class="total" size="small">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    props:{},
    data(){
      const baseReg = (rule, value, callback) => {
        let v = value.toString().trim();
        let flag = /^[A-Z]$/.test(v);
        if(v){
          if (!flag) {
            if (callback) callback(new Error('请输入1个大写字母'));
          } else if(this.AreaRow.stoareaCode!==this.areaInfor.stoareaCode) {
            let param = JSON.stringify({stoareaCode: this.areaInfor.stoareaCode})
            setTimeout(() => {
              this.$ajaxPost('wms/storehouseArea/select.do', {reqParam: param}).then(({data}) => {
                if (data.code == 200 && data.data) {
                  callback(new Error('当前库区编码已存在，不可重复添加'))
                } else {
                  callback()
                }
              })
            }, 10)
          }else{
            callback();
          }
        }else{
          if(this.areaInforTitle=='新增库区'){
            callback();
          }else{
            if (callback) callback(new Error('请输入1个大写字母'));
          }
        }
      };
      const nameReg = (rule, value, callback) => {
        let v = value.toString().trim();
        if (v.length<2||v.length>10) {
          if (callback) callback(new Error('请输入2-10个字'));
        }else if(this.AreaRow.stoareaName!==this.areaInfor.stoareaName) {
          let param = JSON.stringify({stoareaName: this.areaInfor.stoareaName})
          setTimeout(() => {
            this.$ajaxPost('wms/storehouseArea/select.do', {reqParam: param}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前库区名称已存在，不可重复添加'))
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
        reservoirList:[],
        advancedFilter:false,
        addReservoirdio:false,
        ReservoirType:{
          typeName: "库区类型",
        },
        ReservoirTypeList:[],
        filterParam:{
          status:'',
          type:'',
        },
        searchWay:0,
        areaInfor:{  //新增，编辑仓库
          id:'',  
          stoareaCode:'',
          stoareaName:'',
          type:'',
          sort:'',
        },
        areaInforTitle:'新增库区',
        AreaRow:[],   //点击编辑库区时获取那一行的数据
        areaInforRule:{
          stoareaCode:[{trigger: 'blur', validator: baseReg}],
          stoareaName:[{required: true, trigger: 'blur', validator: nameReg}],
          sort: [{trigger: 'change', validator: this.$Util.RegExp.pureSort}],
        },
         edArea:{
          ids:'',
          status:'-2',
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
      //获取所有库区
      getReservoirList(param){
        param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/storehouseArea/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.reservoirList=data.data.dataList
            this.total=data.data.totalNum
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
      //新增库区
      addReservoirBtn(){
        this.addReservoirdio=true;
        this.areaInforTitle='新增库区';
      },
      //保存新增
      saveAddBtn(){
        this.$refs.areaInforRef.validate((valid) => {
          if (valid) {
            let json_areaInfor=JSON.stringify(this.areaInfor)
            this.$ajaxPost('wms/storehouseArea/add.do',{reqParam:json_areaInfor}).then(({data})=>{
              if(data.code==200){
                this.$message.success('新增库区成功')
                this.param.pageNum=1;
                this.param.pageSize=15
                this.addReservoirdio=false;
                this.getReservoirList();
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //关闭新增窗口时 表单时重置
      resetAdd(val) {
        this.$refs.areaInforRef.resetFields();
        Object.keys(this.areaInfor).forEach(key => {
          this.areaInfor[key] = '';
        });
      },
      //取消
      concelSubmit(){
        this.addReservoirdio=false;
      },
      //删除
      deleteReservoir(){
        if(this.ids.length>0){
          this.$confirm('删除库区后，不可恢复，请谨慎操作？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let logIds=this.ids.toString();
            this.edArea.ids=logIds
            this.edArea.status='-2'
            let json_edAreat=JSON.stringify(this.edArea)
             this.$ajaxPost('wms/storehouseArea/updateBatchStatus.do',{reqParam:json_edAreat}).then(({data}) => {
               if (data.code == 200) {
                 this.$message.success('删除成功');
                 this.param.pageNum=1;
                 this.param.pageSize=15
                 this.getReservoirList();
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
      startStores(){
        if(this.ids.length>0){
          let logIds=this.ids.toString();
          this.edArea.ids=logIds
          this.edArea.status='0'
          let json_edAreat=JSON.stringify(this.edArea)
          this.$ajaxPost('wms/storehouseArea/updateBatchStatus.do',{reqParam:json_edAreat}).then(({data}) => {
            if (data.code == 200) {
              this.$message.success('启用成功');
              this.getReservoirList();
            } else {
              this.$message.error(data.msg);
            }
          })
        }else{
          this.$message.warning('请至少选择一条数据')
        }
      },
      //禁用
      forbidStores(){
        let logIds=this.ids.toString();
        this.edArea.ids=logIds
        this.edArea.status='-1'
        let json_edAreat=JSON.stringify(this.edArea)
        this.$ajaxPost('wms/storehouseArea/updateBatchStatus.do',{reqParam:json_edAreat}).then(({data}) => {
          if (data.code == 200) {
            this.$message.success('禁用成功');
            this.getReservoirList();
          } else {
            this.$message.error(data.msg);
          }
        })
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
        this.getReservoirList()
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
        this.getReservoirList()
        this.advancedFilter=false;
      },
      //清空搜索条件
      concelTterm(){
        this.param.pageNum=1;
        this.param.pageSize=15
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        this.param.keyword='';
        this.$refs.qSearch.inputValue=''
        this.getReservoirList();
      },
      //查看详情
      checkDetail(row){
        this.areaInforTitle='编辑库区'
        this.addReservoirdio=true;
        for(let key in this.areaInfor){
          if(row[key]!=null){
            this.areaInfor[key]=row[key]
          }
        }
        this.AreaRow=row
      },
      //保存编辑
      saveEditBtn(){
        this.$refs.areaInforRef.validate((valid) => {
          if (valid) {
             let json_areaInfor=JSON.stringify(this.areaInfor)
            this.$ajaxPost('wms/storehouseArea/update.do',{reqParam:json_areaInfor}).then(({data})=>{
              if(data.code==200){
                this.$message.success('编辑库区成功')
                this.addReservoirdio=false;
                this.getReservoirList();
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //启用
      startRow(row){
        this.edArea.ids=row.id;
        this.edArea.status='0'
        let json_edAreat=JSON.stringify(this.edArea)
        this.$ajaxPost('wms/storehouseArea/updateBatchStatus.do',{reqParam:json_edAreat}).then(({data}) => {
          if (data.code == 200) {
            this.$message.success('启用成功');
            this.getReservoirList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      //禁用
      forbidRow(row){
        this.edArea.ids=row.id;
        this.edArea.status='-1'
        let json_edAreat=JSON.stringify(this.edArea)
        this.$ajaxPost('wms/storehouseArea/updateBatchStatus.do',{reqParam:json_edAreat}).then(({data}) => {
          if (data.code == 200) {
            this.$message.success('禁用成功');
            this.getReservoirList();
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
        this.getReservoirList();
      },
      //当前页改变
      currentChange(v) {
        this.param.pageNum = v;
        this.getReservoirList();
      },
    },
    components: {},
    mounted() {
      this.getReservoirList();
      this.getReservoirType();
    }
  }
</script>

<style lang='scss'>

 
</style>
