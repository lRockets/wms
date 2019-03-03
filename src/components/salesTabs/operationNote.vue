<template>
  <div>
    <el-table ref="operationNoteData" :data="operationNoteData">
      <el-table-column align="center" prop="" label="订单状态"></el-table-column>
      <el-table-column align="center" prop="" label="操作时间"></el-table-column>
      <el-table-column align="center" prop="" label="操作人"></el-table-column>
      <el-table-column align="center" prop="" label="操作日志"></el-table-column>
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
        operationNoteData:[],
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
