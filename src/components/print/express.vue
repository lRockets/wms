<template>
    <div class="print">
        <el-form :model="expressData"
                 ref="expressFormRef"
                 size="small"
                 label-width="120px">
            <el-row>
                <el-col>
                    <div class="print--wrap" style="margin-bottom:30px;">
                        <p class="title">
                            <span>打印机选项</span>
                        </p>
                        <div>
                            <el-form-item prop="tplValue" label="目标打印机：">
                                <el-col :span="18">
                                    <el-select v-model="printDefault" 
                                                @change="changePrintMachine"
                                                placeholder="请选择">
                                        <el-option
                                            v-for="item in printList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                            </el-form-item>
                            <el-form-item prop="num" label="状态：">
                                <el-col :span="18">
                                   {{printStatus}}
                                </el-col>
                            </el-form-item>
                            <!-- <el-form-item prop="num" label="位置：">
                                <el-col>
                                   WSD-725ef1d1-19f2-4567-a5ba-68ca85edb103...
                                </el-col>
                            </el-form-item> -->
                        </div>
                    </div>
                    <div class="print--wrap">
                        <p class="title">
                            <span>打印效果</span>
                        </p>
                        <div>
                            <el-form-item prop="num" label="待打印订单：">
                                <el-col :span="18">
                                   {{count.ExpbillPtwiceCount}}笔，其中首次打印的订单{{count.SendbillPtwicePtwiceCount}}笔
                                </el-col>
                            </el-form-item>
                            <el-form-item v-if="canSelect" prop="num" label="物流商：">
                                <el-select  v-model="code" @change="changeExpCompany" placeholder="请选择">
                                    <el-option
                                        v-for="item in expressCompanies"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-if="!isSF" :disabled="!isSF" v-model="expressData.companyTpl" placeholder="请选择">
                                    <el-option
                                        v-for="item in companyTpls"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-else v-model="expressData.SFCompanyTpl" placeholder="请选择">
                                    <el-option
                                        v-for="item in SFCompanyTpls"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="num" label="剩余物流单号：">
                                <el-col :span="18">
                                   {{count.ExpbillPtwiceCount}}
                                </el-col>
                            </el-form-item>
                            <el-form-item v-if="canSelect" label="运费：">
                                <el-col :span="18">
                                    <el-radio-group v-model="expressData.fee">
                                        <el-radio label="寄方付">寄方付</el-radio>
                                        <el-radio label="到付">到付</el-radio>
                                    </el-radio-group>
                                </el-col>
                            </el-form-item>
                            <el-form-item v-if="isSF" label="时效：">
                                <el-col :span="18">
                                    <el-radio-group   v-model="expressData.time">
                                        <el-radio label="顺丰特惠">顺丰特惠</el-radio>
                                        <el-radio label="顺丰标快">顺丰标快</el-radio>
                                    </el-radio-group>
                                </el-col>
                            </el-form-item>
                            <!-- <el-form-item prop="tplValue" label="打印模板：">
                                <el-col :span="18">
                                    <el-select  v-model="shippingData.tplValue" placeholder="请选择">
                                        <el-option
                                            v-for="item in tplList"
                                            :key="item.tplName"
                                            :label="item.tplName"
                                            :value="item.tplName">
                                        </el-option>
                                    </el-select>
                                </el-col>
                            </el-form-item> -->
                        </div>
                    </div>
                    <div></div>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
export default {
    props: {
        showPrint: Boolean,
        logisticsList: Array,
        tplList: Array,
        count: Object,
        selectIds: Array,
        logisticsCode: String,
        caiNiaoPrintDefault: String,
    },
    data() {
        return {
            printList: [],
            printDefault: '',
            printStatus: '',
            expressData: {
                num: '1',
                tplValue: '',
                company: '',
                companyTpl: '',
                SFCompanyTpl: '',
                fee: '寄方付',
                time: '顺丰特惠',
            },
            expressCompanies: [{
                label: '中通快递',
                value: 'ZTO',
            }, {
                label: '圆通快递',
                value: 'YTO',
            } , {
                label: '德邦快递',
                value: 'DBKD',
            }, {
                label: '顺丰速运',
                value: 'SF',
            }, {
                label: '韵达快递',
                value: 'YUNDA',
            }],
            companyTpls: [{
                label: '菜鸟中通模板',
                value: 'ZTO',
            }, {
                label: '菜鸟圆通模板',
                value: 'YTO',
            } , {
                label: '菜鸟德邦模板',
                value: 'DBKD',
            }, {
                label: '菜鸟顺丰模板',
            }, {
                label: '菜鸟韵达模板',
                value: 'YUNDA',
            }],
            SFCompanyTpls: [{
                label: '陆运',
                value: 'SFLY',
            }, {
                label: '航空',
                value: 'SFHK',
            }],
            code: '',
        }
    },
    computed: {
        canSelect() {
            if (this.selectIds.length > 1) {
                return false;
            } else {
                return true;
            }
        },
        isSF() {
            if ('SF' === this.code) {
                return true;
            } else {
                return false;
            }
        },
    },
    created() {
        this.code = this.logisticsCode;
        this.expressData.companyTpl = this.logisticsCode;
        this.expressData.SFCompanyTpl = 'SFLY';
        if (this.isSF) {
            this.$emit('getPrintExpress', this.code);
            this.getPrinters();
        } else {
            this.getCaiNiaoPrinters();
        }
    },
    methods: {
        getPrinters() {
            cfprint.onmessage = (evn) => {
                // cfprint.log('收到消息！"'+evn.data+'"', evn);
                const resp = JSON && JSON.parse(evn.data) || $.parseJSON(evn.data); 
                if (resp.result === 1 && resp.printers) {    
                    cfprint.log('获取打印机列表成功!');    
                    const data = JSON.parse(evn.data).printers
                    data.forEach((print) => {
                        if (print.default) {
                            this.printDefault = print.name;
                        }
                    });
                    this.printList = data.map((item) => {
                        return {
                            value: item.name,
                            label: item.name,
                        }
                    });
                    this.checkServerStatus();
                } else {                   
                    cfprint.log("获取打印机列表失败: "+resp.message);
                }
            }
            
            // getParam();    //获取页面上最新的打印服务器参数
                var _retrievePrnListData = '{"business_type":2}';  //获取打印机列表的请求数据
            
            //发送获取打印机列表数据
            sendMsg(_retrievePrnListData); 
        },
        // 获取菜鸟打印的打印机列表
        getCaiNiaoPrinters() {
            this.printList = this.$Print.printList;
            this.printDefault = this.$Print.printDefault;
            this.printStatus = this.$Print.printStatus;
        },
        checkServerStatus() {
            if(cfprint.state() !== cfprint.OPEN) {
                cfprint.onclose = (evn) => {
                    cfprint.log('与服务器连接中断或无法连接，请确认康虎云报表服务器已启动', evn);
                    this.printStatus = '无法连接';
                }
                cfprint.onopen = (evn) => {
                    cfprint.log('与服务器连接成功。服务器已正常启动。', evn);
                    this.printStatus = '准备就绪';
                }
                // cfprint.open();    //重新连接，该函数在cfprint_ext.js中
            } else {
                cfprint.log('与服务器连接正常。');
                this.printStatus = '准备就绪';
            }
        },
        changePrintMachine(value) {
            this.printDefault = value;
            this.$emit('getPrintMachine', value);
        },
        changeExpCompany(value) {
            console.log(value);
           this.expressData.companyTpl = value;
           this.$emit('getPrintExpress', value);
        },
    },
        
}
</script>
<style lang="scss">
    .print{
        .el-form-item{
            margin-bottom: 15px;
        }
        .title{
            position: relative;
            padding:10px 0;
            span{
                position: absolute;
                top: -10px;
                text-indent: 42px;
            }
            &:before{
                position: absolute;
                content: '';
                left:0;
                top:0;
                background-color: #e5e5e5;
                width: 30px;
                height: 1px;
            }
             &:after{
                position: absolute;
                content: '';
                right:0;
                top:0;
                background-color: #e5e5e5;
                width: 75%;
                height: 1px;
            }
        }
        .print--wrap{
            border: 1px solid #e5e5e5;
            border-top: none;
            .print__label{
                display: inline-block;
                width: 100%;
                text-align: right;
            }
            .el-row{
                margin-bottom: 20px;
            }
            &:nth-child(2){
                .title{
                    span{
                        text-indent: 48px;
                    }
                }
            }
        }
    }
    .print__preview{
       height: 350px;
    }
</style>
