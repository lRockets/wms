<template>
  <div class="service_config">
    <header class="top-head">
      <div class="cardBox">
        <span :class="{active:isActive}" @click="instockBtn">入库配置</span>
        <span :class="{active:!isActive}" @click="outstockBtn">出库配置</span>
      </div>
    </header>
    <div class="instock_config" v-if="isActive">
      <div style="margin-bottom: 20px;" class="step">
        <el-button size="small">入库预约</el-button>
        <span class="arrow"></span>
        <el-button size="small">收货</el-button>
        <span class="arrow"></span>
        <el-button size="small">质检</el-button>
        <span class="arrow"></span>
        <el-button size="small">入库</el-button>
      </div>
      <el-form :model="instockConfig" label-width="150px" :rules="instockConfigRule" ref="instockConfigRef">
        <el-form-item prop="purinLocationId" label="默认采购收货库位：" class="range">
          <el-select size="small" v-model="instockConfig.purinLocationId" placeholder="请选择库位" @change="selectPur">
            <template v-for="(item,index) in storehouseLocation">
              <el-option :label="item.locationCode" :value="item.id" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="saleinLocationId" label="默认售后收货库位：" class="range">
          <el-select size="small" v-model="instockConfig.saleinLocationId" placeholder="请选择库位" @change="selectSale">
            <template v-for="(item,index) in storehouseLocation">
              <el-option :label="item.locationCode" :value="item.id" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label-width="10px" prop="withinTimePre">
          <el-checkbox v-model="instockConfig.isUpdatePre" @change="changePre" true-label='1' false-label='0' >预约入库单生成之后允许在 <el-input size="small" maxlength="3" style="width: 70px;margin: 0 20px" v-model="instockConfig.withinTimePre"></el-input>小时之内进行修改</el-checkbox>
          <p style="margin-left: 25px" class="note">勾选此项即表示预约入库单录入之后，在有效时间范围内，只允许修改入库商品数量数据。</p>
        </el-form-item>
        <el-form-item label-width="10px" prop="withinTimeUnpre">
          <el-checkbox v-model="instockConfig.isUpdateUnpre"  @change="changeUpPre" true-label='1' false-label='0'>无预约入库单生成之后允许在 <el-input size="small" maxlength="3" style="width: 70px;margin: 0 20px" v-model="instockConfig.withinTimeUnpre"></el-input>小时之内进行修改</el-checkbox>
          <p style="margin-left: 25px" class="note">勾选此项即表示无预约入库单录入之后，在有效时间范围内，只允许修改入库商品数量数据。</p>
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button size="small" @click="saveInstockBtn" class="total">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="outstock_config" v-else>
      <div style="margin-bottom: 20px;" class="step">
        <el-button size="small">拣货</el-button>
        <span class="arrow"></span>
        <el-button size="small">验货</el-button>
        <span class="arrow"></span>
        <el-button size="small">称重</el-button>
        <span class="arrow"></span>
        <el-button size="small">出库</el-button>
      </div>
      <el-form :model="outstockConfig" :rules="outstockConfigRule" ref="outstockConfigRef">
        <el-form-item label="生成单个拣货单配置：" label-width="160px" prop="singlePickTime">
          <p>待分配订单，等待时间超过 <el-input size="small" maxlength="2" style="width: 70px;margin: 0 20px" v-model="outstockConfig.singlePickTime"></el-input>小时，则自动生成单个拣货单；</p>
        </el-form-item>
        <el-form-item label="拣货并发配置：" label-width="11 5px" prop="batchPickTime">
          <p>拣货单作业超过 <el-input size="small" maxlength="2" style="width: 70px;margin: 0 20px" v-model="outstockConfig.batchPickTime"></el-input>分钟，没有进行拣货操作，则拣货单解除锁定，允许其他人对此订单开始拣货；</p>
        </el-form-item>
        <el-form-item label-width="10px" prop='topNum'>
          <el-checkbox v-model="outstockConfig.isUponPickSort" true-label='0' false-label='-1' >最上层的库位，拣货优先级最低
            <el-input size="small" maxlength="2" style="width: 70px;margin: 0 20px" v-model="outstockConfig.topNum"></el-input>层为最上层
          </el-checkbox>
          <p style="margin-left: 25px" class="note">勾选此项即表示优先拣低库位的商品，最后拣放在最上层的库位商品</p>
        </el-form-item>
        <el-form-item label-width="10px" prop='isGoodsSerial'>
          <el-checkbox v-model="outstockConfig.isGoodsSerial" true-label='0' false-label='-1'>验货时，是否录入商品序列号</el-checkbox>
          <p style="margin-left: 25px" class="note">勾选此项即表示验货环节可录入商品序列号</p>
        </el-form-item>
        <el-form-item label-width="10px" prop="isDeviate">
          <el-checkbox v-model="outstockConfig.isDeviate" true-label='0' false-label='-1' @change="changeDeviate">称重复核，开启后则校验实际称重与系统中的重量偏差</el-checkbox>
        </el-form-item>
        <el-form-item label-width="165px" label="允许的重量误差值：" prop="deviateNum" v-if="outstockConfig.isDeviate=='0'">
          <el-radio-group v-model="outstockConfig.deviateType" >
            <el-radio label="1">按百分比</el-radio>
            <el-radio label="2">按固定值</el-radio>
          </el-radio-group>
          <div>
            <el-input size="small" v-model="outstockConfig.deviateNum" style="width: 100px" :maxlength="outstockConfig.deviateType=='1'?2:4"></el-input>
            <span v-if="outstockConfig.deviateType=='1'">%</span>
            <span v-if="outstockConfig.deviateType=='2'">g</span>
          </div>
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button size="small" @click="saveOutstockBtn" class="total">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    props:{},
    data(){
      const type1Reg = (rule, value, callback) => {
        let v = value.toString().trim();
        let flag = /^([1-9]|[1-9]\d|[1-2]\d{2}|3[0-5]\d}|360)$/.test(v);
        if (this.instockConfig.isUpdatePre=='1') {
          if (!flag) {
            callback(new Error('请输入1-360的整数'));
          } else {
            callback();
          }
        }else {
          callback();
        }
      };
      const type2Reg = (rule, value, callback) => {
        let v = value.toString().trim();
        let flag = /^([1-9]|[1-9]\d|[1-2]\d{2}|3[0-5]\d}|360)$/.test(v);
        if (this.instockConfig.isUpdateUnpre=='1') {
          if (!flag) {
            callback(new Error('请输入1-360的整数'));
          } else {
            callback();
          }
        }else {
          callback();
        }
      };
      const num1Reg = (rule, value, callback) => {
        let v = value.toString().trim();
        let flag = /^([1-9]|10|11|12)$/.test(v);
        if (!flag) {
          callback(new Error('请输入1-12的整数'));
        } else {
          callback();
        }
      };
      const num2Reg = (rule, value, callback) => {
        let v = value.toString().trim();
        let flag = /^([1-5]\d{0,1}|60)$/.test(v);
        if (!flag) {
          callback(new Error('请输入1-60的整数'));
        } else {
          callback();
        }
      };
      const value1Reg = (rule, value, callback) => {
        let v = value.toString().trim();
        let flag1 = /^([0-9]|[1-4]\d|50)$/.test(v);
        let flag2 = /^([0-9]|[1-9]\d{1,2}|1000)$/.test(v);
        if(this.outstockConfig.isDeviate=='0'){
          if(this.outstockConfig.deviateType=='1'){
            if (!flag1) {
              callback(new Error('请输入0-50的整数'));
            } else {
              callback();
            }
          }else{
            if (!flag2) {
              callback(new Error('请输入0-1000的整数'));
            } else {
              callback();
            }
          }
        }else{
          callback();
        }
      };
      const topNumReg = (rule, value, callback) => {
        let v = value.toString().trim();
        let flag1 = /^([1-9])$/.test(v);
        let flag2 = /^([A-z])$/.test(v);
        if(this.outstockConfig.isUponPickSort=='0'){
          if(this.numRule.layerCodeRule==0){
            if (!flag2) {
              callback(new Error('请输入A-Z/a-z的字母'));
            } else {
              callback();
            }
          }else{
            if (!flag1) {
              callback(new Error('请输入1-9的整数'));
            } else {
              callback();
            }
          }
        }else{
          callback();
        }
      };
      return{
        storehouseLocation:[],   //库位列表
        isActive:true,
        instockConfig:{
          purinLocationId:'',
          purinLocationName:'',
          saleinLocationId:'',
          saleinLocationName:'',
          isUpdatePre:'0',
          isUpdateUnpre:'0',
          withinTimePre:'',
          withinTimeUnpre:'',
        },
        instockConfigRule:{
          purinLocationId:[{required: true,trigger: 'change', message:'请选择默认采购收货库位'}],
          saleinLocationId:[{required: true,trigger: 'change', message:'请选择默认售后收货库位'}],
          withinTimePre:[{trigger: 'change', validator: type1Reg}],
          withinTimeUnpre:[{trigger: 'change', validator: type2Reg}],
        },
        outstockConfig:{
          singlePickTime:'',
          batchPickTime:'',
          isUponPickSort:'-1',
          topNum:'',
          isGoodsSerial:'-1',
          isDeviate:'-1',
          deviateType:'1',
          deviateNum:'',
        },
        outstockConfigRule:{
          singlePickTime:[{trigger: 'change', validator: num1Reg}],
          batchPickTime:[{trigger: 'change', validator: num2Reg}],
          topNum:[{trigger: 'change', validator: topNumReg}],
          deviateNum:[{trigger: 'change', validator: value1Reg}],
        },
        numRule:[],
      }
    },
    methods:{
      //获取所有库位
      getStorageList(){
        let json_param=JSON.stringify({pageSize:99999,pageNum:1})
        this.$ajaxPost('wms/storehouseLocation/selectPage.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.storehouseLocation=data.data.dataList
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //查询编码规则
      getLocationRule(){
        let param={
          storehouseId:this.$Cookies.get('storehouseId')
          // storehouseId:'40'
        }
        let json_param=JSON.stringify(param)
        this.$ajaxPost('wms/storehouseLocationRule/select.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.numRule=data.data
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //出库Btn
      outstockBtn(){
        this.isActive=false;
        this.getOutstock();
      },
      //入库配置
      instockBtn(){
        this.isActive=true;
        this.getInstock();
      },
      selectPur(val){
        if(val){
          this.storehouseLocation.forEach(item=>{
            if(item.id==val){
              this.instockConfig.purinLocationName=item.locationCode;
            }
          })
        }else{
          this.instockConfig.purinLocationName='';
        }
      },
      selectSale(val){
        if(val){
          this.storehouseLocation.forEach(item=>{
            if(item.id==val){
              this.instockConfig.saleinLocationName=item.locationCode;
            }
          })
        }else{
          this.instockConfig.saleinLocationName='';
        }
      },
      changePre(val){
        if(val=='0'){
          this.instockConfig.withinTimePre=''
        }
      },
      changeUpPre(val){
        if(val=='0'){
          this.instockConfig.withinTimeUnpre=''
        }
      },
      changeDeviate(val){
        if(val){
          this.outstockConfig.deviateType='1'
          this.outstockConfig.deviateNum=''
        }
      },
      //获取入库配置
      getInstock(){
        console.log(this.instockConfig);
        let json_ReservoirType=JSON.stringify({})
        this.$ajaxPost('wms/confInbound/select.do',{reqParam:json_ReservoirType}).then(({data})=>{
          if(data.code==200){
            if(data.data!=null){
              for(let key in this.instockConfig){
                if(data.data[key]!=null){
                  if(data.data[key] !== 0){
                    this.instockConfig[key]=data.data[key]
                  }
                }
              }
              this.instockConfig.isUpdatePre=this.instockConfig.isUpdatePre+'';
              this.instockConfig.isUpdateUnpre=this.instockConfig.isUpdateUnpre+'';
            }
            
            
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //保存入库配置
      saveInstockBtn(){
        this.$refs.instockConfigRef.validate((valid) => {
          if (valid) {
            let json_instock=JSON.stringify(this.instockConfig)
            this.$ajaxPost('wms/confInbound/update.do',{reqParam:json_instock}).then(({data})=>{
              if(data.code==200){
               this.getInstock();
               this.$message.success('入库配置修改成功')
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //获取出库配置
      getOutstock(){
        let json_Outstock=JSON.stringify({})
        this.$ajaxPost('wms/confOutbound/select.do',{reqParam:json_Outstock}).then(({data})=>{
          if(data.code==200){
            if(data.data!=null){
              for(let key in this.outstockConfig){
                if(data.data[key]!=null){
                  this.outstockConfig[key]=data.data[key]
                }
              }
              this.outstockConfig.isUponPickSort=this.outstockConfig.isUponPickSort+'';
              this.outstockConfig.isGoodsSerial=this.outstockConfig.isGoodsSerial+'';
              this.outstockConfig.isDeviate=this.outstockConfig.isDeviate+'';
              this.outstockConfig.deviateType=this.outstockConfig.deviateType+'';
            }
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      //保存出库配置
      saveOutstockBtn(){
        this.$refs.outstockConfigRef.validate((valid) => {
          if (valid) {
            if(this.outstockConfig.isDeviate=='-1'){
              delete this.outstockConfig.deviateType;
              this.outstockConfig.deviateNum=''
            }
            let json_outstock=JSON.stringify(this.outstockConfig)
            this.$ajaxPost('wms/confOutbound/update.do',{reqParam:json_outstock}).then(({data})=>{
              if(data.code==200){
               this.getOutstock();
               this.$message.success('出库配置修改成功')
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
    },
    mounted(){
      this.getInstock();
      this.getStorageList();
      this.getLocationRule();
    }
  }
</script>

<style lang="scss">
.service_config{
  .step{
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    .el-button{
      width: 80px;
      background: #00d2a2;
      color: #ffffff;
      border: 1px solid #00d2a2;
    }
    .arrow{
      display: inline-block;
      width: 24px;
      height: 18px;
      background: url('../../assets/images/arrow.png') center center no-repeat;
      margin: 0 23px;
    }
  }
} 
.service_config .el-checkbox__input.is-checked+.el-checkbox__label{
  color: #606266;
}
.service_config .el-radio__input.is-checked+.el-radio__label{
  color: #606266;
}
.outstock_config{
  .el-form-item__label{
    text-align: left;
  }
}
</style>
