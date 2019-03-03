<template>
    <div class="interfaceConfig">
        <ul class="topNav">
            <li :class="{active:whichNav=='first'}" @click="erpBtn">ERP接口参数</li>
            <li class="line"></li>
            <li :class="{active:whichNav=='two'}" @click="messageBtn">短信接口参数</li>
            <li class="line"></li>
            <li :class="{active:whichNav=='three'}" @click="rookieBtn">菜鸟接口参数</li>
        </ul>
        <el-form :model="configParam" label-width="140px" :rules="configParamRule" ref="configParamRef" size="small">
            <el-form-item label="接口地址 ：" prop='interfaceUrl'>
                <el-input size="small" v-model="configParam.interfaceUrl" maxlength="1000"></el-input>
            </el-form-item>
            <el-form-item label="账号（ID）：" prop='interfaceNo'>
                <el-input size="small" v-model="configParam.interfaceNo" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="密钥（Secret）：" prop='interfaceSecret'>
                <el-input size="small" v-model="configParam.interfaceSecret" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" class="total" @click="saveConfig">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    props:{

    },
    data(){
        return{
            whichNav:'first',
            configParam:{
                interfaceUrl:'',
                interfaceNo:'',
                interfaceSecret:'',
                id:'',
                type:'',
            },
            configParamRule:{
                interfaceUrl:[{required: true, trigger: 'change', message:'请输入0-1000个字'}],
                interfaceNo:[{required: true, trigger: 'change', message:'请输入0-100个字'}],
                interfaceSecret:[{required: true, trigger: 'change', message:'请输入0-100个字'}],
            },
        }

    },
    methods:{
        erpBtn(){
            this.whichNav='first'
            this.getInterface(1)
        },
        messageBtn(){
            this.whichNav='two'
            this.getInterface(2)
        },
        rookieBtn(){
            this.whichNav='three'
            this.getInterface(3)
        },
        getInterface(param){
            this.$refs.configParamRef.resetFields()
            for(let key in this.configParam){
                this.configParam[key]=''
            }
            let json_param=JSON.stringify({type:param})
            this.$ajaxPost('wms/confInterface/select.do',{reqParam:json_param}).then(({data})=>{
                if(data.code==200){
                    if(data.data!=null){
                        for(let key in this.configParam){
                            if(data.data[key]!=null){
                                this.configParam[key]=data.data[key]
                            }
                        }
                    }
                }else{
                    this.$message.error(data.msg)
                }
            })
        },
        saveConfig(){
            let str=''
            if(this.whichNav=='first'){
                str=1
            }else if(this.whichNav=='two'){
                str=2
            }else{
                str=3
            }
            this.$refs.configParamRef.validate((valid) => {
                if (valid) {
                    this.configParam.type=str
                    let json_param=JSON.stringify(this.configParam)
                    this.$ajaxPost('wms/confInterface/update.do',{reqParam:json_param}).then(({data})=>{
                        if(data.code==200){
                            this.$message.success('数据保存成功')
                            this.getInterface(type);
                        }else{
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        },
    },
    mounted(){
        this.getInterface(1);
    },
}
</script>
<style lang="scss">
.interfaceConfig{
    .topNav{
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        margin-bottom: 30px;
        border-bottom:1px dashed #d8dfe3;
        padding: 0 0 20px 20px;
        li{
            line-height: 16px;
            font-family: MicrosoftYaHei;
            font-size: 14px;
            letter-spacing: 0px;
            color: #999999;
            cursor: pointer;
        }
        li.active{
            color: #39b9fe;
        }
        li.line{
            height: 14px;
            width: 1px;
            background: #999999;
            margin: 0 30px;
            cursor: none;
        }
    }
    .el-input{
        width: 300px;
        height: 32px;
        line-height: 32px;
        .el-input__inner{
            height: 32px;
            line-height: 32px;
        }
    }
}
</style>


