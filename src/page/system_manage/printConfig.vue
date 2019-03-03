<template>
    <div class="printConfig">
        <header class="top-head">
            <el-button size="small" @click="addModule" class="total">新增模板</el-button>
            <div class="header-right f-fr">
                <search placeholder="请输入模板名称，ID，Code进行搜索" @on-search="qSearch" :width="'280px'" :showIcon="false" ref="qSearchRef"></search>
            </div>
        </header>
        <el-table ref="moduleList" :data="moduleList" height="500px" border>
            <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
            <el-table-column align="center" label="操作" width="246">
            <template slot-scope="scope">
                <el-button type="text" @click="editorUser(scope.row)">编辑</el-button>
                <el-button type="text" @click="downLoadBtn(scope.row)">下载</el-button>
                <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
            </template>
            </el-table-column>
            <el-table-column align="center" label="图片" width="74">
                <template slot-scope="scope">
                    <img :src="$Util.formatImageUrl(scope.row.tplImgUrl)" style="width:100%;height:50px;margin-top:5px;display:block;"/>
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="id" label="模板ID" ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="tplName" label="模板名称"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="type" label="模板类型">
                <template slot-scope="scope">
                    {{['','外部模板','自定义模板'][scope.row.type]}}
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="tplCode" label="模板Code" width="100"></el-table-column>
            <el-table-column align="center" prop="status" label="状态">
                <template slot-scope="scope">
                    {{['删除','禁用','启用'][scope.row.status+2]}}
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
        <el-dialog :title="printDiaTitle" :visible.sync="printDiaDia"  :modal-append-to-body="false" @close='resetPrintDiaDia' class="printDiaInfor">
          <el-form :model="printInfor" label-width="120px" class="printInfor" :rules="stockInforRule" ref="printInforRef" size="small">
            <el-form-item prop="tplName" label="模板名称：">
              <el-input size="small" v-model="printInfor.tplName" style="width:200px" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item prop="type" label="模板类型：">
                <el-radio-group v-model="printInfor.type">
                    <el-radio :label="1">外部模板</el-radio>
                    <el-radio :label="2">自定义模板</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="tplCode" label="模板Code：">
              <el-input size="small" v-model="printInfor.tplCode" style="width:200px" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item prop="" label="上传模板文件：" class="uploadModule">
                <el-input size="small" placeholder="未选择任何文件" v-model="fileUpload" disabled style="width:280px;background-color: #ffffff;">
                    <template slot="append">
                        <el-upload
                            class="upload-demo"
                            ref="uploadTxt"
                            :headers="headers"
                            :action="$baseURL+'wms/file/upload.do'"
                            :on-success="handleSuccess"
                            :data="updDataFile"
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
            <el-form-item label="上传模板图片：">
                <el-upload
                    ref="upload"
                    :headers="headers"
                    class="avatar-uploader f-fl"
                    :action="$baseURL+'wms/file/upload.do'"
                    :show-file-list="false"
                    :data="updDataImg"
                    :on-success="handleAvatarSuccess"
                    :on-error="uploadError"
                    :before-upload="beforeAvatarUpload2">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="avatar-uploader-icon">点击上传</i>
                </el-upload>
                <span class="uploadImgTip f-fl">仅支持png/jpg格式的图片，单张图片需小于等于2M</span> 
            </el-form-item>
            <el-form-item label="状态：" prop="status" :rules="[{ required: true, message: '请选择状态'}]">
                <el-switch
                    v-model="printInfor.status"
                    active-value='0'
                    inactive-value='-1'>
                </el-switch>
            </el-form-item>
            <div style="width: 100%;text-align:right;">
              <el-button size="small" @click="concelAdd">取消</el-button>
              <el-button size="small" @click="saveAdd" class="total" v-if="printDiaTitle=='新增模板'">保存</el-button>
              <el-button size="small" @click="saveEdit" class="total" v-if="printDiaTitle=='编辑模板'">保存</el-button>
            </div>
          </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props:{},
    data(){
        const tplNameReg = (rule, value, callback) => {
            let v = value.toString().trim()
            if(v.length<2||v.length>20){
                callback(new Error('请输入2-20个字'))
            }else if (this.rowData.tplName !== this.printInfor.tplName) {
                let param = JSON.stringify({tplName: this.printInfor.tplName})
                setTimeout(() => {
                    this.$ajaxPost('wms/confPrint/select.do', {reqParam: param}).then(({data}) => {
                        if (data.code == 200 && data.data) {
                            callback(new Error('当前模板名称已存在，不可重复添加'))
                        } else {
                            callback()
                        }
                    })
                }, 10)
            } else {
                callback()
            }
        }
        const tplCodeReg = (rule, value, callback) => {
            let v = value.toString().trim()
            if(v){
                if(v.length<1||v.length>30){
                    callback(new Error('请输入1-30个字'))
                }else {
                    callback()
                }
            }else{
                callback()
            }
        }
        return{
            percentage:0,
            uploadSchedule:false,
            timer:null,

            moduleList:[],
            printDiaTitle:'新增模板',
            printDiaDia:false,
            printInfor:{
                id:'',
                tplName:'',
                type:1,
                tplCode:'',
                tplFileUrl:'',
                tplImgUrl:'',
                status:'0',
            },
            stockInforRule:{
                tplName:[{required: true, trigger: 'change', validator: tplNameReg}],
                type:[{required: true, trigger: 'change',message:'请选择模板类型'}],
                tplCode:[{trigger: 'change', validator: tplCodeReg}],
            },
            rowData:{},

            fileUpload:'',
            updDataFile: {path: 'file/printConfig/confPrint'},
            updDataImg: {path: 'img/printConfig/confPrint'},
            imageUrl:'',
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
        getAllModule(){
            let json_param=JSON.stringify(this.param)
            this.$ajaxPost('wms/confPrint/selectPage.do',{reqParam:json_param}).then(({data})=>{
                if(data.code==200){
                    this.moduleList=data.data.dataList
                    this.total=data.data.totalNum
                }else{
                    this.$message.error(data.msg)
                }
            })
        },
        //新增模板
        addModule(){
            this.printDiaDia=true;
            this.printDiaTitle='新增模板'
        },
        qSearch(){
            this.param.keyword=this.$refs.qSearchRef.inputValue
            this.getAllModule();
        },
        //编辑
        editorUser(row){
            this.printDiaTitle='编辑模板'
            this.rowData=JSON.parse(JSON.stringify(row))
            for(let key in this.printInfor){ 
                if(row[key]!=null){
                    this.printInfor[key]=row[key]
                }
            }
            this.printInfor.status=this.printInfor.status+''
            this.imageUrl=this.printInfor.tplImgUrl
            this.fileUpload=this.printInfor.tplFileUrl
            this.printDiaDia=true;
        },
        downLoadBtn(row){
            window.open(this.$Util.formatImageUrl(row.tplFileUrl))
        },
        //删除
        deleteRow(row){
            this.$confirm('删除模板后，不可恢复，请谨慎操作？', '删除模板', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let json_param=JSON.stringify({ids:row.id,status:'-2'})
                this.$ajaxPost('wms/confPrint/updateBatchStatus.do',{reqParam:json_param}).then(({data})=>{
                    if(data.code==200){
                        this.$message.success('删除成功')
                        this.param.pageSize=15;
                        this.param.pageNum=1;
                        this.getAllModule();
                    }else{
                        this.$message.error(data.msg)
                    }
                })
            }).catch(() => {})
        },
        //取消
        concelAdd(){
            this.printDiaDia=false;
        },
        //保存新增
        saveAdd(){
            this.$refs.printInforRef.validate((valid) => {
                if (valid) {
                    if(this.percentage<100 && this.percentage>0){
                        this.$message.error('文件正在上传，请稍后')
                    }else{
                        let json_param = JSON.stringify(this.printInfor)
                        this.$ajaxPost('wms/confPrint/add.do', {reqParam: json_param}).then(({data}) => {
                            if (data.code == 200) {
                                this.$message.success('新增成功')
                                this.param.pageNum=1;
                                this.param.pageSize=15
                                this.printDiaDia = false
                                this.getAllModule()
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                } else {
                    return false
                }
            })
        },
        //保存编辑
        saveEdit(){
             this.$refs.printInforRef.validate((valid) => {
                if (valid) {
                    let json_param = JSON.stringify(this.printInfor)
                    this.$ajaxPost('wms/confPrint/update.do', {reqParam: json_param}).then(({data}) => {
                        if (data.code == 200) {
                            this.$message.success('编辑成功')
                            this.param.pageNum=1;
                            this.param.pageSize=15
                            this.printDiaDia = false
                            this.getAllModule()
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
                this.printInfor.tplFileUrl=response.data.url
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
            this.showProgress=true;
            const isLt5M = file.size / 1024 / 1024 < 5
            if (!isLt5M) {
            this.$message.error('单个文件需小于等于5M')
            }
            return isLt5M
        },
        changeStatus(file, fileList){
            this.fileUpload=file.name
        },
        uploadError (err, file, fileList) {
            this.$message.error(err)
        },

        // 上传图片
        handleAvatarSuccess(response, file, fileList) {
            if(response.code==200){
                this.printInfor.tplImgUrl=response.data.url;
                this.imageUrl=this.$Util.formatImageUrl(response.data.url)
            }else{
                this.$message.error(response.msg)
            }
        },
        beforeAvatarUpload2(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
            this.$message.error('上传图片只能是 PNG/JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 重置表单
        resetPrintDiaDia(val){
            this.$refs.printInforRef.resetFields()
            Object.keys(this.printInfor).forEach(key => {
                this.printInfor[key] = ''
            })
            this.printInfor.type=1;
            this.printInfor.status=0;
            this.fileUpload=''
            this.imageUrl='';
            this.percentage = 0;
            clearInterval( this.timer );
            this.timer = null;
        },
         //每页数量改变
        sizeChange(v) {
            this.param.pageSize = v;
            this.getAllModule();
        },
        //当前页改变
        currentChange(v) {
            this.param.pageNum = v;
            this.getAllModule();
        },
    },
    mounted(){
        this.getAllModule();
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
.printDiaInfor{
    .el-input,.el-input__inner{
        height:32px;
        line-height: 32px;
    }
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
        width: 160px;
        height: 120px;
        display:table-cell; 
        vertical-align:bottom;
        background: url(../../assets/images/camera.png) center 19px no-repeat;
        background-size: 64px 58px;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .uploadImgTip{
        font-size: 13px;
        color: #999999;
        width: 200px;
        margin:auto 10px;
        font-family: MicrosoftYaHei;
        line-height: 24px;
        padding: 33px 0;
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


