<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
<template>
  <div style="padding: 10px;border:1px solid #dcdfe6;">
    <el-input
      size="mini"
      clearable
      placeholder="输入分类关键字对进行过滤"
      v-model="filterText" @clear="resetChecked">
    </el-input>
    <el-tree ref="tree" :filter-node-method="filterNode"
             :data="treeData"
             :props="defaultProps"
             :node-key="nodeKey"
             :show-checkbox="showCheckbox"
             :default-expanded-keys="defaultExpandedKeys"
             :default-checked-keys="defaultCheckedKeys"
             :expand-on-click-node="false"
             :render-content="renderContent"
             @check-change="handleCheckChange"
             @current-change="handleNodeChange">
    </el-tree>
    <el-dialog title="编辑分类" :visible.sync="goodsEdit.visible" width="320px">
      <el-form>
        <el-form-item label="分类名称：">
          <el-input size="mini" style="width:200px;" clearable v-model="goodsEdit.data.name"></el-input>
        </el-form-item>
        <div class="clearfix">
          <el-button size="mini" type="primary" style="float:right;margin:15px 0 0;" @click="doEdit">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        filterText: "",
        result: {
          ids: [],
          names: [],
          objs: []
        },
        treeData:[{goods_cat_id: "0", name: "全部分类",children:[]}],
        goodsEdit:{
          visible:false,
          data:{
            name:"",
            parent_id:""
          }
        }
      };
    },
    props: {
      isIgnoreParent: {
        type: Boolean,
        default: false,
      },
      nodeKey: {//主键key
        type: String,
        default: "goods_cat_id"
      },
      defaultProps: {//树配置项
        type: Object,
        default(){
          return {
            children: 'children',
            label: 'name'
          }
        }
      },
      defaultExpandedKeys: {//默认展开节点
        type: Array,
        default(){
          return []
        }
      },
      defaultCheckedKeys: {//默认选中节点
        type: Array,
        default(){
          return []
        }
      },
      showCheckbox: {//是否显示checkbox
        type: Boolean,
        default: false
      },
      isEdit:{//是否编辑树
        type: Boolean,
        default: false
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      renderContent(h, { node, data, store }) {
        if(this.isEdit){
          return (
            <span class="custom-tree-node">
            <span>{node.label}</span>
          <span>
          <el-button size="mini" type="text" on-click={ () => this.append(data) }>添加</el-button>
          </span>
          </span>);
        }else{
          return (
            <span class="custom-tree-node">
            <span>{node.label}</span>
          <span>
          </span>
          </span>);
        }
      },
      doEdit(){
       if(!this.goodsEdit.data.name.trim()){
         this.$alert("请填写分类名称!", '错误提示', {
           confirmButtonText: '确定',
           type: "error"
         }).catch({});
       }else{
         this.$ajaxPost("Erp/Category/catAdd",this.goodsEdit.data).then(res=>{
           if (res.data.code == 1) {
             this.catListAjax();
           } else {
             this.$alert(res.data.msg, '错误提示', {
               confirmButtonText: '确定',
               type: "error"
             }).catch({});
           }
           this.goodsEdit.visible = !this.goodsEdit.visible;
         });
       }
      },
      catListAjax(){
        this.$ajaxPost("Erp/Category/catList", {}).then(res => {
          if (res.data.stat == 1) {
            this.treeData[0].children = res.data.data;
          } else {
            this.$message({
              type: "error",
              message: "请求失败!"
            });
            this.treeData = [{goods_cat_id: "0", name: "全部分类",children:[]}];
          }
        })
      },
      append(data) {
        this.goodsEdit.data.parent_id = data.goods_cat_id;
        this.goodsEdit.visible = !this.goodsEdit.visible;
      },
      filterNode(value, data) {//过滤
        if (!value) return true;
        return data[this.defaultProps.label].indexOf(value) !== -1;
      },
      handleNodeChange(data, node) {//单击改变
        if (this.showCheckbox) {
          return;
        } else {
          this.getFinalResult("single");
          this.$emit("nodeCallback");
        }
      },
      handleCheckChange(data, checked, indeterminate){//check改变
        this.getFinalResult();
        this.$emit("checkCallback");
      },
      getFinalResult(type){
        this.result.ids = [];
        this.result.objs = [];
        this.result.names = [];
        if (type == "single") {//单选结果
          if (this.$refs.tree.getCurrentNode()) {
            if (this.isIgnoreParent && this.$refs.tree.getCurrentNode().isParent) {
              //去掉父节点
            } else {
              this.result.ids = this.$refs.tree.getCurrentKey();
              this.result.objs = this.$refs.tree.getCurrentNode();
              this.result.names.push(this.$refs.tree.getCurrentNode()[this.defaultProps.label]);
            }
            this.filterText = this.result.names[0];
          }
        } else {//多选结果
          if (this.isIgnoreParent) {
            //去掉父节点
            this.$refs.tree.getCheckedNodes().forEach(item => {
              if (!item.isParent) {
                this.result.ids.push(item[this.defaultProps.label]);
                this.result.names.push(item[this.defaultProps.label]);
                this.result.objs.push(item);
              }
            });
          } else {
            this.result.ids = this.$refs.tree.getCheckedKeys();
            this.result.objs = this.$refs.tree.getCheckedNodes();
            this.result.names = [];
            this.$refs.tree.getCheckedNodes().forEach(item => {
              this.result.names.push(item[this.defaultProps.label]);
            });
          }
        }
      },
      resetChecked() {//清空
        this.$refs.tree.setCheckedKeys([]);
        this.$refs.tree.setCurrentKey(undefined);
        this.getFinalResult();
        this.filterText='';
        this.$emit('clearInp')
      }
    },
    mounted(){
      if (this.defaultCheckedKeys) {
        this.result.ids = this.defaultCheckedKeys
      }
      this.catListAjax();
    }
  };
</script>
