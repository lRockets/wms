<template>
  <div>
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
        inventory:[], //商品明细表格
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
