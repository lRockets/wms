<template>
    <div class="print">
        <el-form :model="shippingData"
                 ref="shippingFormRef"
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
                                    <el-select size="small" v-model="printDefault" placeholder="请选择">
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
                            <el-form-item prop="num" label="打印份数：">
                                <el-input style="width: 53%;" size="small" v-model="shippingData.num" placeholder="请输入打印份数"/>
                            </el-form-item>
                            <!-- <el-form-item prop="tplValue" label="打印模板：">
                                <el-col :span="18">
                                    <el-select size="small" v-model="shippingData.tplValue" placeholder="请选择">
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
    },
    data() {
        return {
            printList: [],
            printDefault: '',
            printStatus: '',
            shippingData: {
                num: '1',
                tplValue: '',
            },
        }
    },
    created() {
        this.getPrinters();
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
