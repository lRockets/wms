<template>
  <div class="inspect-manage">
    <div class="operate" >
      <el-form :model="inspectionForm" ref="multiCodeForm">
        <el-form-item label="待出库订单：">
          <el-row type="flex" justify="space-between">
            <p>{{checkedNum}}&nbsp;笔</p>
            <div class="audioImg" @click="() => this.audioFlag = !this.audioFlag" :style="`background-positionY: ${audioFlag ? '-281px' : '-237px'}`"></div>
          </el-row>
        </el-form-item>
        <el-form-item label="物流单号/销售单号：">
          <div class="thisRow">
            <el-input size="small" v-model="inspectionForm.multiCode"
                                   @keyup.enter.native="(e) => getMainList(e)"
                                   v-focus='true'
                                   ref="multiCodeInput"
                                   placeholder="请输入单号或扫标枪录入"></el-input>
            <el-button size="small" @click="getMainList" type="primary">Enter</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="inspectionForm.chkScan" :true-label="0" :false-label="-1" @change="handlerScan">出库前进行拦截扫描</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="inspectionForm.chkAutoSubmit" :true-label="0" :false-label="-1" @change="handlerAutoSubmit">自动提交</el-checkbox>
        </el-form-item>
        <el-form-item style="width: 100%" label-width="0">
          <el-button size="small" type="primary" style="width:100%;" @click="confirmOutboundBtn">确认出库装车</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="content">
      <div class="title">
        <section class="item">
            <p class="left">当前订单总数：</p>
            <p class="right">{{totalOrder}}<span>笔</span></p>
        </section>
      </div>

      <el-table v-loading="loadingTable.inspect" 
                ref="inspect" 
                border
                :data="tableData" 
                height=500px>
        <el-table-column align="center" type="index" label="行号" width="60"></el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="remove(scope.row)">移除</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="saleouto" label="订单号"></el-table-column>
        <el-table-column align="center" prop="logcompName" label="物流商"></el-table-column>
        <el-table-column align="center" prop="expbillNo" label="物流单号"></el-table-column>
        <el-table-column align="center" prop="contactName" label="收货人"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    props:{},
    data(){
      return{
        // @keypress.native="(e) => checkScanGun(e, 'multiCode')" 
        userName: this.$Cookies.get('userName'),
        tableData:[],
        totalOrder: 0,
        headerData: {},
        inspectionForm:{
          multiCode:'',
          goodsCode:'',
          goodsSerialization: '',
          chkScan: -1,
          chkAutoSubmit: 0,
        },
        pageObj: {
          pageNum: 1,
          pageSize: 15,
        },
        total: 0,
        loadingTable: {
          inspect: false,
        },
        checkedNum: 0,
        scannerGun: {
          prevTime: 0,
        },
        audioFlag: true,
        // checkScanGunFlag: true
      }
    },
    mounted() {
      this.getCheckedNum();
    },
    directives: {
      focus: {
        inserted: function (el, {value}) {
          if (value) {
            el.firstElementChild.focus()
          }
        }	    
      }
    },
    methods:{
      audioStart(isSuccess) {
        if (!this.audioFlag) {
          return;
        }
        let audioName = '';
        if(isSuccess == 'yes') {
          audioName = this.$Util.audioName.url_detailYes
        } else {
          audioName = this.$Util.audioName.url_detailNo;
        }
        const audioData = require(`../../assets/sound/${audioName}`);
        const audio = new Audio(audioData);
        audio.play();
      },
      /**
        * @method 获取验货列表
        */
      async getMainList(e) {
        if (e.type == 'keyup' && e.code !== 'Enter' ) return;
        if (this.inspectionForm.multiCode == '') {
          return;
        }
        const { data } = await this.$ajaxPost('wms/outbound/selectlListScreening.do', {
          reqParam: JSON.stringify({
            search: this.inspectionForm.multiCode,
            Intercept: this.inspectionForm.chkScan,
          }),
        });
        if (data.code === 200) {
         const checkOrder = (data) => {
           let checkArray = [];
           this.tableData.forEach((item) => {
             if (data.id === item.id) {
               checkArray.push(item);
             }
           });
           return checkArray;
         };
         if (this.tableData.length === 0) {
           this.tableData.push(data.data);
           this.totalOrder += 1;
         } else {
            if (checkOrder(data.data).length === 0) {
              this.tableData.push(data.data);
              this.totalOrder += 1;
            } else {
              this.audioStart('no')
              this.$message.warning('此单号已存在');
            }
         }
         this.scannerGun.prevTime = 0;
         if(this.inspectionForm.chkAutoSubmit === 0) {
           this.confirmOutbound();
         }
        } else {
          this.audioStart('no')
          this.$message.error(data.msg);
        }
        this.loadingTable.inspect = false;
      },
      async getCheckedNum() {
        const { data } = await this.$ajaxPost('wms/outbound/count.do');
        if (data.code === 200) {
          this.checkedNum = data.data.count;
        } else {
          this.audioStart('no')
          this.$message.warning(data.msg);
        }
      },
      confirmOutboundBtn() {
        if (this.totalOrder === 0) {
          this.audioStart('no')
          this.$message.warning('未出库任何订单');
        } else {
          this.confirmOutbound();
        }
      },
      async confirmOutbound() {
        const { data } = await this.$ajaxPost('wms/outbound/insert.do', {
          reqParam: JSON.stringify({
            ids: this.tableData.map((item) => item.id).join(),
          }),
        });
        if (data.code === 200) {
          this.$message.success('出库成功');
          this.audioStart('yes')
          this.tableData = [];
          this.$refs.multiCodeForm.resetFields();
          this.inspectionForm.multiCode = ''
          this.$refs.multiCodeInput.$el.firstElementChild.focus()
        } else {
          this.audioStart('no')
          this.$message.warning(data.msg);
        }
      },
      remove(row) {
        console.log(row);
      },
      handlerScan(value) {
        this.inspectionForm.chkScan = value;
      },
      handlerAutoSubmit(value) {
        this.inspectionForm.chkAutoSubmit = value;
      },
      /**
       * @method 判断是否是扫描枪输入
       * @param { Object } e: 标准的事件对象
       * @param { string } type: 触发扫描枪的类型
       */
      // checkScanGun(e, type) {
      //   let nextTime = new Date().getTime();
      //   if (this.scannerGun.prevTime === 0 || (nextTime - this.scannerGun.prevTime <= 50)) {
      //     if (e.code === 'Enter' && e.which === 13) {
      //       if (type === 'multiCode') {
      //         this.checkScanGunFlag = true
      //         this.getMainList();
      //       }
      //     } else {
      //       this.scannerGun.prevTime = nextTime;
      //       this.inspectionForm[type] += String.fromCharCode(e.which);
      //     }
      //   }
      // },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin.scss';
  @import '../../styles/common.scss';
  .inspect-manage{
    display: flex;
    flex-wrap: nowrap;
    box-sizing: border-box;
    .operate{
      width: 20%;
      padding: 0 10px;
      margin-right: 1%;
      max-height:700px;
      overflow: hidden;
      border-right: 1px dashed #dddddd;
      .el-form{
        .el-form-item__content{
          .thisRow{
            width: 100%;
            display: flex;
            @include flexCenter;
            .el-button{
              margin-left: 5px;
            }
          }
        }
      }
    }
    .content{
      width: 80%;
      .title{
        .item{
          @include fd(row);
          margin-bottom: 15px;
        }
        .left{
          @include fd(column);
          justify-content: center;
          height: 100%;
          @include sc(14px, $black-333);
        }
        .right{
          @include sc(14px, $gray-666);
          span{
            margin-left: 5px;
          }
        }
      }
    }
    .el-form-item{
      margin-bottom: 5px;
    }
    .tag-wavepick--two{
      padding: 0px;
    }
    .audioImg{
      height: 30px;
      width: 26px;
      margin-top: 5px;
      cursor: pointer;
      background-image: url('../../assets/images/sprite.png');
      background-repeat: no-repeat;
    }
  }
</style>
