<template>
  <div class="wrapper">
    <a @click="dialogVisible = true" class="show el-icon-more"></a>
    <el-dialog @close="close" title="选择表头" :visible="dialogVisible" width="540px">
      <el-transfer
        filterable
        :data="filterData"
        v-model="filteredData"
        :titles="['显示项', '过滤项']">
      </el-transfer>
      <div class="clearfix">
        <el-button size="mini" type="primary" style="float:right;margin-top:15px" @click="saveChange">保存</el-button>
      </div>
    </el-dialog>
    <el-table 
              :height="tableSetting.height"
              :row-class-name="tableRowClassName"
              :border="tableSetting.border"
              :highlight-current-row="typeof tableSetting.highlightCurrentRow==='undefined'?true:tableSetting.highlightCurrentRow"
              :size="tableSetting.size?tableSetting.size:'mini'"
              :min-width="tableSetting.minWidth"
              :max-height="tableSetting.maxHeight"
              :data="tableData"
              :empty-text="tableSetting.emptyText?tableSetting.emptyText:'暂无数据'"
              :sum-text="tableSetting.sumText?tableSetting.sumText:'合计'"
              :show-summary="tableSetting.showSummary"
              :summary-method="tableSetting.summaryMethod"
              :fit="typeof tableSetting.fit?true:tableSetting.fit"
              ref="elTable"
              @row-click="rowClick"
              @row-dblclick="rowDblclick"
              @cell-click="cellClick"
              @cell-dblclick="cellDblClick"
              @select-all="selectAll"
              @select="select"
              header-row-class-name="table-header">
      <el-table-column v-if="needSelect" type="selection" width="55" :fixed="true" align="center">
      </el-table-column>
      <el-table-column v-if="needIndex" type="index" width="55" :fixed="true" label="行号" align="center">
      </el-table-column>
      <template v-for="(item,index) in columnsData">
        <el-table-column v-if="item.showIt"
                         :type="item.type"
                         :label="item.label"
                         :align="item.align"
                         :prop="item.prop"
                         :width="item.width"
                         :sortable="item.sortable"
                         :fixed="item.fixed"
                         :min-width="item.minWidth"
                         :key="index"
        >
          <template v-if="item.hasOwnProperty('render')" slot-scope="scope">
            <column-content :render="item.render" :scope="scope"></column-content>
          </template>
        </el-table-column>
      </template>
      <template slot="empty">
        <img :src="$Util.emptySrc" alt="">
        <p style="padding-top: 15px;font-size: 16px">~ 暂无数据 ~</p>
      </template>

    </el-table>
  </div>
</template>
<script>
  import ColumnContent from './ColumnContent.vue'
  let static_columns_data;
  export default {
    props: {
      isRequested: {
        type: Boolean,
        default: false
      },
      "filteredDataParent": {
        type: Array,
        required: false,
        default(){
          return []
        }
      },
      "columns-data": {             // 列数据
        type: Array,
        required: false
      },
      "table-data": {                // 表格数据
        type: Array,
        required: false,
        default(){
          return []
        }
      },
      "table-setting": {             // 表格设置 详细见api
        type: Object,
        required: false,
        default(){
          return {}
        }
      },
      "need-index": {                // 表格设置 是否显示 序号
        default: true
      },
      "need-select": {               // 表格设置 是否显示 多选
        default: false
      },
      "needRowClass": {//需要表格特殊背景色
        default: ""
      }
    },
    data(){
      return {
        filterData: [],        // 过滤的数据
        filteredData: [],      // 过滤完的数据
        staticColumns: [],     // 静态表格头数据
        dialogVisible: false
      }
    },
    watch: {
      filteredData(cur){                  // 先将所有的都显示出来
        this.columnsData.forEach(e => {
          e.showIt = true;
        })
        cur.forEach(e => {                 // 再把不要显示的弄走
          this.columnsData.forEach(ele => {
            if (ele.prop == e) {
              ele.showIt = false;
            }
          })
        });
      },
      isRequested(){
        this.filteredData = this.filteredDataParent;
      }
    },
    methods: {
      saveChange(){
        this.dialogVisible = false;
        this.$emit("column-change");
      },
      tableRowClassName({row, rowIndex}) {
        /*this.$emit("row-class", {row, rowIndex});*/
        //创建订单特殊样式
        if (this.needRowClass == "orderCreateTab") {
          if (row.is_customer_logistics == 1 && row.is_update_logistics == 0) {
            return "customized-row";
          }
          if (row.paytype == 1) {
            //货到付款
            return "paytype-row";
          }
        }
      },
      clearSelection(){             // 清除所有的选中项
        this.$refs.elTable.clearSelection();
      },
      selectAll(selection){
        this.$emit("select-all", selection)
      },
      select(selection, row){
        this.$emit("select", selection, row)
      },
      rowClick(row, event, column){
        this.$emit("row-click", row, event, column)
      },
      rowDblclick(row, event){
        this.$emit("row-dblclick", row, event)
      },
      cellClick(row, column, cell, event){
        this.$emit("cell-click", row, column, cell, event)
      },
      cellDblClick(row, column, cell, event){
        this.$emit("cell-dblclick", row, column, cell, event)
      },
      close(){
        this.dialogVisible = false
      }
    },
    created(){
      static_columns_data = this.columnsData.slice(0);
      this.columnsData.forEach(e => {
        e.showIt = e.showIt === false ? false : true;
        e.key = e.prop;
        e.align = e.align ? e.align : 'center';
        this.filterData.push(e)
        if (!e.hasOwnProperty('render')) {
          e.render = function (h, scope) {
            return h("div", scope.row[e.prop])
          }
        }
      });
    },
    components: {
      "column-content": ColumnContent
    }
  }
</script>
<style scoped>
  .wrapper {
    position: relative;
  }

  .wrapper .show {
    font-size: 24px;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 99;
  }

  .el-table th, .el-table tr {
    background-color: red;
  }

</style>
