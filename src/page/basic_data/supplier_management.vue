<template>
  <div class="supplier_management">
    <header class="top-head">
      <el-button size="small" class="total" @click="addSupplier">新增</el-button>
      <el-button size="small" @click="deleteSupplier">删除</el-button>
      <el-button size="small" @click="startSupplier">启用</el-button>
      <el-button size="small" @click="forbidSupplier">禁用</el-button>
      <div class="header-right f-fr">
        <search placeholder="请输入供应商名称，编码，进行搜索" @on-search="qSearch" :showIcon="false" :width="'280px'" ref="qSearch" style="width:310px"></search>
        <el-button size="small" class="total" @click="goSearch">高级搜索</el-button>
      </div>
    </header>
    <el-table ref="supplierList" :data="supplierList" border height="500px" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="44"></el-table-column>
      <el-table-column align="center" type="index" label="行号" width="48"></el-table-column>
      <el-table-column align="center" prop="name" label="操作" width="110">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="checkDetail(scope.row)">查看详情</el-button>
          <el-button size="small" type="text" @click="startRow(scope.row,0)" v-if="scope.row.status==-1">启用</el-button>
          <el-button size="small" type="text" @click="startRow(scope.row,-1)" v-if="scope.row.status==0">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="supplierCode" label="供应商编码" width="140"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="supplierNameShort" label="供应商简称" width="140"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="supplierName" label="供应商名称" width="140"></el-table-column>
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
    <el-dialog title="高级筛选" :visible.sync="advancedFilter" :modal-append-to-body="false">
      <el-form :model="filterParam" size="small">
        <el-form-item prop="status" label="状态：">
          <el-select size="small" v-model="filterParam.status" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="concelTerm">清空条件</el-button>
          <el-button size="small" @click="submitSearch" class="total">查询</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="addSupplierTitle" :visible.sync="addSupplierDia" :modal-append-to-body="false" @close="resetAdd" class="filterParam">
      <el-form :model="SupplierInfor" label-width="110px" ref="SupplierRef" :rules="SupplierRule" size="small">
        <el-form-item prop="supplierCode" label="供应商编码：">
          <el-input size="small" v-model="SupplierInfor.supplierCode" placeholder="不填写时，系统自动生成" maxlength="10" clearable :disabled="addSupplierTitle=='编辑供应商'"></el-input>
        </el-form-item>
        <el-form-item prop="supplierName" label="供应商全称：">
          <el-input size="small" v-model="SupplierInfor.supplierName" placeholder="" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item prop="supplierNameShort" label="供应商简称：">
          <el-input size="small" v-model="SupplierInfor.supplierNameShort" placeholder="" maxlength="6" clearable></el-input>
        </el-form-item>
        <el-form-item label="供应商地址：" class="city" prop="districtId" style="width: 100%">
          <div class="addressChoice">
            <el-select size="small" v-model="SupplierInfor.provinceId" placeholder="请选择省" clearable @change="checkProvince">
              <template v-for="(item,index) in provinceList">
                <el-option :label="item.regionName" :value="item.id" :key="index"></el-option>
              </template>
            </el-select>
            <el-select size="small" v-model="SupplierInfor.cityId" placeholder="请选择市" clearable @change="getCityList">
              <template v-for="(item,index) in cityList">
                <el-option :label="item.regionName" :value="item.id" :key="index"></el-option>
              </template>
            </el-select>
            <el-select size="small" v-model="SupplierInfor.districtId" placeholder="请选择区" clearable @change="getDistrictList">
              <template v-for="(item,index) in districtList">
                <el-option :label="item.regionName" :value="item.id" :key="index"></el-option>
              </template>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item prop="address" style="width: 100%">
          <el-input size="small" v-model="SupplierInfor.address" placeholder="请输入详细地址：" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item prop="contactName" label="联系人：">
          <el-input size="small" v-model="SupplierInfor.contactName" placeholder="" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item prop="contactPhone" label="手机：">
          <el-input size="small" v-model="SupplierInfor.contactPhone" placeholder="" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item prop="telephone" label="联系电话：">
          <el-input size="small" v-model="SupplierInfor.telephone" placeholder="" maxlength="8"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱：">
          <el-input size="small" v-model="SupplierInfor.email" placeholder="" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item prop="website" label="网址：" style="width: 100%">
          <el-input size="small" v-model="SupplierInfor.website" placeholder="" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item prop="note" label="备注：" style="width: 100%">
          <el-input size="small" v-model="SupplierInfor.note" type="textarea" maxlength="200" placeholder="请输入0-200个字"></el-input>
        </el-form-item>
        <el-form-item prop="sort" label="排序：">
          <el-input size="small" v-model="SupplierInfor.sort" placeholder="默认100，值越小越靠前" maxlength="4"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;text-align:right;">
          <el-button size="small" @click="concelEdit">取消</el-button>
          <el-button size="small" @click="saveAdd" v-if="addSupplierTitle=='新增供应商'">保存</el-button>
          <el-button size="small" @click="saveEdit" v-if="addSupplierTitle=='编辑供应商'">保存</el-button>
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
        } else if (this.rowData.supplierCode !== this.SupplierInfor.supplierCode) {
          let param = JSON.stringify({supplierCode: this.SupplierInfor.supplierCode})
          setTimeout(() => {
            this.$ajaxPost('wms/supplier/select.do', {reqParam: param}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前供应商编码已存在，不可重复添加'))
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
    const supplierNameReg = (rule, value, callback) => {
      let v = value.toString().trim()
      if (v.length >= 2 && v.length <= 20) {
        if (this.rowData.supplierName !== this.SupplierInfor.supplierName) {
          let param = JSON.stringify({supplierName: this.SupplierInfor.supplierName})
          setTimeout(() => {
            this.$ajaxPost('wms/supplier/select.do', {reqParam: param}).then(({data}) => {
              if (data.code == 200 && data.data && this.rowData.supplierName !== this.SupplierInfor.supplierName) {
                callback(new Error('当前供应商名称已存在，不可重复添加'))
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
    const supplierNameShortReg = (rule, value, callback) => {
      let v = value.toString().trim()
      if (v.length >= 2 && v.length <= 6) {
        if (this.rowData.supplierNameShort !== this.SupplierInfor.supplierNameShort) {
          let param = JSON.stringify({supplierNameShort: this.SupplierInfor.supplierNameShort})
          setTimeout(() => {
            this.$ajaxPost('wms/supplier/select.do', {reqParam: param}).then(({data}) => {
              if (data.code == 200 && data.data) {
                callback(new Error('当前供应商名称已存在，不可重复添加'))
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
      supplierList: [],
      advancedFilter: false,
      addSupplierDia: false,
      addSupplierTitle: '新增供应商',
      filterParam: {
        status: '',
      },
      SupplierInfor: {  //新增，编辑货主
        id: '',
        supplierCode: '',
        supplierName: '',
        supplierNameShort: '',
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
      SupplierRule: {
        supplierCode: [{trigger: 'blur', validator: nameReg}],
        supplierName: [{required: true, trigger: 'blur', validator: supplierNameReg}],
        supplierNameShort: [{required: true, trigger: 'blur', validator: supplierNameShortReg}],
        address: [{trigger: 'change', validator: addressReg}],
        contactName: [{trigger: 'change', validator: this.$Util.RegExp.pureName}],
        contactPhone: [{trigger: 'change', validator: this.$Util.RegExp.phoneReg2}],
        telephone: [{trigger: 'change', validator: telReg}],
        note: [{trigger: 'change', validator: this.$Util.RegExp.noteReg}],
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
      rowData: {}
    }
  },
  methods: {
    getSupplier (param) {
      param = param || Object.assign({}, this.param, [this.param, this.filterParam][this.searchWay])
      let json_param = JSON.stringify(param);
      console.log(param)
      this.$ajaxPost('wms/supplier/selectPage.do', {reqParam: json_param}).then(({data}) => {
        if (data.code == 200) {
          this.supplierList = data.data.dataList
          this.total = data.data.totalNum
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //新增供应商
    addSupplier () {
      // this.$refs.SupplierRef.resetFields()
      // Object.keys(this.SupplierInfor).forEach(key => {
      //   this.SupplierInfor[key] = ''
      // })
      this.addSupplierDia = true
      this.addSupplierTitle = '新增供应商'
    },
    //保存新增
    saveAdd () {
      this.$refs.SupplierRef.validate((valid) => {
        if (valid) {
          let json_SupplierInfor = JSON.stringify(this.SupplierInfor)
          this.$ajaxPost('wms/supplier/add.do', {reqParam: json_SupplierInfor}).then(({data}) => {
            if (data.code == 200) {
              this.$message.success('新增成功')
              this.param.pageNum=1;
              this.param.pageSize=15
              this.addSupplierDia = false
              this.getSupplier()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    //查看详情
    checkDetail (row) {
      this.addSupplierTitle = '编辑供应商'
      this.addSupplierDia = true
      for (let key in this.SupplierInfor) {
        if(row[key]!=null){
          this.SupplierInfor[key] = row[key]
        }
      }
      this.rowData = row
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
      this.$refs.SupplierRef.validate((valid) => {
        if (valid) {
          let json_SupplierInfor = JSON.stringify(this.SupplierInfor)
          this.$ajaxPost('wms/supplier/update.do', {reqParam: json_SupplierInfor}).then(({data}) => {
            if (data.code == 200) {
              this.$message.success('编辑成功')
              this.addSupplierDia = false
              this.getSupplier()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    //取消
    concelEdit(){
      this.addSupplierDia = false
    },
    //删除
    deleteSupplier () {
      this.judgeChecked(-2)
      this.param.pageNum=1;
      this.param.pageSize=15
    },
    //启用
    startSupplier () {
      this.judgeChecked(0)
    },
    //禁用
    forbidSupplier () {
      this.judgeChecked(-1)
    },
    // 删除启用禁用公用方法
    judgeChecked (status) {
      if (this.ids.length == 0) {
        this.$message.warning('请至少选择一条数据')
      } else {
        let obj = JSON.stringify({ids: this.ids.join(','), status: status})
        if (status == -2) {
          this.$confirm('删除供应商后，不可恢复，请谨慎操作', '删除供应商', {
            confirmButtonText: '确认删除',
            cancelButtonText: '取消操作',
            type: 'warning',
            center: true
          }).then(() => {
            this.$ajaxPost('wms/supplier/updateBatchStatus.do', {reqParam: obj}).then(({data}) => {
              if (data.code == 200) {
                this.$message.success('删除成功')
                this.getSupplier()
              } else {
                this.$message.error(data.msg)
              }
            })
            return
          }).catch(() => {})
        } else {
          this.$ajaxPost('wms/supplier/updateBatchStatus.do', {reqParam: obj}).then(({data}) => {
            if (data.code == 200) {
              switch (status) {
                case 0:
                  this.$message.success('启用成功')
                  break
                case -1:
                  this.$message.success('禁用成功')
                  break
              }
              this.getSupplier()
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      }
    },
    //快速搜索
    qSearch () {
      this.param.pageNum=1;
      this.param.pageSize=15
      this.searchWay = 0
      this.param.keyword = this.$refs.qSearch.inputValue
      Object.keys(this.filterParam).forEach(key => {
        this.filterParam[key] = ''
      })
      this.getSupplier()
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
      this.param.keyword = ''
      this.$refs.qSearch.inputValue = ''
      this.getSupplier()
      this.advancedFilter = false
    },
    //清空搜索条件
    concelTerm () {
      this.param.pageNum=1;
      this.param.pageSize=15
      Object.keys(this.filterParam).forEach(key => {
        this.filterParam[key] = ''
      })
      this.$refs.qSearch.inputValue = ''
      this.param.keyword = ''
      this.getSupplier()
    },

    //关闭新增窗口时 表单时重置
    resetAdd (val) {
      this.$refs.SupplierRef.resetFields()
      Object.keys(this.SupplierInfor).forEach(key => {
        this.SupplierInfor[key] = ''
      })
    },
    //启用
    startRow (row, status) {
      let obj = JSON.stringify({ids: row.id, status: status})
      this.$ajaxPost('wms/supplier/updateBatchStatus.do', {reqParam: obj}).then(({data}) => {
        if (data.code == 200) {
          switch (status) {
            case 0:
              this.$message.success('启用成功')
              break
            case -1:
              this.$message.success('禁用成功')
              break
          }
          this.getSupplier()
        } else {
          this.$message.error(data.msg)
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
      this.SupplierInfor.cityId = ''
      this.SupplierInfor.cityName = ''
      this.districtList = []
      this.SupplierInfor.districtId = ''
      this.SupplierInfor.districtName = ''
      if (val) {
        this.getProvinceList(val, 2)
        this.provinceList.forEach(item => {
          if (item.id == val) {
            this.SupplierInfor.provinceName = item.regionName
          }
        })
      } else {
        this.SupplierInfor.provinceName = ''
      }
    },
    //选择市时获取区
    getCityList (val) {
      this.districtList = []
      this.SupplierInfor.districtId = ''
      this.SupplierInfor.districtName = ''
      if (val) {
        this.getProvinceList(val, 3)
        this.cityList.forEach(item => {
          if (item.id == val) {
            this.SupplierInfor.cityName = item.regionName
          }
        })
      } else {
        this.SupplierInfor.cityName = ''
      }
    },
    //点击区时
    getDistrictList (val) {
      if (val) {
        this.districtList.forEach(item => {
          if (item.id == val) {
            this.SupplierInfor.districtName = item.regionName
          }
        })
      } else {
        this.SupplierInfor.districtName = ''
      }
    },
    //每页数量改变
    sizeChange (v) {
      this.param.pageSize = v
      this.getSupplier()
    },
    //当前页改变
    currentChange (v) {
      this.param.pageNum = v
      this.getSupplier()
    },
  },
  components: {},
  mounted () {
    this.getSupplier()
    this.getProvinceList('0', '1')
  }
}
</script>

<style lang="scss">
</style>
