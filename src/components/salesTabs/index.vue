<template>
    <div class="tabBox">
      <el-tabs v-model="activeName2" @tab-click="handleClick" type="border-card" style="margin-top: 20px;min-height: 320px;">
        <el-tab-pane label="商品明细" name="first">
          <el-table ref="inventory" :data="inventory">
            <el-table-column align="center" label="行号" width="120"></el-table-column>
            <el-table-column align="center" prop="address" label="商品编码"></el-table-column>
            <el-table-column align="center" prop="address" label="SKU"></el-table-column>
            <el-table-column align="center" prop="address" label="条码"></el-table-column>
            <el-table-column align="center" prop="address" label="商品名称"></el-table-column>
            <el-table-column align="center" prop="address" label="品牌"></el-table-column>
            <el-table-column align="center" prop="address" label="规格属性"></el-table-column>
            <el-table-column align="center" prop="order" label="单价"></el-table-column>
            <el-table-column align="center" prop="address" label="数量"></el-table-column>
            <el-table-column align="center" prop="address" label="金额"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="订单信息" name="second">
          <el-form label-width="110px" class="detailInfor" >
            <el-form-item label="销售单号：">RK1812120001AA</el-form-item>
            <el-form-item label="店铺名称：">采购入库</el-form-item>
            <el-form-item label="订单渠道：">供应商A</el-form-item>
            <el-form-item label="买家ID：">2018-02-14  18:00:00</el-form-item>
            <el-form-item label="外部单号：">待检</el-form-item>
            <el-form-item label="物流商：">YY1812120001AA</el-form-item>
            <el-form-item label="物流单号：">这是备注信息</el-form-item>
            <el-form-item label="重量（kg）：">待检</el-form-item>
            <el-form-item label="省市县：">待检</el-form-item>
            <el-form-item label="街道地址：">待检</el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="备注/留言" name="three">
         <div class="f-fl" style="width: 48%">
           <el-row>
             <span>买家留言</span>
             <el-input type="textarea"></el-input>
           </el-row>
         </div>
          <div class="f-fr" style="width: 48%">
            <span>卖家留言</span>
            <el-input type="textarea"></el-input>
          </div>
        </el-tab-pane>
        <el-tab-pane label="发票信息" name="four">
          <el-form label-width="110px" class="detailInfor" >
            <el-form-item label="发票类型：">RK1812120001AA</el-form-item>
            <el-form-item label="购买方名称：">采购入库</el-form-item>
            <el-form-item label="购买方税号：">供应商A</el-form-item>
            <el-form-item label="购买方电话：">2018-02-14  18:00:00</el-form-item>
            <el-form-item label="购买方开户行：">待检</el-form-item>
            <el-form-item label="购买方账号：">YY1812120001AA</el-form-item>
            <el-form-item label="购买方地址：">这是备注信息</el-form-item>
            <el-form-item label="发票金额：" >待检</el-form-item>
            <el-form-item label="发票备注：">待检</el-form-item>
            <el-form-item label="销售方名称：">待检</el-form-item>
            <el-form-item label="销售方税号：">待检</el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="库存状况查看" name="five">
          <el-table ref="statusData" :data="statusData">
            <el-table-column align="center" label="行号" width="120"></el-table-column>
            <el-table-column align="center" prop="address" label="SKU"></el-table-column>
            <el-table-column align="center" prop="address" label="商品名称"></el-table-column>
            <el-table-column align="center" prop="address" label="规格属性"></el-table-column>
            <el-table-column align="center" prop="address" label="可用库存"></el-table-column>
            <el-table-column align="center" prop="address" label="锁定库存"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="总数量为：6    总金额为：60.00" name="seven" disabled></el-tab-pane>
      </el-tabs>
      <div class="buttonBox">
        <el-button type="text" @click="editorTabs" v-if="!isEditorTabs">编辑</el-button>
        <el-button type="text" v-if="isEditorTabs" @click="concelEditorTabs">取消</el-button>
        <el-button type="text" v-if="isEditorTabs">保存</el-button>
      </div>
    </div>
</template>
<script>
  export default {
    props:{

    },
    data(){
      return{
        activeName2: 'first',
        inventory:[], //商品明细表格
        ordersInfor:[],
        invoiceInfor:[],
        statusData:[],
        isEditorTabs:false,  //是否在编辑tab页
      }
    },
    methods:{
      handleClick(tab, event) {
        this.isEditorTabs=false;
        console.log(tab, event);
      },
      //编辑tabs页
      editorTabs(){
        this.isEditorTabs=true;
      },
      //取消编辑
      concelEditorTabs(){
        this.isEditorTabs=false;
      },
    },
    components: {},
    mounted() {

    }
  }
</script>

<style lang="scss">

</style>
