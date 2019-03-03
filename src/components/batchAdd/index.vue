<template>
    <el-dialog title="批量生成库位" :visible.sync="batch_addDia"  :modal-append-to-body="false" class="addlocation" @close="resetBatchAdd">
        <el-form :model="batch_add" label-width="120px" :rules="batch_addRule" ref="batch_addRef" v-show="active==1" size="small">
            <el-form-item prop="type" label="类型：">
                <el-select size="small" v-model="batch_add.type" placeholder="请选择"  @change="changeType" >
                <el-option label="货架" value="1"></el-option>
                <el-option label="托盘" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="stoareaId" label="所在库区：">
                <el-select size="small" v-model="batch_add.stoareaId" placeholder="请选择库区" @change="changeStoarea">
                    <template v-for="(item,index) in reservoirData">
                        <el-option :label="item.stoareaCode" :value="item.id" :key="index+'batch'"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item prop="stochannelCode" label="通道号：" class="codeRule" style="width: 49%" >
                <span>起始流水号</span>
                <el-input size="small" v-model="batch_add.stochannelCode" ></el-input>
            </el-form-item>
            <el-form-item prop="stochannelNumber" label="生成通道数" style="width: 37%" >
                <el-input size="small" v-model="batch_add.stochannelNumber" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="stoshelfCode" label="货架号：" class="codeRule" style="width: 49%" v-if="batch_add.type==1">
                <span>起始流水号</span>
                <el-input size="small" v-model="batch_add.stoshelfCode" ></el-input>
            </el-form-item>
            <el-form-item prop="stoshelfNumber" label="生成货架数" style="width: 37%" v-if="batch_add.type==1">
                <el-input size="small" v-model="batch_add.stoshelfNumber" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="layerNum" label="层数：" class="codeRule" style="width: 49%" v-if="batch_add.type==1">
                <span>起始流水号</span>
                <el-input size="small" v-model="batch_add.layerNum" ></el-input>
            </el-form-item>
            <el-form-item prop="layerNumber" label="生成层数" style="width: 37%" v-if="batch_add.type==1">
                <el-input size="small" v-model="batch_add.layerNumber" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="columnNum" label="列数：" class="codeRule" style="width: 49%" v-if="batch_add.type==1">
                <span>起始流水号</span>
                <el-input size="small" v-model="batch_add.columnNum" ></el-input>
            </el-form-item>
            <el-form-item prop="columnNumber" label="生成列数" style="width: 37%" v-if="batch_add.type==1">
                <el-input size="small" v-model="batch_add.columnNumber" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="stoshelfCode" label="托盘号：" class="codeRule" style="width: 49%" v-if="batch_add.type==2">
                <span>起始流水号</span>
                <el-input size="small" v-model="batch_add.stoshelfCode" ></el-input>
            </el-form-item>
            <el-form-item prop="stoshelfNumber" label="生成托盘数" style="width: 37%" v-if="batch_add.type==2">
                <el-input size="small" v-model="batch_add.stoshelfNumber" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="length" label="库位长(m)：" >
                <el-input size="small" v-model="batch_add.length"  maxlength="5"></el-input>
            </el-form-item>
            <el-form-item prop="width" label="库位宽(m)：" >
                <el-input size="small" v-model="batch_add.width" maxlength="5"></el-input>
            </el-form-item>
            <el-form-item prop="height" label="库位高(m)：" >
                <el-input size="small" v-model="batch_add.height" maxlength="5"></el-input>
            </el-form-item>
            <el-form-item prop="maxWeight" label="库位承重(kg)：">
                <el-input size="small" v-model="batch_add.maxWeight" maxlength="7"></el-input>
            </el-form-item>
            <el-form-item style="width:100%;text-align:right;">
                <el-button @click="concelEdit">取消</el-button>
                <el-button @click="previewBitBtn">预览库位</el-button>
            </el-form-item>
        </el-form>
        <div class="previewBit" v-show="active==2">
            <p>预览库位信息（共 {{ preBitList.length }} 个库位）</p>
            <el-table ref="preBit " :data="preBitList" border style="margin: 20px 0;" height='300'>
                <el-table-column align="center" label="行号" type="index" width="55"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="locationCode" label="库位编码" width="250"></el-table-column>
                <el-table-column align="center" prop="repeat" label="操作" >
                <template slot-scope="scope">
                    <el-button type="text" @click="deleteStoarea(scope)">删除</el-button>
                    <span style="color:#f56c6;">{{scope.row.repeat=='0'?'':'当前库位编码已存在，请勿重复添加'}}</span>
                </template>
                </el-table-column>
                <template slot="empty">
                    <div class="noData">
                        <div class="noData-img"></div>
                        <p>暂无数据</p>
                    </div>
                </template>
            </el-table>
            <el-row style="text-align:right;">
                <el-button @click="gobackPre">返回上一步</el-button>
                <el-button class='total' @click="submitStorage">确定生成库位</el-button>
            </el-row>
        </div>
    </el-dialog>
</template>
<script>
  export default {
    props:{
        numRules:{
            type:Object,
            default:{},
        },
        reservoirData:{
            type:Array,
            default:[],
        },
    },
    data(){
        return{
            active:'1',
            batch_addDia:false,
            batch_add:{ //  批量生成库位
                type:'1',
                stoareaId:'',
                stoareaCode:'',
                stochannelCode:'',
                stoshelfCode:'',
                layerNum:'',
                columnNum:'',
                stochannelNumber:'',
                stoshelfNumber:'',
                layerNumber:'',
                columnNumber:'',
                length:'',
                width:'',
                height:'', 
                maxWeight:'',
                delectCodeList:[],
            },
            batch_addRule:{
                type:[{required: true, trigger: 'change', message:'请选择类型'}],
                stoareaId:[{required: true, trigger: 'change', message:'请选择库区'}],
                stochannelCode:[{required: true, trigger: 'change', validator:(rule, value, callback)=> this.$Util.RegExp.b_num1Reg(rule, value, callback,this.numRules.stochannelCodeRule)}],
                stoshelfCode:[{required: true, trigger: 'change', validator:(rule, value, callback)=> this.$Util.RegExp.b_num1Reg(rule, value, callback,this.batch_add.type=='1'?this.numRules.stoshelfCodeRule:this.numRules.palletCodeRule)}],
                layerNum:[{required: true, trigger: 'change', validator:(rule, value, callback)=> this.$Util.RegExp.b_num1Reg(rule, value, callback,this.numRules.layerCodeRule)}],
                columnNum:[{required: true, trigger: 'change', validator:(rule, value, callback)=> this.$Util.RegExp.b_num1Reg(rule, value, callback,this.numRules.columnCodeRule)}],

                stochannelNumber:[{required: true, trigger: 'change',validator:(rule, value, callback)=> this.$Util.RegExp.produce1Reg(rule, value, callback,this.numRules.stochannelCodeRule,this.batch_add.stochannelCode)}],
                stoshelfNumber:[{required: true, trigger: 'change',validator:(rule, value, callback)=> this.$Util.RegExp.produce1Reg(rule, value, callback,this.batch_add.type=='1'?this.numRules.stoshelfCodeRule:this.numRules.palletCodeRule,this.batch_add.stoshelfCode)}],
                layerNumber:[{required: true, trigger: 'change', validator:(rule, value, callback)=> this.$Util.RegExp.produce1Reg(rule, value, callback,this.numRules.layerCodeRule,this.batch_add.layerNum)}],
                columnNumber:[{required: true, trigger: 'change', validator:(rule, value, callback)=> this.$Util.RegExp.produce1Reg(rule, value, callback,this.numRules.columnCodeRule,this.batch_add.columnNum)}],
                length:[{required: true, trigger: 'change',  validator: this.$Util.RegExp.lengthReg}],
                width:[{required: true, trigger: 'change', validator: this.$Util.RegExp.length2Reg}],
                height:[{required: true, trigger: 'change', validator: this.$Util.RegExp.length2Reg}],
                maxWeight:[{required: true, trigger: 'change', validator: this.$Util.RegExp.length2Reg}],
            },
            preBitList:[],
        }
    },
    methods:{
        //预览库位
        previewBitBtn(){
            this.$refs.batch_addRef.validate((valid) => {
                if (valid) {
                    this.batch_add.stochannelCode=this.batch_add.stochannelCode.toUpperCase()
                    this.batch_add.stoshelfCode=this.batch_add.stoshelfCode.toUpperCase()
                    this.batch_add.layerNum=this.batch_add.layerNum.toUpperCase()
                    this.batch_add.columnNum=this.batch_add.columnNum.toUpperCase()
                    let json_batch_add=JSON.stringify(this.batch_add)
                    this.$ajaxPost('wms/storehouseLocation/validatorBatch.do',{reqParam:json_batch_add}).then(({data})=>{
                    if(data.code==200){
                        this.active=2
                        this.preBitList=data.data
                    }else{
                        this.$message.error(data.msg)
                    }
                    })
                }
            })
        },
        //取消
        concelEdit(){
            this.batch_addDia=false;
        },
        //改变新增类型
        changeType(val){
            this.$refs.batch_addRef.resetFields();
            Object.keys(this.batch_add).forEach(key => {
                this.batch_add[key] = '';
            });
            this.batch_add.delectCodeList = [];
            this.batch_add.type = val;
        },
        //选择库区时
        changeStoarea(val){
            this.reservoirData.forEach(item=>{
                if(item.id==val){
                    this.batch_add.stoareaCode=item.stoareaCode;
                }
            })
        },
        // 删除预览的库位
        deleteStoarea(scope){
            this.batch_add.delectCodeList.push(scope.row.locationCode)
            this.preBitList.splice(scope.$index,1)
        },
        //返回上一步
        gobackPre(){
            this.active=1;
        },
        //确定生产库位
        submitStorage(){
            let flag=true;
            this.preBitList.forEach(item=>{
                if(item.repeat=='1'){
                    this.$message.warning('请移除重复的库位')
                    flag=false
                }
            })
            if(flag){
                this.$refs.batch_addRef.validate((valid) => {
                    if (valid) {
                        let json_batch_add=JSON.stringify(this.batch_add)
                        this.$ajaxPost('wms/storehouseLocation/addBatch.do',{reqParam:json_batch_add}).then(({data})=>{
                        if(data.code==200){
                            this.batch_addDia=false;
                            this.$message.success('批量新增成功')
                            this.active=1
                            this.$parent.getStorageTree();
                        }else{
                            this.$message.error(data.msg)
                        }
                        })
                    }
                })
            }else{
                this.$message.warning('请移除重复的库位')
            }
        },
        //关闭批量新增窗口时 表单时重置
        resetBatchAdd(val) {
            this.$refs.batch_addRef.resetFields();
            Object.keys(this.batch_add).forEach(key => {
                // ;
                if(typeof this.batch_add[key] == Array){
                    this.batch_add[key] = []
                }else{
                    this.batch_add[key] = ''
                }
            });
            this.batch_add.delectCodeList=[];
            this.batch_add.type='1';
            this.active=1;
        },
    },
    components: {},
    mounted() {
        
    }
  }
</script>

<style lang="scss">

</style>
