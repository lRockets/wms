<template>
    <div class="derivedRecord">
        <p class="tip">提示：后台导出任务的数据和记录，可在这里查看进度及下载，导出的数据文件保留7日，请尽快下载</p> 
        <el-table ref="derivedList" :data="derivedList" height="500px" border>
            <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
            <el-table-column align="center" label="操作" width="246">
            <template slot-scope="scope">
                <el-button type="text" @click="downLoadBtn(scope.row)" :disabled="scope.row.isExportUrlDelect==1">下载</el-button>
                <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
            </template>
            </el-table-column>
            <el-table-column align="center" prop="startTime" label="创建时间" width="170"></el-table-column>
            <el-table-column align="center" prop="typeName" label="导出类型"></el-table-column>
            <el-table-column align="center" prop="exportUrl" label="数据条数"></el-table-column>
            <el-table-column align="center" prop="progressBar" label="进度">
                <template slot-scope="scope">
                    {{scope.row.progressBar+'%'}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="endTime" label="处理完成时间"></el-table-column>
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
    </div>
</template>
<script>
export default {
    props:{
        
    },
    data(){
        return{
            derivedList:[],
            param:{
                pageSize:15,
                pageNum:1,
            },
            total:0,
        }
    },
    methods:{
        getAllModule(){
            let json_param=JSON.stringify(this.param)
            this.$ajaxPost('wms/exportLog/selectPage.do',{reqParam:json_param}).then(({data})=>{
                if(data.code==200){
                    this.derivedList=data.data.dataList
                    this.total=data.data.totalNum
                }else{
                    this.$message.error(data.msg)
                }
            })
        },
        downLoadBtn(row){
            window.open(this.$baseURL+'wms/profile/'+row.exportUrl)
        },
        //删除
        deleteRow(row){
            this.$confirm('删除模板后，不可恢复，请谨慎操作？', '删除模板', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let json_param=JSON.stringify({ids:row.id,status:'-2'})
                this.$ajaxPost('wms/exportLog/updateBatchStatus.do',{reqParam:json_param}).then(({data})=>{
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
}
</script>
<style lang="scss">
.derivedRecord{
    p.tip{
        font-size: 13px;
        line-height: 24px;
        letter-spacing: 1px;
        color: #999999;
        margin: 0 0 10px 10px;
    }
}
</style>


