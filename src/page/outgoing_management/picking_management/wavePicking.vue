<template>
  <div class="supplier_management">
    <header class="top-head">
      <el-button type="primary" size="small" @click="handlerPrintShipping">打印发货单</el-button>
      <el-button type="primary" size="small" @click="handlerPrintDelivery">打印快递单</el-button>
      <el-button type="primary" size="small" @click="changeDeliveryBtn">修改物流商</el-button>
      <el-button type="primary" size="small" @click="deleteBtn">删除波次</el-button>
      <div class="header-right f-fr">
        <search placeholder="请输入销售单号、物流单号、波次号进行搜索" 
                @on-search="codeSearch"  
                width="320px" 
                :showIcon="false" 
                ref="search"></search>
        <el-button type="primary" size="small" @click="goSearch">高级搜索</el-button>
      </div>
    </header>
    <el-table v-loading="loadingTable.pick" 
              ref="pickingList" 
              border
              :data="tableData" 
              height="500px" 
              @row-click="rowClick"
              :highlight-current-row='true'
              @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column type="index" align="center" label="行号" width="60"></el-table-column>
      <el-table-column align="center" prop="tags" label="打印标记" width="150">
        <template slot-scope="scope">
          <ul :class="[scope.row.tags.invoice === 0 ? 'tag-wavepick--three' : 'tag-wavepick--two','tag-wavepick']">
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
      <el-table-column align="center" prop="createTime" label="生成时间" width="150"></el-table-column>
      <el-table-column align="center" prop="pickNo" label="波次号" width="200"></el-table-column>
      <el-table-column align="center" prop="logcompName" label="物流商"></el-table-column>
      <el-table-column align="center" prop="wavetruleName" label="波次规则"></el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
            {{scope.row.status | saleStatus }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="orderNum" label="订单数量"></el-table-column>
      <el-table-column align="center" prop="pickQty" label="商品数量"></el-table-column>
      <el-table-column align="center" prop="surplusQty" label="待拣货数"></el-table-column>
      <el-table-column align="center" prop="dataMode" label="数据来源">
        <template slot-scope="scope">
            {{scope.row.dataMode | dataSourceType }}
        </template>
      </el-table-column>
     <el-table-column align="center" prop="updateTime" width="150" label="更新时间"></el-table-column>
      <el-table-column align="center" prop="updateByname" width="120" label="更新人"></el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination background :page-sizes="[15, 30, 50, 100]"
                   :page-size="pageObj.pageSize"
                   :total="total.pick"
                   layout="total, prev, pager, next, sizes, jumper"
                   @size-change="sizeChange"
                   @current-change="currentChange"
                   :current-page.sync="pageObj.pageNum"
                   style="margin-top: 20px;text-align: center;">
    </el-pagination>

    <div class="tabBox">
      <el-tabs v-model="tabActive" 
              @tab-click="handleClick" 
              border
              type="border-card" 
              style="margin-top: 20px;min-height: 320px;">
        <el-tab-pane label="订单明细" 
                     name="orderDetail">
          <el-table ref="inventory" 
                    border
                    v-loading="loadingTable.inventory" 
                    :data="inventoryTableData">
            <el-table-column align="center" type="index" label="行号" width="60"></el-table-column>
            <el-table-column align="center" label="操作" width="120">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="removeBtn(scope.row)">移除</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="tags" label="打印标记">
               <template slot-scope="scope">
                <ul :class="[scope.row.tags.invoice === 0 ? 'tag-wavepick--three' : 'tag-wavepick--two','tag-wavepick']">
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
            <el-table-column align="center" prop="saleoutNo" width="200" label="销售单号"></el-table-column>
            <el-table-column align="center" prop="status" label="状态">
              <template slot-scope="scope">
                  {{scope.row.status | saleStatus }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="pickQty" label="商品数量"></el-table-column>
            <el-table-column align="center" prop="ToBopicked" label="待拣货数"></el-table-column>
            <el-table-column align="center" prop="logcompName" label="物流商"></el-table-column>
            <el-table-column align="center" prop="expbillNo" width="180" label="物流单号"></el-table-column>
            <el-table-column align="center" prop="contactName" label="收货人"></el-table-column>
            <el-table-column align="center" prop="address" show-overflow-tooltip label="收货地址" width="200"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  
    <el-dialog title="高级筛选" 
               :visible.sync="visible.search" 
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               class="advanceFilter">
      <el-form :model="searchData"
                ref="searchFormRef"
                label-width="120px">
        <el-row type="flex" justify="space-between">
          <el-col :span="11">
              <el-form-item prop="optTime" label="波次生成时间：">
                <el-date-picker
                  v-model="searchData.optTime"
                  type="daterange"
                  size="small" 
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  range-separator="至"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00']"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
          </el-col>
          <el-col :span="11">
              <el-form-item prop="status" label="状态：">
                <el-select size="small" v-model="searchData.status" placeholder="请选择">
                  <el-option
                      v-for="item in advanceFormPickOrderStatusList"
                      :key="item.itemValue"
                      :label="item.itemName"
                      :value="item.itemValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="11">
              <el-form-item prop="logcompId" label="物流商：">
              <el-select size="small" v-model="searchData.logcompId" placeholder="请选择">
                <el-option
                      v-for="item in advanceFormLogisticsList"
                      :key="item.id"
                      :label="item.logcompName"
                      :value="item.id">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="waveruleId" label="波次规则：">
              <el-select size="small" v-model="searchData.waveruleId" placeholder="请选择">
               <el-option
                    v-for="item in advanceFormWaveRegList"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemValue">
                </el-option>
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
                    :value="item.itemValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="other" label="其他条件：">
              <el-checkbox v-model="searchData.other">显示拣货完成的波次</el-checkbox>
            </el-form-item>
          </el-col>
       </el-row>
       <el-row type="flex" justify="space-between">
          <el-col :span="24">
            <el-form-item prop="tagList" label="打印标记：">
             <el-checkbox-group v-model="searchData.tagList">
                <el-checkbox label="已打快递单"></el-checkbox>
                <el-checkbox label="已打发货单"></el-checkbox>
                <el-checkbox label="未打快递单"></el-checkbox>
                <el-checkbox label="未打发货单"></el-checkbox>
              </el-checkbox-group>
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

    <el-dialog title="修改物流商" 
               :visible.sync="visible.delivery"  
               width="24%"
               :modal-append-to-body="false">
      <el-form :model="logistics" label-width="110px">
        <el-form-item prop="companyName" label="物流商：">
          <el-select size="small" v-model="logistics.companyName" placeholder="请选择" style="width:100%;">
            <el-option
                v-for="item in deliveryList"
                :key="item.id"
                :label="item.logcompName"
                :value="item.logcompName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row type="flex" justify="end">
            <el-button size="small" @click="visible.delivery = false">取消</el-button>
            <el-button size="small" type="primary" @click="confirmChangeDelivery">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog title="打印快递单" 
                width="32%"
                :close-on-click-modal="false"
                :visible.sync="visible.express">
        <express-shipping :tplList="printTplList"
                          :count="printNum"
                          :selectIds="ids"
                          :logisticsCode="logisticsCode"
                          @getPrintMachine="getPrintMachine"
                          @getPrintExpress="getPrintExpress"/>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="visible.express = false">取 消</el-button>
          <el-button size="small" type="primary" @click="doPrintExpress">确定打印</el-button>
        </div>
    </el-dialog>

    <el-dialog title="打印发货单" 
                width="28%"
                @close="resetPrint"
                :close-on-click-modal="false"
                :visible.sync="visible.shipping">
        <print-shipping :tplList="printTplList"
                        :count="printNum"/>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="visible.shipping = false">取 消</el-button>
          <el-button size="small" type="primary" @click="doPrint">确定打印</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  import PrintShipping from '@/components/print/shipping.vue';
  import ExpressShipping from '@/components/print/express.vue';
  // import shippingData from '@/assets/json/shippingData.json';
  import { noPagingMaxSize } from '@/assets/js/constVarible.js';

  export default {
    data(){
      return{
        ids:[],
        saleoutIds: [],
        tableData:[],
        inventoryTableData: [],
        deliveryList: [],
        shippingData: [],
        printTplList: [],
        printNum: {},
        caiNiaoPrintDefault: '',
        expressPrintLogistic: '',
        logisticsCode: '',
        searchData:{
          optTime: [],
          status:'',
          logcompId:'',
          waveruleId:'',
          typeInvoice:'',
          // TODO 缺少其他条件 & 打印标记
          other: false,
          tagList: [],
        },
        logistics: {
          companyName: '',
        },
        pageObj: {
          pageNum: 1,
          pageSize: 15,
        },
        loadingTable: {
          pick: true,
          inventory: true,
        },
        total: {
          pick: 0,
        },
        visible: {
          shipping: false,
          delivery: false,
          search: false,
          express: false,
        },
        prevInventoryId: -1,
        // 高级搜索中的列表
        advanceFormInvoiceList: [],
        advanceFormPickOrderStatusList: [],
        advanceFormWaveRegList: [],
        advanceFormLogisticsList: [],
        tabActive: 'orderDetail',
        inventory:[], //商品明细表格
        isEditorTabs:false,  //是否在编辑tab页
      }
    },
    components: {
      PrintShipping,
      ExpressShipping,
    },
    mounted() {
      this.getMainList(this.pageObj);
    },
    methods:{
      /**
        * @method 获取波次拣货列表
        */
      async getMainList(params) {
        const { data } = await this.$ajaxPost('wms/wavepick/selectPage.do', {
          reqParam: JSON.stringify(params),
        });
        if (data.code === 200) {
          this.tableData = data.data.dataList.map((item) => {
            return {
              ...item,
              tags: {
                exp: item.isPrintExpbill,
                bill: item.isPrintSendbill,
                invoice: item.isPrintInvoice,
              },
            }
          });
          this.total.pick = data.data.totalNum;
          this.loadingTable.pick = false;
          if (this.tableData.length !== 0) {
            this.prevInventoryId = this.tableData[0].id;
            //默认选择第一行
            this.$refs.pickingList.setCurrentRow(this.tableData[0]);
            this.getDetail(this.prevInventoryId);
          } else {
            this.loadingTable.inventory = false;
            //搜索为空时  清空商品明细
            this.inventoryTableData = [];
          }
        } else {
          this.loadingTable.pick = true;
        }
      },
      async getDetail(id) {
        const { data } = await this.$ajaxPost('wms/wavepickDetail/selectById.do', {
          reqParam: JSON.stringify({
            id,
          }),
        });
        if (data.code === 200) {
          this.inventoryTableData = data.data.map((item) => {
            return {
              ...item,
              tags: {
                exp: item.isPrintExpbill,
                bill: item.isPrintSendbill,
                invoice: item.isPrintInvoice,
              },
            }
          });;
          // this.total.inventory = data.data.totalNum;
          this.loadingTable.inventory = false;
        } else {
          this.loadingTable.inventory = true;
        }
      },
      // 打印发货单
      handlerPrintShipping(){
        if (this.ids.length > 0) {
          this.getPrintTplList();
          this.getPrintNum('shipping');
          this.getPrintData();
        } else {
          this.$message.warning('请至少选择一条数据');
        }
      },
      //打印快递单
      handlerPrintDelivery() {
        if (this.ids.length > 0) {
          this.getPrintTplList();
          this.getPrintNum('express');
          this.getExpressPrintData();
        } else {
          this.$message.warning('请至少选择一条数据');
        }
      },
      // 获取打印的模板列表
      async getPrintTplList() {
        const { data } = await this.$ajaxPost('wms/confPrint/selectPage.do', {
          reqParam: JSON.stringify({
            pageNum: 1, 
            pageSize: noPagingMaxSize,
          }),
        });
        if (data.code === 200) {
          this.printTplList = data.data.dataList;
        } else {
          this.$message.error(data.msg);
        }
      },
      // 获取打印的数量
      async getPrintNum(type) {
        const { data } = await this.$ajaxPost('wms/saleoutPrint/saleoutPrintCount.do', {
          reqParam: JSON.stringify({
            saleoutIds: this.saleoutIds.join(), 
          }),
        });
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
        const { data } = await this.$ajaxPost('wms/saleoutPrint/saleoutOutPrint.do', {
          reqParam: JSON.stringify({
            ids: this.saleoutIds.join(), 
          }),
        });
        if (data.code === 200) {
          if(data.data.dataList.length > 0){
            this.shippingData = [];
            data.data.dataList.forEach(item => {
              console.log(item);
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
        const { data } = await this.$ajaxPost('wms/saleoutPrint/saleoutLogisticsPrint.do', {
          reqParam: JSON.stringify({
            ids: this.saleoutIds.join(), 
          }),
        });
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
         this.shippingData.forEach((item) => {
           sendMsg(item);
         })
      },
      // 打印快递单
      doPrintExpress() {
        if ('SF' === this.expressPrintLogistic) {
          this.doPrint();
        } else {
          this.$Print.doPrint(this.shippingData, {
            printer: this.caiNiaoPrintDefault,
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
      //生成波次拣货单
      wavePickingBtn() {
        if (this.ids.length>0) {

        } else {
          this.$message.warning('请至少选择一条数据');
        }
      },
      // 删除波次
      deleteBtn() {
        if (this.ids.length > 0) {
          this.$confirm('删除此波次以后，订单将进入待分配列表，需重新生成拣货单', '删除确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteWavePick(this.ids.join());
          }).catch(() => {
             this.$message({
              type: 'info',
              message: '已取消删除操作'
            });
          });
        } else {
          this.$message.warning('请至少选择一条数据');
        }
      },
      changeDeliveryBtn() {
        if (this.ids.length !== 1) {
          this.$message.warning('请选择一条需修改的波次');
        } else {
          this.getAllLogisticsCompany((data) => {
            this.deliveryList = data.data.dataList;
            this.visible.delivery = true;
          });
        }
      },
      /**
       * @method 修改物流商
       * 
       */
      async confirmChangeDelivery() {
        const { data } = await this.$ajaxPost('wms/wavepick/updatelogcompNameAndexpbillNo.do', {
          reqParam: JSON.stringify({
            id: this.ids.join(),
            logcompName: this.logistics.companyName,
            logcompNameId: this.deliveryList.filter((item) => item.logcompName === this.logistics.companyName)[0].id,
          }),
        });
        if (data.code === 200) {
          this.$message({
              type: 'success',
              message: '修改成功!'
          });
          this.getMainList(this.pageObj);
        } else {
          this.$message.error(data.msg);
        }
      },
      async deleteWavePick(ids) {
        const { data } = await this.$ajaxPost('wms/wavepick/delete.do', {
          reqParam: JSON.stringify({
            ids,
          }),
        });
        if (data.code === 200) {
          this.$message({
              type: 'success',
              message: '删除成功!'
          });
          this.getMainList(this.pageObj);
        } else {
          this.$message.error(data.msg);
        }
      },
      // 移除波次
      removeBtn(row) {
        this.$confirm('从波次中移除此订单后，订单将进入待分配列表，需重新生成拣货单', '移除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeMavePick(row.id);
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消移除操作'
          });
        });
      },
      async removeMavePick(id){
        const { data } = await this.$ajaxPost('wms/wavepickDetail/deleteOrder.do', {
          reqParam: JSON.stringify({
            id,
          }),
        });
        if (data.code === 200) {
          this.$message({
              type: 'success',
              message: '删除成功!'
          });
          this.getMainList(this.pageObj);
        } else {
          this.$message.error(data.msg);
        }
      },
      rowClick(row) {
        if (this.prevInventoryId !== row.id) {
          this.getDetail(row.id);
          this.prevInventoryId = row.id;
        }
      },
      // 根据销售单号、外部单号、物流单号、手机号/姓名搜索
      codeSearch(value) {
        this.pageObj.pageNum = 1;
        this.resetSearch();
        if (value.trim() === '') {
          delete this.pageObj.search;
          this.getMainList(this.pageObj);
        } else {
          this.getMainList(Object.assign(this.pageObj, {
            search: value,
          }));
        }
        // this.$refs.search.showToggleTable = false;
      },
      // 高级搜索
      goSearch(){
        if (this.advanceFormInvoiceList.length === 0) {
          this.getDictData('发票类型','advanceFormInvoiceList');
        }
        if (this.advanceFormPickOrderStatusList.length === 0) {
          this.getDictData('拣货单状态','advanceFormPickOrderStatusList');
        }
        if (this.advanceFormWaveRegList.length === 0) {
          this.getDictData('波次规则','advanceFormWaveRegList');
        }
        if (this.advanceFormLogisticsList.length === 0) {
          this.getAllLogisticsCompany((data) => {
            this.advanceFormLogisticsList = data.data.dataList;
          });
        }
        this.visible.search = true;
      },
      handleSearch() {
        let tempSearch = {};
        this.pageObj.pageNum = 1;
        if (this.pageObj.search !== '') {
          delete this.pageObj.search;
        }
        // 处理时间的传参格式
          // 波次生成时间
        if (this.searchData.optTime.length !== 0) {
          this.searchData.optStime = this.searchData.optTime[0];
          this.searchData.optEtime = this.searchData.optTime[1];
        }

        Object.keys(this.searchData).forEach((key) => {
          if (key !== 'optTime') {
            if (this.searchData[key] !== '' && !Array.isArray(this.searchData[key])) {
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
          if (this.$refs['searchFormRef']) {
              this.$refs['searchFormRef'].resetFields();
           }
           Object.keys(this.searchData).forEach((key) => {
              delete this.pageObj[key];
           });
           ['optStime', 
             'optEtime', 
            ].forEach((key) => {
             this.searchData[key] = '';
           });
      },
      /**
       * @method 根据字典表获取高级搜索中的列表数据
       * @param { string } typeNameCN: 字典参数的中文描述
       * @param { string } typeNameEN: 字典参数的英文描述
       */
      async getDictData(typeNameCN, typeNameEN) {
        const { data } = await this.$ajaxPost('wms/dataDict/selectItemName.do', {
          reqParam: JSON.stringify({
            typeName: typeNameCN,
          }),
        });
        if (data.code === 200) {
          this[typeNameEN] = data.data.dataDictList;
        } else {
          this.$message.error(data.msg);
        }
      },
      // 获取所有的物流商
      async getAllLogisticsCompany(callback) {
        const { data } = await this.$ajaxPost('wms/logisticsCompany/selectPage.do', {
          reqParam: JSON.stringify({
            pageNum: 1, 
            pageSize: noPagingMaxSize,
          }),
        });

        if (data.code === 200) {
          callback && callback(data);
        } else {
          this.$message.error(data.msg);
        }
      },
      //清空搜索条件
      concelTerm(){
        Object.keys(this.filterParam).forEach(key => {
          this.filterParam[key] = '';
        });
        // this.filterParam.status='0';
        // this.getTemplateList();
      },
      // 选择多条数据
      handleSelectionChange(val) { 
        this.ids = val.map(item => {
          return item.id
        });
        if (this.ids.length === 1) {
          this.logistics.companyName = val[0].logcompName;
          this.logisticsCode = val[0].logcompCode;
        }
        let json_param=JSON.stringify({id:this.ids.join(',')})
        this.$ajaxPost('wms/wavepickDetail/selectById.do',{reqParam:json_param}).then(({data})=>{
          if(data.code==200){
            this.saleoutIds = data.data.map(item => {
              return item.id;
            });
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      handleClick(tab, event) {
        this.isEditorTabs=false;
      },
      //编辑tabs页
      editorTabs(){
        this.isEditorTabs=true;
      },
      //取消编辑
      concelEditorTabs(){
        this.isEditorTabs=false;
      },
      // 每页数量改变
      sizeChange(pageSize) {
        this.getMainList(Object.assign(this.pageObj, {
          pageSize,
        }));
      },
      // 当前页改变
      currentChange(pageNum) {
        this.getMainList(Object.assign(this.pageObj, {
          pageNum,
        }));
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/mixin.scss';
  @import '../../../styles/common.scss';
</style>
