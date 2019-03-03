<template>
  <div class="supplier_management">
    <header class="top-head">
      <el-button type="primary" size="small" @click="singlePickingBtn">生成单个拣货单</el-button>
      <el-button type="primary" size="small" @click="wavePickingBtn">生成波次拣货单</el-button>
      <el-button type="primary" size="small" @click="changeDeliveryBtn">修改物流商</el-button>
      <el-button type="primary" size="small" @click="enterTrackNumberBtn">录入物流单号</el-button>
      <el-button type="primary" size="small" @click="deleteSaleBtn">删除</el-button>
      <el-button type="primary" size="small" @click="interceptOrderBtn">拦截订单</el-button>
      
      <div class="header-right f-fr">
        <search placeholder="请输入销售单号、外部单号、物流单号、手机号/姓名，进行搜索" 
                @on-search="codeSearch" 
                width="420px" 
                :showIcon="false" 
                ref="search"></search>
        <el-button type="primary" size="small" @click="goSearch">高级搜索</el-button>
      </div>
    </header>
    <el-table v-loading="loadingTable.sales" 
              ref="salesList"
              border
              :data="tableData" 
              height="500px" 
              @row-click="rowClick"
              :highlight-current-row='true'
              @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column type="index" align="center" label="行号" width="60"></el-table-column>
      <el-table-column align="center" prop="waitTime" label="等待时间" width="120" sortable></el-table-column>
      <el-table-column align="center" prop="saleoutNo" label="订单号" width="200"></el-table-column>
      <el-table-column align="center" prop="type" label="出库类型">
           <template slot-scope="scope">
            {{scope.row.type | outPutType}}
          </template>
      </el-table-column>
      <el-table-column align="center" prop="logcompName" label="物流商" width="120"></el-table-column>
      <el-table-column align="center" prop="expbillNo" label="物流单号" width="180"></el-table-column>
      <el-table-column align="center" prop="address" label="收货地址" width="200">
         <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.address" placement="top">
               <p class="textOverFlow">{{scope.row.address}}</p>
            </el-tooltip>
          </template>
      </el-table-column>
      <el-table-column align="center" prop="contactName" width="120" label="收货人姓名"></el-table-column>
      <el-table-column align="center" prop="contactPhone" width="120" label="收货人手机号"></el-table-column>
      <el-table-column align="center" prop="isInvoice" label="是否开票">
         <template slot-scope="scope">
            {{scope.row.isInvoice === 0 ? '是' : '否'}}
          </template>
      </el-table-column>
      <el-table-column align="center" prop="payType" label="付款方式" width="95">
         <template slot-scope="scope">
            {{scope.row.payType | payWayType}}
          </template>
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
      <el-table-column align="center" prop="dataMode" label="数据来源">
        <template slot-scope="scope">
            {{scope.row.dataMode | dataSourceType }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updateTime" width="150" label="更新时间"></el-table-column>
      <el-table-column align="center" prop="updateByname" width="120" label="更新人"></el-table-column>
    </el-table>
    <el-pagination background :page-sizes="[15,30,50,100]"
                   :page-size="pageObj.pageSize"
                   :total="total.sales"
                   layout="total, prev, pager, next, sizes, jumper"
                   @size-change="sizeChange"
                   @current-change="currentChange"
                   :current-page.sync="pageObj.pageNum">
    </el-pagination>

    <div class="tabBox">
      <el-tabs v-model="tabActive" 
               @tab-click="tabChange" 
               type="border-card" 
               style="margin-top: 20px;min-height: 320px;">
        <el-tab-pane label="商品明细" name="goodsDetail">
           <el-table ref="inventory" 
                     border
                     v-loading="loadingTable.inventory" 
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
            <el-table-column align="center" prop="saleoutQty" label="数量" width="120">
              <template slot-scope="scope">
                <el-input v-show="editing" v-model="scope.row.saleoutQty" size="mini" placeholder="请输入数量"></el-input>
                <p v-show="!editing">{{scope.row.saleoutQty}}</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="saleoutAmount" label="金额" width="120"></el-table-column>
            <el-table-column v-if="editing" align="center" label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="remove(scope.row)" >移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane class="preOrder" label="订单信息" name="orderInfo">
          <el-row type="flex" justify="space-between" :gutter="20">
            <el-col class="preOrder__item" :span="6">
              <label>订单号：</label>
              <section>{{orderDetail.saleoutNo}}</section>
            </el-col>
            <el-col class="preOrder__item" :span="6">
              <label>店铺名称：</label>
              <section>{{orderDetail.onlstoreName}}</section>
            </el-col>
            <el-col class="preOrder__item" :span="6">
              <label>订单渠道：</label>
              <section>{{orderDetail.onlstorePlatform}}</section>
            </el-col>
             <el-col class="preOrder__item" :span="6">
              <label>买家ID：</label>
              <section>{{orderDetail.buyerId}}</section>
            </el-col>
          </el-row>

           <el-row type="flex" :gutter="20">
            <el-col class="preOrder__item" :span="6">
              <label>外部单号：</label>
              <section>{{orderDetail.extNo}}</section>
            </el-col>
            <el-col class="preOrder__item" :span="6">
              <label>物流商：</label>
              <section>{{orderDetail.logcompName}}</section>
            </el-col>
            <el-col class="preOrder__item" :span="6">
              <label>物流单号：</label>
              <section>{{orderDetail.expbillNo}}</section>
            </el-col>
          </el-row>

          <section v-if="!editing">
            <el-row type="flex" :gutter="20">
              <el-col class="preOrder__item" :span="6">
                <label>省市区/县：</label>
                <section>{{orderDetail.provinceName}}-{{orderDetail.cityName}}-{{orderDetail.districtName}}</section>
              </el-col>
              <el-col class="preOrder__item" :span="6">
                <label>街道地址：</label>
                <section>{{orderDetail.address}}</section>
              </el-col>
            </el-row>
          </section>
          <section v-else>
            <el-form :model="orderDetail"
                      :rules="orderFormRef"
                      label-width="120px">
              <el-row type="flex" :gutter="20">
                <el-col class="preOrder__item edit" :span="12">
                  <label>省市区/县：</label>
                  <section>
                    <el-select v-model="orderDetail.provinceId"
                              size="small"
                              placeholder="请选择省份"
                              @change="provinceChange"
                              clearable>
                          <el-option v-for="item in provinceList"
                                :label="item.regionName"
                                :value="item.id"
                                :key="item.id"></el-option>
                    </el-select>
                  </section>
                  <section>
                    <el-select v-model="orderDetail.cityId"
                              size="small"
                              placeholder="请选择城市"
                              @change="cityChange"
                              clearable>
                          <el-option v-for="item in cityList"
                                :label="item.regionName"
                                :value="item.id"
                                :key="item.id"></el-option>
                    </el-select>
                  </section>
                  <section>
                    <el-select v-model="orderDetail.districtId"
                              size="small"
                              placeholder="请选择区县"
                              clearable>
                          <el-option v-for="item in countryList"
                                :label="item.regionName"
                                :value="item.id"
                                :key="item.id"></el-option>
                    </el-select>
                  </section>
                </el-col>
                <el-col class="preOrder__item edit" :span="10">
                  <label>街道地址：</label>
                  <section>
                    <el-input size="small" v-model="orderDetail.address" placeholder="请输入详细街道地址"></el-input>
                  </section>
                </el-col>
              </el-row>
            </el-form>
          </section>
           
        </el-tab-pane>
        <el-tab-pane label="备注/留言" name="remark">
         <note :noteData="noteDetail" :editing="editing"></note>
        </el-tab-pane>
        <el-tab-pane label="发票信息" name="invoice">
          <section v-if="Object.keys(invoiceDetail).length !== 0">
            <div v-if="!editing">
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
            </div>
            <div v-else>
              <el-form :model="invoiceDetail"
                        ref="invoiceFormRef"
                        :rules="invoiceFormRules"
                        label-width="120px">
                <el-row type="flex">
                  <el-col :span="6">
                    <el-form-item prop="type" label="发票类型：">
                      <el-select style="width:100%;" size="small" v-model="invoiceDetail.type" placeholder="请选择">
                        <el-option
                            v-for="item in advanceFormInvoiceList"
                            :key="item.itemValue"
                            :label="item.itemName"
                            :value="item.itemValue">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="buyerName" label="购买方名称：">
                      <el-input size="small" v-model="invoiceDetail.buyerName"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="buyerTaxno" label="购买方税号：">
                      <el-input size="small" v-model="invoiceDetail.buyerTaxno"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="contactPhone" label="购买方电话：">
                      <el-input size="small" v-model="invoiceDetail.contactPhone"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row type="flex">
                  <el-col :span="6">
                    <el-form-item prop="depositBank" label="购买方开户行：">
                      <el-input size="small" v-model="invoiceDetail.depositBank"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="depositAccount" label="购买方账号：">
                      <el-input size="small" v-model="invoiceDetail.depositAccount"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="address" label="购买方地址：">
                      <el-input size="small" v-model="invoiceDetail.address"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row type="flex">
                  <el-col :span="6">
                    <el-form-item prop="invoiceAmount" label="发票金额：">
                      <el-input size="small" v-model="invoiceDetail.invoiceAmount"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="note" label="发票备注：">
                      <el-input size="small" v-model="invoiceDetail.note"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                 <el-row type="flex">
                  <el-col :span="6">
                    <el-form-item prop="sellerName" label="销售方名称：">
                      <el-input size="small" v-model="invoiceDetail.sellerName"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="sellerTaxno" label="销售方税号：">
                      <el-input size="small" v-model="invoiceDetail.sellerTaxno"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </section>
          <section class="noData" v-else>
            <div class="noData-img"></div>
            <p>暂无发票信息</p>
          </section>
        </el-tab-pane>
        <el-tab-pane label="库存状况查看" name="stock">
          <el-table ref="statusData" 
                    border
                    :data="stockData">
            <el-table-column type="index" align="center" label="行号" width="60"></el-table-column>
            <el-table-column align="center" prop="skuCode" label="SKU"></el-table-column>
            <el-table-column align="center" prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column align="center" prop="properties" label="规格属性"></el-table-column>
            <el-table-column align="center" prop="stockQty" label="可用库存"></el-table-column>
            <el-table-column align="center" prop="lockQty" label="锁定库存"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="total" disabled>
          <p slot="label">总数量为：
            <span>{{inventoryTableData.length == 0 ? '' : inventoryTableData[0].saleoutQtySum}}</span>
            总金额为：
            <span>{{inventoryTableData.length == 0 ? '' : inventoryTableData[0].saleoutAmountSum}}</span>
          </p>
        </el-tab-pane>
      </el-tabs>
      <div class="buttonBox" v-if="canEdit === 0 && showEditBtn">
        <div v-if="!editing">
          <el-button type="text" @click="goEdit">编辑</el-button>
          <el-button type="text" 
            v-clipboard:copy="copyText"
            v-clipboard:success="onCopySuccess"
            v-clipboard:error="onCopyError"
            v-if="showCopyBtn">复制</el-button>
        </div>
        <div v-else>
            <el-button type="text" @click="cancelEdit">取消</el-button>
            <el-button type="text" @click="saveEdit">保存</el-button>
        </div>
      </div>
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
             <el-form-item prop="goodsName" label="商品名称：">
              <el-input size="small" v-model="searchData.goodsName" placeholder="" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="skuCode" label="商品编码/SKU：">
              <el-input size="small" v-model="searchData.skuCode" placeholder="" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="11">
              <el-form-item prop="buyerId" label="买家ID：">
                <el-input size="small" v-model="searchData.buyerId" placeholder="" maxlength="20"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="11">
             <el-form-item prop="contactPhone" label="收件人手机号：">
              <el-input size="small" v-model="searchData.contactPhone" placeholder="" maxlength="20"></el-input>
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
                  style="width: 100%">
                </el-date-picker>
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
                style="width: 100%">
              </el-date-picker>
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
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="type" label="出库类型：">
              <el-select size="small" v-model="searchData.type" placeholder="请选择">
                <el-option
                    v-for="item in advanceFormOutputList"
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
            <el-form-item prop="onlstorePlatform" label="订单渠道：">
              <el-select size="small" v-model="searchData.onlstorePlatform" placeholder="请选择">
               <el-option
                    v-for="item in advanceFormOrderList"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
       <el-row type="flex" justify="space-between">
          <el-col :span="11">
            <el-form-item prop="onlstoreName" label="店铺：">
              <el-select filterable 
                        size="small" 
                         clearable 
                         v-model="searchData.onlstoreName" 
                         placeholder="请选择">
                <el-option
                    v-for="item in advanceFormStoreList"
                    :key="item.storeName"
                    :label="item.storeName"
                    :value="item.storeName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
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
       </el-row>
       <el-row type="flex" justify="end">
        <el-form-item style="margin-bottom: 0px;">
          <el-button size="small" @click="resetSearch">清空条件</el-button>
          <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
        </el-form-item>
       </el-row>
      </el-form>
    </el-dialog>

    <el-dialog title="库存不足" 
              :visible.sync="visible.lowStock" 
              v-loading="loadingTable.lowStock" 
              :modal-append-to-body="false" 
              class="lowStock">
      <p>以下商品库存不足，请先补货，再生成对应拣货单：</p>
      <el-table ref="lowStocksList" 
                v-loadmore="loadMore"
                height="400"
                border
                :data="lowStocksList">
        <el-table-column type="index" align="center" label="行号" width="60"></el-table-column>
        <el-table-column align="center" prop="skuCode" label="SKU"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="enableQty" label="剩余可用库存"></el-table-column>
        <el-table-column align="center" prop="saleoutQty" label="代发货数"></el-table-column>
        <el-table-column align="center" prop="supplement" label="待补货数"></el-table-column>
      </el-table>
      <el-row type="flex" style="marginTop: 20px;" justify="end">
        <el-button type="primary" @click="downloadLowStock">下载补货清单</el-button>
      </el-row>
    </el-dialog>

    <el-dialog title="修改物流商" 
               :visible.sync="visible.delivery"  
               width="24%"
               :close-on-click-modal="false"
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

    <el-dialog title="录入物流单号" 
               :visible.sync="visible.trackNumber"  
                width="24%"
               :close-on-click-modal="false"
               :modal-append-to-body="false">
      <el-form :model="track" 
                ref="trackFormRef"
               :rules="trackFormRules"
               label-width="110px">
        <el-form-item prop="numbers" label="物流单号：">
          <el-input size="small" v-model="track.numbers"></el-input>
        </el-form-item>
        <el-row type="flex" justify="end">
            <el-button size="small" @click="visible.trackNumber = false">取消</el-button>
            <el-button size="small" type="primary" @click="confirmEnterTrackNumber">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Inventory from '@/components/salesTabs/inventory';
  import inventoryStatus from '@/components/salesTabs/inventoryStatus';
  import invoiceInfor from '@/components/salesTabs/invoiceInfor';
  import note from '@/components/salesTabs/note';
  import { Util } from '@/assets/js/util';
  import { RPOSITIVE_INT }  from '@/assets/js/regExp';
  import { invoiceType } from '@/assets/js/filters';
  import { 
    noPagingMaxSize,
    OutPutNoSelectTxt, 
  } from '@/assets/js/constVarible';

    const throttle = (method, duration) => {
        let begin = new Date();
        return () => {
            let current = new Date();
            if(current-begin >= duration){
                    method.apply(this, ...arguments);
                    begin = current;
            }
        } 
    };

  export default {
    data(){
      return{
        ids:[],
        tableData:[],
        inventoryTableData: [],
        tempInventoryTableData: [],
        orderDetail: {},
        deliveryList: [],
        orderFormRef: {
          origin: [{ 
            required: true, trigger: 'blur', message: '请选择省份'
          }],
          cityId: [{
            required: true, trigger: 'blur', message: '请选择城市'
          }],
          districtId: [{
            required: true, trigger: 'blur', message: '请选择区县'
          }]
        },
        noteDetail: {},
        tempNote: '',
        invoiceDetail: {},
        invoiceFormRules: {
          buyerName: [{
            trigger: 'change', validator: this.$Regs.RegMin2MaxChar(2, 20),
          }],
          buyerTaxno: [{
            trigger: 'change', validator: this.$Regs.RegMin2MaxNumberAndLetter(10, 20),
          }],
          contactPhone: [{
            trigger: 'change', validator: this.$Regs.RegMin2MaxNumber(5, 11),
          }],
          depositBank: [{
            trigger: 'change', validator: this.$Regs.RegMin2MaxChar(2, 30),
          }],
          depositAccount: [{
            trigger: 'change', validator: this.$Regs.RegMin2MaxChar(5, 30),
          }],
          address: [{
            trigger: 'change', validator: this.$Regs.RegMin2MaxChar(5, 30),
          }],
          invoiceAmount: [{
            trigger: 'change', validator: this.$Regs.RegMin2MaxNumber(0, 999999, false),
          }],
          sellerName: [{
            trigger: 'change', validator: this.$Regs.RegMin2MaxChar(2, 20),
          }],
          sellerTaxno: [{
            trigger: 'change', validator: this.$Regs.RegMin2MaxNumberAndLetter(10, 20),
          }]
        },
        tempInvoiceDetail: {},
        stockData: [],
        addSupplierDia:false,
        lowStocks:false,
        searchData:{
          goodsName:'',
          skuCode:'',
          buyerId:'',
          contactPhone:'',
          placeTime: [],
          payTime: [],
          createTime: [],
          type:'',
          logcompId:'',
          onlstorePlatform:'',
          onlstoreName:'',
          typeInvoice:'',
        },
        logistics: {
          companyName: '',
        },
        track:{
          numbers: '',
        },
        trackFormRules: {
          numbers: [{
            trigger: 'change', validator: this.$Regs.RegMin2MaxWithOutCN(5, 30),
          }]
        },
        lowStocksList:[],
        tabActive: 'goodsDetail',
        // 编辑权限： 0:可以编辑  -1:不可编辑
        canEdit: -1, 
        // 是否显示编辑按钮
        showEditBtn: false,
        // 是否显示复制按钮
        showCopyBtn: false,
        copyText: '',
        // 是否在编辑中
        editing: false,
        pageObj: {
          pageNum: 1,
          pageSize: 15,
        },
        total: {
          sales: 0,
          inventory: 0,
        },
        loadingTable: {
          sales: true,
          inventory: true,
          lowStock: true,
        },
        visible: {
          lowStock: false,
          search: false,
          delivery: false,
          trackNumber: false,
        },
        prevInventoryId: -1,
        // 高级搜索中的列表
        advanceFormInvoiceList: [],
        advanceFormOrderList: [],
        advanceFormOutputList: [],
        advanceFormLogisticsList: [],
        advanceFormStoreList: [],
        provinceList: [],
        cityList: [],
        countryList: [],
        // 默认动态表格有下一页
        canTableScroll: true,
      }
    },
    components: {
      Inventory,
      inventoryStatus,
      invoiceInfor,
      note,
    },
    directives: {
        loadmore: {
            inserted: (el, binding) => {
                const calcHeight = () => {
                    const sign = 100;
                    console.log(this.scrollHeight , this.scrollTop , this.clientHeight);
                    const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
                    if (scrollDistance <= sign) {
                        // binding.value()
                    }
                };
                // el.querySelector('.el-table__body-wrapper').addEventListener('scroll', throttle(calcHeight()), 0.2e3), false);
            }
        },
    },
    mounted() {
      this.getMainList(this.pageObj);
    },
    methods: {
       /**
        * @method 获取待分配的销售单
        */
      async getMainList(params) {
        this.loadingTable.sales = true;
        const { data } = await this.$ajaxPost('wms/allocated/selectPage.do', {
          reqParam: JSON.stringify(params),
        });
        if (data.code === 200) {
          this.tableData = data.data.dataList;
          this.total.sales = data.data.totalNum;
          this.loadingTable.sales = false;
          if (this.tableData.length !== 0) {
            let preRow = 0;
            if(this.prevInventoryId == -1){
              this.prevInventoryId = this.tableData[0].id;
            }else{
              //获取当前选中行的index
              preRow = this.getRowIndex(this.prevInventoryId)
            }
            //默认选择一行
            this.$refs.salesList.setCurrentRow(this.tableData[preRow]);
            // 判断是否有编辑权限
            this.canEdit = data.data.userRoleEdit;
            this.showEditBtn = this.canEdit === 0 ? true : false;
            this.getDetail(this.prevInventoryId);
            this.getUserNote(this.prevInventoryId);
            // this.setOrderDetail(this.tableData[preRow]);
            this.getSkuDetail(this.prevInventoryId);
            this.getInvoiceDetail(this.prevInventoryId);
          } else {
            this.loadingTable.inventory = false;
            //搜索为空时  清空商品明细，订单明细，备注/留言，发票信息，库存状况查看
            this.inventoryTableData = [];
            this.orderDetail = {};
            this.noteDetail = {};
            this.invoiceDetail = {};
            this.stockData = [];
          }
        } else {
          this.loadingTable.sales = true;
        }
      },
      async getDetail(id) {
        const { data } = await this.$ajaxPost('wms/saleoutDetail/selectListSaleoutIdBygood.do', {
          reqParam: JSON.stringify({
            id,
          }),
        });
        if (data.code === 200) {
          const loopData = (arr) => (
            arr.map((item) => {
              return {
                IMGURL: Util.formatImageUrl(item.imageUrl),
                ...item,
              }
            })
          );
          this.inventoryTableData = loopData(data.data);
          this.tempInventoryTableData = loopData(data.data);
          // this.total.inventory = data.data.totalNum;
          this.loadingTable.inventory = false;
        } else {
          this.loadingTable.inventory = true;
        }
      },
      // setOrderDetail(data) {
      //   this.orderDetail = data;
      // },
      getRowIndex(id) {
        let rowIndex = 0;
        this.tableData.forEach( (item,index) => {
          if(id == item.id){
            rowIndex = index
          }
        })
        return rowIndex
      },
      /**
       * @method  获取用户用户订单信息和备注
       */
      async getUserNote(id) {
        const { data } = await this.$ajaxPost('wms/saleoutDetail/selectListSaleoutAndNote.do', {
          reqParam: JSON.stringify({
            id,
          }),
        });
        if (data.code === 200) {
          // 默认取第一条数据
           if (data.data.length === 0) {
            this.noteDetail = {
              flag: null,
            };
          } else {
            this.noteDetail = data.data[0];
            this.orderDetail = {
              ...data.data[0],
            };
            this.tempNote = this.noteDetail.note;
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
        const { data } = await this.$ajaxPost('wms/saleoutInvoice/selectByinvoice.do', {
          reqParam: JSON.stringify({
            id,
          }),
        });
        if (data.code === 200) {
          // 默认取第一条数据
          if (data.data.length !== 0) {
            this.invoiceDetail = {
              ...data.data[0],
              invoiceTypeCN: invoiceType(data.data[0].type)
            };
            this.tempInvoiceDetail= {...this.invoiceDetail};
            if (this.tabActive === 'invoice') {
              this.showEditBtn = true;
            }
          } else {
            this.invoiceDetail = {};
            this.tempInvoiceDetail = {};
            if (this.tabActive === 'invoice') {
              this.showEditBtn = false;
            }
          }
        } else {
          this.$message.error(data.msg);
        }
      },
      /**
       * @method 获取库存信息数据
       * @param { int } id: 当前销售单的id值
       */
      async getSkuDetail(id) {
        const { data } = await this.$ajaxPost('wms/saleoutDetail/selectListSaleoutBySkuStock.do', {
          reqParam: JSON.stringify({
            id,
          }),
        });
        if (data.code === 200) {
          this.stockData = data.data;
        } else {
          this.$message.error(data.msg);
        }
      },
      /**
       * @method 检验单次拣货
       * @param { Array } ids: 需检验的数据数组 
       */
      async checkSinglePick(ids) {
        const { data } = await this.$ajaxPost('wms/piecepick/insertVerification.do', {
          reqParam: JSON.stringify({
            ids,
            pageSize: 15,
          }),
        });
        if (data.code === 200) {
          this.singlePick(ids);
        } else if (data.code === 10000) {
          this.visible.lowStock = true;
          this.lowStocksList = data.data.skuList;
          if(this.lowStocksList.length < 15) {
              this.canTableScroll = false;
          }
        } else {
          this.$message.error(data.msg);
        }
      },
       async checkMultiPick(ids) {
        const { data } = await this.$ajaxPost('wms/wavepick/insertVerification.do', {
          reqParam: JSON.stringify({
            ids,
            pageSize: 15,
          }),
        });
        if (data.code === 200) {
          this.multiPick(ids);
        } else if (data.code === 10000) {
          this.visible.lowStock = true;
          this.lowStocksList = data.data.skuList;
        } else {
          this.$message.error(data.msg);
        }
      },
      async singlePick(ids) {
        const { data } = await this.$ajaxPost('wms/piecepick/insert.do', {
          reqParam: JSON.stringify({
            ids,
          }),
        });
        if (data.code === 200) {
          this.$message({
              type: 'success',
              message: '单个拣货单创建成功!'
          });
          this.getMainList(this.pageObj);
        } else {
          this.$message.error(data.msg);
        }
      },
      async multiPick(ids) {
        const { data } = await this.$ajaxPost('wms/wavepick/insert.do', {
          reqParam: JSON.stringify({
            ids,
          }),
        });
        if (data.code === 200) {
          this.$message({
              type: 'success',
              message: '波次拣货单创建成功!'
          });
          this.getMainList(this.pageObj);
        } else {
          this.$message.error(data.msg);
        }
      },
      async interCeptOrder(ids) {
        const { data } = await this.$ajaxPost('wms/saleout/updateIntercept.do', {
          reqParam: JSON.stringify({
            ids,
          }),
        });
        if (data.code === 200) {
          this.$message({
              type: 'success',
              message: '拦截成功!'
          });
          this.getMainList(this.pageObj);
        } else {
          this.$message.error(data.msg);
        }
      },
      async deleteOrder(ids) {
        const { data } = await this.$ajaxPost('wms/saleout/delete.do', {
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
      // 生成单个拣货单
      singlePickingBtn(){
        if (this.ids.length > 0) {
          this.checkSinglePick(this.ids.join());
        } else {
          this.$message.warning('请至少选择一条数据');
        }
      },
      // 生成波次拣货单
      wavePickingBtn(){
        if (this.ids.length > 1) {
          this.checkMultiPick(this.ids.join());
        } else {
          this.$message.warning('请至少选择两条数据');
        }
      },
      deleteSaleBtn(){
        if (this.ids.length > 0) {
          this.$confirm('删除订单后，不可恢复，请谨慎操作?', '删除确认', {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消操作',
            type: 'warning'
          }).then(() => {
            this.deleteOrder(this.ids.join());
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        } else {
          this.$message.warning('请勾选需删除的订单');
        }
      },
      // 拦截订单
      interceptOrderBtn(){
        if (this.ids.length > 0) {
          this.interCeptOrder(this.ids.join());
        } else {
          this.$message.warning('请至少选择一条数据');
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
        if (this.advanceFormOrderList.length === 0) {
          this.getDictData('店铺类型','advanceFormOrderList');
        }
        if (this.advanceFormOutputList.length === 0) {
          this.getDictData('出库类型','advanceFormOutputList');
        }
        if (this.advanceFormLogisticsList.length === 0) {
          this.getLogistics();
        }
        if (this.advanceFormStoreList.length === 0) {
          this.getStores();
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
          // 下单时间
        if (this.searchData.placeTime && this.searchData.placeTime.length !== 0) {
          this.searchData.optStimePlaceTime = this.searchData.placeTime[0];
          this.searchData.optEtimePlaceTime = this.searchData.placeTime[1];
        } else {
            this.searchData.optStimePlaceTime = '';
            this.searchData.optEtimePlaceTime = '';
        }
          // 付款时间
        if (this.searchData.payTime && this.searchData.payTime.length !== 0) {
          this.searchData.optStimePayTime = this.searchData.payTime[0];
          this.searchData.optEtimePayTime = this.searchData.payTime[1];
        } else {
            this.searchData.optStimePayTime = '';
            this.searchData.optEtimePayTime = '';
        }
          // 接单时间
        if (this.searchData.createTime && this.searchData.createTime.length !== 0) {
          this.searchData.optStimeTakeTime = this.searchData.createTime[0];
          this.searchData.optEtimeTakeTime = this.searchData.createTime[1];
        } else {
            this.searchData.optStimeTakeTime = '';
            this.searchData.optEtimeTakeTime = '';
        }
        Object.keys(this.searchData).forEach((key) => {
          if (key !== 'placeTime' && key !== 'payTime' && key !== 'createTime') {
            if (this.searchData[key] !== '' && !Array.isArray(this.searchData[key])) {
              tempSearch[key] = this.searchData[key];
            } else if (this.searchData[key] === '' && !Array.isArray(this.searchData[key])) {
              delete this.pageObj[key];
            }
          } else {
              delete this.pageObj[key];
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
           ['optStimePlaceTime', 
             'optEtimePlaceTime', 
             'optStimePayTime', 
             'optEtimePayTime',
             'optStimeTakeTime',
             'optEtimeTakeTime',
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
      // 获取物流商列表
      async getLogistics() {
        const { data } = await this.$ajaxPost('wms/logisticsCompany/selectPage.do', {
          reqParam: JSON.stringify({
            pageNum: 1,
            pageSize: noPagingMaxSize,
          }),
        });
        if (data.code === 200) {
          this.advanceFormLogisticsList = data.data.dataList;
        } else {
          this.$message.error(data.msg);
        }
      },
      // 获取店铺列表
      async getStores() {
        const { data } = await this.$ajaxPost('wms/store/selectPage.do', {
          reqParam: JSON.stringify({
            pageNum: 1,
            pageSize: noPagingMaxSize,
          }),
        });
        if (data.code === 200) {
          this.advanceFormStoreList = data.data.dataList;
        } else {
          this.$message.error(data.msg);
        }
      },
      // 选择多条数据
      handleSelectionChange(val){
        this.ids = val.map(item => {
          return item.id;
        });
        if (this.ids.length === 1) {
          this.logistics.companyName = val[0].logcompName;
        }
      },
      rowClick(row) {
        if (this.prevInventoryId !== row.id) {
          this.getDetail(row.id);
          this.getUserNote(row.id);
          // this.setOrderDetail(row);
          this.getSkuDetail(row.id);
          this.getInvoiceDetail(row.id);
          this.prevInventoryId = row.id;
          if (this.tabActive === 'invoice') {
            if (Object.keys(this.invoiceDetail).length !== 0) {
              this.showEditBtn = true;
            } else {
              this.showEditBtn = false;
            }
          } else if (this.tabActive === 'stock') {
            this.showEditBtn = false;
          }
          this.editing = false;
        }
      },
      /**
       * @method tab切换
       * @param { Object } tab: Tab对象的实例
       */
      tabChange(tab) {
        if (!this.editing) {
          this.cancelEdit();
        }
        if (this.tabActive === 'invoice') {
          if (Object.keys(this.invoiceDetail).length !== 0) {
            this.showEditBtn = true;
            this.showCopyBtn = true;
            this.copyText = JSON.stringify({
                '发票类型：': this.invoiceDetail.invoiceTypeCN,
                '购买方名称：':this.invoiceDetail.buyerName,
                '购买方税号：':this.invoiceDetail.buyerTaxno,
                '购买方开户行：':this.invoiceDetail.depositBank,
                '购买方账号：':this.invoiceDetail.depositAccount,
                '购买方地址：':this.invoiceDetail.address,
                '发票金额：':this.invoiceDetail.invoiceAmount,
                '发票备注：':this.invoiceDetail.note,
                '销售方名称：':this.invoiceDetail.sellerName,
                '销售方税号：':this.invoiceDetail.sellerTaxno,
              }).replace(/\"/g,'').replace(/:/g,'').replace(/^{|}$/g,'').replace(/,/g,'\n')
          } else {
            this.showEditBtn = false;
            this.showCopyBtn = false;
          }
        } else if (this.tabActive === 'stock') {
          this.showEditBtn = false;
        } else {
          this.showEditBtn = true;
          this.editing = false;
        }
      },
      goEdit() {
        this.editing = true;
        if (this.tabActive === 'invoice') {
          this.getDictData('发票类型','advanceFormInvoiceList');
        } else if (this.tabActive === 'orderInfo') {
          this.getArea(1);
          this.getArea(2, this.orderDetail.provinceId);
          this.getArea(3, this.orderDetail.cityId);
        }
      },
      // tab上取消编辑
      cancelEdit() {
        if (this.tabActive === 'goodsDetail') {
           this.inventoryTableData = JSON.parse(JSON.stringify(this.tempInventoryTableData));
        } else if (this.tabActive === 'remark') {
          this.noteDetail = {
            ...this.noteDetail,
            note: this.tempNote,
          };
        } else if (this.tabActive === 'invoice') {
          this.invoiceDetail = {...this.tempInvoiceDetail};
        }
        this.editing = false;
      },
      // tab上保存编辑
      saveEdit() {
        if (this.tabActive === 'goodsDetail') {
            const canEditGoodsDetail = () => {
                let isAccess = true;
                this.inventoryTableData.forEach((item) => {
                    if (RPOSITIVE_INT.test(item.saleoutQty)) {
                        const qty = parseInt(item.saleoutQty, 10);
                        if (qty < 1 || qty > 99999) {
                            isAccess = false;
                        }
                    }
                });
                return isAccess;
            };
            if (canEditGoodsDetail()) {
                this.editGoodsDetail();
                this.editing = false;
            } else {
                this.$message.warning('商品数量仅支持1-99999的整数');
            }
        } else if (this.tabActive === 'orderInfo') {
          if (this.orderDetail.provinceId !== '' && 
              this.orderDetail.cityId !== '' && 
              this.orderDetail.districtId !== '') {
                if (this.orderDetail.address.length >= 5 && this.orderDetail.address.length <= 30) {
                    this.editOrderAndNote({
                      id: this.orderDetail.id,
                      provinceId: this.orderDetail.provinceId,
                      provinceName: this.provinceList.filter((item) => item.id === this.orderDetail.provinceId)[0].regionName,
                      cityId: this.orderDetail.cityId,
                      cityName: this.cityList.filter((item) => item.id === this.orderDetail.cityId)[0].regionName,
                      districtId: this.orderDetail.districtId,
                      districtName: this.countryList.filter((item) => item.id === this.orderDetail.districtId)[0].regionName,
                      address: this.orderDetail.address,
                    });
                    this.editing = false;
                } else {
                   this.$message.warning('街道地址仅支持5-30个字');
                }
          } else {
            this.$message.warning('请选择完整的省市县信息');
          }
        } else if (this.tabActive === 'remark') {
          this.editOrderAndNote({
            id: this.noteDetail.id,
            note: this.noteDetail.note,
          });
          this.editing = false;
        } else if (this.tabActive === 'invoice') {
          this.$refs.invoiceFormRef.validate((valid) => {
            if (valid) {
              this.editInvoice();
              this.editing = false;
            } else {
              return false;
            }
          });
        }
      },
      // 移除商品详细中的某项
      async remove(item) {
        if (this.inventoryTableData.length <= 1) {
          this.$message.warning('请至少保留一个商品信息');
        } else {
          const { data } = await this.$ajaxPost('wms/saleoutDetail/deleteGoods.do', {
            reqParam: JSON.stringify({
              id: item.detailId,
            }),
          });
          if (data.code === 200) {
            this.editing = false;
            this.getDetail(this.prevInventoryId);
          } else {
            this.$message.error(data.msg);
          }
        }
      },
      // 修改商品详细
      async editGoodsDetail() {
        const { data } = await this.$ajaxPost('wms/saleoutDetail/updataGoods.do', {
          reqParam: JSON.stringify({
            skuList: this.inventoryTableData.map((item) => {
              return {
                id: item.detailId,
                saleoutQty: item.saleoutQty,
              }
            }),
          }),
        });
        if (data.code === 200) {
          this.getDetail(this.prevInventoryId);
        } else {
          this.$message.error(data.msg);
        }
      },
      // 修改订单信息和备注信息
      async editOrderAndNote(obj) {
        const { data } = await this.$ajaxPost('wms/allocated/updataOrder.do', {
          reqParam: JSON.stringify(obj),
        });
        if (data.code === 200) {
          this.getMainList(this.pageObj)
          // this.getUserNote(this.prevInventoryId);
          this.editing = false;
        } else {
          this.$message.error(data.msg);
        }
      },
      // 修改发票信息
      async editInvoice() {
        const { data } = await this.$ajaxPost('wms/saleoutInvoice/updataByinvoice.do', {
          reqParam: JSON.stringify(this.invoiceDetail),
        });
        if (data.code === 200) {
          this.getInvoiceDetail(this.prevInventoryId);
        } else {
          this.$message.error(data.msg);
        }
      },
      /**
       * @method 获取省市区
       * @param { int } type: 区域类型
       *                    - 1:省
       *                    - 2:市
       *                    - 3:区县
       * @param { int } id: 当前区域id
       */
      async getArea(type, id) {
        const { data } = await this.$ajaxPost('wms/region/selectAll.do', {
          reqParam: JSON.stringify({
            type,
            id,
          }),
        });
        if (data.code === 200) {
          if (type === 1) {
            this.provinceList = data.data;
          } else if (type === 2) {
            this.cityList = data.data;
          } else if (type === 3) {
            this.countryList = data.data;
          }
        } else {
          this.$message.error(data.msg);
        }
      },
      provinceChange(id) {
        this.orderDetail.cityId = '';
        this.orderDetail.districtId = '';
        this.getArea(2, id);
      },
      cityChange(id) {
        this.orderDetail.districtId = '';
        this.getArea(3, id);
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
      // TODO 后台暂时未做分页处理，这里以后需要去处理后台分页返回的数据，table去滚动加载
      loadMore () {
          if (this.canTableScroll) {
              console.log(1111);
          }
      },
      onCopyError() {
        this.$message.error('复制失败');
      },
      onCopySuccess() {
        this.$message.success('复制成功');
      },
      // 下载补货清单
      async downloadLowStock() {
        const { data } = await this.$ajaxPost('wms/allocated/export.do', {
          reqParam: JSON.stringify({
            ids: this.ids.join(),
            typeName: '待分配补货清单',
          }),
        });
        if (data.code === 200) {
          // window.open(`${this.$baseURL}/wms/profile/${data.data.exportUrl}`);
          // this.$Util.download(this.$baseURL+'wms/profile/'+data.data.exportUrl);
          // this.$Util.download(`${this.$baseURL}/wms/profile/${data.data.exportUrl}`);
          window.location.href = `${this.$baseURL}/wms/profile/${data.data.exportUrl}`;
        } else {
          this.$message.error(data.msg);
        }
      },
      // 获取所有的物流商
      async getAllLogisticsCompany(requestObj, callback) {
        const { data } = await this.$ajaxPost('wms/logisticsCompany/selectPage.do', {
          reqParam: JSON.stringify(requestObj),
        });

        if (data.code === 200) {
          callback && callback(data);
        } else {
          this.$message.error(data.msg);
        }
      },
      changeDeliveryBtn() {
        if (this.ids.length !== 1) {
          this.$message.warning(OutPutNoSelectTxt);
        } else {
          this.getAllLogisticsCompany({
            pageNum: 1, 
            pageSize: noPagingMaxSize,
          }, (data) => {
            this.deliveryList = data.data.dataList;
            this.visible.delivery = true;
          });
        }
      },
      enterTrackNumberBtn() {
        if (this.ids.length !== 1) {
          this.$message.warning(OutPutNoSelectTxt);
        } else {
          this.visible.trackNumber = true;
        }
      },
      // 确认录入物流单号
      async confirmEnterTrackNumber() {
        if (this.$refs['trackFormRef']) {
          this.$refs.trackFormRef.validate((valid) => {
            if (valid) {
              this.enterTrackNumber();
            }
          });
        }
      },
      async enterTrackNumber() {
        const { data } = await this.$ajaxPost('wms/allocated/updatelogcompNameAndexpbillNo.do', {
          reqParam: JSON.stringify({
            id: this.ids.join(),
            expbillNo: this.track.numbers,
          }),
        });
        if (data.code === 200) {
          this.visible.delivery = false;
          this.$message({
              type: 'success',
              message: '录入成功!'
          });
          this.getMainList(this.pageObj);
        } else {
          this.$message.error(data.msg);
        }
      },
      /**
       * @method 修改物流商
       * 
       */
      async confirmChangeDelivery() {
        const { data } = await this.$ajaxPost('wms/allocated/updatelogcompNameAndexpbillNo.do', {
          reqParam: JSON.stringify({
            id: this.ids.join(),
            logcompName: this.logistics.companyName,
            logcompNameId: this.deliveryList.filter((item) => item.logcompName === this.logistics.companyName)[0].id,
          }),
        });
        if (data.code === 200) {
          this.visible.delivery = false;
          this.$message({
              type: 'success',
              message: '修改成功!'
          });
          this.getMainList(this.pageObj);
        } else {
          this.$message.error(data.msg);
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../styles/mixin.scss';
  @import '../../../styles/common.scss';
  .preOrder__item{
    @include fd(row);
    padding: 15px 0;
    &.edit{
      @include flexCenter;
    }
    label{
      width: 100px;
      text-align: right;
      @include sc(14px, $black-333);
    }
    section{
      text-align: left;
      flex:1;
       @include sc(14px, $gray-666);
    }
  }
</style>

<style lang="scss">
@import '../../../styles/mixin.scss';
@import '../../../styles/common.scss';
 #pane-goodsDetail{
      .wrap-img{
        padding: 5px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          width: 33px;
          height: 35px;
        }
      }
 }
 .advanceFilter{
   .el-select{
     width: 100%;
   }
 }
 #tab-total{
   p{
     color: $gray-999;
   }
   span{
     margin-right: 20px;
     @include sc(14px,$green-d2a2);
     & + span{
       @include sc(14px,$orange-a356);
     }
   }
 }
 .lowStock{
   .el-dialog__body{
     padding-top: 0px;
     p{
       padding: 10px 0;
     }
   }
 }
</style>
