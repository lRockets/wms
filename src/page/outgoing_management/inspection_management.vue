<template>
  <div class="inspect-manage">
    <div class="operate" >
      <el-form :model="inspectionForm" ref="inspectionRef">
        <el-form-item label="待验货订单：">
          <el-row type="flex" justify="space-between">
            <p>{{checkedNum}}&nbsp;笔</p>
            <div class="audioImg" @click="() => this.audioFlag = !this.audioFlag" :style="`background-positionY: ${audioFlag ? '-281px' : '-237px'}`"></div>
          </el-row>
          
        </el-form-item>
        <el-form-item label="验货员：">
          <el-input size="small" disabled v-model="userName"></el-input>
        </el-form-item>
        <el-form-item label="拣货篮条码/物流单号/销售单号：">
          <div class="thisRow">
            <el-input size="small" 
                      @keyup.enter.native="(e) => getMainList(e)"
                      v-model="inspectionForm.multiCode"  
                      v-focus="true"
                      ref="multiCodeInput"
                      placeholder="请输入单号或扫标枪录入"></el-input>
            <el-button size="small" @click="getMainList" type="primary">Enter</el-button>
          </div>
        </el-form-item>
        <el-form-item label="商品条码：">
          <div class="thisRow">
            <el-input size="small" 
                      v-model="inspectionForm.barcode" 
                      ref="barcodeInput"
                      @keyup.enter.native="(e) => checkBarCode(e)"
                      placeholder="请输入商品条码或扫标枪录入"></el-input>
            <el-button size="small" @click="checkBarCode" type="primary">Enter</el-button>
          </div>
        </el-form-item>
         <el-form-item label="商品序列号：" v-if="visible.goodsSerial === 0">
           <div class="thisRow">
            <el-input size="small" 
                      @keyup.enter.native="multiCheckBtn"
                      v-model="inspectionForm.goodsSerialization" 
                      placeholder="请输入商品序列号或扫标枪录入"></el-input>
            <el-button size="small" @click="multiCheckBtn" type="primary">Enter</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="inspectionForm.chkScan" :true-label="0" :false-label="-1" @change="handlerScan">验货前进行拦截扫描</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="inspectionForm.chkAutoSubmit" :true-label="0" :false-label="-1" @change="handlerAutoSubmit">自动提交</el-checkbox>
        </el-form-item>
        <el-form-item style="width: 100%" label-width="0">
          <el-button size="small" type="primary" style="width:100%;" @click="confirmInspectBtn">确认验货</el-button>
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
            <el-row type="flex" justify="space-between">
              <el-col>
                <p class="left">买家留言：</p>
              </el-col>
              <el-col>
                <p class="right">{{headerData.buyNote}}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6" :offset="6">
            <el-row type="flex" justify="space-between">
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

      <el-table v-loading="loadingTable.inspect" 
                ref="inspect" 
                border
                :data="tableData" 
                height=500px>
        <el-table-column align="center" type="index" label="行号" width="60"></el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
              {{scope.row.status | saleStatus }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="outboundQty" label="待拣数量"></el-table-column>
        <el-table-column align="center" prop="saleoutQty" label="总数量"></el-table-column>
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
        <el-table-column align="center" prop="properties" show-overflow-tooltip label="规格属性" width="200"></el-table-column>
        <el-table-column align="center" prop="assitBarcode" label="辅助条码" width="150"></el-table-column>
      </el-table>

      <el-dialog
        title="验货完成"
        :visible.sync="visible.goWeight"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="30%">
        <span>恭喜，验货已完成！</span>
        <span slot="footer" class="dialog-footer">
           <el-button size="small" @click="stayCurrentPage">留在当前页</el-button>
           <el-button size="small" type="primary" @click="toWeight">去称重</el-button>
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
          :selectIds="tableData.length>0 ?headerData.id:''"
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
    props:{},
    data(){
      return{
        // @keypress.native="(e) => checkScanGun(e, 'multiCode')" 
        // @keypress.native="(e) => checkScanGun(e, 'barcode')" 
        // @keypress.native="(e) => checkScanGun(e, 'goodsSerialization')" 
        userName: this.$Cookies.get('userName'),
        tableData:[],
        saleoutIds: [],
        shippingData: [],
        printTplList: [],
        printNum: {},
        headerData: {},
        inspectionForm:{
          multiCode:'',
          barcode:'',
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
        visible: {
          // 0:显示 -1：不显示
          goodsSerial: -1,
          goWeight: false,
          shipping: false,
          express: false,
        },
        checkedNum: 0,
        scannerGun: {
          prevTime: 0,
        },
        audioFlag: true,
        audioUrl: '',
        caiNiaoPrintDefault: "",
        expressPrintLogistic: "",
        logisticsCode: "",
        // checkBarcodeFlag:true,
      }
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
        if ('' === this.inspectionForm.multiCode) {
          this.audioStart('no')
          this.$message.warning('请输入单号');
          return;
        }
        const { data } = await this.$ajaxPost('wms/outcheck/selectPage.do', {
          reqParam: JSON.stringify({
            search: this.inspectionForm.multiCode,
            Intercept: this.inspectionForm.chkScan,
          }),
        });
        if (data.code === 200) {
          if (data.data.length !== 0) {
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
            // this.checkBarcodeFlag = false
            this.$refs.barcodeInput.$el.firstElementChild.focus()
          } else {
            this.headerData = {};
            this.tableData = [];
          }
        } else {
          this.$message.error(data.msg);
          this.audioStart('no')
        }
        this.loadingTable.inspect = false;
      },
      async getCheckedNum() {
        const { data } = await this.$ajaxPost('wms/outcheck/count.do');
        if (data.code === 200) {
          this.checkedNum = data.data.count;
        } else {
          this.audioStart('no')
          this.$message.warning(data.msg);
        }
      },
      /**
       * @method 获取是否显示商品序列号
       * 
       */
      async getGoodsSerial(id) {
        const { data } = await this.$ajaxPost('wms/confOutbound/selectByStorehouseId.do');
        if (data.code === 200) {
          // 默认取第一条数据
          if (data.data !== null) {
            this.visible.goodsSerial = data.data.isGoodsSerial;
          }
        } else {
          this.audioStart('no')
          this.$message.error(data.msg);
        }
      },
      confirmInspectBtn() {
        let arr = this.tableData.filter((item) => {
          if (item.outboundQty === 0) {
            return item;
          }
        });
        if (this.tableData.length === 0) {
          this.audioStart('no')
          this.$message.warning('请添加拣货单');
          return;
        }
        this.confirmInspect();

        // if (arr.length === this.tableData.length) {
        // } else {
          // this.$confirm('当前订单中还存在未验货完成的商品，是否确认提交？', '验货确认', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => {
          //   this.confirmInspect();
          // }).catch(() => {
          //   this.$message({
          //     type: 'info',
          //     message: '已取消验货'
          //   });
          // });
        // }
      },
      async confirmInspect() {
        const { data } = await this.$ajaxPost('wms/outcheck/insert.do', {
          reqParam: JSON.stringify({
            confirmInspection: 0,
            outserialNumberId: this.visible.goodsSerial,
            skuList: this.tableData,
          }),
        });
        if (data.code === 200) {
          // this.visible.goWeight = true;
          this.headerData = {};
          this.tableData = [];
          this.$refs.inspectionRef.resetFields();
          this.inspectionForm.multiCode = '';
          this.$refs.multiCodeInput.$el.firstElementChild.focus()
          this.audioStart('yes')
          this.$message({
            message: '验货成功',
            type: 'success',
            duration:1000,
          });
          this.getCheckedNum();
        } else {
          this.$message.warning(data.msg);
          this.audioStart('no')
        }
      },
      handlerScan(value) {
        this.inspectionForm.chkScan = value;
      },
      handlerAutoSubmit(value) {
        this.inspectionForm.chkAutoSubmit = value;
      },
      checkBarCode(e) {
        if (e.type == 'keyup' && e.code !== 'Enter' ) return;
        if (this.inspectionForm.barcode == '') {
          return;
        }
        this.scannerGun.prevTime = 0;
        let checkArray = [];
        let NumArray = this.tableData.filter((item) => {
          return item.barcode === this.inspectionForm.barcode || item.extNo === this.inspectionForm.barcode || item.assitBarcode === this.inspectionForm.barcode
        });
        if (NumArray.length === 0) {
          this.audioStart('no')
          this.$message.warning('此商品条码不在销售单中');
          return;
        }
        let flag = false;
        for (const item of NumArray) {
          if (item.outboundQty > 0) {
            item.outboundQty --;
            this.inspectionForm.barcode = '';
            if (item.outboundQty === 0) {
              item.status = '';
            }
            flag = true;
            break;
          }
        }
        if (!flag) {
          this.audioStart('no')
          this.inspectionForm.barcode = '';
          this.$message.warning('当前商品超出需发货量，请核实');
        }
        this.checkedAllQty();
      },
      multiCheckBtn() {
        this.scannerGun.prevTime = 0;
        let checkArray = [];

        if (checkArray.length === this.tableData.length) {
          this.audioStart('no')
          this.$message.warning('此商品条码不在销售单中');
        }
        if (this.inspectionForm.barcode === '') {
          this.audioStart('no')
          this.$message.warning('请填写商品条码');
        } else {
          let flag = false;
          this.tableData.forEach((item) => {
            if (item.barcode === this.inspectionForm.barcode) {
              flag = true;
              this.multiCheck(item.id, item.detailId);
            }
          });
          if (!flag) {
            this.audioStart('no')
            this.$message.warning('请填写正确的商品条码');
          }
        }
      },
      async multiCheck(id, detailId) {
        const { data } = await this.$ajaxPost('wms/outcheck/insert.do', {
          reqParam: JSON.stringify({
            id,
            detailId,
            barcode: this.inspectionForm.barcode,
            outserialNumber: this.inspectionForm.goodsSerialization,
            outserialNumberId: this.visible.goodsSerial,
          }),
        });
        if (data.code === 200) {
          this.checkBarCode();
        } else {
          this.audioStart('no')
          this.$message.warning(data.msg);
        }
      },
      checkedAllQty() {
        let arr = this.tableData.filter((item) => {
          if (item.outboundQty === 0) {
            return item;
          }
        });
        if (this.inspectionForm.chkAutoSubmit === 0 &&
         arr.length === this.tableData.length) {
            this.confirmInspect();
        }
      },
      stayCurrentPage() {
        this.visible.goWeight = false;
        this.headerData = {};
        this.tableData = [];
        this.$ref.inspectionRef.resetFields();
      },
      toWeight() {
        this.$router.push('/outgoing_management/weighing_management');
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
      //         this.getMainList();
      //       } else if (type === 'barcode') {
      //         this.checkBarCode();
      //       } else if (type === 'goodsSerialization') {
      //         this.multiCheckBtn();
      //       }
      //     } else {
      //       this.scannerGun.prevTime = nextTime;
      //       this.inspectionForm[type] += String.fromCharCode(e.which);
      //     }
      //   }
      // },
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
  .audioImg{
    height: 30px;
    width: 26px;
    margin-top: 5px;
    cursor: pointer;
    background-image: url('../../assets/images/sprite.png');
    background-repeat: no-repeat;
  }
</style>
