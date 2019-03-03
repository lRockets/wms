<template>
  <div class="wave_rule">
    <el-form :model="waveRuleForm" label-width="130px" :rules="waveRuleRule" ref="waveRuleRef" size="small">
      <el-form-item prop="confName" label="波次规则名称：">
        <el-input size="small" v-model.trim="waveRuleForm.confName" style="width: 200px" maxlength="6"></el-input>
      </el-form-item>
      <el-form-item prop="status" label="状态：">
        <el-switch
          v-model="waveRuleForm.status"
          active-value="0"
          inactive-value="-1">
        </el-switch>
      </el-form-item>
      <div >
        <div class="cutOff"><span>执行条件</span><i></i></div>
        <el-form-item prop="time1" label="起止时间：">
          <el-time-picker
              is-range
              :clearable='false'
              v-model="waveRuleForm.time1"
              value-format='HH:mm:ss'
              default-value='00:00:00'
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              style="margin-left: 20px;"
              size="small"
              @change="selectTime1">
            </el-time-picker>
        </el-form-item>
        <el-form-item prop="intervalTime" label="时间间隔：">
          <el-input size="small" v-model.trim="waveRuleForm.intervalTime" maxlength="3" style="width: 70px;margin-right:15px;"></el-input><span>分钟</span>
        </el-form-item>
      </div>
      <div >
        <div class="cutOff"><span>订单筛选</span><i></i></div>
        <el-form-item prop="time2" label="接单时间：" class="timeType">
          <el-select size="small" v-model="waveRuleForm.timeType" placeholder="请选择" style="width: 150px;margin-right: 20px;">
            <el-option label="接单时间" value="1"></el-option>
            <el-option label="下单时间" value="2"></el-option>
            <el-option label="支付时间" value="3"></el-option>
          </el-select>
          <span>在当天</span>
            <el-time-picker
              is-range
              v-model="waveRuleForm.time2"
              value-format='HH:mm:ss'
              default-value='00:00:00'
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              style="margin-left: 20px;"
              size="small"
              @change="selectTime2">
            </el-time-picker>
        </el-form-item>
        <el-form-item prop="maxQty" label="订单品种：">
          <p>商品数量<el-input size="small" style="width: 70px;margin: 0 15px;" v-model.trim="waveRuleForm.minQty"></el-input>至<el-input size="small" style="width: 70px;margin: 0 15px;" v-model.trim="waveRuleForm.maxQty"></el-input></p>
        </el-form-item>
        <el-form-item prop="skuMaxnum">
          <p>商品种类<el-input size="small" style="width: 70px;margin: 0 15px;" v-model.trim="waveRuleForm.skuMinnum"></el-input>至<el-input size="small" style="width: 70px;margin: 0 15px;" v-model.trim="waveRuleForm.skuMaxnum"></el-input></p>
        </el-form-item>
        <el-form-item prop="containRelation" label="包含商品：">
          <el-radio-group v-model="waveRuleForm.containRelation">
            <el-radio label="1">或</el-radio>
            <el-radio label="2">且</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="skuCode" label="">
          <el-input size="small" type="textarea" v-model.trim="waveRuleForm.skuCode" placeholder="请输入商品SKU，多个SKU请用英文逗号或者换行符隔开"></el-input>
        </el-form-item>
      </div>
      <div> 
        <div class="cutOff"><span>分组条件</span><i></i></div>
      <!-- <el-form-item prop="pickareaCondition" label="拣货区域：">
          <el-radio-group v-model="waveRuleForm.pickareaCondition">
            <el-radio label="1">不限货架</el-radio>
            <el-radio label="2">相同货架</el-radio>
            <el-radio label="3">相邻货架</el-radio>
            <el-radio label="4">指定货架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" v-if="waveRuleForm.pickareaCondition==4">
          <template v-for="(shelf,index) in storeshelfData">
            <div class="addressChoice shelf" :key="index">
              <el-select size="small" v-model="shelf.stoareaId" placeholder="请选择库区" @change="(val)=>{checkReservoir(val,shelf)}">
                <template v-for="(item,index1) in reservoirList">
                  <el-option :label="item.stoareaName" :value="item.id" :key="index1"></el-option>
                </template>
              </el-select>
              <el-select size="small" v-model="shelf.stochannelId" placeholder="请选择通道" @change="(val)=>{checkPassList(val,shelf)}">
                <template v-for="(item,index1) in shelf.passList">
                  <el-option :label="item.stochannelName" :value="item.id" :key="index1"></el-option>
                </template>
              </el-select>
              <el-select size="small" v-model="shelf.storeshelfId" placeholder="请选择货架" @change="(val)=>{checkStorageList(val,shelf)}">
                <template v-for="(item,index1) in shelf.storageList">
                  <el-option :label="item.stoshelfName" :value="item.id" :key="index1"></el-option>
                </template>
              </el-select>
              <el-button type="text" class="el-icon-delete" style="font-size:20px;padding:0 5px;" v-if="index>0" @click="removeRow1(shelf,index)"></el-button>
              <span class="error" v-if="!shelf.isFail" :class="{firstError:index==0}">请选择完整的库区/通道/货架</span>
            </div>
          </template>
          <el-row style="display: flex;align-items: center;margin-top: 20px">
            <el-button icon="el-icon-plus" style="height: 34px;font-size: 25px;padding:0 5px" @click="addRow1"></el-button>
            <span style="height: 32px;line-height: 32px;display: inline-block;margin-left: 10px;">新增一行</span>
          </el-row>
        </el-form-item> -->
        <el-form-item prop="onlstoreCondition" label="店铺：">
          <el-radio-group v-model="waveRuleForm.onlstoreCondition">
            <el-radio label="1">不限店铺</el-radio>
            <el-radio label="2">指定店铺</el-radio>
            <el-radio label="3">排除店铺</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="onlstoreId" label="" v-if="waveRuleForm.onlstoreCondition!=1">
          <el-select size="small" v-model="waveRuleForm.onlstoreId" multiple @change="selectShip" placeholder="请选择" style="width: 300px;margin-right: 20px;">
            <template v-for="(item,index) in shipList">
              <el-option :label="item.storeName" :value="item.id" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item v-if="waveRuleForm.onlstoreCondition!=1">
          <el-table ref="shipData" border :data="shipData" height="170">
            <el-table-column align="center" type="index" label="行号" width="55"></el-table-column>
            <el-table-column align="center" prop="storeName" label="店铺名称"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteRow(scope)">删除</el-button>
              </template>
            </el-table-column>
            <template slot="empty">
              <div class="noData">
                <div class="noData-img"></div>
                <p>暂无数据</p>
              </div>
            </template>
          </el-table>
        </el-form-item>
        <el-form-item prop="spenoteCondition" label="特殊备注：">
          <el-radio-group v-model="waveRuleForm.spenoteCondition">
            <el-radio label="1">不限备注</el-radio>
            <el-radio label="2">指定备注</el-radio>
            <el-radio label="3">排除备注</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="spenote" label="" v-if='waveRuleForm.spenoteCondition!=1'>
          <el-input size="small" type="textarea" v-model.trim="waveRuleForm.spenote" placeholder="请输入备注" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item prop="invtypeCondition" label="发票类型：">
          <el-radio-group v-model="waveRuleForm.invtypeCondition">
            <el-radio label="1">不限</el-radio>
            <el-radio label="2">指定类型</el-radio>
            <el-radio label="3">排除类型</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="invtypeCode" label="" v-if="waveRuleForm.invtypeCondition!=1">
          <el-select size="small" v-model="waveRuleForm.invtypeCode" multiple @change="selectInvtype" placeholder="请选择（多选）" style="width: 300px;margin-right: 20px;">
            <template v-for="(item,index) in typeList">
              <el-option :label="item.itemName" :value="item.itemValue" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model.trim="waveRuleForm.isSameskuPriority" true-label='0' false-label='-1'>相同商品的订单优先分配到同一个波次</el-checkbox>
        </el-form-item>
      </div>
      <div>
        <div class="cutOff"><span>限制条件</span><i></i></div>
        <el-form-item prop="volumeMax" label="体积限制：">
          <p>小于等于<el-input size="small" maxlength="5" v-model.trim="waveRuleForm.volumeMax" style="width: 70px;margin: 0 20px;"></el-input>m³</p>
        </el-form-item>
        <el-form-item prop="weightMax" label="重量限制：">
          <p>小于等于<el-input size="small" maxlength="6" v-model.trim="waveRuleForm.weightMax" style="width: 70px;margin: 0 20px;"></el-input>kg</p>
        </el-form-item>
        <el-form-item prop="orderMaxnum" label="订单数限制：">
          <p>
            订单笔数下限<el-input size="small" v-model.trim="waveRuleForm.orderMinnum" maxlength="2" style="width: 70px;margin: 0 20px;"></el-input>
            订单笔数上限<el-input size="small" v-model.trim="waveRuleForm.orderMaxnum" maxlength="2" style="width: 70px;margin: 0 20px;"></el-input>
          </p>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button size="small" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    export default {
        props:{},
        data(){
          const timeCellReg = (rule, value, callback) => {
            let v = value.toString().trim();
            let flag = /^([1-9]|[1-9]\d|1\d{2}|2[0-3]\d|240)$/.test(v);
            if (!flag) {
              if (callback) callback(new Error('请输入1-240的整数'));
            } else {
              callback();
            }
          };
          const orderNum2Reg = (rule, value, callback) => {
            let v = value.toString().trim();
            let flag1 = /^([1-9]|[1-9]\d{1,2})$/.test(v);
            let flag2 = /^([1-9]|[1-9]\d{1,2})$/.test(this.waveRuleForm.minQty);
            if(this.waveRuleForm.minQty==''||v.length==0){
              if (callback) callback(new Error('请输入最大数量和最小数量'));
            }else{
              if(!flag1||!flag2){
                if (callback) callback(new Error('请输入1-999的整数'));
              }else{
                if(this.waveRuleForm.maxQty-this.waveRuleForm.minQty>=0){
                  callback();
                }else{
                  if (callback) callback(new Error('最大数量需大于等于最小数量'));
                }
              }
            }
          };
          const orderNum4Reg = (rule, value, callback) => {
            let v = value.toString().trim();
            let flag1 = /^([1-9]|[1-9]\d)$/.test(v);
            let flag2 = /^([1-9]|[1-9]\d)$/.test(this.waveRuleForm.skuMinnum);
            if(this.waveRuleForm.skuMinnum==''||v.length==0){
              if (callback) callback(new Error('请输入最大数量和最小数量'));
            }else{
              if(!flag1||!flag2){
                if (callback) callback(new Error('请输入1-99的整数'));
              }else{
                if(this.waveRuleForm.skuMaxnum-this.waveRuleForm.skuMinnum>=0){
                  callback();
                }else{
                  if (callback) callback(new Error('最大数量需大于等于最小数量'));
                }
              }
            }
          };
          const bulkReg = (rule, value, callback) => {
            let v = value.toString().trim();
            let flag = /^([1-9]|[1-9]\.\d{1,2}|10|10\.\d{1,2}|1\d\.\d{1,2}|20|20.00)$/.test(v);
              if(!flag){
                if (callback) callback(new Error('请输入大于0，小于等于20的数字，保留2位小数'));
              }else{
                callback();
              }
          };
          const scaleReg = (rule, value, callback) => {
            let v = value.toString().trim();
            let flag = /^([1-9]|[1-9]\d|[1-3]\d{1,2}|4[0-7]\d|480|[1-9]\.\d{1,2}|[1-9]\d\.\d{1,2}|[1-3]\d{1,2}\.\d{1,2}|4[0-7]\d\.\d{1,2}|480.00)$/.test(v);
              if(!flag){
                if (callback) callback(new Error('请输入大于0，小于等于480的数字，保留2位小数'));
              }else{
                callback();
              }
          };
          const orders2Reg = (rule, value, callback) => {
            let v = value.toString().trim();
            let flag1 = /^([2-9]|1\d|20)$/.test(v);
            let flag2 = /^([2-9]|1\d|20)$/.test(this.waveRuleForm.orderMinnum);
            if(this.waveRuleForm.orderMinnum==''||v.length==0){
              if (callback) callback(new Error('请输入最大数量和最小数量'));
            }else{
              if(!flag1||!flag2){
                if (callback) callback(new Error('请输入2-20的整数'));
              }else{
                if(this.waveRuleForm.orderMaxnum-this.waveRuleForm.orderMinnum>=0){
                  callback();
                }else{
                  if (callback) callback(new Error('最大数量需大于等于最小数量'));
                }
              }
            }
          };
          const skuCodeReg=(rule, value, callback)=>{
            if(value){
              let v = value.replace(/\n/g,'<br>').split(',');
              let flag=true;
              for(var i=0;i<v.length;i++){
                v[i]=v[i].toString().trim()
                if(/^([A-Z]{2}\d{6}-\d\d|[A-Z]{3}\d{5}-\d\d)$/.test(v[i])==false){
                  flag=false;
                }
              }
              if(!flag){
                if (callback) callback(new Error('sku用英文逗号分隔 ，第1-8位：取商品编码(2位大写字母加6位数字/3位大写字母加5位数字) ，第8位：固定中划线 ，第9-10位：取流水号(从01开始递增)'));
              }else{
                let json_param = JSON.stringify({skuCodes:value})
                this.$ajaxPost('wms/goodsSku/batchCheckIsExist.do', {reqParam: json_param}).then(({data}) => {
                  if (data.code == 200) { 
                    if(data.data==null){
                      callback();
                    }else{
                      if (callback) callback(new Error(data.data+' SKU不存在，请核实数据 '));
                    }
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }
            }else{
              callback();
            }
          };
          return{
            waveRuleForm:{
              confName:'',
              status:'0',
              time1:['08:00:00', '08:00:00'],   //起止时间
              startTime:'',
              endTime:'',
              intervalTime:'',
              timeType:'1',
              time2:['08:00:00', '08:00:00'],    //订单起止时间
              orderStime:'',
              orderEtime:'',
              maxQty:'',
              minQty:'',
              skuMaxnum:'',
              skuMinnum:'',
              containRelation:'1', 
              skuCode:'',       //包含商品sku
              // pickareaCondition:'1',  //拣货区域分组条件
              // storeshelfId:'',     //货架id
              // storeshelfName:'',  //货架名称

              onlstoreCondition:'1',   //店铺方式
              onlstoreId:[],    //多选店铺id
              onlstoreName:[],
              spenoteCondition:'1',   //特殊备注选择
              spenote:'',            //特殊备注
              invtypeCondition:'1',
              invtypeCode:[],      //发票类型选择
              invtypeName:[],      
              volumeMax:'',
              weightMax:'',
              orderMinnum:'',
              orderMaxnum:'',
              isSameskuPriority:'-1',
            },
            shipList:[],
            shipData:[],
            typeList:[],  //发票类型
            waveRuleRule:{
              confName:[{required: true, trigger: 'change', message:'请输入1-6个字'}],
              time1:[{required: true, trigger: 'change', message:'请选择时间'}],
              intervalTime:[{required: true, trigger: 'change',validator:timeCellReg}],
              time2:[{required: true, trigger: 'change', message:'请选择时间'}],
              maxQty:[{required: true, trigger: 'change',validator:orderNum2Reg}],
              skuMaxnum:[{required: true, trigger: 'change',validator:orderNum4Reg}],
              skuCode:[{ trigger: 'blur',validator:skuCodeReg}],
              code:[{required: true, trigger: 'change', message:'请至少输入一个货架编码'}],
              onlstoreId:[{required: true, trigger: 'change', message:'请至少选中一个店铺信息'}],
              spenote:[{required: true, trigger: 'change', message:'请输入1-50个字'}],
              invtypeCode:[{required: true, trigger: 'change', message:'请至少选中一个发票类型'}],
              volumeMax:[{required: true, trigger: 'change', validator:bulkReg}],
              weightMax:[{required: true, trigger: 'change', validator:scaleReg}],
              orderMaxnum:[{required: true, trigger: 'change', validator:orders2Reg}],
            },
            // storeshelfData:[{stoareaId:'',stochannelId: '',storeshelfId: '',storeshelfName:'',passList:[],storageList:[],isFail:false}],
            shelfIsFail:false,
            reservoirList:[],  //库区列表
          }
        },
      methods:{
        //获取波次规则
        getWaveRule(){
          let json_param = JSON.stringify({})
          this.$ajaxPost('wms/confWavepick/select.do', {reqParam: json_param}).then(({data}) => {
            if (data.code == 200 ) { 
              if(data.data!=null){
                for(let key in this.waveRuleForm){
                  if(data.data[key]!=null){
                    this.waveRuleForm[key]=data.data[key]
                    if(typeof this.waveRuleForm[key]=='number'){
                      this.waveRuleForm[key]=this.waveRuleForm[key]+''
                    }
                  }
                }
                this.waveRuleForm.time1=[]
                this.waveRuleForm.time2=[]
                this.waveRuleForm.time1.push(this.waveRuleForm.startTime,this.waveRuleForm.endTime)//起止时间
                this.waveRuleForm.time2.push(this.waveRuleForm.orderStime,this.waveRuleForm.orderEtime)  //接单起止时间
                if(this.waveRuleForm.onlstoreId !== '' && this.waveRuleForm.onlstoreId !== null){
                  this.waveRuleForm.onlstoreId=this.waveRuleForm.onlstoreId.split(',')   //多选店铺id
                  for(let key in this.waveRuleForm.onlstoreId){
                    this.waveRuleForm.onlstoreId[key]=this.waveRuleForm.onlstoreId[key]-0
                    this.shipList.forEach(item=>{  //店铺列表
                      if(this.waveRuleForm.onlstoreId[key]==item.id){
                        this.shipData.push(item)
                      }
                    })
                  }
                  this.waveRuleForm.onlstoreName=this.waveRuleForm.onlstoreName.split(',')   //多选店铺名称
                }
                if(this.waveRuleForm.invtypeCode !== '' && this.waveRuleForm.invtypeCode !== null){
                  this.waveRuleForm.invtypeCode=this.waveRuleForm.invtypeCode.split(',')   //多选发票类型id
                  for(let key in this.waveRuleForm.invtypeCode){
                    this.waveRuleForm.invtypeCode[key]=this.waveRuleForm.invtypeCode[key]-0
                  }
                  this.waveRuleForm.invtypeName=this.waveRuleForm.invtypeName.split(',')   //多选发票类型名称
                  for(let key in this.waveRuleForm.invtypeName){
                    this.waveRuleForm.invtypeName[key]=this.waveRuleForm.invtypeName[key]-0
                  }
                }
                //货架
              // this.storeshelfData=JSON.parse(JSON.stringify(data.data.storeshelfList))
                // for(var i =0;i<this.storeshelfData.length;i++){
                //   this.storeshelfData[i].stoareaId=this.storeshelfData[i].stoareaId-0
                //   this.storeshelfData[i].stochannelId=this.storeshelfData[i].stochannelId-0
                //   this.storeshelfData[i].storeshelfId=this.storeshelfData[i].storeshelfId-0
                //   this.$set(this.storeshelfData[i],'isFail',true)
                //   this.$set(this.storeshelfData[i],'passList',[])
                //   this.$set(this.storeshelfData[i],'storageList',[])
                //   this.getStorageList(this.storeshelfData[i].stoareaId,this.storeshelfData[i])
                //   this.getShelfList(this.storeshelfData[i].stochannelId,this.storeshelfData[i])
              // }
              }
            } else {
              this.$message.error(data.msg)
            }
          })
        },
        //选择起止时间
        selectTime1(val){
          if(val!==null&&val!==[]){
            this.waveRuleForm.startTime=val[0]
            this.waveRuleForm.endTime=val[1]
          }else{
            this.waveRuleForm.startTime=''
            this.waveRuleForm.endTime=''
          }
        },
        //选择接单起止时间
        selectTime2(val){
          if(val!==null&&val!==[]){
            this.waveRuleForm.orderStime=val[0]
            this.waveRuleForm.orderEtime=val[1]
          }else{
            this.waveRuleForm.orderStime=''
            this.waveRuleForm.orderEtime=''
          }
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
        //选择店铺
        selectShip(val){
          this.waveRuleForm.onlstoreName=[];
          this.shipData=[];
          if(val){
            for(var i=0;i<val.length;i++){
              for(var s =0;s<this.shipList.length;s++){
                if(val[i]==this.shipList[s].id){
                  this.waveRuleForm.onlstoreName.push(this.shipList[s].storeName)
                  this.shipData.push(this.shipList[s])
                }
              }
            }
          }
        },
        //删除店铺
        deleteRow(scope){
          this.shipData.splice(scope.$index,1)
          this.waveRuleForm.onlstoreName.splice(scope.$index,1)
          this.waveRuleForm.onlstoreId.splice(scope.$index,1)
        },
        //查询所有发票类型
        getAllType(){
          let json_param=JSON.stringify({typeName:'发票类型'})
          this.$ajaxPost('wms/dataDict/selectItemName.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              this.typeList=data.data.dataDictList
            }else{
              this.$message.error(data.msg);
            }
          })
        },
        //选择发票类型
        selectInvtype(val){
          this.waveRuleForm.invtypeName=[];
          if(val){
            for(var i=0;i<val.length;i++){
              this.typeList.forEach(item=>{
                if(val[i]==item.itemValue){
                  this.waveRuleForm.invtypeName.push(item.itemName)
                }
              })
            }
          }
        },
       // //新增一行
        // addRow1(){
        //   this.storeshelfData.push({stoareaId:'',stochannelId: '',storeshelfId: '',storeshelfName:'',passList:[],storageList:[],isFail:false})
        // },
        // //移除一行
        // removeRow1(item,index){
        //   this.storeshelfData.splice(index,1)
        // },
        // //选择货区时
        // checkReservoir(val,shelf){
        //   shelf.stochannelId='';
        //   shelf.passList=[];
        //   shelf.storeshelfId='';
        //   shelf.storeshelfName=''
        //   shelf.storageList=[];
        //   shelf.isFail=false;
        //   if(val){
        //     this.getStorageList(val,shelf);
        //   }
        // },
        // //选择通道时
        // checkPassList(val,shelf){
        //   shelf.storeshelfId='';
        //   shelf.storeshelfName=''
        //   shelf.storageList=[];
        //   shelf.isFail=false;
        //   if(val){
        //     this.getShelfList(val,shelf)
        //   }
        // },
        // //选择货架时
        // checkStorageList(val,shelf){
        //   if(val){
        //     shelf.storageList.forEach(item=>{
        //       if(item.id==val){
        //         shelf.storeshelfName=item.stoshelfName
        //       }
        //     })
        //     shelf.isFail=true;
        //   }else{
        //     shelf.storeshelfName=''
        //     shelf.isFail=false;
        //   }
      // },
        save(){
          this.$refs.waveRuleRef.validate((valid) => {
            if (valid) {
              delete this.waveRuleForm.time1
              delete this.waveRuleForm.time2
            // if(this.waveRuleForm.pickareaCondition==4){   //指定货架时
              //   let flag=true;
              //   let arrId=[];
              //   let arrName=[];
              //   this.storeshelfData.forEach(item=>{
              //     if(!item.isFail){       
              //       flag=false;
              //     }
              //   })
              //   if(flag){     //判断是否有货架信息没有填完整
              //     for(var i=0;i<this.storeshelfData.length;i++){
              //       arrId.push(this.storeshelfData[i].storeshelfId)
              //       arrName.push(this.storeshelfData[i].storeshelfName)
              //     }
              //     this.waveRuleForm.storeshelfId=arrId.toString()
              //     this.waveRuleForm.storeshelfName=arrName.toString()
              //     this.shelfIsFail=true;
              //   }else{    
              //     this.shelfIsFail=false;
              //   }
              // }else{   //未指定货架
              //   this.waveRuleForm.storeshelfId=''
              //   this.waveRuleForm.storeshelfName=''
            // }

              if(this.waveRuleForm.onlstoreCondition==1){   //不限店铺时
                this.waveRuleForm.onlstoreId=''
                this.waveRuleForm.onlstoreName=''
              }else{
                this.waveRuleForm.onlstoreId=this.waveRuleForm.onlstoreId.toString()
                this.waveRuleForm.onlstoreName=this.waveRuleForm.onlstoreName.toString()
              }

              if(this.waveRuleForm.spenoteCondition==1){   //不限备注时
                this.waveRuleForm.spenote=''
              }

              if(this.waveRuleForm.invtypeCondition==1){   //不限发票类型时
                this.waveRuleForm.invtypeCode=''
                this.waveRuleForm.invtypeName=''
              }else{
                this.waveRuleForm.invtypeCode=this.waveRuleForm.invtypeCode.toString()
                this.waveRuleForm.invtypeName=this.waveRuleForm.invtypeName.toString()
              }
              // if(this.shelfIsFail){
                let json_param=JSON.stringify(this.waveRuleForm)
                this.$ajaxPost('wms/confWavepick/update.do',{reqParam:json_param}).then(({data})=>{
                  this.waveRuleForm.onlstoreId=[]
                  this.waveRuleForm.onlstoreName=[]
                  this.waveRuleForm.invtypeCode=[]
                  this.waveRuleForm.invtypeName=[]
                  this.shipData=[]
                  if(data.code==200){
                    this.$message.success('保存成功')
                    // this.resetForm();
                    this.getWaveRule();
                  }else{
                    this.$message.error(data.msg) 
                  }
                })
              // }else{
              //   return false
              // }
            }else{
              return false
            }
          })
        },
        //重置表单
        resetForm(){
          this.$refs.waveRuleRef.resetFields()
          Object.keys(this.waveRuleForm).forEach(key => {
            this.waveRuleForm[key] = ''
          })
          this.waveRuleForm.status='0'
          this.waveRuleForm.timeType='1'
          this.waveRuleForm.containRelation='1'
          // this.waveRuleForm.pickareaCondition='1'
          this.waveRuleForm.onlstoreCondition='1'
          this.waveRuleForm.spenoteCondition='1'
          this.waveRuleForm.invtypeCondition='1'
          this.waveRuleForm.isSameskuPriority='-1'
          this.waveRuleForm.time1=['08:00:00', '08:00:00']
          this.waveRuleForm.time2=['08:00:00', '08:00:00']
          // this.storeshelfData=[{stoareaId:'',stochannelId: '',storeshelfId: '',storeshelfName:'',passList:[],storageList:[],isFail:false}]
        },
         //获取所有库区
        getReservoirList(){
          let json_param=JSON.stringify({pageNum:1,pageSize:15})
          this.$ajaxPost('wms/storehouseArea/selectPage.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              this.reservoirList=data.data.dataList
            }else{
              this.$message.error(data.msg)
            }
          })
        },
        //获取通道列表
        getStorageList(val,shelf){
          let json_param=JSON.stringify({pageNum:1,pageSize:15,stoareaId:val})
          this.$ajaxPost('wms/storehouseChannel/selectPage.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              shelf.passList=data.data.dataList
            }else{
              this.$message.error(data.msg)
            }
          })
        },
        //获取货架列表
        getShelfList(val,shelf){
          let json_param=JSON.stringify({pageNum:1,pageSize:15,stochannelId:val})
          this.$ajaxPost('wms/storehouseShelf/selectPage.do',{reqParam:json_param}).then(({data})=>{
            if(data.code==200){
              shelf.storageList=data.data.dataList
            }else{
              this.$message.error(data.msg)
            }
          })
        },
      },
      mounted(){
        this.getWaveRule();
        this.getShipList();
        this.getAllType();
        this.getReservoirList();
      },
    }
</script>

<style lang="scss">
.wave_rule {
  .step{
    .el-button{
      width: 80px;
      background: #00d2a2;
      color: #ffffff;
      border: 1px solid #00d2a2;
      padding: 0 ;
    }
  }
  .el-checkbox__input.is-checked+.el-checkbox__label{
    color: #606266;
  }
  .el-radio__input.is-checked+.el-radio__label{
    color: #606266;
  }
} 
.cutOff{
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin: 20px 0;
  span{
    font-size: 14px;
    color: #333333;
    flex: 0 0 70px;
    text-align: center;
    font-weight: bold;
  }
  i{
    flex: 1;
    height: 0px;
    border-bottom:1px dashed #d8dfe3; 
  }
}
.timeType .el-form-item__content .el-form-item__error{
  left:300px;
}
span.error{
  color: #f56c6c;
  font-size: 12px;
  line-height: 32px;
  padding-left: 10px;
}
span.error.firstError{
  padding-left: 40px;
}
</style>
