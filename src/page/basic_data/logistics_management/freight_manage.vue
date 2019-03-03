<template>
  <div class="freight_manage">
    <header class="top-head">
      <el-button size="small" @click="addFreight" class="total">新增</el-button>
      <el-button size="small" @click="deleteFreight" >删除</el-button>
      <el-button size="small" @click="startFreight" >启用</el-button>
      <el-button size="small" @click="forbidFreight" >禁用</el-button>
      <div class="header-right f-fr">
        <search placeholder="请输入运费模板名称，ID，进行搜索" @on-search="qSearch" :width="'280px'" :showIcon="false" ref="qSearch" style="width:310px"></search>
        <el-button size="small" @click="goSearch" class="total">高级搜索</el-button>
      </div>
    </header>
    <el-table ref="freightList" border :data="freightList" height="500px" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="44"></el-table-column>
      <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="checkDetail(scope.row)" style="color:#39b9fe;">查看详情</el-button>
          <el-button size="small" type="text" @click="startRow(scope.row)" v-if="scope.row.status=='-1'">启用</el-button>
          <el-button size="small" type="text" @click="forbidRow(scope.row)" v-if="scope.row.status=='0'">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="id" label="运费模板ID"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="tplName" label="运费模板名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="logcompName" label="所属物流商"></el-table-column>
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
    <el-dialog title="高级筛选" :visible.sync="advancedFilter"  :modal-append-to-body="false">
      <el-form :model="filterParam" label-width="90px" size="small">
        <el-form-item prop="status" label="状态：">
          <el-select size="small" v-model="filterParam.status" placeholder="请选择" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="concelTerm">清空条件</el-button>
          <el-button size="small" @click="submitSearch" class="total">查询</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="addFreightTitle" :visible.sync="addFreightDia"  :modal-append-to-body="false" @close="resetAdd" class="addFreight">
      <el-form :model="freightInfor" label-width="110px" ref="freightRef" :rules="freightRule">
        <div class="subTitle">基本信息</div>
        <el-form-item prop="tplName" label="模板名称：">
          <el-input style="width:280px;" size="small" v-model="freightInfor.tplName" placeholder="请输入模板名称" maxlength="10"  clearable></el-input>
        </el-form-item>
        <el-form-item prop="logcompId" label="所属物流商：">
          <el-select style="width:280px;" size="small" v-model="freightInfor.logcompId" placeholder="请选择物流商"  clearable @change="selectLog">
            <template v-for="(item,index) in LogisticList">
              <el-option :label="item.logcompName" :value="item.id" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="sort" label="排序：">
          <el-input style="width:280px;" size="small" v-model="freightInfor.sort"  maxlength="4" placeholder="默认100，值越小越靠前" clearable></el-input>
        </el-form-item>
        <div class="subTitle">运费信息</div>
        <el-form-item prop="tplType" label="计费方式：" style="width: 100%;">
          <el-radio-group v-model="freightInfor.tplType" @change='checkRadio'>
            <el-radio label="1">按首重续重/按首件续件</el-radio>
            <el-radio label="2">按区间重量</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="type1" v-if="freightInfor.tplType=='1'">
          <el-form-item label-width="0" style="width:100%">
            <el-table :data="weightList" border style="width:871px;">
              <el-table-column class-name="columnName" align="center" prop="province_tags" label="区域" width="230px">
                <template slot-scope="scope">
                  <div @click="checkProvince1(scope)" style="min-width:200px;min-height: 32px; ">
                    <el-tag v-for="(tag,index) in scope.row.provinceIds" :key="tag.regionName" closable @close="deleteProvince1(scope,index)">{{tag.regionName}}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="type" label="计费规则" width="156px">
                <template slot-scope="scope">
                  <el-select size="small" v-model="scope.row.type">
                    <el-option label="按首重续重" value="1"></el-option>
                    <el-option label="按首件续件" value="2"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="priority" label="首重（kg）/首件" >
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.priority" maxlength="6"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="priorityPrice" label="首重/件价格（元）" >
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.priorityPrice" maxlength="6"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="renewal" label="续重（kg）/续件" >
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.renewal" maxlength="6"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="renewalPrice" label="续重/件价格(元)" >
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.renewalPrice" maxlength="6"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center">
                <template slot-scope="scope">
                  <el-button size="small" type="text" class="el-icon-delete" style="font-size:20px;padding:0 5px;" v-if="scope.$index>0" @click="removeRow1(scope)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <p class="el-form-item__error" v-if="priorityRule">{{priorityRuleError}}</p>
          </el-form-item>
          <el-row style="display: flex;align-items: center;margin-top: 20px">
            <el-button size="small" icon="el-icon-plus" style="height: 40px;font-size: 25px;" @click="addRow1"></el-button>
            <span style="height: 40px;line-height: 40px;display: inline-block;margin-left: 10px;">新增一行</span>
          </el-row>
        </div>
        <div class="type2" v-else>
          <el-form-item prop="provinceIdList" label="区域：" style="width: 100%">
            <div @click="checkProvince2" style="min-height: 40px; ">
              <el-tag v-for="(tag,index) in freightInfor.provinceIdList" :key="tag.regionName" closable  @close="deleteProvince2(index)">{{tag.regionName}}</el-tag>
            </div>
            <div class="el-form-item__error" v-if="provinceReg">请至少选择一个省份</div>
          </el-form-item>
          <el-form-item label-width="0" style="width:100%">
            <el-table :data="sectionList" border style="width:871px;" >
              <el-table-column align="center"  prop="endWeight"  label="重量区间（kg）">
                <template slot-scope="scope">
                  <span style="min-width: 20px;display: inline-block">{{scope.row.startWeight}}</span>
                  <span style="margin: 0 30px;">至</span>
                  <el-input size="small" v-model="scope.row.endWeight" style="width: 120px;text-align: center" maxlength="10"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="intrulePrice"  label="价格（元）"  >
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.intrulePrice" style="width: 120px" maxlength="10"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center">
                <template slot-scope="scope">
                  <el-button size="small" type="text" class="el-icon-delete" style="font-size:20px;padding:0 5px;" v-if="scope.$index>0" @click="removeRow2(scope)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <p class="el-form-item__error" v-if="intervalRule">{{intervalRuleError}}</p>
          </el-form-item>
          <el-row style="display: flex;align-items: center;margin-top: 20px">
            <el-button size="small" icon="el-icon-plus" style="height: 40px;font-size: 25px;" @click="addRow2"></el-button>
            <span style="height: 40px;line-height: 40px;display: inline-block;margin-left: 10px;">新增一行</span>
          </el-row>
        </div>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click='concelSubmit'>取消</el-button>
          <el-button size="small" @click="saveAdd" v-if="addFreightTitle=='新增运费模板'" class="total">保存</el-button>
          <el-button size="small" @click="saveEdit" v-if="addFreightTitle=='编辑运费模板'" class="total">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="省份" :visible.sync="provinceDia"  :modal-append-to-body="false"  @close="resetProvince">
      <template v-for="item in provinceList">
        <el-checkbox v-model="item.isChecked" :label="item" :disabled="item.disabled" :key="item.id">{{item.regionName}}</el-checkbox>
      </template>
      <el-row style="text-align:right;">
        <el-button size="small" @click="concelEdit">取消</el-button>
        <el-button size="small" @click="saveprovince1" v-if="freightInfor.tplType=='1'" class="total">保存</el-button>
        <el-button size="small" @click="saveprovince2" v-if="freightInfor.tplType=='2'" class="total">保存</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props:{},
    data(){
      const nameReg = (rule, value, callback) => {
        let v = value.toString().trim();
        let flag = /^[0-9]|[1-9]{1,3}$/.test(v);
        if(v){
          if (!flag) {
            if (callback) callback(new Error('请输入0-9999的整数'));
          }else {
            callback();
          }
        }else {
          callback();
        }
       
      };
      const tplNameReg = (rule, value, callback) => {
        let v = value.toString().trim();
        if (v.length <2 || v.length > 10) {
          if (callback) callback(new Error('请输入2-10个字'));
        }else if(this.FreightRow.tplName!==this.freightInfor.tplName){
          let param = JSON.stringify({tplName: this.freightInfor.tplName})
          setTimeout(() => {
            this.$ajaxPost('wms/expfeeTpl/select.do', {reqParam: param}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前模板名称已存在，不可重复添加'))
              } else {
                callback()
              }
            })
          }, 10)
        }else{
          callback();
        }
      };
      const logcompIdReg = (rule, value, callback) => {
        let v = value.toString().trim();
        if (v) {
          if(this.FreightRow.logcompId!==this.freightInfor.logcompId){
            let param = JSON.stringify({logcompId: this.freightInfor.logcompId})
            setTimeout(() => {
              this.$ajaxPost('wms/expfeeTpl/select.do', {reqParam: param}).then(({data}) => {
                if (data.code == 200 && data.data) {
                  callback(new Error('当前物流商已存在运费模板，不可重复添加'))
                } else {
                  callback()
                }
              })
            }, 10)
          }else{
            callback();
          }
        }else{
          if (callback) callback(new Error('请选择物流商'));
        }
      };
      // const provinceReg = (rule, value, callback) => {
      //   let v = value.toString().trim();
      //   console.log(this.freightInfor.tplType);
        
      //   if(this.freightInfor.tplType=='2'){
      //     if (v.length==0) {
      //       if (callback) callback(new Error('请至少选择一个省份'));
      //     }else {
      //       callback();
      //     }
      //   }else{
      //     callback();
      //   }
      // };
      return{
        ids:[],
        freightList:[],
        advancedFilter:false,
        addFreightDia:false,
        addFreightTitle:'新增运费模板',
        provinceDia:false, //选择省份的弹框
        searchWay:0,
        filterParam:{
          status:'',
        },
        LogisticList:[], //物流商列表
        freightInfor:{  //新增，编辑运费运费模板
          id:'',
          logcompId:'',
          logcompName:'',
          sort:'',
          tplName:'',
          tplType:'1',
          priorityRuleList:[],
          intervalRuleList:[],
          provinceIdList:[],  //区域id列表（区间重量规则时的区域）
        },
        provinceReg:false,
        FreightRow:{},  //点击编辑运费模板时，那一行的数据
        freightRule:{
          logcompId:[{required: true, trigger: 'change', validator: logcompIdReg}],
          sort:[{trigger: 'change', validator: nameReg}],
          tplName:[{required: true, trigger: 'blur', validator: tplNameReg}],
          provinceIdList:[{required: true, trigger: 'change', message:'请至少选择一个省份'}],
        },
        priorityRule:false,   //tplType为1时数据是否合法
        priorityRuleError:'',  //tplType1不合法提示
        judgeStatus1:false,

        intervalRule:false,
        intervalRuleError:'', 
        judgeStatus2:false,

        edFreight:{
          ids:'',
          status:'-2',
        },
        //按首重计费
        weightList:[
          {provinceIds:[],type:'1',priority:0.0,priorityPrice:0.0,renewal:0.0,renewalPrice:0.0}
          ],
        //选择是哪一行
        isCheckedRow:{
          rowIndex:'',
          tags:[],
        },
        //按区间计费
        sectionList:[
          {startWeight:0.00,endWeight:0.00,intrulePrice:0}
        ],
        //省份列表
        provinceList:[],
        //已选省份列表
        isCheckedList:[],
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
        this.$ajaxPost('wms/expfeeTpl/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.freightList=data.data.dataList
            this.total=data.data.totalNum
          }else{
            this.$message.error(data.msg);
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
      //选取物流商
      selectLog(val){
        if(val){
          this.LogisticList.forEach(item=>{
            if(item.id==val){
              this.freightInfor.logcompName=item.logcompName
            }
          })
        }else{
          this.freightInfor.logcompName=''
        }
      },
      //新增运费模板
      addFreight(){
        this.addFreightDia=true;
        this.addFreightTitle='新增运费模板'
      },
      //选择计费方式时
      checkRadio(val){
        // if(val=='1'){
        //   this.freightInfor.intervalRuleList=[];
        //   this.freightInfor.provinceIdList=[];
        //   this.sectionList=[{startWeight:0.00,endWeight:0.00,intrulePrice:0}];
        // }else{
        //   this.freightInfor.priorityRuleList=[];
        //   this.weightList=[{provinceIds:[],type:'1',priority:0.0,priorityPrice:0.0,renewal:0.0,renewalPrice:0.0}];
        //   this.judgeStatus1=false
        //   this.priorityRule=false
        //   this.intervalRule=false;
        //   this.judgeStatus2=false;
        // }
      },
      //保存新增
      saveAdd(){
        this.$refs.freightRef.validate((valid) => {
          if (valid) {
            if(this.freightInfor.tplType=='1'){
              this.freightInfor.priorityRuleList=this.weightList;
              this.freightInfor.intervalRuleList=[];
              this.freightInfor.provinceIdList=[];
              this.judgeAddRow1();
            }else{
              if(this.freightInfor.provinceIdList.length>0){
                this.provinceReg=false;
              }else{
                this.provinceReg=true;
              }
              this.freightInfor.priorityRuleList=[];
              this.freightInfor.intervalRuleList=this.sectionList;
              this.judgeAddRow2();
            }
            if(this.judgeStatus1||this.judgeStatus2 ){
              if(!this.provinceReg){
                let json_freightInfor=JSON.stringify(this.freightInfor)
                this.$ajaxPost('wms/expfeeTpl/add.do',{reqParam:json_freightInfor}).then(({data})=>{
                  if(data.code==200){
                    this.$message.success('添加成功')
                    this.param.pageNum=1;
                    this.param.pageSize=15
                    this.addFreightDia=false;
                    this.priorityRule=false;
                    this.intervalRule=false;
                    this.getTemplateList();
                  }else{
                    this.$message.error(data.msg);
                  }
                })
              }
            }else{
              this.priorityRule=true;
              this.intervalRule=true;
            }
            
          }else{
            return false
          }
        })
      },
      //关闭新增窗口时 表单时重置
      resetAdd(val) {
        this.$refs.freightRef.resetFields();
        Object.keys(this.freightInfor).forEach(key => {
          this.freightInfor[key] = '';
        });
        this.freightInfor.tplType='1'

        this.freightInfor.provinceIdList=[];
        this.freightInfor.intervalRuleList=[];
        this.freightInfor.priorityRuleList=[];

        this.priorityRule=false;
        this.judgeStatus1=false
        this.intervalRule=false;
        this.judgeStatus2=false;
        this.weightList=[{provinceIds:[],type:'1',priority:0.0,priorityPrice:0.0,renewal:0.0,renewalPrice:0.0}]
        this.sectionList=[{startWeight:0.00,endWeight:0.00,intrulePrice:0}]
      },
      //删除
      deleteFreight(){
        if(this.ids.length>0){
          this.$confirm('删除模板后，不可恢复，请谨慎操作？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let logIds=this.ids.toString();
            this.edFreight.ids=logIds
            this.edFreight.status='-2'
            let json_edFreight=JSON.stringify(this.edFreight)
             this.$ajaxPost('wms/expfeeTpl/updateBatchStatus.do',{reqParam:json_edFreight}).then(({data}) => {
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
      startFreight(){
        if(this.ids.length>0){
          let logIds=this.ids.toString();
          this.edFreight.ids=logIds
          this.edFreight.status='0'
          let json_edFreight=JSON.stringify(this.edFreight)
          this.$ajaxPost('wms/expfeeTpl/updateBatchStatus.do',{reqParam:json_edFreight}).then(({data}) => {
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
      forbidFreight(){
        if(this.ids.length>0){
          let logIds=this.ids.toString();
          this.edFreight.ids=logIds
          this.edFreight.status='-1'
          let json_edFreight=JSON.stringify(this.edFreight)
          this.$ajaxPost('wms/expfeeTpl/updateBatchStatus.do',{reqParam:json_edFreight}).then(({data}) => {
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
        this.param.keyword='';
        this.$refs.qSearch.inputValue=''
        this.getTemplateList();
      },
      //按首重计费时新增一行
      addRow1(){
        this.judgeAddRow1();
        if(this.judgeStatus1){
          this.priorityRule=false;
          this.priorityRuleError=''
          this.weightList.push(
            {provinceIds:[],type:'1',priority:0.00,priorityPrice:0.00,renewal:0.00,renewalPrice:0.00}
          )
        }else{
          this.priorityRule=true;
        }
      },
      //移除一行
      removeRow1(scope){
        this.weightList.splice(scope.$index,1)
      },
      judgeAddRow1(){
        let status=true;
        for(var i=0;i<this.weightList.length;i++){
          var flag1 = /^(0\.\d{1,2}|[1-9]\d{0,1}|[1-9]\d{0,1}\.\d{1,2}|100|100.0|100.00)$/.test(this.weightList[i].priority);            //首重
          var flag2 = /^(0\.\d{1,2}|[1-9]\d{0,1}|[1-9]\d{0,1}\.\d{1,2}|100|100.0|100.00)$/.test(this.weightList[i].priorityPrice);       //首重价格
          var flag3 = /^(0\.\d{1,2}|[1-9]\d{0,1}|[1-9]\d{0,1}\.\d{1,2}|100|100.0|100.00)$/.test(this.weightList[i].renewal);             //续重
          var flag4 = /^(0\.\d{1,2}|[1-9]\d{0,1}|[1-9]\d{0,1}\.\d{1,2}|100|100.0|100.00)$/.test(this.weightList[i].renewalPrice);        //续重价格
          var flag5 = /^([1-9]\d{0,1}|100)$/.test(this.weightList[i].priority);        //首件
          var flag6 = /^([1-9]\d{0,1}|100)$/.test(this.weightList[i].renewal);        //续件
          if(this.weightList[i].provinceIds.length==0){
            this.priorityRuleError='请至少选择一个省份'
          }else{
            if(this.weightList[i].type=='1'){   //首重续重
              if(!flag1){
                this.priorityRuleError='首重，请输入大于0，小于等于100的数字，保留两位小数'
              }else if(!flag2){
                this.priorityRuleError='首重价格，请输入0-100的数字，保留两位小数'
              }else if(!flag3){
                this.priorityRuleError='续重，请输入大于0，小于等于100的数字，保留两位小数'
              }else if(!flag4){
                this.priorityRuleError='续重价格，请输入0-100的数字，保留两位小数'
              }
            }else{
              if(!flag5){
                this.priorityRuleError='首件信息，请输入1-100的整数'
              }else if(!flag2){
                this.priorityRuleError='首件价格，请输入0-100的数字，保留两位小数'
              }else if(!flag6){
                this.priorityRuleError='续件信息，请输入1-100的整数'
              }else if(!flag4){
                this.priorityRuleError='续件价格，请输入0-100的数字，保留两位小数'
              }
            }
          }
          if(this.weightList[i].provinceIds.length==0 || !flag1 || !flag2 || !flag3 || !flag4){
            status=false;
          }
        }
        if(status){
          this.judgeStatus1=true;
        }else{
          this.judgeStatus1=false;
        }
      },
      //type1去掉已选省份
      deleteProvince1(scope,index){
        this.weightList[scope.$index].provinceIds.splice(index,1);
      },
      //type1选择省份
      checkProvince1(scope){
        this.isCheckedRow.rowIndex=scope.$index
        this.isCheckedRow.tags=scope.row.provinceIds;
        //将已经被选中的省份禁用
        if(this.isCheckedRow.tags.length>0){
          for(let i=0;i<this.provinceList.length;i++){
            for(let t=0;t<this.isCheckedRow.tags.length;t++){
              if(this.provinceList[i].regionName == this.isCheckedRow.tags[t].regionName){
                this.$set(this.provinceList[i],'disabled',true)
                this.$set(this.provinceList[i],'isChecked',true)
                break;
              }else{
                this.$set(this.provinceList[i],'disabled',false)
                this.$set(this.provinceList[i],'isChecked',false)
              }
            }
          }
        }
        this.provinceDia=true;
      },
      //type1确认省份
      saveprovince1(){
        this.isCheckedList=[];
        let nameList=[];
        this.weightList[this.isCheckedRow.rowIndex].provinceIds.forEach(item=>{
          nameList.push(item.regionName)
        })
        this.weightList[this.isCheckedRow.rowIndex].provinceIds=[]
        for(let i=0;i<this.provinceList.length;i++){
          if(this.provinceList[i].isChecked){
            this.weightList[this.isCheckedRow.rowIndex].provinceIds.push({
              regionName:this.provinceList[i].regionName,
              regionId:this.provinceList[i].id,
            })
          }
        }
        this.provinceDia=false;
      },
      //取消
      concelEdit(){
        this.provinceDia=false;
      },
      //关闭省份选择时重置
      resetProvince(val){
        this.isCheckedList=[];
        for(let i=0;i<this.provinceList.length;i++){
          this.$set(this.provinceList[i],'isChecked',false)
          this.$set(this.provinceList[i],'disabled',false)
        }
      },
      //按首件计费时新增一行
      addRow2(){
        this.judgeAddRow2();
        if(this.judgeStatus2){
          this.intervalRule=false;
          this.priorityRuleError='';
          let last_num=this.sectionList[this.sectionList.length-1].endWeight
          this.sectionList.push({startWeight:last_num,endWeight:'',intrulePrice:1})
        }else{
          this.intervalRule=true;
        }
      },
       //移除一行
      removeRow2(scope){
        this.sectionList.splice(scope.$index,1)
      },
      judgeAddRow2(){
        let status=true;
        for(var i=0;i<this.sectionList.length;i++){
          let flag1 = /^([0-9]|[1-9]\d|[0-9]\.\d{1,2}|[1-9]\d\.\d{1,2}|100|100.0|100.00)$/.test(this.sectionList[i].endWeight);
          let flag2 = /^([0-9]|[1-9]\d|[0-9]\.\d{1,2}|[1-9]\d\.\d{1,2}|100|100.0|100.00)$/.test(this.sectionList[i].intrulePrice);
          if(!flag1){
            this.intervalRuleError='重量信息，请输入大于0，小于等于100的数字，保留两位小数 '
          }else if(this.sectionList[i].endWeight-this.sectionList[i].startWeight<=0){
            this.intervalRuleError='最大重量值需大于最小重量值'
          }
          if(!flag2){
            this.intervalRuleError='价格信息，请输入0-100的数字，保留两位小数  '
          }
          if(this.sectionList[i].endWeight-this.sectionList[i].startWeight <= 0 || !flag1 || !flag2){
            status=false;
          }
        }
        if(status){
          this.judgeStatus2=true;
        }else{
          this.judgeStatus2=false;
        }
      },
      //type2去掉已选省份
      deleteProvince2(index){
        this.freightInfor.provinceIdList.splice(index,1);
      },
      //type2选择省份
      checkProvince2(){
        //将已经被选中的省份禁用
        if(this.freightInfor.provinceIdList.length>0){
          for(let i=0;i<this.provinceList.length;i++){
            for(let t=0;t<this.freightInfor.provinceIdList.length;t++){
              if(this.provinceList[i].regionName == this.freightInfor.provinceIdList[t].regionName){
                this.$set(this.provinceList[i],'isChecked',true)
                this.$set(this.provinceList[i],'disabled',true)
                break;
              }else{
                this.$set(this.provinceList[i],'isChecked',false)
                this.$set(this.provinceList[i],'disabled',false)
              }
            }
          }
        }
        this.provinceDia=true;
      },
      //type2确认省份
      saveprovince2(){
        let nameList=[];
        this.freightInfor.provinceIdList.forEach(item=>{
          nameList.push(item.regionName)
        })
        this.freightInfor.provinceIdList=[]
        for(let i=0;i<this.provinceList.length;i++){
          if(this.provinceList[i].isChecked){
            this.freightInfor.provinceIdList.push({
              regionName:this.provinceList[i].regionName,
              regionId:this.provinceList[i].id,
            })
          }
        }
        this.provinceDia=false;
      },
      //查看详情
      checkDetail(row){
        this.addFreightTitle='编辑运费模板'
        for (let key in this.freightInfor){
          if(row[key]!=null){
            this.freightInfor[key]=row[key];
          }
        }
        this.FreightRow=row;
        if(this.freightInfor.tplType){
          this.freightInfor.tplType=this.freightInfor.tplType.toString()
        }
        this.freightInfor.provinceIdList=[];
        this.freightInfor.intervalRuleList=[];
        this.freightInfor.priorityRuleList=[];
        let ID={
          id:row.id,
        }
        let json_id=JSON.stringify(ID)
        this.$ajaxPost('wms/expfeeTpl/selectDetails.do',{reqParam:json_id}).then(({data})=>{
          if(data.code==200){
           if(row.tplType==1){
             this.weightList=data.data.priorityRuleList
             for(var i=0;i<this.weightList.length;i++){
               this.weightList[i].type=this.weightList[i].type+''
             }
           }else{
             this.sectionList=data.data.intervalRuleList
             this.freightInfor.provinceIdList=data.data.provinceIdList;
           }
            this.addFreightDia=true;
          }else{
            this.$message.error(data.msg);
          }
        })
      },
      //保存编辑
      saveEdit(){
         this.$refs.freightRef.validate((valid) => {
          if (valid) {
            if(this.freightInfor.tplType=='1'){
              this.freightInfor.priorityRuleList=this.weightList;
              this.freightInfor.intervalRuleList=[];
              this.freightInfor.provinceIdList=[];
              this.judgeAddRow1();
            }else{
              this.freightInfor.priorityRuleList=[];
              this.freightInfor.intervalRuleList=this.sectionList;
              this.judgeAddRow2();
            }
            if(this.judgeStatus1||this.judgeStatus2){
              let json_freightInfor=JSON.stringify(this.freightInfor)
              this.$ajaxPost('wms/expfeeTpl/update.do',{reqParam:json_freightInfor}).then(({data})=>{
                if(data.code==200){
                  this.$message.success('修改成功')
                  this.addFreightDia=false;
                  this.priorityRule=false;
                  this.intervalRule=false;
                  this.getTemplateList();
                }else{
                  this.$message.error(data.msg);
                }
              })
            }else{
              this.priorityRule=true;
              this.intervalRule=true;
            }
            
          }else{
            return false
          }
        })
      },
      //取消提交
      concelSubmit(){
        this.addFreightDia=false;

      },
      //启用
      startRow(row){
        this.edFreight.ids=row.id
        this.edFreight.status='0'
        let json_edFreight=JSON.stringify(this.edFreight)
        this.$ajaxPost('wms/expfeeTpl/updateBatchStatus.do',{reqParam:json_edFreight}).then(({data}) => {
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
        this.edFreight.ids=row.id
        this.edFreight.status='-1'
        let json_edFreight=JSON.stringify(this.edFreight)
        this.$ajaxPost('wms/expfeeTpl/updateBatchStatus.do',{reqParam:json_edFreight}).then(({data}) => {
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
      //获取所有的省
      getProvinceList(){
        let areaParam={
          type:"1",
          id:"0"
        }
        let json_areaParam=JSON.stringify(areaParam)
        this.$ajaxPost("wms/region/selectAll.do",{reqParam:json_areaParam}).then(({data})=>{
          if (data.code==200){
            data.data.forEach(item=>{
              this.provinceList.push({
                regionName:item.regionName,
                id:item.id,
              })
            })
          } else{
            this.$message.error(data.msg)
          }
        })
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
      this.getLogisticList();
      this.getProvinceList();
    }
  }
</script>

<style lang="scss">
  .freight_manage{
    .el-dialog__body .el-form{
      display: flex;
      flex-wrap: wrap;
      .el-form-item{
        width: 48%;
      }
    }
  }
  #app .addFreight .el-dialog{
    width: 900px;
     .el-table__body .el-table__row td .cell{
       padding: 10px;
    }
  }
  #app .columnName .cell>div{
    overflow: auto;
    padding: 10px;
    margin: 0 -10px 0 -10px;
  }
</style>
