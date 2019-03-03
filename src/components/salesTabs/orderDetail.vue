<template>
  <div>
    <el-form label-width="110px" class="detailInfor" :model="orderDetailForm">
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
  </div>
</template>
<script>
  export default {
    props:{
     /* RowData:{
        type: Object,
        default: {},
      },*/
    },
    data(){
      return{
        orderDetailForm:{

        },
      }
    },
    methods:{

    },
    components: {},
    mounted() {

    }
  }
</script>

<style lang="scss">

</style>
