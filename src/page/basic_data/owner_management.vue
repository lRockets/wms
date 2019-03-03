<template>
  <div class="device_management">
    <header class="top-head">
      <el-button size="small" class="total" @click="addOwner">新增</el-button>
      <el-button size="small" class="total" @click="deleteOwner">删除</el-button>
      <el-button size="small" class="total" @click="startOwner">启用</el-button>
      <el-button size="small" class="total" @click="forbidOwner">禁用</el-button>
      <div class="header-right f-fr">
        <search placeholder="请输入货主名称，编码进行搜索" @on-search="qSearch" :showIcon="false" :width="'280px'" ref="qSearch" style="width:310px"></search>
        <el-button size="small" class="total" @click="goSearch">高级搜索</el-button>
      </div>
    </header>
    <el-table ref="ownerList" border  :data="ownerList" height="500px" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="44"></el-table-column>
      <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
      <el-table-column align="center" label="操作" width="110">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="checkDetail(scope.row)">查看详情</el-button>
          <el-button size="small" type="text" @click="startOwnerRow(scope.row,0)" v-if="scope.row.status==-1">启用</el-button>
          <el-button size="small" type="text" @click="startOwnerRow(scope.row,-1)" v-if="scope.row.status==0">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="ownerCode" label="货主编码" width="110"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="ownerNameShort" label="货主简称" width="110"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="ownerName" label="货主全称" width="110"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="provinceName" label="省"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="cityName" label="市"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="districtName" label="区"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="address" label="详细地址" width="200"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="contactName" label="联系人"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="sort" label="排序"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="statusName" label="状态"></el-table-column>
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
    <el-dialog title="高级筛选" :visible.sync="advancedFilter" :modal-append-to-body="false" class="filterParam">
      <el-form :model="filterParam" label-width="90px" size="small">
        <el-form-item prop="status" label="状态：">
          <el-select size="small" v-model="filterParam.status" placeholder="请选择" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 100%;text-align:right;">
          <el-button size="small" @click="concelTerm">清空条件</el-button>
          <el-button size="small" @click="submitSearch" class="total">查询</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="ownerTitle" :visible.sync="addOwnerDia" :modal-append-to-body="false" @close="resetAdd" class="filterParam">
      <el-form :model="ownerInfor" label-width="110px" ref="ownerRef" :rules="ownerRule" size="small">
        <el-form-item prop="ownerCode" label="货主编码：">
          <el-input size="small" v-model="ownerInfor.ownerCode" placeholder="不填写时系统自动生成" maxlength="10" clearable></el-input>
        </el-form-item>
        <el-form-item prop="ownerName" label="货主全称：">
          <el-input size="small" v-model="ownerInfor.ownerName" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="ownerNameShort" label="货主简称：">
          <el-input size="small" v-model="ownerInfor.ownerNameShort" placeholder="" maxlength="6" clearable></el-input>
        </el-form-item>
        <el-form-item label="货主地址：" class="city" prop="districtId" style="width: 100%">
          <div class="addressChoice">
            <el-select size="small" v-model="ownerInfor.provinceId" placeholder="请选择省" clearable @change="checkProvince">
              <template v-for="(item,index) in provinceList">
                <el-option :label="item.regionName" :value="item.id" :key="index"></el-option>
              </template>
            </el-select>
            <el-select size="small" v-model="ownerInfor.cityId" placeholder="请选择市" clearable @change="getCityList">
              <template v-for="(item,index) in cityList">
                <el-option :label="item.regionName" :value="item.id" :key="index"></el-option>
              </template>
            </el-select>
            <el-select size="small" v-model="ownerInfor.districtId" placeholder="请选择区" clearable @change="getDistrictList">
              <template v-for="(item,index) in districtList">
                <el-option :label="item.regionName" :value="item.id" :key="index"></el-option>
              </template>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item prop="address" style="width: 100%">
          <el-input size="small" v-model="ownerInfor.address" placeholder="请输入详细地址：" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item prop="contactName" label="联系人：">
          <el-input size="small" v-model="ownerInfor.contactName" placeholder="" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="contactPhone" label="手机：">
          <el-input size="small" v-model="ownerInfor.contactPhone" placeholder="" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item prop="telephone" label="联系电话：">
          <el-input size="small" v-model="ownerInfor.telephone" placeholder="" maxlength="8"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱：">
          <el-input size="small" v-model="ownerInfor.email" placeholder="" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item prop="website" label="网址：" style="width: 100%">
          <el-input size="small" v-model="ownerInfor.website" placeholder="" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item prop="note" label="备注：" style="width: 100%">
          <el-input size="small" v-model="ownerInfor.note" type="textarea" maxlength="200" placeholder="请输入0-200个字"></el-input>
        </el-form-item>
        <el-form-item prop="sort" label="排序：">
          <el-input size="small" v-model="ownerInfor.sort"  placeholder="默认100，值越小越靠前" maxlength="4"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small"  @click="cancelDialog">取消</el-button>
          <el-button size="small"  class="total" @click="saveAdd" v-if="ownerTitle=='新增货主'">保存</el-button>
          <el-button size="small"  class="total" @click="saveEdit" v-if="ownerTitle=='编辑货主'">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data () {
    const nameReg = (rule, value, callback) => {
      let v = value.toString().trim()
      let flag = /^[a-zA-Z0-9_`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{2,10}$/.test(v)
      if (v) {
        if (!flag) {
          if (callback) callback(new Error('请输入2-10个字母/数字/符号'))
        } else if (this.rowData.ownerCode !== this.ownerInfor.ownerCode) {
          let param = JSON.stringify({ownerCode: this.ownerInfor.ownerCode})
          setTimeout(() => {
            this.$ajaxPost('wms/owner/select.do', {reqParam: param}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前货主编码已存在，不可重复添加'))
              } else {
                callback()
              }
            })
          }, 10)
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const name1Reg = (rule, value, callback) => {
      let v = value.toString().trim()
      if (v.length >= 2 && v.length <= 20) {
        if (this.rowData.ownerName !== this.ownerInfor.ownerName) {
          let param = JSON.stringify({ownerName: this.ownerInfor.ownerName})
          setTimeout(() => {
            this.$ajaxPost('wms/owner/select.do', {reqParam: param}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前货主全称已存在，不可重复添加'))
              } else {
                callback()
              }
            })
          },10)
        } else {
          callback()
        }
      } else {
        if (callback) callback(new Error('请输入2-20个字'))
      }
    }
    const name2Reg = (rule, value, callback) => {
      let v = value.toString().trim()
      if (v.length >= 2 && v.length <= 6) {
        if (this.rowData.ownerNameShort !== this.ownerInfor.ownerNameShort) {
          let param = JSON.stringify({ownerNameShort: this.ownerInfor.ownerNameShort})
          setTimeout(() => {
            this.$ajaxPost('wms/owner/select.do', {reqParam: param}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前货主简称已存在，不可重复添加'))
              } else {
                callback()
              }
            })
          }, 10)
        } else {
          callback()
        }
      } else {
        if (callback) callback(new Error('请输入2-6个字'))
      }
    }
    const addressReg = (rule, value, callback) => {
      let v = value.toString().trim()
      if (v) {
        if (v.length < 5 || v.length > 30) {
          if (callback) callback(new Error('请输入5-30个字'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const telReg = (rule, value, callback) => {
      let v = value.trim()
      if (v) {
         let flag = /^\d{8}$|^\d{5}$/.test(v)
        if (flag) {
          callback()
        } else {
          callback(new Error('请输入5或8位数字'))
        }
      } else {
        callback()
      }
    }
    return {
      ids: [],
      ownerList: [{}],
      advancedFilter: false,
      addOwnerDia: false,
      ownerTitle: '新增货主',
      searchWay: 0,
      filterParam: {
        status: ''
      },
      rowData: [],
      ownerInfor: {  //新增，编辑货主
        id: '',
        ownerCode: '',
        ownerName: '',
        ownerNameShort: '',
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        districtId: '',
        districtName: '',
        address: '',
        contactName: '',
        contactPhone: '',
        telephone: '',
        note: '',
        email: '',
        website: '',
        sort: '',
      },
      ownerRule: {
        ownerCode: [{trigger: 'blur', validator: nameReg}],
        ownerName: [{required: true, trigger: 'blur', validator: name1Reg}],
        ownerNameShort: [{required: true, trigger: 'blur', validator: name2Reg}],
        address: [{trigger: 'change', validator: addressReg}],
        contactName: [{trigger: 'change', validator: this.$Util.RegExp.pureName}],
        contactPhone: [{trigger: 'change', validator: this.$Util.RegExp.phoneReg2}],
        telephone: [{trigger: 'change', validator: telReg}],
        note: [{trigger: 'change',validator: this.$Util.RegExp.noteReg}],
        sort: [{trigger: 'change', validator: this.$Util.RegExp.pureSort}],
        email: [{trigger: 'change', validator: this.$Util.RegExp.emailReg2}],
        website: [{trigger: 'change', validator: this.$Util.RegExp.httpReg}],
      },
      provinceList: [],
      cityList: [],
      districtList: [],
      areaParam: {
        type: '1',
        id: '0'
      },
      param: {
        pageNum: 1,
        pageSize: 15,
        keyword: '',
      },
      total: 10,
    }
  },
  methods: {
    // 取消
    cancelDialog () {
      this.addOwnerDia = false
    },
    //查询所有模板
    getOwnerList (param) {
      param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay])
      let json_param = JSON.stringify(param)
      this.$ajaxPost('wms/owner/selectPage.do', {reqParam: json_param}).then(({data}) => {
        if (data.code == 200) {
          this.ownerList = data.data.dataList
          this.total = data.data.totalNum
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //新增货主
    addOwner () {
      this.addOwnerDia = true
      this.ownerTitle = '新增货主'
    },
    //保存新增
    saveAdd () {
      this.$refs.ownerRef.validate((valid) => {
        if (valid) {
          let json_deviceInfor = JSON.stringify(this.ownerInfor)
          this.$ajaxPost('wms/owner/add.do', {reqParam: json_deviceInfor}).then(({data}) => {
            if (data.code == 200) {
              this.$message.success('新增成功')
              this.param.pageNum=1;
              this.param.pageSize=15;
              this.addOwnerDia = false
              this.getOwnerList()
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
      this.$refs.ownerRef.resetFields()
      Object.keys(this.ownerInfor).forEach(key => {
        this.ownerInfor[key] = ''
      })
    },
    //删除
    deleteOwner () {
      if (this.ids.length > 0) {
        this.$confirm('删除货主后，不可恢复，请谨慎操作？', '删除货主', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = this.ids.join(',')
          this.updStatus(ids, -2, '删除成功')
          this.param.pageNum=1;
          this.param.pageSize=15
        }).catch(() => {})
      } else {
        this.$message.warning('请至少选择一条数据')
      }
    },
    //启用
    startOwner () {
      if (this.ids.length > 0) {
        let ids = this.ids.join(',')
        this.updStatus(ids, 0, '启用成功')
      } else {
        this.$message.error('请选择要启用的数据')
      }
    },
    startOwnerRow (row, status) {
      let msg = status == 0 ? '启用成功' : '禁用成功'
      this.updStatus(row.id, status, msg)
    },
    //禁用
    forbidOwner () {
      if (this.ids.length > 0) {
        let ids = this.ids.join(',')
        this.updStatus(ids, -1, '禁用成功')
      } else {
        this.$message.error('请选择要禁用的数据')
      }
    },
    updStatus (ids, status, msg) {
      this.$ajaxPost('wms/owner/updateBatchStatus.do', {reqParam: JSON.stringify({ids: ids, status: status})}).then(({data}) => {
        if (data.code == 200) {
          this.$message.success(msg)
          this.getOwnerList()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //快速搜索
    qSearch () {
      this.param.pageNum=1;
      this.param.pageSize=15
      this.param.keyword = this.$refs.qSearch.inputValue
      this.searchWay = 0
      Object.keys(this.filterParam).forEach(key => {
        this.filterParam[key] = ''
      })
      this.getOwnerList()
      this.advancedFilter = false
    },
    //高级搜索
    goSearch () {
      this.advancedFilter = true
    },
    submitSearch () {
      this.param.pageNum=1;
      this.param.pageSize=15
      this.param.keyword = ''
      this.$refs.qSearch.inputValue = ''
      this.searchWay = 1
      this.getOwnerList()
      this.advancedFilter = false
    },
    //清空搜索条件
    concelTerm () {
      this.param.pageNum=1;
      this.param.pageSize=15
      Object.keys(this.filterParam).forEach(key => {
        this.filterParam[key] = ''
      })
      this.param.keyword = ''
      this.$refs.qSearch.inputValue = ''
      this.getOwnerList()
    },
    //查看详情
    checkDetail (row) {
      console.log(row)
      this.rowData = row
      this.addOwnerDia = true
      this.ownerTitle = '编辑货主'
      for (let key in this.ownerInfor) {
        if(row[key]!=null){
          this.ownerInfor[key] = row[key]
        }
      }
      if(row.provinceId!==null&&row.provinceId!==''){
        this.getProvinceList(row.provinceId, 2)
      }
      setTimeout(() => {
        if(row.cityId!==null&&row.cityId!==''){
          this.getProvinceList(row.cityId, 3)
        }
      }, 10)
    },
    //保存编辑
    saveEdit () {
      this.$refs.ownerRef.validate((valid) => {
        if (valid) {
          let json_deviceInfor = JSON.stringify(this.ownerInfor)
          this.$ajaxPost('wms/owner/update.do', {reqParam: json_deviceInfor}).then(({data}) => {
            if (data.code == 200) {
              this.$message.success('编辑成功')
              this.addOwnerDia = false
              this.getOwnerList()
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
    //获取所有的省/市/区
    getProvinceList (ID, type) {
      this.areaParam.type = type
      this.areaParam.id = ID
      let json_areaParam = JSON.stringify(this.areaParam)
      this.$ajaxPost('wms/region/selectAll.do', {reqParam: json_areaParam}).then(({data}) => {
        if (data.code == 200) {
          if (this.areaParam.type == 1) {
            this.provinceList = data.data
          } else if (this.areaParam.type == 2) {
            this.cityList = data.data
          } else if (this.areaParam.type == 3) {
            this.districtList = data.data
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //选择省份时获取市列表
    checkProvince (val) {
      this.cityList = []
      this.ownerInfor.cityId = ''
      this.ownerInfor.cityName = ''
      this.districtList = []
      this.ownerInfor.districtId = ''
      this.ownerInfor.districtName = ''
      if (val) {
        this.getProvinceList(val, 2)
        this.provinceList.forEach(item => {
          if (item.id == val) {
            this.ownerInfor.provinceName = item.regionName
          }
        })
      } else {
        this.ownerInfor.provinceName = ''
      }
    },
    //选择市时回去区
    getCityList (val) {
      this.districtList = []
      this.ownerInfor.districtId = ''
      this.ownerInfor.districtName = ''
      if (val) {
        this.getProvinceList(val, 3)
        this.cityList.forEach(item => {
          if (item.id == val) {
            this.ownerInfor.cityName = item.regionName
          }
        })
      } else {
        this.ownerInfor.cityName = ''
      }
    },
    //点击区时
    getDistrictList (val) {
      if (val) {
        this.districtList.forEach(item => {
          if (item.id == val) {
            this.ownerInfor.districtName = item.regionName
          }
        })
      } else {
        this.ownerInfor.districtName = ''
      }
    },
    //每页数量改变
    sizeChange (v) {
      this.param.pageSize = v
      this.getOwnerList()
    },
    //当前页改变
    currentChange (v) {
      this.param.pageNum = v
      this.getOwnerList()
    },
  },
  components: {},
  mounted () {
    this.getOwnerList()
    this.getProvinceList('0', '1')
  }
}
</script>

<style lang="scss">

</style>
