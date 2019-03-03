<template>
  <div class="device_management">
    <header class="top-head">
      <el-button size="small" @click="addExpress" class="total">新增</el-button>
      <el-button size="small" @click="deleteExpress">删除</el-button>
      <div class="header-right f-fr">
        <search placeholder="请输入设备编码进行搜索" @on-search="qSearch" :showIcon="false" :width="'280px'" ref="qSearch" style="width:310px"></search>
        <el-button size="small" @click="goSearch" class="total">高级搜索</el-button>
      </div>
    </header>
    <el-table ref="deviceList" :data="deviceList" height="500px" border @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="44"></el-table-column>
      <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
      <el-table-column align="center" label="操作" width="80">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="checkDetail(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="deviceCode" label="设备编码"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" label="设备类型">
        <template slot-scope="scope">{{scope.row.type==1?'拣货篮':'拣货车'}}</template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" label="状态" prop="statusName"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="备注"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="updateTime" label="更新时间" width="170"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="updateName" label="更新人"></el-table-column>
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
    <el-dialog title="高级筛选" :visible.sync="advancedFilter" :modal-append-to-body="false" class="filterParam">
      <el-form :model="filterParam" label-width="90px" size="small">
        <el-form-item prop="status" label="状态：" >
          <el-select  size="small" v-model="filterParam.status" placeholder="请选择" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="空闲" value="1"></el-option>
            <el-option label="占用" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="logcompId" label="设备类型：">
          <el-select size="small" v-model="filterParam.type" placeholder="请选择设备类型" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="拣货篮" value="1"></el-option>
            <el-option label="拣货车" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="concelTerm">清空条件</el-button>
          <el-button size="small" @click="submitSearch" class="total">查询</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="deviceTitle" :visible.sync="addDeviceDia" :modal-append-to-body="false" @close="resetAdd" class="filterParam">
      <el-form :model="deviceInfor" label-width="110px" ref="deviceRef" :rules="deviceRule" size="small">
        <el-form-item prop="type" label="设备类型：" v-if="deviceTitle=='新增设备'">
          <el-select size="small" v-model="deviceInfor.type" placeholder="请选择设备类型" clearable @change="selectLog">
            <template v-for="(item,index) in deviceTypeList">
              <el-option :label="item.logcompName" :value="item.id" :key="index"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="deviceSum" label="设备数：" v-if="deviceTitle=='新增设备'">
          <el-input size="small" v-model="deviceInfor.deviceSum" placeholder="" maxlength="3" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备编码：" v-if="deviceTitle=='编辑设备'">{{deviceInfor.deviceCode}}</el-form-item>
        <el-form-item label="状态：" v-if="deviceTitle=='编辑设备'">{{deviceInfor.statusName}}</el-form-item>
        <el-form-item prop="note" label="备注：">
          <el-input size="small" v-model="deviceInfor.note" placeholder="" maxlength="100" clearable></el-input>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="cancelDialog">取消</el-button>
          <el-button size="small" @click="saveAdd" v-if="deviceTitle=='新增设备'" class="total">保存</el-button>
          <el-button size="small" @click="saveEdit" v-if="deviceTitle=='编辑设备'" class="total">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data () {
    const nametemplateNameReg = (rule, value, callback) => {  //所属公司
      let v = value.toString().trim()
      if (v.length >= 2 && v.length <= 10) {
        callback()
      } else {
        if (callback) callback(new Error('请输入2-10个字'))
      }
    }
    const tplUrlReg = (rule, value, callback) => {
      let v = value.toString().trim()
      if (v) {
        if (v.length < 5 || v.length > 50) {
          if (callback) callback(new Error('请输入5-50个字'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const deviceSumRule = (rule, value, callback) => {
      if (value) {
        let v = value.toString()
        let flag = /^[1-9][0-9]{0,9}$/.test(v)
        flag ? callback() : callback(new Error('请输入1-999的整数'))
      } else {
        callback(new Error('请输入1-999的整数'))
      }
    }
    return {
      ids: [],
      deviceList: [],
      advancedFilter: false,
      addDeviceDia: false,
      deviceTitle: '新增设备',
      searchWay: 0,
      deviceType: {
        typeName: '设备类型',
      },
      deviceTypeList: [{id: 1, logcompName: '拣货篮'}, {id: 2, logcompName: '拣货车'}],
      deviceInfor: {  //新增，编辑设备
        note: '',
        type: '',
        deviceSum: '',
        logcompName: '',
        tplName: '',
        deviceCode:'',
        statusName:''
      },
      deviceRule: {
        deviceSum: {required: true, trigger: 'change', validator: deviceSumRule},
        type: {required: true, trigger: 'change', message: '请选择设备类型'},
        note:{trigger: 'change', validator: this.$Util.RegExp.noteReg},
      },
      param: {
        pageNum: 1,
        pageSize: 15,
        deviceCode: '',

      },
      filterParam: {
        status: '',
        type: '',
      },
      total: 10,
      rowId: ''
    }
  },
  methods: {
    // 取消
    cancelDialog () {
      this.addDeviceDia = false
    },
    //查询所有设备
    getDeviceList (param) {
      param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay])
      if (this.searchWay == 1) {
        delete param.deviceCode
      }
      let json_param = JSON.stringify(param)
      this.$ajaxPost('wms/device/selectPage.do', {reqParam: json_param}).then(({data}) => {
        if (data.code == 200) {
          this.deviceList = data.data.dataList
          this.total = data.data.totalNum
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //获取设备类型
    getDeviceType () {
      /*      let json_TemplateType = JSON.stringify(this.TemplateType)
            this.$ajaxPost('wms/dataDict/selectItemName.do', {reqParam: json_TemplateType}).then(({data}) => {
              if (data.code == 200) {
                this.deviceTypeList = data.data.dataDictList
              } else {
                this.$message.error(data.msg)
              }
            })*/
    },
    //选取设备类型
    selectLog (val) {
      if (val) {
        this.deviceTypeList.forEach(item => {
          if (item.id == val) {
            this.deviceInfor.logcompName = item.logcompName
          }
        })
      } else {
        this.deviceInfor.logcompName = ''
      }
    },
    //新增设备
    addExpress () {
      this.addDeviceDia = true
      this.deviceTitle = '新增设备'
      Object.keys(this.deviceInfor).forEach(key => {
        this.deviceInfor[key] = ''
      })
    },
    //保存新增
    saveAdd () {
      this.$refs.deviceRef.validate((valid) => {
        if (valid) {
          this.deviceInfor.deviceSum = this.deviceInfor.deviceSum - 0
          delete this.deviceInfor.logcompName
          delete this.deviceInfor.tplName
          let json_deviceInfor = JSON.stringify(this.deviceInfor)
          this.$ajaxPost('wms/device/insert.do', {reqParam: json_deviceInfor}).then(({data}) => {
            if (data.code == 200) {
              this.$message.success('新增成功')
              this.param.pageNum=1;
              this.param.pageSize=15
              this.addDeviceDia = false
              this.getDeviceList()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    //关闭新增窗口时 表单时重置
    resetAdd (val) {
      if (this.deviceTitle == '新增设备') {
        this.$refs.deviceRef.resetFields()
        Object.keys(this.deviceInfor).forEach(key => {
          this.deviceInfor[key] = ''
        })
      }
    },
    //删除
    deleteExpress () {
      if (this.ids.length > 0) {
        this.$confirm('删除设备后，不可恢复，请谨慎操作？', '删除设备', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let deleteId = {
            ids: this.ids.toString(),
          }
          let json_id = JSON.stringify(deleteId)
          this.$ajaxPost('wms/device/updateStatus.do', {reqParam: json_id}).then(({data}) => {
            if (data.code == 200) {
              this.$message.success('删除成功')
              this.param.pageNum=1;
              this.param.pageSize=15
              this.getDeviceList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      } else {
        this.$message.warning('请至少选择一条数据')
      }
    },
    //快速搜索
    qSearch () {
      this.param.pageNum=1;
      this.param.pageSize=15
      this.param.deviceCode = this.$refs.qSearch.inputValue
      this.searchWay = 0
      Object.keys(this.filterParam).forEach(key => {
        this.filterParam[key] = ''
      })
      this.getDeviceList()
      this.advancedFilter = false
    },
    //高级搜索
    goSearch () {
      this.advancedFilter = true
    },
    submitSearch () {
      this.param.pageNum=1;
      this.param.pageSize=15
      this.searchWay = 1
      this.param.deviceCode=''
      this.$refs.qSearch.inputValue=''
      this.getDeviceList()
      this.advancedFilter = false
    },
    //清空搜索条件
    concelTerm () {
      this.param.pageNum=1;
      this.param.pageSize=15
      Object.keys(this.filterParam).forEach(key => {
        this.filterParam[key] = ''
      })
      this.param.deviceCode = ''
      this.$refs.qSearch.inputValue = ''
      this.getDeviceList()
    },
    //查看详情
    checkDetail (row) {
      this.rowId = row.id
      this.addDeviceDia = true
      this.deviceTitle = '编辑设备'
      for (let key in this.deviceInfor) {
        if(row[key]!=null){
          this.deviceInfor[key] = row[key]
        }
      }

    },
    //保存编辑
    saveEdit () {
      this.$refs.deviceRef.validate((valid) => {
        if (valid) {
          let obj = {ids: this.rowId, note: this.deviceInfor.note}
          let json_deviceInfor = JSON.stringify(obj)
          this.$ajaxPost('wms/device/updateStatus.do', {reqParam: json_deviceInfor}).then(({data}) => {
            if (data.code == 200) {
              this.$message.success('编辑成功')
              this.addDeviceDia = false
              this.getDeviceList()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    //选择多条数据
    handleSelectionChange (val) {
      this.ids = val.map(item => {
        return item.id
      })
    },
    //每页数量改变
    sizeChange (v) {
      this.param.pageSize = v
      this.getDeviceList()
    },
    //当前页改变
    currentChange (v) {
      this.param.pageNum = v
      this.getDeviceList()
    },
  },
  components: {},
  mounted () {
    this.getDeviceList()
  }
}
</script>

<style scoped lang="scss">
  
</style>
