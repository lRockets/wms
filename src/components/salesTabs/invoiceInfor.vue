<template>
  <div>
    <el-form label-width="110px" class="detailInfor" :model="invoiceInforForm">
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
        invoiceInforForm:{

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
