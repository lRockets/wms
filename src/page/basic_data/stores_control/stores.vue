<template>
    <div class="stores">
      <header class="top-head">
        <el-button @click="addStores" class='total' size="small">新增</el-button>
        <el-button @click="deleteStores" class='total' size="small">删除</el-button>
        <el-button @click="startStores" class='total' size="small">启用</el-button>
        <el-button @click="forbidStores" class='total' size="small">禁用</el-button>
        <div class="header-right f-fr">
          <search placeholder="请输入仓库名称，编码，进行搜索" @on-search="qSearch" :showIcon="false" ref="qSearch" :width="'280px'" style="width:310px"></search>
          <el-button @click="goSearch" class='total' size="small">高级搜索</el-button>
        </div>
      </header>
      <el-table ref="storesList" :data="storesList" height="500px" border @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="44"></el-table-column>
        <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
        <el-table-column align="center" prop="name" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="checkDetail(scope.row)" style='color:#39b9fe;' size="small">查看详情</el-button>
            <el-button type="text" @click="startRow(scope.row)" v-if="scope.row.status=='-1'" size="small">启用</el-button>
            <el-button type="text" @click="forbidRow(scope.row)" v-if="scope.row.status=='0'" size="small">禁用</el-button>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="storehouseCode" label="仓库编码" width="120"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="storehouseName" label="仓库名称" width="120"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="provinceName" label="省"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="cityName" label="市"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="districtName" label="区"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="address" label="详细地址" width="200"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="contactName" label="联系人"></el-table-column>
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
      <el-dialog title="高级筛选" :visible.sync="advancedFilter"  :close-on-click-modal='false' class="filterParam">
        <el-form :model="filterParam" label-width="100px">
          <el-form-item prop="status" label="状态：">
            <el-select v-model="filterParam.status" placeholder="请选择" size="small">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" value="0"></el-option>
              <el-option label="禁用" value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width:100%;text-align:right;">
            <el-button @click="concelTerm" size="small">清空条件</el-button>
            <el-button @click="confirmSearch" class='total' size="small">查询</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog :title="storeInforTitle" :visible.sync="addStoreDia"  :modal-append-to-body="false" @close="resetForm" class='tStorehouse'>
        <el-form :model="storeInfor" :rules="storeInforRule" label-width="130px" ref="storeInforRef" size="small">
          <div class="subTitle">基本信息</div>
          <div class="thisRow_base">
            <el-form-item prop="storehouseCode" label="仓库编码：" >
              <el-input size="small"  v-model="storeInfor.storehouseCode" placeholder="不填写时，系统自动生成" maxlength="10" style="maxl"></el-input>
            </el-form-item>
            <el-form-item prop="storehouseName" label="仓库名称：">
              <el-input size="small" v-model="storeInfor.storehouseName" placeholder="" maxlength="20" style="width:280px"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="仓库地址：" class="city" prop="districtId">
            <div class="addressChoice">
              <el-select size="small"  v-model="storeInfor.provinceId" placeholder="请选择省"  clearable @change="checkProvince">
                <template v-for="(item,index) in provinceList">
                  <el-option :label="item.regionName" :value="item.id" :key="index"></el-option>
                </template>
              </el-select>
              <el-select size="small" v-model="storeInfor.cityId" placeholder="请选择市"  clearable @change="getCityList">
                <template v-for="(item,index) in cityList">
                  <el-option :label="item.regionName" :value="item.id" :key="index"></el-option>
                </template>
              </el-select>
              <el-select size="small" v-model="storeInfor.districtId" placeholder="请选择区"  clearable @change="getDistrictList">
                <template v-for="(item,index) in districtList">
                  <el-option :label="item.regionName" :value="item.id" :key="index"></el-option>
                </template>
              </el-select>
          </div>
          </el-form-item>
          <el-form-item prop="address">
            <el-input size="small" v-model="storeInfor.address" placeholder="请输入详细地址：" minlength="5" maxlength="30"></el-input>
          </el-form-item>
          <div class="thisRow_base">
            <el-form-item prop="contactName" label="联系人：">
              <el-input size="small" v-model="storeInfor.contactName" placeholder="" style="width:280px"></el-input>
            </el-form-item>
            <el-form-item prop="contactPhone" label="联系电话：">
              <el-input size="small" v-model="storeInfor.contactPhone" placeholder="" maxlength="11" style="width:280px"></el-input>
            </el-form-item>
          </div>
          <el-form-item prop="note" label="备注：">
            <el-input size="small" v-model="storeInfor.note" style="width:280px" type="textarea" placeholder="请输入0-200字" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item prop="sort" label="排序：" style="width: 48%">
            <el-input size="small" v-model="storeInfor.sort" placeholder="默认100，值越小越靠前" maxlength="4"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model='tStorehouseLocation' :rules="tStorehouseRule" label-width="130px" ref="tStorehouseRef" size="small">
          <div class="subTitle">库位编码规则</div>
          <el-form-item prop="stoareaCodeRule" label="库区编码：">
            <el-select size="small" v-model="tStorehouseLocation.stoareaCodeRule" placeholder="请选择" style='width: 280px;' :disabled="isEdit">
              <el-option label="字母" value="0"></el-option>
            </el-select>
            <span class='note'>示例：库区编码为A、B、...... 、Z；</span>
          </el-form-item>
          <el-form-item prop="stochannelCodeRule" label="通道编码：">
            <el-select size="small" v-model="tStorehouseLocation.stochannelCodeRule" placeholder="请选择" style='width: 280px;' :disabled="isEdit">
              <el-option label="数字" value="1"></el-option>
              <el-option label="数字+数字" value="1;1"></el-option>
            </el-select>
            <span class='note'>示例：通道编码为01、02、...... 、99；</span>
          </el-form-item>
          <el-form-item prop="stoshelfCodeRule" label="货架编码：">
            <el-select size="small" v-model="tStorehouseLocation.stoshelfCodeRule" placeholder="请选择" style='width: 280px;' :disabled="isEdit">
              <el-option label="数字+数字" value="1;1"></el-option>
              <el-option label="字母+数字" value="0;1"></el-option>
              <el-option label="字母+数字+数字" value="0;1;1"></el-option>
            </el-select>
            <span class='note'>示例：通道编码为01、02、...... 、99；</span>
          </el-form-item>
          <el-form-item prop="layerCodeRule" label="层数编码：">
            <el-select size="small" v-model="tStorehouseLocation.layerCodeRule" placeholder="请选择" style='width: 280px;' :disabled="isEdit">
              <el-option label="数字" value="1"></el-option>
              <el-option label="字母" value="0"></el-option>
            </el-select>
            <span class='note'>示例：层数编码为1、2、...... 、9；</span>
          </el-form-item>
          <el-form-item prop="columnCodeRule" label="列数编码：">
            <el-select size="small" v-model="tStorehouseLocation.columnCodeRule" placeholder="请选择" style='width: 280px;' :disabled="isEdit">
              <el-option label="数字+数字" value="1;1"></el-option>
              <el-option label="字母+数字" value="0;1"></el-option>
            </el-select>
            <span class='note'>示例：列数编码为01、02、...... 、99；</span>
          </el-form-item>
          <el-form-item prop="palletCodeRule" label="托盘编码：">
            <el-select size="small" v-model="tStorehouseLocation.palletCodeRule" placeholder="请选择" style='width: 280px;' :disabled="isEdit">
              <el-option label="数字+数字" value="1;1"></el-option>
              <el-option label="字母+数字" value="0;1"></el-option>
              <el-option label="字母+数字+数字" value="0;1;1"></el-option>
            </el-select>
            <span class='note'>示例：通道编码为01、02、...... 、99；</span>
          </el-form-item>
          <el-form-item prop="layerRuleSuffix" label="货架库位编码：" >
            <el-row>
              <span>{库区}</span>
              <el-select size="small"  placeholder="请选择分隔符" style='width: 100px;margin: 0 10px;' v-model="tStorehouseLocation.stoareaRuleSuffix">
                <el-option label="无" value="无"></el-option>
                <el-option label="短横线【-】" value="-"></el-option>
                <el-option label="下划线【_】" value="_"></el-option>
                <el-option label="反斜杠【/】" value="/"></el-option>
              </el-select>
              <span>{通道}</span>
              <el-select size="small" placeholder="请选择分隔符" style='width: 100px;margin: 0 10px;' v-model="tStorehouseLocation.stochannelRuleSuffix">
                <el-option label="无" value="无"></el-option>
                <el-option label="短横线【-】" value="-"></el-option>
                <el-option label="下划线【_】" value="_"></el-option>
                <el-option label="反斜杠【/】" value="/"></el-option>
              </el-select>
              <span>{货架}</span>
              <el-select size="small" placeholder="请选择分隔符" style='width: 100px;margin: 0 10px;' v-model="tStorehouseLocation.stoshelfRuleSuffix">
                <el-option label="无" value="无"></el-option>
                <el-option label="短横线【-】" value="-"></el-option>
                <el-option label="下划线【_】" value="_"></el-option>
                <el-option label="反斜杠【/】" value="/"></el-option>
              </el-select>
              <span>{层数}</span>
              <el-select size="small" placeholder="请选择分隔符" style='width: 100px;margin: 0 10px;' v-model="tStorehouseLocation.layerRuleSuffix">
                <el-option label="短横线【-】" value="-"></el-option>
                <el-option label="下划线【_】" value="_"></el-option>
                <el-option label="反斜杠【/】" value="/"></el-option>
              </el-select>
              <span>{列数}</span>
            </el-row>
            <el-row><p class='note'>示例编码：A01-01-1/01（货架类型）</p></el-row>
          </el-form-item>
          <el-form-item prop="stochannelRuleSuffixPallet" label="托盘库位编码：">
            <el-row>
              <span>{库区}</span>
              <el-select size="small" placeholder="请选择分隔符" style='width: 100px;margin: 0 10px;' v-model="tStorehouseLocation.stoareaRuleSuffixPallet">
                <el-option label="无" value="无"></el-option>
                <el-option label="短横线【-】" value="-"></el-option>
                <el-option label="下划线【_】" value="_"></el-option>
                <el-option label="反斜杠【/】" value="/"></el-option>
              </el-select>
              <span>{通道}</span>
              <el-select size="small" placeholder="请选择分隔符" style='width: 100px;margin: 0 10px;' v-model="tStorehouseLocation.stochannelRuleSuffixPallet">
                <el-option label="无" value="无"></el-option>
                <el-option label="短横线【-】" value="-"></el-option>
                <el-option label="下划线【_】" value="_"></el-option>
                <el-option label="反斜杠【/】" value="/"></el-option>
              </el-select>
              <span>TP-{托盘}</span>
            </el-row>
            <el-row><p class='note'>示例编码：A01-TP-01（托盘类型） </p></el-row>
          </el-form-item>
          <el-form-item style="width:100%;text-align:right;">
            <el-button @click="concelEdit" size="small">取消</el-button>
            <el-button @click="saveAddBtn" v-if="!isEdit" class='total' size="small">保存</el-button>
            <el-button @click="saveEditBtn" v-if="isEdit" class='total' size="small">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
  // TODO form中的disable属性导致的样式异常
    export default {
      props:{},
      data(){
        const baseReg = (rule, value, callback) => {
          if(value){
            let v = value.toString().trim();
            if (v.length<1||v.length>10) {
              if (callback) callback(new Error('请输入1-10个字母/数字/符号'))
            } else if (this.storeRow.storehouseCode !== this.storeInfor.storehouseCode) {
              let param = JSON.stringify({storehouseCode: this.storeInfor.storehouseCode})
              setTimeout(() => {
                this.$ajaxPost('wms/storehouse/select.do', {reqParam: param}).then(({data}) => {
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
            if(this.storeInforTitle=='新增仓库'){
              callback()
            }else{
              if (callback) callback(new Error('请输入1-10个字母/数字/符号'))
            }
          }
        };
        const NameReg = (rule, value, callback) => {
          if(!value){
            return
          }
          let v = value.toString().trim();
          if (v.length<2||v.length>10){
            if (callback) callback(new Error('请输入2-10个字'));
          }else if(this.storeRow.storehouseName!==this.storeInfor.storehouseName){
            let param = JSON.stringify({storehouseName: this.storeInfor.storehouseName})
            setTimeout(() => {
              this.$ajaxPost('wms/storehouse/select.do', {reqParam: param}).then(({data}) => {
                if (data.code == 200 && data.data) {
                  callback(new Error('当前仓库名称已存在，不可重复添加'))
                } else {
                  callback()
                }
              })
            }, 10)
          }else{
            callback();
          }
        };
        const addressReg = (rule, value, callback) => {
          if(!value){
            callback(new Error('请输入5-30个字'));
            return
          }
          let v = value.toString().trim();
          if (v.length<5||v.length>30) {
            if (callback) callback(new Error('请输入5-30个字'));
          } else {
            callback();
          }
        };
        const layerReg = (rule, value, callback) => {
          if(!value){
            return
          }
          let v = value.toString().trim();
          if (this.tStorehouseLocation.stoareaRuleSuffix==''||this.tStorehouseLocation.stochannelRuleSuffix==''||
          this.tStorehouseLocation.stoshelfRuleSuffix==''||this.tStorehouseLocation.layerRuleSuffix=='') {
            if (callback) callback(new Error('请选择分隔符'));
          } else {
            callback();
          }
        };
        const stochannelReg = (rule, value, callback) => {
          if(!value){
            return
          }
          let v = value.toString().trim();
          if (this.tStorehouseLocation.stoareaRuleSuffixPallet==''||this.tStorehouseLocation.stochannelRuleSuffixPallet=='') {
            if (callback) callback(new Error('请选择分隔符'));
          } else {
            callback();
          }
        };
        return{
          ids:[],
          isEdit:false,
          storesList:[],
          advancedFilter:false,
          addStoreDia:false,
          filterParam:{
            status:'',
          },
          storeInforTitle:'新增仓库',
          searchWay:0,
          storeInfor:{  //新增，编辑仓库
            id:'',
            storehouseCode:'',
            storehouseName:'',
            provinceId:'',
            provinceName:'',
            cityId:'',
            cityName:'',
            districtId:'',
            districtName:'',
            address:'',
            contactName:'',
            note:'',
            sort:'',
            contactPhone:'',
            tStorehouseLocationRule:{},
          },
          storeInforRule:{
            storehouseCode:[{required:this.isEdit==true?true:false,trigger: 'change', validator: baseReg}],
            storehouseName:[{required: true, trigger: 'change', validator: NameReg}],
            districtId:[{required: true, trigger: 'change',message:'请选择完整的省市县信息'}],
            address:[{required: true, trigger: 'change',validator: addressReg}],
            contactName:[{required: true, trigger: 'change', validator: this.$Util.RegExp.pureName2}],
            contactPhone:[{required: true, trigger: 'change', validator: this.$Util.RegExp.dotPhone2}],
            sort:[{trigger: 'change', validator: this.$Util.RegExp.pureSort}],
            note:[{trigger: 'change', validator: this.$Util.RegExp.noteReg}],
          },
          tStorehouseLocation:{
            stoareaCodeRule:'',
            stochannelCodeRule:'',
            stoshelfCodeRule:'',
            layerCodeRule:'',
            columnCodeRule:'',
            palletCodeRule:'',
            stoareaRuleSuffix:'',
            stochannelRuleSuffix:'',
            stoshelfRuleSuffix:'',
            layerRuleSuffix:'',
            stoareaRuleSuffixPallet:'',
            stochannelRuleSuffixPallet:'',
          },
          tStorehouseRule:{
            stoareaCodeRule:[{required: true, trigger: 'change',message:'请选择库区编码'}],
            stochannelCodeRule:[{required: true, trigger: 'change',message:'请选择通道编码'}],
            stoshelfCodeRule:[{required: true, trigger: 'change',message:'请选择货架编码'}],
            layerCodeRule:[{required: true, trigger: 'change',message:'请选择层数编码'}],
            columnCodeRule:[{required: true, trigger: 'change',message:'请选择列数编码'}],
            palletCodeRule:[{required: true, trigger: 'change',message:'请选择托盘编码'}],
            layerRuleSuffix:[{required: true, trigger: 'blur',validator: layerReg}],
            stochannelRuleSuffixPallet:[{required: true, trigger: 'blur',validator: stochannelReg}],
          },
          storeRow:{},  //点击编辑仓库时，那一行的数据
          provinceList: [], //省
          cityList: [],     //市
          districtList: [],  //区
          areaParam:{
            type:"1",
            id:"0"
          },
          edStore:{   //批量更新状态
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
        //获取所有仓库
        getStoresList(param){
          param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay]);

          let json_param=JSON.stringify(param)
          this.$ajaxPost('wms/storehouse/selectPage.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              this.storesList=data.data.dataList
              this.total=data.data.totalNum
              // console.log(data)
            }else{
              this.$message.error(data.msg)
            }
          })
        },
        //新增仓库
        addStores(){
          this.isEdit=false;
          this.storeInforTitle='新增仓库';
          this.addStoreDia=true;
        },
        //保存新增
        saveAddBtn(){
          this.$refs.storeInforRef.validate((valid) => {
            if (valid) {
               this.$refs.tStorehouseRef.validate((valid) => {
                if (valid) {
                   let tStore=this.tStorehouseLocation
                  this.storeInfor.tStorehouseLocationRule=tStore
                  Object.keys(this.storeInfor.tStorehouseLocationRule).forEach(key => {
                    if(this.storeInfor.tStorehouseLocationRule[key]=='无'){
                      this.storeInfor.tStorehouseLocationRule[key]='';
                    }
                  });
                  let json_storeInfor=JSON.stringify(this.storeInfor)
                  this.$ajaxPost('wms/storehouse/add.do',{reqParam:json_storeInfor}).then(({data})=>{
                    if(data.code==200){
                      this.$message.success('新增仓库成功')
                      this.param.pageNum=1;
                      this.param.pageSize=15
                      this.addStoreDia=false;
                      this.getStoresList();
                    }else{
                      this.$message.error(data.msg)
                    }
                  })
                }
              })
            }
          })
        },
        //取消
        concelEdit(){
          this.addStoreDia=false;
        },
        //关闭表单时重置
        resetForm(){
          this.$refs.storeInforRef.resetFields();
          Object.keys(this.storeInfor).forEach(key => {
            this.storeInfor[key] = '';
          });
          this.$refs.tStorehouseRef.resetFields();
          Object.keys(this.tStorehouseLocation).forEach(key => {
            this.tStorehouseLocation[key] = '';
          });
          this.storeInfor.tStorehouseLocationRule={};
          this.cityList=[];
          this.districtList=[];
        },
        //删除
        deleteStores(){
          if(this.ids.length>0){
            this.$confirm('删除仓库后，不可恢复，请谨慎操作？', '删除仓库', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let idString=this.ids.toString();
              this.edStore.ids=idString
              this.edStore.status='-2'
              let json_id=JSON.stringify(this.edStore)
              this.$ajaxPost('wms/storehouse/updateBatchStatus.do',{reqParam:json_id}).then(({data}) => {
                if (data.code == 200) {
                  this.$message.success('删除成功');
                  this.param.pageNum=1;
                  this.param.pageSize=15
                  this.getStoresList()
                } else {
                  this.$message.error(data.msg);
                }
              })
            }).catch(() => {})
          }else{
            this.$message.error('请选择要删除的数据')
          }
        },
        //启用
        startStores(){
          if(this.ids.length>0){
            let idString=this.ids.toString();
            this.edStore.ids=idString
            this.edStore.status='0'
            let json_id=JSON.stringify(this.edStore)
            this.$ajaxPost('wms/storehouse/updateBatchStatus.do',{reqParam:json_id}).then(({data}) => {
              if (data.code == 200) {
                this.$message.success('启用成功');
                this.getStoresList()
              } else {
                this.$message.error(data.msg);
              }
            })
          }else{
            this.$message.error('请选择要启用的数据')
          }
        },
        //禁用
        forbidStores(){
          if(this.ids.length>0){
            let idString=this.ids.toString();
            this.edStore.ids=idString
            this.edStore.status='-1'
            let json_id=JSON.stringify(this.edStore)
            this.$ajaxPost('wms/storehouse/updateBatchStatus.do',{reqParam:json_id}).then(({data}) => {
              if (data.code == 200) {
                this.$message.success('禁用成功');
                this.getStoresList()
              } else {
                this.$message.error(data.msg);
              }
            })
          }else{
            this.$message.error('请选择要禁用的数据')
          }
        },
        //快速搜索
        qSearch(){
          this.param.pageNum=1;
          this.param.pageSize=15
          this.searchWay=0;
          this.param.keyword=this.$refs.qSearch.inputValue
          Object.keys(this.filterParam).forEach(key => {
            this.filterParam[key] = '';
          });
          this.getStoresList();
          this.advancedFilter=false;
        },
        //高级搜索
        goSearch(){
          this.advancedFilter=true;
        },
        confirmSearch(){
          this.param.pageNum=1;
          this.param.pageSize=15
          this.searchWay=1;
          this.param.keyword=''
          this.$refs.qSearch.inputValue=''
          this.getStoresList();
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
          this.getStoresList();
        },
        //查看详情
        checkDetail(row){
          this.isEdit=true;
          this.storeInforTitle='编辑仓库'
          this.addStoreDia=true;

          // console.log(row);

          for(let key in this.storeInfor){
            // if(row[key]!=null){
              // console.log(key,row[key])
              this.storeInfor[key]=row[key] ? row[key] : ''
            // }
          }
          this.storeRow=row
          this.getLocationRule(row.id);
          if(row.provinceId!==null&&row.provinceId!==''){
            this.getProvinceList(row.provinceId,2)
          }
          setTimeout(() => {
            if(row.cityId!==null&&row.cityId!==''){
              this.getProvinceList(row.cityId,3)
            }
          }, 10)
        },
         //查询编码规则
        getLocationRule(val){
          let param={
            storehouseId:val
          }
          let json_param=JSON.stringify(param)
          this.$ajaxPost('wms/storehouseLocationRule/select.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              this.tStorehouseLocation=data.data
              Object.keys(this.tStorehouseLocation).forEach(key => {
                if(this.tStorehouseLocation[key]==''){
                  this.tStorehouseLocation[key]='无';
                }
              });
            }else{
              this.$message.error(data.msg)
            }
          })
        },
        //保存编辑
        saveEditBtn(){
          this.$refs.storeInforRef.validate((valid) => {
            if (valid) {
               this.$refs.tStorehouseRef.validate((valid) => {
                if (valid) {
                  let tStore=this.tStorehouseLocation
                  this.storeInfor.tStorehouseLocationRule=tStore
                  Object.keys(this.storeInfor.tStorehouseLocationRule).forEach(key => {
                    if(this.storeInfor.tStorehouseLocationRule[key]=='无'){
                      this.storeInfor.tStorehouseLocationRule[key]='';
                    }
                  });
                  let json_storeInfor=JSON.stringify(this.storeInfor)
                  this.$ajaxPost('wms/storehouse/update.do',{reqParam:json_storeInfor}).then(({data})=>{
                    if(data.code==200){
                      this.$message.success('编辑仓库成功')
                      this.addStoreDia=false;
                      this.getStoresList();
                    }else{
                      this.$message.error(data.msg)
                    }
                  })
                }
              })
            }
          })
        },
        //启用
        startRow(row){
          this.edStore.ids=row.id
          this.edStore.status='0'
          let json_id=JSON.stringify(this.edStore)
          this.$ajaxPost('wms/storehouse/updateBatchStatus.do',{reqParam:json_id}).then(({data}) => {
            if (data.code == 200) {
              this.$message.success('启用成功');
              this.getStoresList()
            } else {
              this.$message.error(data.msg);
            }
          })
        },
        //禁用
        forbidRow(row){
          this.edStore.ids=row.id
          this.edStore.status='-1'
          let json_id=JSON.stringify(this.edStore)
          this.$ajaxPost('wms/storehouse/updateBatchStatus.do',{reqParam:json_id}).then(({data}) => {
            if (data.code == 200) {
              this.$message.success('禁用成功');
              this.getStoresList()
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
        //获取所有的省/市/区
        getProvinceList(ID,type){
          this.areaParam.type=type;
          this.areaParam.id=ID;
          let json_areaParam=JSON.stringify(this.areaParam);
          console.log(json_areaParam)
          this.$ajaxPost("wms/region/selectAll.do",{reqParam:json_areaParam}).then(({data})=>{
            console.log(data)
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
          this.storeInfor.cityId='';
          this.storeInfor.cityName='';
          this.districtList=[];
          this.storeInfor.districtId='';
          this.storeInfor.districtName='';
          if(val){
            this.getProvinceList(val,2)
            this.provinceList.forEach(item=>{
              if(item.id==val){
                this.storeInfor.provinceName=item.regionName
              }
            })
          }else{
            this.storeInfor.provinceName='';
          }
        },
        //选择市时回去区
        getCityList(val){
          this.districtList=[];
          this.storeInfor.districtId='';
          this.storeInfor.districtName='';
          if(val){
            this.getProvinceList(val,3)
            this.cityList.forEach(item=>{
              if(item.id==val){
                this.storeInfor.cityName=item.regionName
              }
            })
          }else{
            this.storeInfor.cityName='';
          }
        },
        //点击区时
        getDistrictList(val){
          if(val){
            this.districtList.forEach(item=>{
              if(item.id==val){
                this.storeInfor.districtName=item.regionName
              }
            })
          }else{
            this.storeInfor.districtName='';
          }
        },
        //每页数量改变
        sizeChange(v) {
          this.param.pageSize = v;
          this.getStoresList();
        },
        //当前页改变
        currentChange(v) {
          this.param.pageNum = v;
          this.getStoresList();
        },
      },
      components: {},
      mounted() {
        this.getStoresList();
        this.getProvinceList('0','1');
      }
    }
</script>

<style lang="scss">
.stores{
  .tStorehouse{
    .note{
      margin-left: 20px;
      font-size: 13px;
      color: #999999;
    }
    p.note{
      margin-left: 0;
    }
    .el-dialog{
      width: 888px;
    }
  }
}

</style>
