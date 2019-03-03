<template>
  <div>
    <el-table ref="statusData" :data="statusData">
      <el-table-column align="center" label="行号" width="120"></el-table-column>
      <el-table-column align="center" prop="address" label="SKU"></el-table-column>
      <el-table-column align="center" prop="address" label="商品名称"></el-table-column>
      <el-table-column align="center" prop="address" label="规格属性"></el-table-column>
      <el-table-column align="center" prop="address" label="可用库存"></el-table-column>
      <el-table-column align="center" prop="address" label="锁定库存"></el-table-column>
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
        statusData:[],
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
