<template>
    <div class="formProps">
        <el-row class="title" type="flex">
            <el-col :span="4"><p>规格属性</p></el-col>
            <el-col :span="4"><p>SKU</p></el-col>
            <el-col :span="4"><p>商品条码</p></el-col>
            <el-col :span="4"><p>辅助条码</p></el-col>
            <el-col :span="4"><p>外部SKU</p></el-col>
            <el-col :span="4"><p>参考成本价(元)</p></el-col>
        </el-row>

        <el-form ref="dynamicPropsForm" 
                v-if="propsForm.tGoodsSkuList.length !== 0" 
                    :inline="true" 
                    :model="propsForm"
                    label-width="100px">
            <div v-for="(item, index) in propsForm.tGoodsSkuList" :key="index">
                <el-row class="tbody" type="flex">
                    <el-col :span="4">
                        <p>{{item.title.join().replace(/,/g,' ')}}</p>
                    </el-col>
                    <el-col :span="4">
                        <p>{{item.skuCode}}</p>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item
                            :prop="'tGoodsSkuList.'+ index + '.barcode'"
                            :rules="{
                                validator: item.barCodeValidator,
                                trigger: 'blur',
                            }"
                        >
                            <el-input @change="inputChange('barcode', index)" size="small" v-model="item.barcode" placeholder="不填写时，系统生成"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item
                            :prop="'tGoodsSkuList.'+ index + '.assitBarcode'"
                            :rules="{
                                validator: item.assitBarCodeValidator,
                                trigger: 'blur',
                            }"
                        >
                            <el-input @change="inputChange('assitBarcode', index)" size="small" v-model="item.assitBarcode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item
                            :prop="'tGoodsSkuList.'+ index + '.extNo'"
                            :rules="{
                                validator: item.extNoValidator,
                                trigger: 'blur',
                            }"
                        >
                            <el-input @change="inputChange('extNo', index)" size="small" v-model="item.extNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item
                            :prop="'tGoodsSkuList.'+ index + '.cost'"
                            :rules="{
                                trigger: 'blur',
                                validator: item.costValidator,
                            }"
                        >
                            <el-input @change="inputChange('cost', index)" size="small" v-model="item.cost"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>  

        <section class="noData" v-else>
            <div class="noData-img"></div>
            <p>暂无属性</p>
          </section>
    </div>
</template>

<script>
  export default {
    name: 'property-form',
    props: {
        formData: {
          type: Array,
          default() {
              return [];
          }
        },
        goodsData: Object,
        formLists: Array,
    },
    data() {
        return {
            propsForm: {
                tGoodsSkuList: [],
            },
        };
    },
    watch: {
        formData(value) {
            this.propsForm.tGoodsSkuList = [];
            this.loopProps(value);
            if (this.$refs.dynamicPropsForm) {
                this.$refs.dynamicPropsForm.clearValidate();
            }
        }
    },
    methods: {
        inputChange(field, index) {
            let allArr = [];
            if (this.propsForm.tGoodsSkuList) {
                for (let i = 0, length = this.propsForm.tGoodsSkuList.length; i < length; i++) {
                    if (i === index) {
                        continue;
                    }
                    allArr.push(`tGoodsSkuList.${i}.${field}`);
                }
            }
            const form = this.$refs['dynamicPropsForm'];
            form.validateField(allArr);
        },
      submitForm() {
        if (this.$refs['dynamicPropsForm']) {
            this.setProps();
            this.setPropsList();
            this.$refs['dynamicPropsForm'].validate((valid) => {
                if (valid) {
                    // this.propsForm.tGoodsSkuList = this.propsForm.tGoodsSkuList.map((item) => {
                    //     if (item.barcode === '') {
                    //         return {
                    //             ...item,
                    //             barcode: item.skuCode,
                    //         }
                    //     } else {
                    //         return item;
                    //     }
                    // });
                } else {
                    return false;
                }
            });
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      loopProps(data) {
            const getProps = () => {
            const arr = [];
            const getArr = (skuArr, list, i = 0) => {  
                if (list[i]) {
                    for (let j = 0; j< list[i].length; j++) {  
                        if (i < list.length - 1) {  　　
                            skuArr[i] = list[i][j];
                            getArr(skuArr ,list , i + 1);
                        } else {
                            arr.push([...skuArr, list[i][j]]);
                        }  
                    }  
                }
            }
            getArr([], data);
            return arr; 
          };
       
        getProps().forEach((item, index) => {
            const oldTGoodsSkuList = [
                ...this.propsForm.tGoodsSkuList,
            ];
            this.propsForm.tGoodsSkuList.push({
                title: item,
                skuCode: '系统自动生成',
                barcode: '',
                assitBarcode: '',
                extNo: '',
                cost: '',
                costValidator: this.$Regs.RegMin2MaxNumber(0, 999999, false),
                barCodeValidator: this.$Regs.RegMin2MaxAndCheckWithOutCN(3, 50, {
                    key: 'barcode',
                }, oldTGoodsSkuList),
                assitBarCodeValidator: this.$Regs.RegMin2MaxAndCheckWithOutCN(3, 50, {
                    key: 'assitBarcode',
                }, oldTGoodsSkuList),
                // 外部SKU
                extNoValidator: this.$Regs.RegMin2MaxAndCheckWithOutCN(3, 50, {
                    key: 'extNo',
                }, oldTGoodsSkuList),
                properties: '',
                propertyTplList: [],
            });
        });
      },
      setProps() {
          const format = (name, selectedProps) => {
              this.propsForm.tGoodsSkuList.forEach((item) => {
                  if (item.title.findIndex((str) => str === selectedProps) !== -1) {
                      item.properties += `${name}:${selectedProps},`;
                  }
              });
          };
          this.formLists.forEach((item, index) => {
              item.value.forEach((props) => {
                  format(item.name, props);
              });
          });
          this.propsForm.tGoodsSkuList = this.propsForm.tGoodsSkuList.map((item) => {
              return {
                  ...item,
                  properties: item.properties.replace(/,$/,''),
              }
          });
      },
      setPropsList() {
         const format = (propertyId, propObj) => {
              this.propsForm.tGoodsSkuList.forEach((item) => {
                  if (item.title.findIndex((str) => str === propObj.provalueValue) !== -1) {
                    item.propertyTplList.push({
                        propertyId,
                        ...propObj,
                    });
                  }
              });
          };
          this.formLists.forEach((item, index) => {
              item.ids.forEach((props) => {
                  format(item.propertyId, props);
              });
          });
      },
    },
  }
</script>
<style lang="scss" scoped>
    @import '~@/styles/common.scss';
    @import './style/index.scss'; 
</style>
<style lang="scss">
    @import './style/indexOuter.scss'; 
</style>

