<template>
  <div class="add-goods">
    <header class="top-head">
      <span class="top-tit">编辑商品</span>
      <div class="header-right f-fr">
        <el-button size="small" @click="backPrev">取消返回</el-button>
        <el-button size="small" class="total" @click="saveEdit">保存</el-button>
      </div>
    </header>
    <div class="wrap">
      <el-form :model="goodsInfoData" :rules="goodsInfoRules" ref="goodsInfoFormRef" label-width="100px">
        <div class="form-tit">基本信息</div>
        <el-row type="flex" :gutter="20" style="flex-wrap: wrap" class="pd20">
          <el-col :span="8">
            <el-form-item label="商品货主:" prop="ownerId">
              <el-select filterable
                         size="small"
                         placeholder="请选择货主"
                         clearable 
                         v-model="goodsInfoData.ownerId">
                <el-option v-for="item in ownerList" :value="item.id" :label="item.ownerNameShort+' ('+item.ownerCode+')'" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品编码:">
              {{goodsInfoData.goodsCode}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外部商品编码:" prop="extNo">
              <el-input size="small" v-model="goodsInfoData.extNo" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品名称:" prop="goodsName">
              <el-input size="small" clearable v-model="goodsInfoData.goodsName" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上级类目:" prop="categoryId">
              <multiple-tree width="100%" 
                             placeholder="请选择类目"
                             clearable
                             :disabled='true'
                             size="small" 
                             :treeData="treeData"
                             :defaultProps="treeProps"
                             :check-last="true"
                             :defaultCheckedKeys="[goodsInfoData.categoryId]"
                             :defaultExpandedKeys="[goodsInfoData.categoryId]"
                             @node-click="chooseCategory"
                             @clear="clearCheck"></multiple-tree>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌:" prop="brandId">
              <el-select size="small" placeholder="请选择品牌" filterable clearable v-model="goodsInfoData.brandId">
                <el-option v-for="item in brandList" :label="item.brandName" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!--属性信息表格-->
        <div class="form-tit" style="margin-top: 0;">属性信息</div>
        <dynamic-form :props-list="propertyData" 
                      :goods-info="goodsInfo"
                      :sku-list="skuList"
                      ref="propsForm"/>

        <div class="form-tit">参数信息</div>
        <el-row type="flex" :gutter="20" style="flex-wrap: wrap" class="pd20">
          <el-col :span="8">
            <el-form-item label="长(cm):" prop="length">
              <el-input size="small" clearable v-model="goodsInfoData.length"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宽(cm):" prop="width">
              <el-input size="small" clearable v-model="goodsInfoData.width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="高(cm):" prop="height">
              <el-input size="small" clearable v-model="goodsInfoData.height"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主单位:" prop="unitId">
              <el-select size="small" v-model="goodsInfoData.unitId">
                <el-option v-for="item in unitList" :label="item.itemName" :value="item.itemValue" :key="item.itemValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重量(g):" prop="weight">
              <el-input size="small" clearable v-model="goodsInfoData.weight"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="型号:" prop="type">
              <el-input size="small" clearable v-model="goodsInfoData.type"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="form-tit">图片信息</div>
        <div class="img-wrap pd20">
          <div class="tip">仅支持png/jpg格式的图片，单张图片需小于等于2M，最多可上传5张</div>
          <el-upload ref="upload" name="file" :limit="5"
                     list-type="picture-card"
                     :headers="headers"
                     :action="$baseURL+'wms/file/upload.do'"
                     :on-preview="handlePreview"
                     :on-remove="handleRemove"
                     :file-list="fileList"
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
        title="编辑成功"
        :visible.sync="isEditSuccess"
        :close-on-click-modal="false"
        width="30%">
        <span>商品编辑成功！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="backPrev">返回列表</el-button>
        </span>
      </el-dialog>

      
      <el-dialog title="图片放大"
                 :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="放大图片">
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import multipleTree from '@/components/Tree/MultipleTree';
  import DynamicForm from '@/components/Goods/Property/index.vue';
  import { baseURL } from '@/assets/js/uri.js';
  import { noPagingMaxSize } from '@/assets/js/constVarible';

  export default {
    components: {
      DynamicForm,
      multipleTree,
    },
    data () {
      // 外部商品编码
      const extNoReg = (rule, value, callback) => {
        if (value && !this.noExtNoValidate) {
          let v = value.toString().trim();
          // let flag = /^[a-zA-Z0-9_`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{3,20}$/.test(v)
          if (v.length > 3 && v.length < 50) {
            if (value !== this.initExtNo) {
                this.$ajaxPost('wms/goods/select.do', {
                  reqParam: JSON.stringify({extNo: this.goodsInfoData.extNo})
                }).then(({data}) => {
                  if (data.code === 200 && data.data) {
                    this.noExtNoValidate = false;
                    callback(new Error('外部商品编码已存在，不可重复添加'))
                  } else {
                    this.noExtNoValidate = false;
                    callback();
                  }
                });
            } else {
              this.noExtNoValidate = false;
              callback();
            }
          } else {
            this.noExtNoValidate = false;
            callback(new Error('请输入3-50个字符'))
          }
        } else {
          this.noExtNoValidate = false;
          callback();
        }
        // callback();
      }

      // 商品名称
      const goodsNameReg = (rule, value, callback) => {
        if (value && !this.noBarValidate) {
            if (value !== this.initGoodsName) {
              this.$ajaxPost('wms/goods/select.do', {
                  reqParam: JSON.stringify({ goodsName: this.goodsInfoData.goodsName })
              }).then(({data}) => {
                  if (data.code === 200 && data.data) {
                    this.noBarValidate = false;
                    callback(new Error(' 当前商品名称已存在，不可重复添加'));
                  } else {
                    this.noBarValidate = false;
                    callback();
                  }
                });
            } else {
              this.noBarValidate = false;
              callback();
            }
        } else {
          this.noBarValidate = false;
          callback();
        }
        // callback();
      }

      const nameReg = (rule, value, callback) => {
        let v = value.toString().trim()
        if (v.length >= 2 && v.length <= 50) {
          callback()
        } else {
          callback(new Error('请输入2-50个字'));
        }
      }
      // ^(\d|[1-9]\d\d|200)(\.\d{1,2})?$
      // 保留一位小数
      const numberReg = (rule, value, callback) => {
        if (value === '') {
          callback()
        } else if (typeof value === 'string') {
          let v = value.trim();
          let flag = /^(\d|[1-9]\d\d|200|[1-9]\d)(\.\d{1})?$/.test(v);
          if (flag) {
            callback()
          } else {
            callback(new Error('请输入0-200的数字，保留一位小数'))
          }
        } else {
          callback();
        }
      }
      const weightReg = (rule, value, callback) => {
        if (value == '') {
          callback()
        } else {
          let v = value - 0
          if (v >= 0 && v <= 100000) {
            callback()
          } else {
            callback(new Error('请输入0-100,000的数字，保留1位小数'))
          }
        }
      }

      const categoryReg = (rule, value, callback) => {
        if (this.goodsInfoData.categoryId == '') {
          callback(new Error('请选择最底层的类目'))
        } else {
          callback();
        }
      };
      
      return {
        treeProps: {
          children: 'children',
          label: 'categoryName',
          id: 'id'
        },
        treeData: [],
        goodsInfoData: {
          ownerId: '',
          categoryId: '',
          extNo: '', // 外部商品编码
          brandId: '',
          goodsCode:'',
          goodsName: '',
          length: '',
          width: '',
          height: '',
          weight: '',
          unitId: '',
          unitName: '',
          type: '',
          tGoodsSkuList: [],
          tGoodsImageList: [],
        },
        goodsInfoRules: {
          ownerId: [{
            required: true, 
            trigger: 'change', 
            message: '请选择商品货主',
          }],
          categoryId: [{
            required: true, 
            trigger: 'change', 
            validator: categoryReg,
          }],
          extNo: [{
            trigger: 'change', 
            validator: extNoReg
          }],
          goodsName: [
            {required: true, trigger: 'change', min: 2, max: 50, message: '请输入2-50个字'},
            {trigger: 'change', validator: goodsNameReg}
          ],
          brandId: [{required: true, trigger: 'change', message: '请选择品牌'}],
          length: [{trigger: 'change', validator: numberReg}],
          width: [{trigger: 'change', validator: numberReg}],
          height: [{trigger: 'change', validator: numberReg}],
          weight: [{trigger: 'change', validator: weightReg}],
          unitId: [{required: true, trigger: 'change', message: '请选择主单位'}],
          type: [{trigger: 'change', min: 0, max: 50, message: '请输入0-50个字'}],
          // costRule: [{trigger: 'change', validator: costRule}],
        },
        rowData: {},
        fileList: [],  //图片列表
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
        goodsInfo: {},
        isEditSuccess: false,
        skuList: [],
        editID: '',
        noBarValidate: true,
        noExtNoValidate: true,
        initGoodsName: '',
        initExtNo: '',
        dialogVisible: false,
        dialogImageUrl: '',
      }
    },
    created() {
        this.editID = this.$route.params.editID;
    },
    mounted () {
      this.getOwnerList()
      this.getBrandList()
      this.getTreeData();
      this.getUnits();
    },
    methods: {
        /**
         * @method 获取商品sku的列表
         */
        async getGoodsSkuDetail() {
            const { data } = await this.$ajaxPost('wms/goodsSku/selectPage.do', {
                reqParam: JSON.stringify({ goodsId: this.editID }),
            });
            if (data.code === 200) {
                this.propertyData.choosePropsList = data.data.dataList.map((item) => {
                    return item.propertyTplList.map((props) => {
                        return {
                            id: props.propvalueId,
                            propertyValue: props.provalueValue,
                        }
                    });
                });
            }
        },
        async getGoodsBasciDetail() {
            const { data } = await this.$ajaxPost('wms/goods/selectPage.do', {
                reqParam: JSON.stringify({ id: this.editID }),
            });
            if (data.code === 200) {
                this.goodsInfo = this.goodsInfoData = data.data.dataList[0];
                this.goodsInfoData.categoryId = this.goodsInfoData.categoryId;
                this.initGoodsName = this.goodsInfoData.goodsName;
                this.initExtNo = this.goodsInfoData.extNo;
                this.fileList = this.goodsInfo.tGoodsImageList.map((item) => {
                  return {
                    name: item.imageName,
                    url:  `${baseURL}/wms/profile/${item.imageUrl}`
                  }
                });
            }
            this.getPropsList();
        },
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
        this.$ajaxPost('wms/category/selectCategoryTree.do').then(({data}) => {
          if (data.code == 200) {
            this.treeData = data.data.categoryList;
            this.getGoodsBasciDetail();
          }
        });
      },
      async getUnits() {
         const { data } = await this.$ajaxPost('wms/dataDict/selectItemName.do', {
              reqParam: JSON.stringify({ typeName: '商品小单位'}),
         });
         if (data.code === 200) {
              this.unitList = data.data.dataDictList;
         }
      },
      async getPropsList() {
        // 获取已选中的属性列表
        const res = await this.$ajaxPost('wms/goodsSku/selectPage.do', {
            reqParam: JSON.stringify({ goodsId: this.editID }),
        });

        let arr = [];
        res.data.data.dataList.forEach((props) => {
            props.propertyTplList.forEach((prop) => {
                arr.push(prop);
            });
        });
        this.skuList = res.data.data.dataList;
        
        if (res.data.code === 200) {
            const { data } = await this.$ajaxPost('wms/property/selectPage.do', {
                reqParam: JSON.stringify({
                  categoryId: this.goodsInfoData.categoryId,
                  pageNum: 1,
                  pageSize: noPagingMaxSize,
                }),
            });
            
            arr = this.filterPropArr(arr, 'provalueValue');
            this.propertyData = data.data.dataList.map((item) => {
                arr.forEach((checked) => {
                    if (!item.choosePropsList) {
                      item = Object.assign(item, {
                        choosePropsList: [],
                        choosePropsIdsList: [],
                        // 已选中的自定义属性
                        alreadyCusomPropsList: [],
                        // 可添加的自定义属性
                        customPropsList: [],
                        chooseCustomPropsList: [],
                      });
                    }
                   if (item.propertyId === checked.propertyId && checked.propvalueId !== null) {
                       item.choosePropsList.push({
                           id: checked.propvalueId,
                           propertyValue: checked.provalueValue,
                           disabled: true,
                       });
                       item.choosePropsIdsList.push(checked.provalueValue);
                   }
                   if (item.propertyId === checked.propertyId && checked.propvalueId === null) {
                      item.alreadyCusomPropsList.push({
                       id: '',
                       propertyValue: checked.provalueValue,
                       disabled: true,
                     });
                     // item.chooseCustomPropsList.push(checked.provalueValue);
                   }
                });
                return {
                    ...item,
                }
            });
        }
       },
      /**
       * @method 选择商品的上级类目
       */
      chooseCategory (item) {
        this.goodsInfoData.categoryId = item.id;
        this.getPropsList();
      },
      filterPropArr(array, type = false) {
        if (array.length === 0) {
            return array;
        } else {
            if(type) {
                let obj = {};
                let newArray = array.reduce((current, next) => {
                    obj[next[type]] ? "" : 
                    obj[next[type]] = true && current.push(next);
                    return current;
                },[]);
                return newArray;
            } else {
                return Array.from(new Set(array));
            }
        }
      },
      // 树节点清空选择
      clearCheck () {
        this.goodsInfoData.categoryId = ''
      },
      // 返回
      backPrev () {
        this.$router.push('/goods_manage/goods_infor');
      },
      saveEdit() {
        // TODO 需要处理内部表单提交问题
        this.$refs.propsForm.$children[1].submitForm();
        this.unitList.forEach((item) => {
          if (item.itemValue === this.goodsInfoData.unitId) {
            this.goodsInfoData.unitName = item.itemName;
          }
        });
        this.$refs.goodsInfoFormRef.validate((valid) => {
          if (valid) {
            this.goodsInfoData.tGoodsSkuList = this.$refs.propsForm.$children[1].propsForm.tGoodsSkuList;
            delete this.goodsInfoData.imageUrl
            this.$ajaxPost('wms/goods/update.do', {
              reqParam: JSON.stringify(this.goodsInfoData),
            }).then(({data}) => {
              if (data.code === 200) {
                this.isEditSuccess = true;
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        });
      },
      handleRemove (file, fileList) {
        let str = file.url.substr(file.url.indexOf('img'))
        let arr = JSON.parse(JSON.stringify(this.goodsInfoData.tGoodsImageList))
        this.goodsInfoData.tGoodsImageList = [];
        arr.map((item) => {
          if(item.imageUrl.indexOf(str) == -1){
            this.goodsInfoData.tGoodsImageList.push(item)
          }
        })
      },
      handlePreview (file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      uploadSuccess (response, file, fileList) {
        if (response.code === 200) {
          this.$message.success('图片上传成功');
          this.goodsInfoData.tGoodsImageList.push({
            // imageUrl: `${baseURL}/wms/profile/${response.data.url}`
            imageUrl: response.data.url,
            imageName: response.data.name,
            // id: response.data.uuid,
          });
        } else {
          this.$message.error(response.msg);
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
