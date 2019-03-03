<template>
  <div class="weight-manage">
    <div class="operate" >
      <el-form :model="weightingForm" ref="weightingRef">
        <el-form-item label="待称重订单：">
          <el-row type="flex" justify="space-between">
            <p>{{checkedNum}}&nbsp;笔</p>
            <div class="audioImg" @click="() => this.audioFlag = !this.audioFlag" :style="`background-positionY: ${audioFlag ? '-281px' : '-237px'}`"></div>
          </el-row>        
        </el-form-item>
        <el-form-item label="称重员：">
          <el-input size="small" disabled v-model="userName"></el-input>
        </el-form-item>
        <el-form-item label="称重重量（g）：" prop="weight">
          <div class="thisRow">
            <el-input size="small" v-model="weightingForm.weight" 
                                   @input="changeWeight"
                                   placeholder="请称重"
                                   v-focus="true"
                                   ref="weightInput" 
                                   @keyup.enter.native="scanWeight"
                                   type="number"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="拣货篮条码/物流单号/销售单号：" prop="order">
          <div class="thisRow">
            <el-input size="small" v-model="weightingForm.order"
                                   placeholder="请输入单号或扫标枪录入" 
                                   ref="orderInput"
                                   @keyup.enter.native="(e) => getMainList(e)"></el-input>
            <el-button size="small" @click="getMainList" type="primary">Enter</el-button>
          </div>
        </el-form-item>
        <el-form-item label="运费成本（元）：">
          <el-input size="small" v-model="weightingForm.price" disabled placeholder="系统自动根据重量进行计算"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="weightingForm.chkScan" :true-label="0" :false-label="-1" @change="handlerScan">称重前进行拦截扫描</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="weightingForm.chkAutoSubmit" :true-label="0" :false-label="-1" @change="handlerAutoSubmit">自动提交</el-checkbox>
        </el-form-item>
        <el-form-item style="width: 100%" label-width="0">
          <el-button size="small" type="primary" style="width:100%;" @click="confirmWeightBtn">确认提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="content">
      <div class="title">
        <el-row class="item" :gutter="20">
          <el-col :span="6">
            <el-row type="flex">
              <el-col>
                <p class="left">物流商：</p>
              </el-col>
              <el-col>
                <p class="right">{{headerData.logcompName}}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6" :offset="6">
            <el-row type="flex">
              <el-col>
                <p class="left">物流单号：</p>
              </el-col>
              <el-col>
                <p class="right">{{headerData.expbillNo}}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row class="item" :gutter="20">
          <el-col :span="6">
            <el-row type="flex">
              <el-col>
                <p class="left">收货人姓名：</p>
              </el-col>
              <el-col> 
                <p class="right">{{headerData.contactName}}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6" :offset="6">
            <el-row type="flex">
              <el-col>
                <p class="left">收货人手机号：</p>
              </el-col>
              <el-col>
                <p class="right">{{headerData.contactPhone}}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row class="item" :gutter="20">
          <el-col :span="6">
            <el-row type="flex">
              <el-col>
                <p class="left">买家留言：</p>
              </el-col>
              <el-col>
                <p class="right">{{headerData.buyNote}}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6" :offset="6">
            <el-row type="flex">
              <el-col>
                <p class="left">卖家备注：</p>
              </el-col>
              <el-col>
                <p class="right">{{headerData.note}}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row class="item" :gutter="20">
          <el-col :span="6">
            <el-row type="flex">
               <el-col>
                <p class="left">打印标记：</p>
              </el-col>
              <el-col>
                <ul v-if="headerData.tags" :class="[headerData.tags.invoice === 0 ? 'tag-wavepick--three' : 'tag-wavepick--two','tag-wavepick']">
                  <li :class="{expActive: headerData.tags.exp === 0}">
                    <span>快递</span>
                  </li>
                  <li :class="{billActive: headerData.tags.bill === 0}">
                    <span>发货</span>
                  </li>
                  <li v-if="headerData.tags.invoice === 0">
                    <span>发票</span>
                  </li>
                </ul>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row class="item" >
           <el-button type="primary" size="small" @click="handlerPrintShipping">打印发货单</el-button>
            <el-button type="primary" size="small" @click="handlerPrintDelivery">打印快递单</el-button>
        </el-row>
      </div>

      <el-table ref="weight" 
                :data="tableData" 
                border
                v-loading="loadingTable.weight"
                height=500px>
        <el-table-column align="center" type="index" label="行号" width="60"></el-table-column>
        <el-table-column align="center" prop="outboundQty" label="总数量"></el-table-column>
        <el-table-column align="center" prop="weight" label="单个重量（g）" width="150"></el-table-column>
        <el-table-column align="center" prop="outboundQtySum" width="150" label="预估总重量（g）"></el-table-column>
        <el-table-column align="center" prop="imageUrl" label="图片" width="120">
          <template slot-scope="scope">
             <div class="wrap-img">
              <img :src="scope.row.IMGURL">
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goodsCode" width="150" label="商品编码"></el-table-column>
        <el-table-column align="center" prop="skuCode" width="150" label="SKU"></el-table-column>
        <el-table-column align="center" prop="barcode" width="150" label="商品条码"></el-table-column>
        <el-table-column align="center" prop="goodsName" width="200" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="brandName" label="品牌" width="150"></el-table-column>
        <el-table-column align="center" prop="properties" label="规格属性" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column align="center" prop="assitBarcode" label="辅助条码" width="150"></el-table-column>
      </el-table>

      <el-dialog
        title="称重完成"
        :visible.sync="visible.goOutput"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="30%">
        <span>恭喜，称重已完成！</span>
        <span slot="footer" class="dialog-footer">
           <el-button size="small" @click="stayCurrentPage">留在当前页</el-button>
           <el-button size="small" type="primary" @click="toOuptPut">去出库</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="打印快递单"
        width="32%"
        :close-on-click-modal="false"
        :visible.sync="visible.express">
        <express-shipping
          :tplList="printTplList"
          :count="printNum"
          :selectIds="tableData.length>0 ? headerData.id : ''"
          :logisticsCode="logisticsCode"
          @getPrintMachine="getPrintMachine"
          @getPrintExpress="getPrintExpress"/>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="visible.express = false">取 消</el-button>
          <el-button size="small" type="primary" @click="doPrintExpress">确定打印</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="打印发货单"
        width="28%"
        :close-on-click-modal="false"
        :visible.sync="visible.shipping">
        <print-shipping :tplList="printTplList" :count="printNum"/>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="visible.shipping = false">取 消</el-button>
          <el-button size="small" type="primary" @click="doPrint">确定打印</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PrintShipping from "@/components/print/shipping.vue";
import ExpressShipping from "@/components/print/express.vue";
import { noPagingMaxSize } from "@/assets/js/constVarible.js";
  export default {
    data(){
      return {
        // @keypress.native="(e) => checkScanGun(e, 'order')" 
        userName: this.$Cookies.get('userName'),
        tableData:[],
        shippingData: [],
        printTplList: [],
        printNum: {},
        headerData: {
          id:'',
        },
        weightingForm:{
          weight: '',
          order: '',
          price: '',
          chkScan: -1,
          chkAutoSubmit: 0,
        },
        loadingTable: {
          weight: false,
        },
        visible: {
          goOutput: false,
          shipping: false,
          express: false,
        },
        checkedNum: 0,
        // 是否校验重量误差 
          // 0-是；-1-否
        isDeviate: -1,
        totalWeight: 0,
        scannerGun: {
          prevTime: 0,
        },
        caiNiaoPrintDefault: "",
        expressPrintLogistic: "",
        logisticsCode: "",
        // checkScanGunFlag: true,
		callback: () => {},		audioFlag: true,      }
    },
    watch:{
      tableData(value){
        if(value.length>0 && '' !== this.weightingForm.weight.trim(this.weightingForm.weight)){
          this.calWeightPrice()
        }
      },
    },
    created() {
      this.callback =  _.debounce(this.calWeightPrice, 1e3);
    },
    components: {
      PrintShipping,
      ExpressShipping,
    },
    mounted() {
      this.getCheckedNum();
      this.getGoodsSerial();
    },
    methods:{
      audioStart(Name,isLog) {
        if (!this.audioFlag) {
          return 
        }
        let audioName = '';
        let arr =[4061,4003,4097]
        if(!Name) {
          audioName = this.$Util.audioName['url_detailNo'];
        } else {
          if(!isLog) {
            if(arr.findIndex(value => value === Name) !== -1){
              audioName = this.$Util.audioName[Name];
            } else {
              audioName = this.$Util.audioName['url_detailNo'];
            }
          } else {
            audioName = this.$Util.audioName[Name];
          }
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
        if (this.weightingForm.order == '') {
           return;
        }
        this.loadingTable.weight = true;
        const { data } = await this.$ajaxPost('wms/outweight/selectPage.do', {
          reqParam: JSON.stringify({
            search: this.weightingForm.order,
            Intercept: this.weightingForm.chkScan,
          }),
        });
        if (data.code === 200) { 
          this.tableData = data.data.map((item) => {
            return {
              ...item,
              tags: {
                exp: item.isPrintExpbill,
                bill: item.isPrintSendbill,
                invoice: item.isPrintInvoice,
              },
              IMGURL: this.$Util.formatImageUrl(item.imageUrl),
            }
          });
          this.headerData = this.tableData[0];
          this.logisticsCode = this.tableData[0].logcompCode;
          this.scannerGun.prevTime = 0;
          this.totalWeight = this.tableData.reduce((acc, cur) => {
            return acc + cur.outboundQtySum;
          }, this.totalWeight);
        } else {
          this.tableData = [];
          this.$message.error(data.msg);
          this.audioStart(data.code,false)
        }
        this.loadingTable.weight = false;
      },
      async getCheckedNum() {
        const { data } = await this.$ajaxPost('wms/outweight/count.do');
        if (data.code === 200) {
          this.checkedNum = data.data.count;
        } else {
          this.$message.error(data.msg);
          this.audioStart(data.code,false)
        }
      },
      async getGoodsSerial(id) {
        const { data } = await this.$ajaxPost('wms/confOutbound/selectByStorehouseId.do');
        if (data.code === 200) {
          // 默认取第一条数据
          if (data.data !== null) {
            this.weightingForm.chkScan = data.data.isDeviate;
          }
        } else {
          this.$message.error(data.msg);
          this.audioStart(data.code,false)
        }
      },
      async confirmWeightBtn() {
        if(this.weightingForm.weight == ''){
          this.audioStart('',false)
          this.$message.warning('重量值不能为空')
          return
        }
        if(this.tableData.length == 0) {
          this.audioStart('',false)
          this.$message.warning('此订单不存在,请核实')
          return
        }
        const { data } = await this.$ajaxPost('wms/outweight/insert.do', {
          reqParam: JSON.stringify({
            id: this.tableData[0].id,
            logcompName: this.tableData[0].logcompName,
            isDeviate: this.weightingForm.chkScan,
            weighingWeight: this.totalWeight,
            outboundWeight: this.weightingForm.weight,
          }),
        });
        if (data.code === 200) {
          this.audioStart(this.headerData.logcompName,true)
          this.headerData = {
            id:'',
          };
          this.tableData = [];
          this.$refs.weightingRef.resetFields();
          this.$refs.weightInput.$el.firstElementChild.focus()
          this.weightingForm.price = ''
          this.$message({
            message: '称重通过',
            type: 'success',
            duration:1000,
          });
          this.getCheckedNum();
        } else {
          this.$message.error(data.msg);
          this.audioStart(data.code,false)
        }
      },
      // 计算运费成本
      async calWeightPrice() {
        if( this.tableData.length == 0) {
          return
        }
        const { data } = await this.$ajaxPost('wms/outweight/outweightPrice.do', {
          reqParam: JSON.stringify({
            id: this.tableData[0].id,
            outboundWeight: this.weightingForm.weight,
          }),
        });
        if (data.code === 200) {
          this.weightingForm.price = data.data;
          if (0 === this.weightingForm.chkAutoSubmit) {
            this.confirmWeightBtn();
          }
        } else {
          this.$message.error(data.msg);
          this.audioStart(data.code,false)
        }
      },
      handlerScan(value) {
        this.weightingForm.chkScan = value;
      },
      handlerAutoSubmit(value) {
        this.weightingForm.chkAutoSubmit = value;
      },
      stayCurrentPage() {
        this.visible.goOutput = false;
        this.headerData = {
          id:'',
        };
        this.tableData = [];
        this.$refs.weightingRef.resetFields();
      },
      toOuptPut() {
        this.$router.push('/outgoing_management/ordersOutgoing');
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
      //       switch (type) {
      //         // case 'weight':
      //         //   this.checkScanGunFlag = false;
      //         //   this.$refs.orderInput.$el.firstElementChild.focus()
      //         //   break;
      //         case 'order' :
      //           this.getMainList(3);
      //           break;
      //       }
      //     } else {
      //       this.scannerGun.prevTime = nextTime;
      //       this.weightingForm[type] += String.fromCharCode(e.which);
      //     }
      //   }
      // },
      scanWeight() {
        // this.checkScanGunFlag = false;
        this.$refs.orderInput.$el.firstElementChild.focus()
      },
      changeWeight(value) {
        if ('' !== value.trim(value)) {
          this.callback(value);
        }
      },
       // 打印发货单
      handlerPrintShipping() {
        if (!(JSON.stringify(this.headerData) == "{}")) {
          this.getPrintTplList();
          this.getPrintNum("shipping");
          this.getPrintData();
        } else {
          this.$message.warning("请先输入待验货订单号");
        }
      },
      // 打印快递单
      handlerPrintDelivery() {
        if (!(JSON.stringify(this.headerData) == "{}")) {
          this.getPrintTplList();
          this.getPrintNum("express");
          this.getExpressPrintData();
        } else {
          this.$message.warning("请先输入待验货订单号");
        }
      },
      // 获取打印的模板列表
      async getPrintTplList() {
        const { data } = await this.$ajaxPost("wms/confPrint/selectPage.do", {
          reqParam: JSON.stringify({
            pageNum: 1,
            pageSize: noPagingMaxSize
          })
        });
        if (data.code === 200) {
          this.printTplList = data.data.dataList;
        } else {
          this.$message.error(data.msg);
        }
      },
      // 获取打印的数量
      async getPrintNum(type) {
        const { data } = await this.$ajaxPost(
          "wms/saleoutPrint/saleoutPrintCount.do",
          {
            reqParam: JSON.stringify({
              saleoutIds: this.headerData.id
            })
          }
        );
        if (data.code === 200) {
          this.printNum = data.data;
        } else {
          this.$message.error(data.msg);
        }
      },
      /**
       * @method 获取打印的数据
       */
      async getPrintData(url) {
        const { data } = await this.$ajaxPost(
          "wms/saleoutPrint/saleoutOutPrint.do",
          {
            reqParam: JSON.stringify({
              ids:this.headerData.id
            })
          }
        );
        if (data.code === 200) {
          if(data.data.dataList.length > 0){
            this.shippingData = [];
            data.data.dataList.forEach(item => {
              this.shippingData.push(this.$Print.formatData(item));
            })
            this.visible.shipping = true;
          }else{
            this.$message.error('当前订单数据异常,请联系管理员')
          }
        } else {
          this.$message.error(data.msg);
        }
      },
      async getExpressPrintData() {
        const { data } = await this.$ajaxPost(
          "wms/saleoutPrint/saleoutLogisticsPrint.do",
          {
            reqParam: JSON.stringify({
              ids:this.headerData.id
            })
          }
        );
        if (data.code === 200) {
          if(data.data.length > 0) {
            this.visible.express = true;
            this.$nextTick(() => {
              this.shippingData = [];
              if ("SF" === this.expressPrintLogistic) {
                data.data.forEach(item => {
                  this.shippingData.push(this.$Print.formatExpressData(item));
                })
              } else {
                this.shippingData = data.data;
              }
            })
          } else {
            this.$message.error('当前订单没有打印模板')
          }
        } else {
          this.$message.error(data.msg);
        }
      },
      // 打印发货单
      doPrint() {
        this.shippingData.forEach(item => {
          sendMsg(item);
        })
      },
      // 打印快递单
      doPrintExpress() {
        if ("SF" === this.expressPrintLogistic) {
          this.doPrint();
        } else {
          this.$Print.doPrint(this.shippingData, {
            printer: this.caiNiaoPrintDefault
            // preview: true,
            //previewType: 'image',
          });
        }
      },
      getPrintMachine(value) {
        this.caiNiaoPrintDefault = value;
      },
      getPrintExpress(value) {
        this.expressPrintLogistic = value;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin.scss';
  @import '../../styles/common.scss';
  .weight-manage{
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
          margin-bottom: 15px;
        }
        .left{
          @include fd(column);
          justify-content: center;
          height: 100%;
          @include sc(14px, $black-333);
          min-width: 150px;
        }
        .right{
          @include textOverFlow;
          @include sc(14px, $gray-666);
        }
      }
    }
    .el-form-item{
      margin-bottom: 5px;
    }
    .tag-wavepick--two{
      padding: 0px;
    }
  }
</style>
<style lang="scss">
.weight-manage{
  .el-form-item__label{
    text-align: left;
  }
  .el-table{
    &:before{
      height:0px;
    }
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

