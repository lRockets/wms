<template>
  <div class="supplier_management">
    <header class="top-head">
      <el-button type="primary" size="small" @click="handlerPrintShipping">打印发货单</el-button>
      <el-button type="primary" size="small" @click="handlerPrintDelivery">打印快递单</el-button>
      <!-- <el-button type="primary" size="small" @click="changeDeliveryBtn">修改物流商</el-button>
      <el-button type="primary" size="small" @click="enterTrackNumberBtn">录入物流单号</el-button>-->
      <el-button type="primary" size="small" @click="interceptOrderBtn">拦截订单</el-button>
      <el-button type="primary" size="small" @click="deleteOrderBtn">移除订单</el-button>
      <div class="header-right f-fr">
        <search
          placeholder="请输入销售单号、物流单号、收货人手机号/姓名、外部单号进行搜索"
          @on-search="codeSearch"
          width="460px"
          :showIcon="false"
          ref="search"
        ></search>
        <el-button type="primary" size="small" @click="goSearch">高级搜索</el-button>
      </div>
    </header>
    <el-table
      v-loading="loadingTable.pick"
      ref="pickingList"
      :data="tableData"
      border
      height="500px"
      @row-click="rowClick"
      :highlight-current-row="true"
      @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column type="index" align="center" label="行号" width="60"></el-table-column>
      <el-table-column align="center" prop="tags" label="打印标记" width="150">
        <template slot-scope="scope">
          <ul
            :class="[scope.row.tags.invoice === 0 ? 'tag-wavepick--three' : 'tag-wavepick--two','tag-wavepick']"
          >
            <li :class="{expActive: scope.row.tags.exp === 0}">
              <span>快递</span>
            </li>
            <li :class="{billActive: scope.row.tags.bill === 0}">
              <span>发货</span>
            </li>
            <li v-if="scope.row.tags.invoice === 0">
              <span>发票</span>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="saleoutNo" label="销售单号" width="200"></el-table-column>
      <el-table-column align="center" prop="address" label="出库类型">
        <template slot-scope="scope">{{scope.row.type | outPutType}}</template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">{{scope.row.status | saleStatus }}</template>
      </el-table-column>
      <el-table-column align="center" prop="logcompName" width="120" label="物流商"></el-table-column>
      <el-table-column align="center" prop="expbillNo" width="180" label="物流单号"></el-table-column>
      <el-table-column align="center" prop="address" label="收货地址" width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.address" placement="top">
            <p class="textOverFlow">{{scope.row.address}}</p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="contactName" width="150" label="收货人姓名"></el-table-column>
      <el-table-column align="center" prop="contactPhone" width="150" label="收货人手机号"></el-table-column>
      <el-table-column align="center" prop="isInvoice" label="是否开票">
        <template slot-scope="scope">{{scope.row.isInvoice === 0 ? '是' : '否'}}</template>
      </el-table-column>
      <el-table-column align="center" prop="payType" label="付款方式">
        <template slot-scope="scope">{{scope.row.payType | payWayType}}</template>
      </el-table-column>
      <el-table-column align="center" prop="saleoutAmount" width="120" label="订单总额（元）"></el-table-column>
      <el-table-column align="center" prop="onlstoreName" width="120" label="店铺名称"></el-table-column>
      <el-table-column align="center" prop="buyerId" width="120" label="买家ID"></el-table-column>
      <el-table-column align="center" prop="onlstorePlatform" width="120" label="订单渠道"></el-table-column>
      <el-table-column align="center" prop="alloinStorehouseName" width="120" label="调入仓库"></el-table-column>
      <el-table-column align="center" prop="placeTime" width="150" label="下单时间" sortable></el-table-column>
      <el-table-column align="center" prop="payTime" width="150" label="付款时间" sortable></el-table-column>
      <el-table-column align="center" prop="createTime" width="150" label="仓库接单时间" sortable></el-table-column>
      <el-table-column align="center" prop="extNo" width="180" label="外部单号"></el-table-column>
      <el-table-column align="center" prop="updateTime" width="150" label="更新时间"></el-table-column>
      <el-table-column align="center" prop="updateByname" width="120" label="更新人"></el-table-column>
    </el-table>
    <el-pagination
      background
      :page-sizes="[15, 30, 50, 100]"
      :page-size="pageObj.pageSize"
      :total="total.pick"
      layout="total, prev, pager, next, sizes, jumper"
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="pageObj.pageNum"
      style="margin-top: 20px;text-align: center;">
    </el-pagination>

    <div class="tabBox">
      <el-tabs
        v-model="tabActive"
        border
        type="border-card"
        style="margin-top: 20px;min-height: 320px;">
        <el-tab-pane label="商品明细" name="goodsDetail">
          <el-table
            ref="inventory"
            v-loading="loadingTable.inventory"
            border
            :data="inventoryTableData">
            <el-table-column type="index" align="center" label="行号" width="60"></el-table-column>
            <el-table-column align="center" prop="imageUrl" label="图片" width="120">
              <template slot-scope="scope">
                <div class="wrap-img">
                  <img :src="scope.row.IMGURL">
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="goodsCode" label="商品编码"></el-table-column>
            <el-table-column align="center" prop="barcode" label="SKU"></el-table-column>
            <el-table-column align="center" prop="goodsCode" label="商品条码"></el-table-column>
            <el-table-column align="center" prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column align="center" prop="brandName" label="品牌" width="150"></el-table-column>
            <el-table-column align="center" prop="properties" show-overflow-tooltip label="规格属性"></el-table-column>
            <el-table-column align="center" prop="price" label="单价" width="120"></el-table-column>
            <el-table-column align="center" prop="saleoutQty" label="数量" width="120"></el-table-column>
            <el-table-column align="center" prop="saleoutAmountSum" label="金额" width="120"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="备注/留言" name="remark">
          <note :noteData="noteDetail"></note>
        </el-tab-pane>
        <el-tab-pane label="发票信息" name="invoice">
          <section v-if="Object.keys(invoiceDetail).length !== 0">
            <el-row type="flex" justify="space-between" :gutter="20">
              <el-col class="preOrder__item" :span="6">
                <label>发票类型：</label>
                <section>{{invoiceDetail.type | invoiceType}}</section>
              </el-col>
              <el-col class="preOrder__item" :span="6">
                <label>购买方名称：</label>
                <section>{{invoiceDetail.buyerName}}</section>
              </el-col>
              <el-col class="preOrder__item" :span="6">
                <label>购买方税号：</label>
                <section>{{invoiceDetail.buyerTaxno}}</section>
              </el-col>
              <el-col class="preOrder__item" :span="6">
                <label>购买方电话：</label>
                <section>{{invoiceDetail.contactPhone}}</section>
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="20">
              <el-col class="preOrder__item" :span="6">
                <label>购买方开户行：</label>
                <section>{{invoiceDetail.depositBank}}</section>
              </el-col>
              <el-col class="preOrder__item" :span="6">
                <label>购买方账号：</label>
                <section>{{invoiceDetail.depositAccount}}</section>
              </el-col>
              <el-col class="preOrder__item" :span="6">
                <label>购买方地址：</label>
                <section>{{invoiceDetail.address}}</section>
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="20">
              <el-col class="preOrder__item" :span="6">
                <label>发票金额：</label>
                <section>{{invoiceDetail.invoiceAmount}}</section>
              </el-col>
              <el-col class="preOrder__item" :span="6">
                <label>发票备注：</label>
                <section>{{invoiceDetail.note}}</section>
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="20">
              <el-col class="preOrder__item" :span="6">
                <label>销售方名称：</label>
                <section>{{invoiceDetail.sellerName}}</section>
              </el-col>
              <el-col class="preOrder__item" :span="6">
                <label>销售方税号：</label>
                <section>{{invoiceDetail.sellerTaxno}}</section>
              </el-col>
            </el-row>
          </section>
          <section class="noData" v-else>
            <div class="noData-img"></div>
            <p>暂无发票信息</p>
          </section>
        </el-tab-pane>
        <el-tab-pane name="total" disabled>
          <p slot="label">
            总数量为：
            <span>{{inventoryTableData.length == 0 ? '' : inventoryTableData[0].saleoutQtySum}}</span>
            总金额为：
            <span>{{inventoryTableData.length == 0 ? '' : inventoryTableData[0].saleoutAmountSum}}</span>
          </p>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog
      title="高级筛选"
      :visible.sync="visible.search"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      class="advanceFilter">
      <el-form :model="searchData" ref="searchFormRef" label-width="120px">
        <el-row type="flex" justify="space-between">
          <el-col :span="11">
            <el-form-item prop="goodsName" label="商品名称：">
              <el-input size="small" v-model="searchData.goodsName" placeholder maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="skuCode" label="商品编码/SKU：">
              <el-input size="small" v-model="searchData.skuCode" placeholder maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="11">
            <el-form-item prop="buyerId" label="买家ID：">
              <el-input size="small" v-model="searchData.buyerId" placeholder maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="contactPhone" label="收件人手机号：">
              <el-input size="small" v-model="searchData.contactPhone" placeholder maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="11">
            <el-form-item prop="placeTime" label="下单时间：">
              <el-date-picker
                v-model="searchData.placeTime"
                type="daterange"
                size="small"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                range-separator="至"
                end-placeholder="结束日期"
                :default-time="['00:00:00']"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="payTime" label="付款时间：">
              <el-date-picker
                v-model="searchData.payTime"
                type="daterange"
                size="small"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                range-separator="至"
                end-placeholder="结束日期"
                :default-time="['00:00:00']"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="11">
            <el-form-item prop="createTime" label="接单时间：">
              <el-date-picker
                v-model="searchData.createTime"
                type="daterange"
                size="small"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                range-separator="至"
                end-placeholder="结束日期"
                :default-time="['00:00:00']"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="type" label="出库类型：">
              <el-select size="small" v-model="searchData.type" placeholder="请选择">
                <el-option
                  v-for="item in advanceFormOutputList"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="11">
            <el-form-item prop="status" label="状态：">
              <el-select size="small" v-model="searchData.status" placeholder="请选择">
                <el-option
                  v-for="item in advanceFormPickOrderStatusList"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="logcompId" label="物流商：">
              <el-select size="small" v-model="searchData.logcompId" placeholder="请选择">
                <el-option
                  v-for="item in advanceFormLogisticsList"
                  :key="item.id"
                  :label="item.logcompName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="11">
            <el-form-item prop="onlstoreId" label="订单渠道：">
              <el-select size="small" v-model="searchData.onlstoreId" placeholder="请选择">
                <el-option
                  v-for="item in advanceFormOrderList"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="onlstoreName" label="店铺：">
              <el-select
                filterable
                style="width: 100%;"
                size="small"
                clearable
                v-model="searchData.onlstoreName"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in advanceFormStoreList"
                  :key="item.storeName"
                  :label="item.storeName"
                  :value="item.storeName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="11">
            <el-form-item prop="typeInvoice" label="发票类型：">
              <el-select size="small" v-model="searchData.typeInvoice" placeholder="请选择">
                <el-option
                  v-for="item in advanceFormInvoiceList"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="24">
            <el-form-item prop="typeInvoice" label="打印标记：">
              <el-checkbox v-model="searchData.isPrintExpbillyes" true-label="-1" false-label>已打快递单</el-checkbox>
              <el-checkbox v-model="searchData.isPrintSendbillyes" true-label="-1" false-label>已打发货单</el-checkbox>
              <el-checkbox v-model="searchData.isPrintExpbillNo" true-label="0" false-label>未打快递单</el-checkbox>
              <el-checkbox v-model="searchData.isPrintSendbillNo" true-label="0" false-label>未打发货单</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="end">
          <el-form-item style="margin-bottom: 0px;">
            <el-button size="small" @click="resetSearch">清空条件</el-button>
            <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog
      title="修改物流商"
      :visible.sync="visible.delivery"
      width="24%"
      :close-on-click-modal="false"
      :modal-append-to-body="false">
      <el-form :model="logistics" label-width="110px">
        <el-form-item prop="companyName" label="物流商：">
          <el-select
            size="small"
            v-model="logistics.companyName"
            placeholder="请选择"
            style="width:100%;"
          >
            <el-option
              v-for="item in deliveryList"
              :key="item.id"
              :label="item.logcompName"
              :value="item.logcompName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-row type="flex" justify="end">
          <el-button size="small" @click="visible.delivery = false">取消</el-button>
          <el-button size="small" type="primary" @click="confirmChangeDelivery">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog
      title="录入物流单号"
      :visible.sync="visible.trackNumber"
      width="24%"
      :close-on-click-modal="false"
      :modal-append-to-body="false">
      <el-form :model="track" ref="trackFormRef" :rules="trackFormRules" label-width="110px">
        <el-form-item prop="numbers" label="物流单号：">
          <el-input size="small" v-model="track.numbers"></el-input>
        </el-form-item>
        <el-row type="flex" justify="end">
          <el-button size="small" @click="visible.trackNumber = false">取消</el-button>
          <el-button size="small" type="primary" @click="confirmEnterTrackNumber">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog
      title="打印快递单"
      @close="resetPrint"
      width="32%"
      :close-on-click-modal="false"
      :visible.sync="visible.express">
      <express-shipping
        :tplList="printTplList"
        :count="printNum"
        :selectIds="ids"
        ref="expressShippingRef"
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
</template>

<script>
import PrintShipping from "@/components/print/shipping.vue";
import ExpressShipping from "@/components/print/express.vue";
import note from "@/components/salesTabs/note";
import { Util } from "@/assets/js/util";
import { invoiceType } from "@/assets/js/filters";
import { noPagingMaxSize } from "@/assets/js/constVarible.js";

export default {
  data() {
    return {
      ids: [],
      saleoutIds: [],
      tableData: [],
      inventoryTableData: [],
      orderDetail: {},
      noteDetail: {},
      invoiceDetail: {},
      deliveryList: [],
      shippingData: [],
      printTplList: [],
      printNum: {},
      lowStocks: false,
      enterLogisticsDia: false, //录入物流单号
      searchData: {
        goodsName: "",
        skuCode: "",
        buyerId: "",
        contactPhone: "",
        placeTime: [],
        payTime: [],
        createTime: [],
        type: "",
        status: "",
        logcompId: "",
        onlstoreId: "",
        onlstoreName: "",
        typeInvoice: "",
        isPrintExpbillyes: "",
        isPrintSendbillyes: "",
        isPrintExpbillNo: "",
        isPrintSendbillNo: ""
      },
      logistics: {
        companyName: ""
      },
      track: {
        numbers: ""
      },
      trackFormRules: {
        numbers: [
          {
            trigger: "change",
            validator: this.$Regs.RegMin2MaxWithOutCN(5, 30)
          }
        ]
      },
      pageObj: {
        pageNum: 1,
        pageSize: 15
      },
      loadingTable: {
        pick: true,
        inventory: true
      },
      total: {
        pick: 0
      },
      visible: {
        delivery: false,
        search: false,
        shipping: false,
        express: false,
        trackNumber: false
      },
      prevInventoryId: -1,
      // 高级搜索中的列表
      advanceFormInvoiceList: [],
      advanceFormOrderList: [],
      advanceFormOutputList: [],
      advanceFormPickOrderStatusList: [],
      advanceFormLogisticsList: [],
      advanceFormStoreList: [],
      tabActive: "goodsDetail",
      inventory: [], //商品明细表格
      ordersInfor: [],
      invoiceInfor: [],
      statusData: [],
      isEditorTabs: false, //是否在编辑tab页
      caiNiaoPrintDefault: "",
      expressPrintLogistic: "",
      logisticsCode: ""
    };
  },
  components: {
    PrintShipping,
    ExpressShipping,
    note
  },
  mounted() {
    this.getMainList(this.pageObj);
  },
  methods: {
    /**
     * @method 获取波次拣货列表
     */
    async getMainList(params) {
      const { data } = await this.$ajaxPost("wms/piecepick/selectPage.do", {
        reqParam: JSON.stringify(params)
      });
      if (data.code === 200) {
        this.tableData = data.data.dataList.map(item => {
          return {
            ...item,
            tags: {
              exp: item.isPrintExpbill,
              bill: item.isPrintSendbill,
              invoice: item.isPrintInvoice
            }
          };
        });
        this.total.pick = data.data.totalNum;
        this.loadingTable.pick = false;
        if (this.tableData.length !== 0) {
          this.prevInventoryId = this.tableData[0].id;
          // 默认选择第一行
          this.$refs.pickingList.setCurrentRow(this.tableData[0]);
          this.getDetail(this.prevInventoryId);
          this.getUserNote(this.prevInventoryId);
          this.getInvoiceDetail(this.prevInventoryId);
        } else {
          this.loadingTable.inventory = false;
          //搜索为空时  清空商品明细，备注/留言，发票信息
          this.inventoryTableData = [];
          this.noteDetail = {};
          this.invoiceDetail = {};
        }
      } else {
        this.loadingTable.pick = true;
      }
    },
    async getDetail(id) {
      const { data } = await this.$ajaxPost(
        "wms/piecepickDetail/selectById.do",
        {
          reqParam: JSON.stringify({
            id
          })
        }
      );
      if (data.code === 200) {
        const loopData = arr =>
          arr.map(item => {
            return {
              IMGURL: Util.formatImageUrl(item.imageUrl),
              ...item
            };
          });
        this.inventoryTableData = loopData(data.data);
        this.loadingTable.inventory = false;
      } else {
        this.loadingTable.inventory = true;
      }
    },
    setOrderDetail(data) {
      this.orderDetail = data;
    },
    /**
     * @method  获取用户用户订单信息和备注
     */
    async getUserNote(id) {
      const { data } = await this.$ajaxPost(
        "wms/piecepickDetail/selectById.do",
        {
          reqParam: JSON.stringify({
            id
          })
        }
      );
      if (data.code === 200) {
        // 默认取第一条数据
        if (data.data.length === 0) {
          this.noteDetail = {
            flag: null
          };
        } else {
          this.noteDetail = data.data[0];
        }
      } else {
        this.$message.error(data.msg);
      }
    },
    /**
     * @method 获取发票信息数据
     * @param { int } id: 当前销售单的id值
     */
    async getInvoiceDetail(id) {
      const { data } = await this.$ajaxPost(
        "wms/saleoutInvoice/selectByinvoicePiecepick.do",
        {
          reqParam: JSON.stringify({
            id
          })
        }
      );
      if (data.code === 200) {
        // 默认取第一条数据
        if (data.data.length !== 0) {
          this.invoiceDetail = {
            ...data.data[0],
            invoiceTypeCN: invoiceType(data.data[0].type)
          };
        }
      } else {
        this.$message.error(data.msg);
      }
    },
    // 打印发货单
    handlerPrintShipping() {
      if (this.ids.length > 0) {
        this.getPrintTplList();
        this.getPrintNum("shipping");
        this.getPrintData();
      } else {
        this.$message.warning("请至少选择一条数据");
      }
    },
    // 打印快递单
    handlerPrintDelivery() {
      if (this.ids.length > 0) {
        this.getPrintTplList();
        this.getPrintNum("express");
        this.getExpressPrintData();
      } else {
        this.$message.warning("请至少选择一条数据");
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
            saleoutIds: this.saleoutIds.join()
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
            ids: this.saleoutIds.join()
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
            ids: this.saleoutIds.join()
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
    //关闭打印表单时，重置
    resetPrint() {
      this.shippingData = [];
    },
    // 录入物流单号
    enterLogisticsBtn() {
      if (this.ids.length > 0) {
        this.enterLogisticsDia = true;
      } else {
        this.$message.warning("请至少选择一条数据");
      }
    },
    // 拦截订单
    interceptOrderBtn() {
      if (this.ids.length > 0) {
        this.interCeptOrder(this.ids.join());
      } else {
        this.$message.warning("请至少选择一条数据");
      }
    },
    async interCeptOrder(ids) {
      const { data } = await this.$ajaxPost("wms/piecepick/updateStatus.do", {
        reqParam: JSON.stringify({
          ids
        })
      });
      if (data.code === 200) {
        this.$message({
          type: "success",
          message: "拦截成功!"
        });
        this.getMainList(this.pageObj);
      } else {
        this.$message.error(data.msg);
      }
    },
    // 移除订单
    deleteOrderBtn() {
      if (this.ids.length > 0) {
        this.$confirm(
          "移除此订单后，订单将进入待分配列表，需重新生成拣货单?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.deleteOrder(this.ids.join());
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message.warning("请勾选需移除的订单");
      }
    },
    async deleteOrder(ids) {
      const { data } = await this.$ajaxPost("wms/piecepick/deleteStatus.do", {
        reqParam: JSON.stringify({
          ids
        })
      });
      if (data.code === 200) {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getMainList(this.pageObj);
      } else {
        this.$message.error(data.msg);
      }
    },
    changeDeliveryBtn() {
      if (this.ids.length !== 1) {
        this.$message.warning("请选择一条需修改的波次");
      } else {
        this.getAllLogisticsCompany(
          {
            pageNum: 1,
            pageSize: noPagingMaxSize
          },
          data => {
            this.deliveryList = data.data.dataList;
            this.visible.delivery = true;
          }
        );
      }
    },
    enterTrackNumberBtn() {
      if (this.ids.length !== 1) {
        this.$message.warning("请选择一条需录入物流单号的波次");
      } else {
        this.visible.trackNumber = true;
      }
    },
    /**
     * @method 修改物流商
     *
     */
    async confirmChangeDelivery() {
      const { data } = await this.$ajaxPost(
        "wms/piecepick/updatelogcompNameAndexpbillNo.do",
        {
          reqParam: JSON.stringify({
            id: this.ids.join(),
            logcompName: this.logistics.companyName,
            logcompNameId: this.deliveryList.filter(
              item => item.logcompName === this.logistics.companyName
            )[0].id
          })
        }
      );
      if (data.code === 200) {
        this.visible.delivery = false;
        this.$message({
          type: "success",
          message: "修改成功!"
        });
        this.getMainList(this.pageObj);
      } else {
        this.$message.error(data.msg);
      }
    },
    // 确认录入物流单号
    async confirmEnterTrackNumber() {
      if (this.$refs["trackFormRef"]) {
        this.$refs.trackFormRef.validate(valid => {
          if (valid) {
            this.enterTrackNumber();
          }
        });
      }
    },
    async enterTrackNumber() {
      const { data } = await this.$ajaxPost(
        "wms/piecepick/updatelogcompNameAndexpbillNo.do",
        {
          reqParam: JSON.stringify({
            id: this.ids.join(),
            expbillNo: this.track.numbers
          })
        }
      );
      if (data.code === 200) {
        this.visible.delivery = false;
        this.$message({
          type: "success",
          message: "录入成功!"
        });
        this.getMainList(this.pageObj);
      } else {
        this.$message.error(data.msg);
      }
    },
    // 获取所有的物流商
    async getAllLogisticsCompany(requestObj, callback) {
      const { data } = await this.$ajaxPost(
        "wms/logisticsCompany/selectPage.do",
        {
          reqParam: JSON.stringify(requestObj)
        }
      );

      if (data.code === 200) {
        callback && callback(data);
      } else {
        this.$message.error(data.msg);
      }
    },
    // 获取仓库列表
    async getStores() {
      const { data } = await this.$ajaxPost("wms/store/selectPage.do", {
        reqParam: JSON.stringify({
          pageNum: 1,
          pageSize: noPagingMaxSize
        })
      });
      if (data.code === 200) {
        this.advanceFormStoreList = data.data.dataList;
      } else {
        this.$message.error(data.msg);
      }
    },
    // 获取状态列表
    async getStatus() {
      const { data } = await this.$ajaxPost("wms/dataDict/selectItemName.do", {
        reqParam: JSON.stringify({
          typeName: "拣货单状态"
        })
      });
      if (data.code === 200) {
        this.advanceFormPickOrderStatusList = data.data.dataDictList;
      } else {
        this.$message.error(data.msg);
      }
    },
    // 根据销售单号、外部单号、物流单号、手机号/姓名搜索
    codeSearch(value) {
      this.pageObj.pageNum = 1;
      this.resetSearch();
      if (value.trim() === "") {
        delete this.pageObj.search;
        this.getMainList(this.pageObj);
      } else {
        this.getMainList(
          Object.assign(this.pageObj, {
            search: value
          })
        );
      }
    },
    // 高级搜索
    goSearch() {
      if (this.advanceFormInvoiceList.length === 0) {
        this.getDictData("发票类型", "advanceFormInvoiceList");
      }
      if (this.advanceFormOrderList.length === 0) {
        this.getDictData("店铺类型", "advanceFormOrderList");
      }
      if (this.advanceFormOutputList.length === 0) {
        this.getDictData("出库类型", "advanceFormOutputList");
      }

      if (this.advanceFormPickOrderStatusList.length === 0) {
        this.getStatus();
      }
      if (this.advanceFormLogisticsList.length === 0) {
        this.getAllLogisticsCompany(
          {
            pageNum: 1,
            pageSize: noPagingMaxSize
          },
          data => {
            this.advanceFormLogisticsList = data.data.dataList;
          }
        );
      }
      if (this.advanceFormStoreList.length === 0) {
        this.getStores();
      }
      this.visible.search = true;
    },
    handleSearch() {
      let tempSearch = {};
      this.pageObj.pageNum = 1;
      if (this.pageObj.search !== "") {
        delete this.pageObj.search;
      }
      // 处理时间的传参格式
      // 下单时间
      if (this.searchData.placeTime.length !== 0) {
        this.searchData.optStimePlaceTime = this.searchData.placeTime[0];
        this.searchData.optEtimePlaceTime = this.searchData.placeTime[1];
      }
      // 付款时间
      if (this.searchData.payTime.length !== 0) {
        this.searchData.optStimePayTime = this.searchData.payTime[0];
        this.searchData.optEtimePayTime = this.searchData.payTime[1];
      }
      // 接单时间
      if (this.searchData.createTime.length !== 0) {
        this.searchData.optStimeTakeTime = this.searchData.createTime[0];
        this.searchData.optEtimeTakeTime = this.searchData.createTime[1];
      }

      Object.keys(this.searchData).forEach(key => {
        if (key !== "placeTime" || key !== "payTime" || key !== "createTime") {
          if (
            this.searchData[key] !== "" &&
            !Array.isArray(this.searchData[key])
          ) {
            tempSearch[key] = this.searchData[key];
          }
        }
      });
      this.getMainList({
          ...this.pageObj,
          ...tempSearch
        });
      this.visible.search = false;
    },
    // 重置高级搜索表单
    resetSearch() {
      if (this.$refs["searchFormRef"]) {
        this.$refs["searchFormRef"].resetFields();
      }
      (this.searchData.isPrintExpbillyes = ""),
        (this.searchData.isPrintSendbillyes = ""),
        (this.searchData.isPrintExpbillNo = ""),
        (this.searchData.isPrintSendbillNo = ""),
        Object.keys(this.searchData).forEach(key => {
          delete this.pageObj[key];
        });
      [
        "optStimePlaceTime",
        "optEtimePlaceTime",
        "optStimePayTime",
        "optEtimePayTime",
        "optStimeTakeTime",
        "optEtimeTakeTime"
      ].forEach(key => {
        this.searchData[key] = "";
      });
      // console.log(this.searchData);
    },
    /**
     * @method 根据字典表获取高级搜索中的列表数据
     * @param { string } typeNameCN: 字典参数的中文描述
     * @param { string } typeNameEN: 字典参数的英文描述
     */
    async getDictData(typeNameCN, typeNameEN) {
      const { data } = await this.$ajaxPost("wms/dataDict/selectItemName.do", {
        reqParam: JSON.stringify({
          typeName: typeNameCN
        })
      });
      if (data.code === 200) {
        this[typeNameEN] = data.data.dataDictList;
      } else {
        this.$message.error(data.msg);
      }
    },
    // 选择多条数据
    handleSelectionChange(val) {
      this.ids = val.map(item => {
        return item.id;
      });
      this.saleoutIds = val.map(item => {
        return item.saleoutId;
      });
      if (this.ids.length === 1) {
        this.logistics.companyName = val[0].logcompName;
        this.logisticsCode = val[0].logcompCode;
        console.log(this.logisticsCode);
      }
    },
    rowClick(row) {
      if (this.prevInventoryId !== row.id) {
        this.getDetail(row.id);
        this.getUserNote(row.id);
        this.getInvoiceDetail(row.id);
        this.prevInventoryId = row.id;
      }
    },
    //编辑tabs页
    editorTabs() {
      this.isEditorTabs = true;
    },
    //取消编辑
    concelEditorTabs() {
      this.isEditorTabs = false;
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.getMainList(
        Object.assign(this.pageObj, {
          pageSize
        })
      );
    },
    // 当前页改变
    currentChange(pageNum) {
      this.getMainList(
        Object.assign(this.pageObj, {
          pageNum
        })
      );
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/mixin.scss";
@import "../../../styles/common.scss";
.preOrder__item {
  @include fd(row);
  padding: 15px 0;
  &.edit {
    @include flexCenter;
  }
  label {
    width: 100px;
    text-align: right;
    @include sc(14px, $black-333);
  }
  section {
    text-align: left;
    flex: 1;
    @include sc(14px, $gray-666);
  }
}
</style>
<style lang="scss">
@import "../../../styles/mixin.scss";
@import "../../../styles/common.scss";
#pane-goodsDetail {
  .wrap-img {
    padding: 5px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 33px;
      height: 35px;
    }
  }
}
#tab-total {
  p {
    color: $gray-999;
  }
  span {
    margin-right: 20px;
    @include sc(14px, $green-d2a2);
    & + span {
      @include sc(14px, $orange-a356);
    }
  }
}
</style>
