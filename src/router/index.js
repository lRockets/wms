import Cookies from 'js-cookie';
import { Util } from './../assets/js/util.js';
import axios from 'axios';
import qs from 'qs';
import Vue from 'vue'
import store from './../store';
import { baseURL } from './../assets/js/uri.js';

let instence = axios.create({
  baseURL: baseURL,
});

var o = {}
o.ajax = function (url, data) {
  let id = Cookies.get("user_id");
  let token = Cookies.get("token");
  let role_id = Cookies.get("role_id");

  data.user_id = id;
  data.token = token;
  data.role_id = role_id;
  return instence.post(url, qs.stringify(data));
}


import Router from 'vue-router'
import Login from './../page/Login.vue'
import Index from './../page/Index.vue'
import Nav from './../page/nav.vue'
// import layout from './../page/layout.vue'
import Error from './../page/errorPage/404.vue'
import $ from 'jquery'
//首页
let home = () => import('./../page/home.vue');

//基础信息
  //仓库管理
let stores = () => import('./../page/basic_data/stores_control/stores.vue');
let storageLocation = () => import('./../page/basic_data/stores_control/storage_location.vue');
let reservoirArea = () => import('./../page/basic_data/stores_control/reservoir_area.vue');
let distributionCurve = () => import('./../page/basic_data/stores_control/distribution_curve.vue');
  //供应商管理
let deviceManagement = () => import('./../page/basic_data/device_management.vue');
let ownerManagement = () => import('./../page/basic_data/owner_management.vue');
let shipManagement = () => import('./../page/basic_data/ship_management.vue');
let supplierManagement = () => import('./../page/basic_data/supplier_management.vue');
  //物流管理
let expressBillManage = () => import('./../page/basic_data/logistics_management/express_bill_manage.vue');
let freightManage = () => import('./../page/basic_data/logistics_management/freight_manage.vue');
let logisticsManagement = () => import('./../page/basic_data/logistics_management/logistics_management.vue');

//系统管理
let systemSetup = () => import('./../page/system_manage/system_setup.vue');
let userManage = () => import('./../page/system_manage/user_manage.vue');
let roleManage = () => import('./../page/system_manage/role_manage.vue');
let interfaceConfig = () => import('./../page/system_manage/interfaceConfig.vue');
let printConfig = () => import('./../page/system_manage/printConfig.vue');
let versionManage = () => import('./../page/system_manage/versionManage.vue');
let derivedRecord = () => import('./../page/system_manage/derivedRecord.vue');

//商品管理
let attributeManage = () => import('./../page/goods_manage/attribute_manage.vue');
let brandManage = () => import('./../page/goods_manage/brand_manage.vue');
let categoryManage = () => import('./../page/goods_manage/category_manage.vue');
let goodsInfor = () => import('./../page/goods_manage/goods_infor.vue');
let add_goods = () => import('./../page/goods_manage/add_goods.vue');
const editGoods = () => import('./../page/goods_manage/editGoods.vue');
//入库管理
let afterSaleReservation = () => import('../page/warehousing_manage/reservations/after_sale_reservation.vue');
let allocatingReservations = () => import('../page/warehousing_manage/reservations/allocating_reservations.vue');
let purchaseReservation = () => import('../page/warehousing_manage/reservations/purchase_reservation.vue');
let afterSaleWarehousing = () => import('../page/warehousing_manage/warehouse_receipt/afterSaleWarehousing.vue');
let purchasingWarehousing = () => import('../page/warehousing_manage/warehouse_receipt/purchasing_warehousing.vue');
let transferToWarehouse = () => import('../page/warehousing_manage/warehouse_receipt/transfer_to_warehouse.vue');
let exceptionManagement = () => import('../page/warehousing_manage/exception_management.vue');

//出库管理
let singlePicking = () => import('../page/outgoing_management/picking_management/singlePicking.vue');
let toBeAssignedSales = () => import('../page/outgoing_management/picking_management/toBeAssignedSales.vue');
let wavePicking = () => import('../page/outgoing_management/picking_management/wavePicking.vue');
let inspectionManagement = () => import('../page/outgoing_management/inspection_management.vue');
let orderInquiry = () => import('../page/outgoing_management/order_inquiry.vue');
let ordersOutgoing = () => import('../page/outgoing_management/ordersOutgoing.vue');
const ScanOutput = () => import('../page/outgoing_management/scanOutput.vue');
let weighingManagement = () => import('../page/outgoing_management/weighing_management.vue');
let ExceptionManagement = () => import('../page/outgoing_management/exception_management.vue');

//库内作业
let inventoryManagement = () => import('../page/libraryWork/inventory_management.vue');
let movementManagement = () => import('../page/libraryWork/movement_management.vue');
let shelfManagement = () => import('../page/libraryWork/shelf_management.vue');

//库存管理
let zoningInventory = () => import('../page/stock_control/zoning_inventory.vue');
let totalInventory = () => import('../page/stock_control/total_inventory.vue');
let safePickingStock = () => import('../page/stock_control/safe_picking_stock.vue');

//规则配置
let serviceConfig = () => import('./../page/rule_config/service_config.vue');
let waveRule = () => import('./../page/rule_config/wave_rule.vue');

//财务管理
let invoiceConfig = () => import('./../page/financial_manage/invoice_config.vue');
let invoicesManage = () => import('./../page/financial_manage/invoices_manage.vue');
let freightBill = () => import('./../page/financial_manage/freight_bill.vue');

Vue.use(Router);

var router = new Router({
  routes: [
    {
      path: '/',
      redirect: "/login"
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/404',
      component: Error
    },
    {
      path: '/home',
      component: Index,
      redirect: 'home',
      children: [
        {path: '/home', component: home, name: '首页'},
      ]
    },
    {
      path: '/basic_data',
      component: Index,
      redirect: '/basic_data/stores_control/stores',
      children: [
        {path: "stores_control/stores", component: stores, name: '仓库'},
        {path: "stores_control/reservoir_area", component: reservoirArea, name: '库区'},
        {path: "stores_control/storage_location", component: storageLocation, name: '库位'},
        {path: "stores_control/distribution_curve", component: distributionCurve, name: '分布图'},
        {path: "logistics_management/logistics_management", component: logisticsManagement, name: '物流商管理'},
        {path: "logistics_management/express_bill_manage", component: expressBillManage, name: '面单模板管理'},
        {path: "logistics_management/freight_manage", component: freightManage, name: '运费模板管理'},
        {path: "supplier_management", component: supplierManagement, name: '供应商管理'},
        {path: "device_management", component: deviceManagement, name: '设备管理'},
        {path: "owner_management", component: ownerManagement, name: '货主管理'},
        {path: "ship_management", component: shipManagement, name: '店铺管理'},
      ]
    },
    {
      path: '/system_manage',
      component: Index,
      redirect: '/system_manage/system_setup',
      children: [
        {path: "system_setup", component: systemSetup, name: '系统设置'},
        {path: "user_manage", component: userManage, name: '用户管理'},
        {path: "role_manage", component: roleManage, name: '角色管理'},
        {path: "interfaceConfig", component: interfaceConfig, name: '接口配置'},
        {path: "printConfig", component: printConfig, name: '打印配置'},
        {path: "versionManage", component: versionManage, name: '版本管理'},
        {path: "derivedRecord", component: derivedRecord, name: '导出记录'},
      ]
    },
    {
      path: '/financial_manage',
      component: Index,
      redirect: '/financial_manage/invoice_config',
      children: [
        {path: "invoice_config", component: invoiceConfig, name: '发票配置'},
        {path: "invoices_manage", component: invoicesManage, name: '发票管理'},
        {path: "freight_bill", component: freightBill, name: '运费账单'},
      ]
    },
    {
      path: '/goods_manage',
      component: Index,
      redirect: '/goods_manage/goods_infor',
      children: [
        {path: "goods_infor", component: goodsInfor, name: '商品信息'},
        {path: "category_manage", component: categoryManage, name: '类目管理'},
        {path: "brand_manage", component: brandManage, name: '品牌管理'},
        {path: "attribute_manage", component: attributeManage, name: '属性管理'},
        {path: "add_goods", component: add_goods, name: '新增商品'},
        {path: "edit_goods/:editID", component: editGoods, name: '编辑商品'}
      ]
    },
    {
      path: '/warehousing_manage',
      component: Index,
      redirect: '/warehousing_manage/reservations/after_sale_reservation',
      children: [
        {path: "reservations/after_sale_reservation", component: afterSaleReservation, name: '售后预约'},
        {path: "reservations/allocating_reservations", component: allocatingReservations, name: '调拨预约'},
        {path: "reservations/purchase_reservation", component: purchaseReservation, name: '采购预约'},
        {path: "warehouse_receipt/purchasing_warehousing", component: purchasingWarehousing, name: '采购入库'},        
        {path: "warehouse_receipt/transfer_to_warehouse", component: transferToWarehouse, name: '调拨入库'},
        {path: "warehouse_receipt/afterSaleWarehousing", component: afterSaleWarehousing, name: '售后入库'},
        {path: "exception_management", component: exceptionManagement, name: '采购退货'},
      ]
    },
    {
      path: '/outgoing_management',
      component: Index,
      redirect: '/outgoing_management/picking_management/toBeAssignedSales',
      children: [
        {path: "picking_management/toBeAssignedSales", component: toBeAssignedSales, name: '待分配订单'},
        {path: "picking_management/singlePicking", component: singlePicking, name: '单个拣货'},
        {path: "picking_management/wavePicking", component: wavePicking, name: '波次拣货'},
        {path: "inspection_management", component: inspectionManagement, name: '验货管理'},
        {path: "order_inquiry", component: orderInquiry, name: '订单查询'},
        {path: "ordersOutgoing", component: ordersOutgoing, name: '出库管理'},
        {
          path: "scanOutput", component: ScanOutput, name: '扫描出库',
        },
        {path: "weighing_management", component: weighingManagement, name: '称重管理'},
        {path: "exception_management", component: ExceptionManagement, name: '异常单管理'},
      ]
    },
    {
      path: '/stock_control',
      component: Index,
      redirect: '/stock_control/total_inventory',
      children: [
        {path: "total_inventory", component: totalInventory, name: '库存总量'},
        {path: "safe_picking_stock", component: safePickingStock, name: '安全拣货库存'},
        {path: "zoning_inventory", component: zoningInventory, name: '分区库存'},
      ]
    },
    {
      path: '/libraryWork',
      component: Index,
      redirect: '/libraryWork/shelf_management',
      children: [
        {path: "shelf_management", component: shelfManagement, name: '上架管理'},
        {path: "movement_management", component: movementManagement, name: '移库管理'},
        {path: "inventory_management", component: inventoryManagement, name: '盘点管理'},
      ]
    },
    {
      path: '/rule_config',
      component: Index,
      redirect: '/rule_config/service_config',
      children: [
        {path: "service_config", component: serviceConfig, name: '业务配置'},
        {path: "wave_rule", component: waveRule, name: '波次规则'},
      ]
    },
    {
      path: "*",
      redirect: '/404'
    }
  ]
})

router.beforeEach((to, from, next) => {

  if (to.path == '/login' || to.path == '/404') {
    next();
  } else {
    // 页面跳转时store中没有时才跳转
    if (!Util.findArrayObjKeyword(store.getters.dynamicTags, to.path, 'values', false).flag) {
      store.dispatch('addDynamicTags', {
        name: to.name,
        path: to.path
      })
    }
    // var id = Cookies.get("user_id");
    let token = Cookies.get("token");
    if (token) {
      // this.$store.dispatch('addCookies', token)
      /*if (window.dictionary) {
        check(to.path, next)
        alert('00')
        o.ajax("Erp/Index/cacheIsRefresh", {}).then(({data}) => {
          if (data.data) { //为真就说明要重新获取字典
            getDataDictionary(next, to.path);
          } else {
            check(to.path,next)
          }
        });
      } else {
        getDataDictionary(next, to.path);
      }*/
      next();
    } else {
      next('/login');
    }
  }

});

function getDataDictionary(next, path) {
 /* o.ajax("Erp/Index/getDataDictionary", {company_id: Cookies.get("company_id")}).then(({data}) => {
    if (data.code === 1) {
      window.dictionary = data.data;
      let did = Cookies.get("department_id");
      window.dictionary.brokerage_list = data.data.user_list.filter(item => {
        return item.department_id == did
      });
      check(path, next)
    } else {
      if (data.system_message == "无法获取用户数据") {
        next("/login");
      }
    }
  })*/
}

function check(path, next) {
  var arr = path.split("/");
  if (arr.length !== 4) {
    next();
  }
  var first = arr[1];
  var second = arr[2];
  var third = arr[3];
  var counld = false;
  var menu = window.dictionary.get_Menu;
  $.each(menu, (i, e) => {
    if (e.name == first) {
      $.each(e.children, (i, ele) => {
        if (ele.name == second) {
          $.each(ele.children, (i, element) => {
            if (element.name == third) {
              counld = true;
              return false;
            }
          })
          return false;
        }
      })
      return false;
    }
  })
  if (counld) {
    next()
  } else {
    next("/404?msg=you have no right to access")
  }
}

export default router;
