<template>
  <div>
    <el-dropdown 
        :hide-on-click="false" 
        trigger="click">
        <el-button style="width: 260px; text-align: right;" class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"/>
        </el-button>
        <el-dropdown-menu 
            slot="dropdown" 
            :style="`width: ${width}; max-height: ${maxHeight}`"
            v-loading="loading">
            <el-tree
                :data="treeData"
                ref="tree"
                :props="defaultProps"
                show-checkbox
                :node-key="defaultProps.key"
                @check='checkChange'/>
        </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
/**
 * @event emit -> check(currentNode, allData)
 * @param initDataPath: string  用点分割请求返回的data数据层级比如   data.storehouseList  代表数据在获取的属性结构的 data下面的storehouseList里面
 * @param defaultProps: object  树形结构的默认字段，  不传则为默认值
 * @param initParams: object    获取树形数据时的需要传的参数， 
 * @param initUrl： string      获取树形数据的接口地址,
 * @param maxHeight: string     需要带单位   比如400px
 * @param width: string         需要带单位   默认260px
 * @method setVal(key:number[]) 给树setValkey上去
 */
export default {
    name: 'jcDropdownTree',
    data () {
        return {
            treeData: [],
            params: {},
            dataPath: [],
            dataPathLen: 0,
            loading: false,
        }
    },
    props: {
        defaultProps: {
            type: Object,
            default() {
                return {
                    children: 'children',
                    key: 'id',
                    label: 'label',
                }
            }
        },
        initParams: {
            type: Object,
            default () {
                return {};
            },
        },
        initUrl: {
            type: String,
            default: '',
        },
        initDataPath: {
            type: String,
            default: '',
        },
        maxHeight: {
            type: String,
            default: '',
        },
        width: {
            type: String,
            default: '260px',
        }
    },
    created(){
        // 初始化树形结构数据在返回参数的哪个地方
        this.dataPathLen = this.initDataPath.split('.').length;
        this.dataPath = this.initDataPath.split('.');
        // 保存初始化获取数据所传参数
        this.params = this.initParams;
        this.getTreeData();
    },
    methods: {
        setVal(keys, boolea) {
            const tree = this.$refs.tree;
            tree.setCheckedKeys(keys, boolea);
        },
        checkChange(current, allData) {
            this.$emit('check', current, allData);
        },
        getTreeData() {
            this.loading = false;
            const json_param = JSON.stringify(this.params)
            this.$ajaxPost(this.initUrl, {reqParam: json_param})
                .then(({ data }) => {
                    if(data.code == 200){
                        let treeData = data;
                        for (let i = 0; i < this.dataPathLen; i++) {
                            treeData = treeData[this.dataPath[i]];
                        }
                        this.treeData = treeData;
                        this.loading = true;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
        },
    },
}
</script>
<style scoped>

</style>
