<template>
  <div>
    <div class="treeMain" @click="mainHandle">
      <div class="iptBox" :style="style">
        <el-input :placeholder="placeholder" :disabled="disabled" :value="result.names" size="small" :style="style" readonly :class="{'is-choose':isChoose}"></el-input>
        <span class="spRow" @click="handleClick" v-show="isChoose">
          <i class="el-icon-arrow-down" :class="{iconTrans:showToggleTable,iconRestore:!showToggleTable}"></i>
        </span>
        <!--0422增加可清空-->
        <span class="icon-close el-icon-circle-close" v-show="result.names!=''&&clearable==true && !disabled" @click="clearInp"></span>
        <!--end-->
        <transition name="genaral-fadeIn">
          <div class="toggle-show-inner select-dropdown"
               :style="style"
               v-show="showToggleTable">
            <el-tree ref="tree" :filter-node-method="filterNode"
                     :data="treeData"
                     :props="defaultProps"
                     :node-key="nodeKey"
                     :show-checkbox="showCheckbox"
                     :default-expanded-keys="defaultExpandedKeys"
                     :default-checked-keys="defaultCheckedKeys"
                     @check-change="handleCheckChange"
                     @current-change="handleNodeChange">
            </el-tree>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        showToggleTable: false,
        showTree: false,
        isNoBorder: false,
        height: '150px',
        filterText: '',
        result: {
          ids: [],
          names: '',
          objs: []
        },
        goodsEdit: {
          visible: false,
          data: {
            name: '',
            parent_id: ''
          }
        }
      }
    },
    props: {
      treeData: {   //树 data
        type: Array,
        default () {
          return []
        }
      },
      width: {   //宽度
        type: String,
        default: '300px'
      },
      placeholder: {   //默认提示语
        type: String,
        default: '请选择'
      },
      showCheckbox: {//是否显示checkbox
        type: Boolean,
        default: false
      },
      isIgnoreParent: {//是否忽略父节点
        type: Boolean,
        default: false,
      },
      nodeKey: {//主键key
        type: String,
        default: 'id'
      },
      defaultProps: {//树配置项
        type: Object,
        default () {
          return {
            children: 'children',
            label: 'org_name',
            id: 'id'
          }
        }
      },
      defaultExpandedKeys: {//默认展开节点
        type: Array,
        default () {
          return []
        }
      },
      defaultCheckedKeys: {//默认选中节点
        type: Array,
        default () {
          return []
        }
      },
      isChoose: {
        type: Boolean,
        default () {
          return true
        }
      },
      clearable: {
        type: Boolean,
        default: false
      },
      checkLast: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false,
      }
    },
    watch: {
      showToggleTable (val) {
        if (val) {
          document.onclick = () => {
            this.showToggleTable = false
            document.onclick = null
          }
        }
      }
    },
    computed: {
      style () {
        let style = {}
        if (this.width) {
          style.width = this.width
        }
        return style
      }
    },
    methods: {
      // 0422新增
      clearInp () {
        this.result.names = ''
        this.resetChecked()
      },
      // end
      handleClick () {
        if (this.disabled) {
          return;
        }
        this.showToggleTable = !this.showToggleTable;
      },
      mainHandle (e) {
        e.cancelBubble = true
        e.stopPropagation()
        // document.addEventListener("click", this.docHandle);
      },
      filterNode (value, data) {//过滤
        if (!value) return true
        return data[this.defaultProps.label].indexOf(value) !== -1
      },
      handleNodeChange (data, node) {//单击改变
        if ((this.showCheckbox && node.data.disabled==true)) {
          return
        } else if (this.checkLast) {
          this.getFinalResult('single')
          let obj = this.$refs.tree.getCurrentNode()
          if (obj.children.length > 0) {
            return true
          } else {
            this.$emit('node-click', data)
          }
        } else {
          this.getFinalResult('single')
          this.$emit('node-click', data)
        }
      },
      handleCheckChange (data, checked, indeterminate) {//check改变
        this.getFinalResult()
        this.$emit('check-change')
      },
      getFinalResult (type) {
        this.result.ids = []
        this.result.objs = []
        this.result.names = ''
        if (type == 'single') {//单选结果
          if (this.$refs.tree.getCurrentNode()) {
            if (this.checkLast) {
              let obj = this.$refs.tree.getCurrentNode()
              if (obj.children.length > 0) {
                return true
              } else {
                this.result.ids = this.$refs.tree.getCurrentKey()
                this.result.objs = this.$refs.tree.getCurrentNode()
                this.result.names = this.$refs.tree.getCurrentNode()[this.defaultProps.label]
                this.showToggleTable = false
              }
            } else {
              if (this.isIgnoreParent && this.$refs.tree.getCurrentNode().children != undefined) {
                return
              } else {
                this.showToggleTable = false
                this.result.ids = this.$refs.tree.getCurrentKey()
                this.result.objs = this.$refs.tree.getCurrentNode()
                this.result.names = this.$refs.tree.getCurrentNode()[this.defaultProps.label]
              }
            }
          }
        } else {//多选结果
          if (this.isIgnoreParent) {
            //去掉父节点
            this.$refs.tree.getCheckedNodes().forEach(item => {

              if (item.children == undefined) {
                this.result.ids.push(item[this.defaultProps.id])
                this.result.names = item[this.defaultProps.label]
                this.result.objs.push(item)
              }
            })
          } else {
            this.result.ids = this.$refs.tree.getCheckedKeys()
            this.result.objs = this.$refs.tree.getCheckedNodes()
            this.result.names = ''
            this.$refs.tree.getCheckedNodes().forEach(item => {
              this.result.names = item[this.defaultProps.label]
            })
          }
        }
      },
      resetChecked () {//清空
        this.$refs.tree.setCheckedKeys([])
        this.$refs.tree.setCurrentKey(undefined)
        this.getFinalResult(true)
        this.$emit('clear')
      }
    },
    mounted () {
      if (this.defaultCheckedKeys) {
        this.result.ids = this.defaultCheckedKeys
      }
    }
  }
</script>
<style scoped>
  .select-input {
    width: 214px;
    height: 32px;
    line-height: 32px;
    padding: 0px 7px;
  }

  .select-dropdown {
    min-width: 180px;
    z-index: 2011;
    position: absolute;
    top: 32px;
    left: 0px;
    box-sizing: border-box;
    border: 1px solid #C1C4C9;
    border-radius: 4px;
  }

  .spRow {
    position: absolute;
    top: 0;
    -webkit-transition: all .3s;
    width: 100%;
    height: 100%;
    color: #c0c4cc;
    right: 0;
    text-align: center;
    cursor: pointer;
  }

  .icon-close {
    position: absolute;
    top: 12px;
    -webkit-transition: all .3s;
    /*    width: 20px;
        height: 20px;*/
    padding: 3px;
    color: #c0c4cc;
    right: 8px;
    text-align: center;
    cursor: pointer;
  }

  .iconTrans {
    position: relative;
    top: -4px;
    float: right;
    height: 100%;
    line-height: 32px;
    width: 25px;
    margin-right: 5px;
    color: #c0c4cc;
    font-size: 14px;
    cursor: pointer;
    transform: rotate(-180deg);
    transition: all .4s;
  }

  .iconRestore {
    position: relative;
    top: 5px;
    float: right;
    height: 100%;
    line-height: 32px;
    width: 25px;
    margin-right: 5px;
    color: #c0c4cc;
    font-size: 14px;
    cursor: pointer;
    transform: rotate(0deg);
    transition: all .4s;
  }

  .iptBox {
    width: 180px;
    position: relative;
    display: inline-block;
  }

  .treeMain {
    position: relative;
  }

  .el-input--small >>> .el-input__inner {
    padding-right: 30px;
  }

  .is-choose >>> .el-input__inner {
    background-color: #fff;
    color: #606266;
  }
  .is-choose.is-disabled >>> .el-input__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .el-tree >>> .el-tree-node__label {
    overflow: hidden
  }

  .treeMain >>> .el-tree {
    min-height: 33px;
    max-height: 280px;
    overflow: auto;
  }
</style>
