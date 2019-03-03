<template>
  <div class="add-goods">
    <header class="top-head">
      <span class="top-tit">新增商品</span>
      <div class="header-right f-fr">
        <el-button size="small" @click="backPrev">取消返回</el-button>
        <el-button size="small" class="total" @click="saveAdd">保存</el-button>
      </div>
    </header>
    <div class="wrap">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <div class="form-tit">基本信息</div>
        <el-row type="flex" :gutter="20" style="flex-wrap: wrap" class="pd20">
          <el-col :span="8">
            <el-form-item label="商品货主:" prop="ownerId">
              <el-select filterable 
                         size="small"
                         placeholder="请选择货主" 
                         clearable 
                         v-model="formData.ownerId">
                <el-option v-for="item in ownerList" 
                           :value="item.id" 
                           :label="item.ownerNameShort+' ('+item.ownerCode+')'" 
                           :key="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品编码:">
              系统自动生成
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外部商品编码:" prop="extNo">
              <el-input size="small" clearable v-model="formData.extNo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" :gutter="20" style="flex-wrap: wrap" class="pd20">
          <el-col :span="8">
            <el-form-item label="商品名称:" prop="goodsName">
              <el-input clearable 
                        size="small"
                        v-model="formData.goodsName" 
                        maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上级类目:" prop="categoryId">
              <multiple-tree width="100%"
                            ref="treeRef"
                             placeholder="请选择类目" 
                             size="small"
                             clearable
                             :treeData="treeData"
                             :defaultProps="treeProps"
                             :check-last="true"
                             @node-click="nodeClick"
                             @clear="clearCheck"></multiple-tree>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌:" prop="brandId">
              <el-select placeholder="请选择品牌" 
                         size="small"
                         filterable 
                         clearable 
                         v-model="formData.brandId">
                <el-option v-for="item in brandList" :label="item.brandName" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!--属性信息表格-->
        <div class="form-tit" style="margin-top: 0;">属性信息</div>
      
        <dynamic-form :props-list="propertyData" 
                      ref="propsForm"/>

        <div class="form-tit">参数信息</div>
        <el-row type="flex" :gutter="20" style="flex-wrap: wrap" class="pd20">
          <el-col :span="8">
            <el-form-item label="长(cm):" prop="length">
              <el-input size="small" clearable v-model="formData.length" @blur="() => formatFloat('length', formData.length)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宽(cm):" prop="width">
              <el-input size="small" clearable v-model="formData.width" @blur="() => formatFloat('width', formData.width)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="高(cm):" prop="height">
              <el-input size="small" clearable v-model="formData.height" @blur="() => formatFloat('height', formData.height)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主单位:" prop="unitId">
              <el-select size="small" v-model="formData.unitId">
                <el-option v-for="item in unitList" :label="item.itemName" :value="item.itemValue" :key="item.itemValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重量(g):" prop="weight">
              <el-input size="small" clearable v-model="formData.weight" @blur="() => formatFloat('weight', formData.weight)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="型号:" prop="model">
              <el-input size="small" clearable v-model="formData.model"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="form-tit">图片信息</div>
        <div class="img-wrap pd20">
          <div class="tip">仅支持png/jpg格式的图片，单张图片需小于等于2M，最多可上传5张</div>
          <el-upload ref="upload" 
                     name="file" 
                     :limit="5"
                     :headers="headers"
                     list-type="picture-card"
                     :on-exceed='handleExceed'
                     :action="$baseURL+'wms/file/upload.do'"
                     :on-preview="handlePreview"
                     :on-remove="handleRemove"
                     :on-success="uploadSuccess"
                     :on-error="uploadError"
                     :before-upload="beforeAvatarUpload"
                     :data="updData"
          >
              <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </el-form>

      <el-dialog
        title="新增成功"
        :visible.sync="isAddSuccess"
        :close-on-click-modal="false"
        width="30%">
        <span>商品新增成功！</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="backPrev">返回列表</el-button>
          <el-button size="small" type="primary" @click="centerDialogVisible">继续新增</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="放大图片">
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import multipleTree from '@/components/Tree/MultipleTree';
  import DynamicForm from '@/components/Goods/Property/index.vue';
  import { noPagingMaxSize } from '@/assets/js/constVarible';

  export default {
    name: 'add_goods',
    components: {
      DynamicForm,
      multipleTree,
    },
    data () {
      // 外部商品编码
      const extNoReg = (rule, value, callback) => {
        if (value) {
          let v = value.toString().trim()
          // let flag = /^[a-zA-Z0-9_`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{3,20}$/.test(v)
          if (v.length >= 3 && v.length <= 50) {
            if (this.rowData.extNo !== this.formData.extNo) {
              let param = JSON.stringify({extNo: this.formData.extNo})
                this.$ajaxPost('wms/goods/select.do', {reqParam: param}).then(({data}) => {
                  if (data.code == 200 && data.data) {
                    callback(new Error('外部商品编码已存在，不可重复添加'))
                  } else {
                    callback()
                  }
                });
            } else {
              callback()
            }
          } else {
            callback(new Error('请输入3-50个字符'))
          }
        } else {
          callback()
        }
      }
      // 商品名称
      const goodsNameReg = (rule, value, callback) => {
        if (value) {
          if (this.rowData.goodsName !== this.formData.goodsName) {
            let param = JSON.stringify({goodsName: this.formData.goodsName})
              this.$ajaxPost('wms/goods/select.do', {reqParam: param}).then(({data}) => {
                if (data.code == 200 && data.data) {
                  callback(new Error(' 当前商品名称已存在，不可重复添加'))
                } else {
                  callback()
                }
              });
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      const nameReg = (rule, value, callback) => {
        let v = value.toString().trim()
        if (v.length >= 2 && v.length <= 50) {
          callback()
        } else {
          if (callback) callback(new Error('请输入2-50个字'))
        }
      }
      // ^(\d|[1-9]\d\d|200)(\.\d{1,2})?$
      // 保留一位小数
      const numberReg = (rule, value, callback) => {
        if (value == '') {
           callback(new Error('请输入0-200的数字，保留一位小数'))
        } else {
          let v = value.trim()
          let flag = /^(\d|[1-9]\d|1\d\d|200)(\.\d)?$/.test(v)
          if (flag) {
            callback()
          } else {
            callback(new Error('请输入0-200的数字，保留一位小数'))
          }
        }
      }
      const weightReg = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入0-100,000的数字，保留1位小数'))
        } else {
          let v = value.trim()
          let flag = /^(\d|[1-9]\d{1,4}|100000)(\.\d)?$/.test(v)
          if (flag) {
            callback()
          } else {
            callback(new Error('请输入0-100,000的数字，保留1位小数'))
          }
        }
      }
      // 参考成本价
      const costRule = (rule, value, callback) => {
        if (value == '') {
          callback()
        } else {
          if (value >= 0 && value <= 99999) {
            callback()
          } else {
            callback(new Error('请输入0-99999的数字'))
          }
        }
      };

      const categoryReg = (rule, value, callback) => {
        if (this.formData.categoryId == '') {
          callback(new Error('请选择最底层的类目'))
        } else {
          callback()
        }
      };
      
      return {
        treeProps: {
          children: 'children',
          label: 'categoryName',
          id: 'id'
        },
        treeData: [],
        formData: {
          ownerId: '',
          categoryId: '',
          extNo: '', // 外部商品编码
          brandId: '',
          goodsName: '',
          length: '',
          width: '',
          height: '',
          weight: '',
          unitId: '',
          unitName: '',
          model: '',
          tGoodsSkuList: [],
          tGoodsImageList: [],
        },
        formRules: {
          ownerId: [{
            required: true, trigger: 'change', message: '请选择货主',
          }],
          extNo: [{trigger: 'change', validator: extNoReg}],
          goodsName: [
            {required: true, trigger: 'change', min: 2, max: 50, message: '请输入2-50个字'},
            {trigger: 'change', validator: goodsNameReg}
          ],
          brandId: [{required: true, trigger: 'change', message: '请选择品牌'}],
          length: [{
            required: true , trigger: 'change', validator: numberReg,
          }],
          width: [{
            required: true , trigger: 'change', validator: numberReg,
          }],
          height: [{
            required: true , trigger: 'change', validator: numberReg,
          }],
          weight: [{
            required: true , trigger: 'change', validator: weightReg,
          }],
          unitId: [{required: true, trigger: 'change', message: '请选择主单位'}],
          type: [{
            trigger: 'change', validator: this.$Regs.RegMin2MaxChar(0, 50),
          }],
          costRule: [{trigger: 'change', validator: costRule}],
          categoryId: [{required: true, trigger: 'change', validator: categoryReg}],
        },
        rowData: {},
        tGoodsImageList: [],  
        shipperList: [], //货主列表
        updData: {path: 'img/goods'},
        unitList: [],        // 主单位列表
        param: {
          pageNum: 1,
          pageSize: 999,
          keyword: '',
          status: 0
        },
        ownerList: [],        // 货主列表
        brandList: [],     // 品牌列表
        propertyData: [],
        // goodsInfo: {},
        isAddSuccess: false,
        dialogVisible: false,
        dialogImageUrl: '',
      }
    },
    mounted () {
      this.getOwnerList()
      this.getBrandList()
      this.getTreeData();
      this.getUnits();
    },
    watch: {
      'formData.categoryId' (categoryId) {
        if(categoryId) {
          this.$ajaxPost('wms/property/selectPage.do', {
            reqParam: JSON.stringify({
              categoryId,
              pageNum: 1,
              pageSize: noPagingMaxSize,
            }),
          }).then(({data}) => {
            if (data.code == 200) {
              this.propertyData = data.data.dataList.map((item) => {
                return {
                    choosePropsList: [],
                    choosePropsIdsList: [],
                    alreadyCusomPropsList: [],
                    customPropsList: [],
                    chooseCustomPropsList: [],
                    ...item,
                }
              });
            }
          });
        } else {
          this.propertyData = []
        }
      },
    },
    methods: {
      // 获取货主列表
      getOwnerList () {
        let jsonObj = JSON.stringify(this.param)
        this.$ajaxPost('wms/owner/selectPage.do', {reqParam: jsonObj}).then(({data}) => {
          if (data.code == 200) {
            this.ownerList = data.data.dataList
          }
        })
      },
      // 获取品牌列表
      getBrandList () {
        let jsonObj = JSON.stringify(this.param)
        this.$ajaxPost('wms/brand/selectPage.do', {reqParam: jsonObj}).then(({data}) => {
          if (data.code == 200) {
            this.brandList = data.data.dataList
          }
        })
      },
      //获取类目
      getTreeData () {
        this.$ajaxPost('wms/category/selectCategoryTree.do', {}).then(({data}) => {
          if (data.code == 200) {
            this.treeData = data.data.categoryList
          }
        })
      },
      async getUnits() {
         const { data } = await this.$ajaxPost('wms/dataDict/selectItemName.do', {
              reqParam: JSON.stringify({ typeName: '商品小单位'}),
         });
         if (data.code === 200) {
              this.unitList = data.data.dataDictList;
         }
      },
      // 树节点点击事件
      nodeClick(item) {
        this.formData.categoryId = item.id
      },
      // 树节点清空选择
      clearCheck () {
        this.formData.categoryId = ''
      },
      // 返回
      backPrev () {
        this.$router.push('/goods_manage/goods_infor');
      },
      //继续新增
      centerDialogVisible(){
        this.$refs.formRef.resetFields()
        Object.keys(this.formData).forEach(key => {
          this.formData[key] = ''
        })
        this.formData.tGoodsSkuList = []
        this.formData.tGoodsImageList = []
        this.propertyData = [];
        this.$refs['treeRef'].result.names = '';
        this.$refs['upload'].clearFiles()
        this.isAddSuccess = false;
      },
      //保存新增
      saveAdd () {
        this.$refs.propsForm.$children[1].submitForm();
        this.unitList.forEach((item) => {
          if (item.itemValue === this.formData.unitId) {
            this.formData.unitName = item.itemName;
          }
        });
        this.$refs.formRef.validate((valid) => {
          if (valid) {
              this.formData.tGoodsSkuList = this.$refs.propsForm.$children[1].propsForm.tGoodsSkuList;
              if(this.formData.tGoodsSkuList.length == 0) {
                this.$message.error('请至少选择一个属性值')
                return
              }
              this.$ajaxPost('wms/goods/add.do', {
                reqParam: JSON.stringify(this.formData),
              }).then(({data}) => {
                if (data.code === 200) {
                    this.isAddSuccess = true;
                } else {
                  this.$message.error(data.msg);
                }
              });
          }
        });
      },
      // 增加一行
      addRow () {
        if (this.formData.tGoodsSkuList >= 99) {
          this.$message.error('最多可添加99个SKU')
        } else {
          let newRow = JSON.parse(JSON.stringify(this.formData.tGoodsSkuList[0]))
          Object.keys(newRow).forEach(key => {
            if (key != 'propertyTplList') {
              newRow[key] = ''
            }
          })
          this.formData.tGoodsSkuList.push(newRow)
        }
      },
      // 删除一行
      delRow (idx) {
        console.log(idx)
        this.formData.tGoodsSkuList.splice(idx, 1)
      },
      handleRemove (file, fileList) {
        this.formData.tGoodsImageList= [];
        this.formData.tGoodsImageList = fileList.map((item) => {
            return {
              imageUrl: item.response.data.url,
              imageName: item.response.data.name,
              // id: item.response.data.uuid,
            }
        });
        
      },
      handleExceed (file, fileList) {
        this.$message.warning('最多可上传 5 张商品图片')
      },
      handlePreview (file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      uploadSuccess (response, file, fileList) {
        if (response.code === 200) {
          this.$message.success('图片上传成功');
          this.formData.tGoodsImageList.push({
            // imageUrl: `${baseURL}/wms/profile/${response.data.url}`
            imageUrl: response.data.url,
            imageName: response.data.name,
            // id: response.data.uuid,
          });
        } else {
          this.$message.error(response.msg)
        }
      },
      uploadError (err, file, fileList) {
        this.$message.error(err)
      },
      //限制图片格式、尺寸
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 PNG/JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      formatFloat(key, value) {
        if (value !== '') {
          if (!isNaN(parseFloat(value))) {
            this.formData[key] = parseFloat(value).toFixed(1);
          }
        }
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

<style scoped lang="scss">
  #app {
    .el-main header {
      padding: 0;
      .top-tit {
        color: #333 !important;
        font-size: 16px;
        line-height: 41px;
      }
    }
    .wrap {
      .form-tit {
        margin: 20px 0;
        padding: 0 20px;
        line-height: 40px;
        background-color: #f5f8fa;
        border: solid 1px #e5e5e5;
        font-size: 16px;
      }
      .el-select {
        width: 100%;
      }
      .img-wrap {
        .tip {
          margin-bottom: 20px;
          font-size: 13px;
          color: #999;
        }
        // /deep/ .el-upload {
        //   width: 160px;
        //   height: 120px;
        //   font-size: 14px;
        //   color: #666;
        // }
        // /deep/ .el-upload-list--picture-card .el-upload-list__item {
        //   width: 160px;
        //   height: 120px;
        // }
      }
      /deep/ .el-table__body .el-table__row td {
        padding: 14px 0;
      }
      .handle-wrap {
        display: table;
        margin-top: 20px;
        font-size: 14px;
        cursor: pointer;
        .icon-box {
          width: 32px;
          height: 32px;
          margin-right: 10px;
          display: table-cell;
          vertical-align: middle;
          text-align: center;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          border: solid 1px #d8dfe3;
        }
        .txt {
          display: table-cell;
          vertical-align: middle;
          padding-left: 10px;
        }
      }
      .text-danger {
        cursor: pointer;
      }
    }
  }
</style>
