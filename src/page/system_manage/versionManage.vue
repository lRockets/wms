<template>
    <div class="version">
        <header class="top-head">
            <el-button size="small" @click="addVersion" class="total">添加版本</el-button>
        </header>
        <el-table ref="versionList" :data="versionList" height="500px" border>
            <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
            <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
                <el-button type="text" @click="editorUser(scope.row)">编辑</el-button>
                <el-button type="text" @click="downLoadBtn(scope.row)">下载</el-button>
                <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
            </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="versionCode" label="code码" ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="versionNo" label="版本号"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="更新说明"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="isTips" label="是否提示更新" width="100">
                <template slot-scope="scope">
                    {{scope.row.isTips=='0'?'是':'否'}}
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="isForce" label="是否强制更新"  width="100">
                <template slot-scope="scope">
                    {{scope.row.isForce=='0'?'是':'否'}}
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="updateTime" label="更新时间" width="170"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="updateByname" label="更新人"></el-table-column>
            <template slot="empty">
                <div class="noData">
                    <div class="noData-img"></div>
                    <p>暂无数据</p>
                </div>
            </template>
        </el-table>
        <!--分页-->
        <el-pagination background :page-sizes="[15,30,50,100]"
                        :page-size="param.pageSize"
                        :total="total"
                        layout="total, prev, pager, next, sizes, jumper"
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        :current-page.sync="param.pageNum"
                        style="margin-top: 20px;text-align: center;">
        </el-pagination>
        <el-dialog :title="versionDiaTitle" :visible.sync="versionDia"  :modal-append-to-body="false" @close='resetversionDia' class="versionDiaInfor">
          <el-form :model="versionInfor" label-width="120px" class="versionInfor" :rules="versionInforRule" ref="versionInforRef" size="small">
            <div class="versionNoBox">
                <el-form-item prop="versionCode" label="版本号：" class="versionNo"></el-form-item>
                <el-form-item prop="num1" label="V" label-width="23px">
                    <el-input size="small" v-model="versionInfor.num1" maxlength="3" style="width:60px;" onkeyup="value=value.replace(/^0\d|[^\d]+/g,'')"></el-input>
                </el-form-item>
                <el-form-item prop="num2" label="." label-width="27px">
                    <el-input size="small" v-model="versionInfor.num2" maxlength="3" style="width:60px;" onkeyup="value=value.replace(/^0\d|[^\d]+/g,'')"></el-input>
                </el-form-item>
                <el-form-item prop="num3" label="." label-width="27px">
                    <el-input size="small" v-model="versionInfor.num3" maxlength="3" style="width:60px;" onkeyup="value=value.replace(/^0\d|[^\d]+/g,'')"></el-input>
                </el-form-item>
            </div>
            <el-form-item prop="apkUrl" label="上传安装包：" class="uploadModule">
                 <el-input size="small" placeholder="未选择任何文件" v-model="fileUpload" disabled style="width:280px;background-color: #ffffff;">
                    <template slot="append">
                        <el-upload
                            class="upload-demo"
                            ref="uploadTxt"
                            :headers="headers"
                            :action="$baseURL+'wms/file/upload.do'"
                            :on-success="handleSuccess"
                            :data="updData"
                            :show-file-list='false'
                            :auto-upload="false"
                            :on-change='changeStatus'
                            :before-upload="beforeAvatarUpload">
                            <span slot="trigger" size="small">浏览</span>
                        </el-upload>
                    </template>
                </el-input>
                <el-button style="margin-left: 10px;" size="small"  @click="submitUpload" class="btn-custom total">点击上传</el-button>
            </el-form-item>
            <el-form-item v-show="uploadSchedule">
                <el-progress :percentage="percentage" color="#1cd8ad"></el-progress>
            </el-form-item>
            <el-form-item label="更新说明：" prop="note">
                <el-input size="small" type="textarea" v-model="versionInfor.note" maxlength="1000"></el-input>
            </el-form-item>
            <el-form-item label="是否提示更新：" prop="isTips">
                <el-switch
                    v-model="versionInfor.isTips"
                    active-value='0'
                    inactive-value='-1'>
                </el-switch>
            </el-form-item>
            <el-form-item label="是否强制更新：" prop="isForce">
                <el-switch
                    v-model="versionInfor.isForce"
                    active-value='0'
                    inactive-value='-1'>
                </el-switch>
            </el-form-item>
            <div style="width: 100%;text-align:right;">
              <el-button size="small" @click="concelAdd">取消</el-button>
              <el-button size="small" @click="saveAdd" class="total" v-if="versionDiaTitle=='添加版本'">保存</el-button>
              <el-button size="small" @click="saveEdit" class="total" v-if="versionDiaTitle=='编辑版本'">保存</el-button>
            </div>
          </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props:{},
    data(){
        const numReg = (rule, value, callback) => {
            let v1 = this.versionInfor.num1.toString().trim()
            let v2 = this.versionInfor.num2.toString().trim()
            let v3 = this.versionInfor.num3.toString().trim()
            let flag1=/^(\d|[1-9]\d|100)$/.test(v1);
            let flag2=/^(\d|[1-9]\d|100)$/.test(v2);
            let flag3=/^(\d|[1-9]\d|100)$/.test(v3);
            let obj='';
            if(flag1&&flag1&&flag1){
                obj=this.versionInfor.num1+'.'+this.versionInfor.num2+'.'+this.versionInfor.num3
            }
            if(!flag1||!flag2||!flag3){
                callback(new Error('请输入0-100的整数'))
            }else if(this.rowData.versionCode!==obj){
                let param = JSON.stringify({versionCode: obj})
                setTimeout(() => {
                    this.$ajaxPost('wms/version/select.do', {reqParam: param}).then(({data}) => {
                        if (data.code == 200 && data.data) {
                            callback(new Error('当前版本号已存在，不可重复添加'))
                        } else {
                            callback()
                        }
                    })
                }, 10)
            }else{
                callback()
            }
        }
        const apkUrlReg = (rule, value, callback) => {
            if(this.percentage!=100){
                callback(new Error('请上传APK文件安装包'))
            }else{
                callback()
            }
        }
        return{
            percentage:0,
            uploadSchedule:false,
            timer:null,

            versionList:[],
            versionDiaTitle:'添加版本',
            versionDia:false,
            versionInfor:{
                id:'',
                num1:'',
                num2:'',
                num3:'',
                versionCode:'',
                apkUrl:'',
                note:'',
                isTips:'0',
                isForce:'-1',
                versionSize:'',
            },
            versionInforRule:{
                versionCode:[{required: true, trigger: 'change',validator:numReg}],
                apkUrl:[{required: true, trigger: 'change',validator:apkUrlReg}],
                note:[{required: true, trigger: 'change', message:'请输入1-1000个字'}]
            },
            rowData:{},
            fileUpload:'',
            updData: {path: 'version/confPrint'},
            param:{
                pageSize:15,
                pageNum:1,
                keyword:'',
            },
            total:0,
        }
    },
    methods:{
        // 获取所有模板
        getAllVersion(){
            let json_param=JSON.stringify(this.param)
            this.$ajaxPost('wms/version/selectPage.do',{reqParam:json_param}).then(({data})=>{
                if(data.code==200){
                    this.versionList=data.data.dataList
                    this.total=data.data.totalNum
                }else{
                    this.$message.error(data.msg)
                }
            })
        },
        //添加版本
        addVersion(){
            this.versionDia=true;
            this.versionDiaTitle='添加版本'
        },
        qSearch(){
            this.param.keyword=this.$refs.qSearchRef.inputValue
            this.getAllVersion();
        },
        //编辑
        editorUser(row){
            this.rowData=JSON.parse(JSON.stringify(row))
            for(let key in this.versionInfor){
                if(row[key]!=null){
                    this.versionInfor[key]=row[key]
                } 
            }
            this.versionInfor.isTips=this.versionInfor.isTips+''
            this.versionInfor.isForce=this.versionInfor.isForce+''
            let str=JSON.parse(JSON.stringify(row.versionCode)).split('')
            
            this.versionInfor.num1=str[0]
            this.versionInfor.num2=str[2]
            this.versionInfor.num3=str[4]
            this.fileUpload=this.versionInfor.apkUrl
            this.uploadSchedule=true;
            this.percentage=100
            this.versionDia=true;
            this.versionDiaTitle='编辑版本'
        },
        downLoadBtn(row){
            window.open(this.$Util.formatImageUrl(row.apkUrl))
        },
        //删除
        deleteRow(row){
            this.$confirm('删除文件后，不可恢复，请谨慎操作？', '删除文件', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let json_param=JSON.stringify({ids:row.id,status:'-2'})
                this.$ajaxPost('wms/version/updateBatchStatus.do',{reqParam:json_param}).then(({data})=>{
                    if(data.code==200){
                        this.$message.success('删除成功')
                        this.param.pageSize=15;
                        this.param.pageNum=1;
                        this.getAllVersion();
                    }else{
                        this.$message.error(data.msg)
                    }
                })
            }).catch(() => {})
        },
        //取消
        concelAdd(){
            this.versionDia=false;
        },
        //保存新增
        saveAdd(){
            this.$refs.versionInforRef.validate((valid) => {
                if (valid) {
                    this.versionInfor.versionCode=this.versionInfor.num1+'.'+this.versionInfor.num2+'.'+this.versionInfor.num3
                    let json_param = JSON.stringify(this.versionInfor)
                    this.$ajaxPost('wms/version/add.do', {reqParam: json_param}).then(({data}) => {
                        if (data.code == 200) {
                            this.$message.success('新增成功')
                            this.param.pageNum=1;
                            this.param.pageSize=15
                            this.versionDia = false
                            this.getAllVersion()
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                } else {
                    return false
                }
            })
        },
        //保存编辑
        saveEdit(){
             this.$refs.versionInforRef.validate((valid) => {
                if (valid) {
                    this.versionInfor.versionCode=this.versionInfor.num1+'.'+this.versionInfor.num2+'.'+this.versionInfor.num3
                    let json_param = JSON.stringify(this.versionInfor)
                    this.$ajaxPost('wms/version/update.do', {reqParam: json_param}).then(({data}) => {
                        if (data.code == 200) {
                            this.$message.success('编辑成功')
                            this.param.pageNum=1;
                            this.param.pageSize=15
                            this.versionDia = false
                            this.getAllVersion()
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                } else {
                    return false
                }
            })
        },
        // 上传文件
        submitUpload() {
            this.uploadSchedule=true;
            this.$refs.uploadTxt.submit();
        },
        //导入成功时
        handleSuccess(response, file, fileList) {
            if(response.code==200){
                this.percentage = 0;
                this.versionInfor.apkUrl=response.data.url
                this.versionInfor.versionSize=response.data.size
                this.timer = setInterval( () => {
                    this.percentage ++ ; 
                    if (this.percentage > 99) {
                        this.percentage = 100;
                        clearInterval( this.timer );
                        this.timer = null;
                    }
                }, 10); 
            }else{
                this.$message.error(response.msg)
            }
        }, 
        //限制图片格式、尺寸
        beforeAvatarUpload (file) {
            const isLt5M = file.size / 1024 / 1024 < 30
            if (!isLt5M) {
            this.$message.error('单个文件需小于等于30M')
            }
            return isLt5M
        },
        changeStatus(file, fileList){
            this.fileUpload=file.name
        },
        uploadError (err, file, fileList) {
            this.$message.error(err)
        },

        // 重置表单
        resetversionDia(val){
            this.$refs.versionInforRef.resetFields()
            Object.keys(this.versionInfor).forEach(key => {
                this.versionInfor[key] = ''
            })
            this.versionInfor.isTips='0';
            this.versionInfor.isForce='-1';
            this.fileUpload=''
            this.percentage = 0;
            this.uploadSchedule=false;
            clearInterval( this.timer );
            this.timer = null;
        },
         //每页数量改变
        sizeChange(v) { 
            this.param.pageSize = v;
            this.getAllVersion();
        },
        //当前页改变
        currentChange(v) {
            this.param.pageNum = v;
            this.getAllVersion();
        },
    },
    mounted(){
        this.getAllVersion();
    },
    computed:{
      headers(){
        return{
          'loginToken':this.$Cookies.get('token'),
          'optDevice':'PC',
        }
      }
    },
}
</script>
<style lang="scss">
.version{
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .versionNoBox{
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
    }
    .versionNo .el-form-item__content .el-form-item__error{
        width: 200px;
    }
}
.uploadModule{
   .el-form-item__content{
        display: flex;
        align-items: center;
        height: 40px;
    }
    
    .el-input{
        height:32px;
        line-height: 30px;
        .el-input__inner{
            height:32px;
            line-height: 32px;
            background-color: #ffffff;
        }
    }
}
</style>
