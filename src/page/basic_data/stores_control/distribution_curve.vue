<template>
    <div class="distribution">
        <el-row style="margin:20px">
            <label class="f-fl title" style="line-height: 32px;margin-right:20px">仓库平面图：</label>
            <el-upload
                    class="upload-demo f-fl"
                    :show-file-list="false"
                    :headers="headers"
                    :action="$baseURL+'wms/file/upload.do'"
                    :on-success="handleSuccess"
                    :data="updData"
                    :before-upload="beforeAvatarUpload">
                <el-button slot="trigger" size="small" class="f-fl">选取图片</el-button>
            </el-upload>
            <el-input v-model="fileUpload" size="small" placeholder="请选择图片" style="width: 150px;" class="fileUploadName f-fl" disabled></el-input>
            <el-button style="margin-left: 10px;" size="small"  @click="submitUpload" class="btn-custom f-fl">图片上传</el-button>
        </el-row>
        <img :src="imgUrl" style="display:block;width:70%;margin:40px auto;"/>
    </div>
</template>

<script>
    export default {
        props:{},
        data(){
            return{
                fileUpload:'',
                uploadVisiable:false,
                imgParam:{
                    id:this.$Cookies.get('storehouseId'),
                    imgUrl:'',
                },
                updData: {path: 'img/storehouse'},
                imgUrl:'',
                handleSuccessUrl:'',
            }
        },
        mounted(){
            this.getStoreImg();
        },
        methods:{
            getStoreImg(){
                let param={
                id:this.$Cookies.get('storehouseId')
                }
                let json_Param=JSON.stringify(param)
                this.$ajaxPost('wms/storehouse/select.do',{reqParam:json_Param}).then(({data})=>{
                    if(data.code==200){
                        this.imgUrl=this.$Util.formatImageUrl(data.data.imgUrl)
                    }else{
                        this.$message.error(data.msg)
                    }
                })
            },
            submitUpload() {
                let json_imgParam=JSON.stringify(this.imgParam)
                this.$ajaxPost('wms/storehouse/updateById.do',{reqParam:json_imgParam}).then(({data})=>{
                    if(data.code==200){
                        this.$message.success('上传成功')
                        this.imgUrl=this.$Util.formatImageUrl(this.handleSuccessUrl)
                    }else{
                        this.$message.error(data.msg)
                    }
                })
            },
            //导入成功时
            handleSuccess(response, file, fileList) {
                if(response.code==200){
                    this.fileUpload = file.name
                    this.imgParam.imgUrl=response.data.url;
                    this.handleSuccessUrl=response.data.url
                }else{
                    this.$message.error(response.msg)
                }
            },
                //限制图片格式、尺寸
            beforeAvatarUpload (file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
                // const isLt2M = file.size / 1024 / 1024 < 2
                if (!isJPG) {
                this.$message.error('上传头像图片只能是 PNG/JPG 格式!')
                }
                // if (!isLt2M) {
                // this.$message.error('上传头像图片大小不能超过 2MB!')
                // }
                // return isJPG && isLt2M
                return isJPG
            },
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

<style lang='scss'>
.distribution{
    .img{
    box-sizing: border-box
    }
}

</style>
