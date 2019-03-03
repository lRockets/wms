<template>
    <div>
        <div class="goodsProps-list__wrap" 
             v-for="(item, index) in lists" 
             :key="index">
             <label class="title">
                <span class="required" v-if="item.isRequired === 0">*</span>
                {{item.propertyName}}：
            </label>
            <el-checkbox-group v-model="item.choosePropsIdsList" 
                               size="small" 
                               @change="(value) => checkChange(value, index)">
                <el-checkbox-button :disabled="skuIds.findIndex((id) => id === item.propertyId) !== -1 && 
                    disabledList.findIndex((str) => str.split(',').findIndex((p) => p === prop_tag.propertyValue) !== -1) !== -1" 
                    :label="prop_tag.propertyValue" 
                    v-for="(prop_tag, prop_index) in item.propertyValueList" 
                    :class="{customActive: skuIds.findIndex((id) => id === item.propertyId) !== -1 && 
                    disabledList.findIndex((str) => str.split(',').findIndex((p) => p === prop_tag.propertyValue) !== -1) !== -1}"
                    :key="prop_index">
                    {{prop_tag.propertyValue}}
                </el-checkbox-button>
            </el-checkbox-group>

            <el-checkbox-group size="small">
                <el-checkbox-button :disabled="true"
                    :label="prop_tag.propertyValue" 
                    v-for="(prop_tag, prop_index) in item.alreadyCusomPropsList" 
                    class="customActive"
                    :key="prop_index">
                    {{prop_tag.propertyValue}}
                </el-checkbox-button>
            </el-checkbox-group>

            <div class="custom-props">
                <el-button class="custom-props__btn" 
                    :class="{active: item.chooseCustomPropsList.findIndex((str) => str === tag) !== -1 }"
                    :key="tag" 
                    v-for="tag in item.customPropsList" 
                    @click="clickCustomProp(tag, index)">
                    <el-tag
                        closable
                        @close="handleClose(tag, index)"
                        type="">
                        {{tag}}
                    </el-tag>
                </el-button>
            </div>
            <el-button size="small" @click="showCustomDialog(index)">添加属性值</el-button>
        </div>


         <el-dialog title="新增属性值" width="30%" :visible.sync="visible">
            <el-form ref="newPropForm" :model="form" :rules="rules">
                <el-form-item style="margin-bottom: 0px;"  label="" label-width="80" prop="propName">
                    <el-input size="small" placeholder="请填写1-5个字" v-model="form.propName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="saveProp">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>

  export default {
    name: 'list-edit',
    props: {
      lists: {
          type: Array,
          default() {
              return [];
          }
      },
      skuList: Array,
    },
    data() {
        return {
            disabledList: [],
            skuIds: [],
            form: {
                propName: '',
            },
            rules: {
                propName: [{
                    trigger: 'change', validator: this.$Regs.RegMin2MaxChar(1, 5),
                 }],
            },
            visible: false,
            index: -1,
        }
    },
    mounted() {
          this.skuList.forEach((item) => {
                item.propertyTplList.forEach((props) => {
                    this.disabledList.push(props.provalueValues);
                    this.skuIds.push(props.propertyId);
                });
            });
            this.disabledList = this.filterPropArr(this.disabledList);
            this.skuIds = this.filterPropArr(this.skuIds);
    },
    methods: {
        checkChange(value, index) {
            this.lists[index].choosePropsList = [];
            let propsArray = this.lists[index].propertyValueList;
            for (let i = 0, length = propsArray.length;i < length; i++) {
                value.forEach((element, eIndex) => {
                    if (element === propsArray[i].propertyValue) {
                        this.lists[index].choosePropsList.push(propsArray[i]);
                    }
                });
            }
            this.lists[index].choosePropsList = this.lists[index].choosePropsList.concat(this.lists[index].chooseCustomPropsList.map((item) => {
                return {
                    id: '',
                    propertyValue: item,
                }
            }));

            let oldProps = [];
            let propsList = [];
            this.lists[index].choosePropsList.forEach((item,index) => {
                if(this.disabledList.findIndex((str) => str.split(',').findIndex((p) => p === item.propertyValue) !== -1) !== -1){
                    oldProps.push(item)
                }else{
                    propsList.push(item)
                }
            })
            this.lists[index].choosePropsList = [
                ...oldProps,
                ...propsList
            ]
        },
        filterPropArr(arr, type = false) {
            if (arr.length === 0) {
                return arr;
            } else {
                if(type) {
                    let obj = {};
                    let newArr = arr.reduce((cur, next) => {
                        obj[next[type]] ? "" : 
                        obj[next[type]] = true && cur.push(next);
                        return cur;
                    },[]);
                    return newArr;
                } else {
                    return Array.from(new Set(arr));
                }
            }
        },
        saveProp() {
            this.$refs.newPropForm.validate((valid) => {
                if (valid) {
                    const customPropsArr = this.lists[this.index].customPropsList;
                    const propsArray = this.lists[this.index].propertyValueList.map((item) => item.propertyValue);
                    if (customPropsArr.concat(propsArray).findIndex((str) => str === this.form.propName.toUpperCase()) === -1) {
                        customPropsArr.push(this.form.propName.toUpperCase());
                    } else {
                        this.$message.warning('请勿添加重复属性值');
                    }
                    this.resetForm();
                    this.visible = !this.visible;
                }
            });
        },
        showCustomDialog(index) {
            this.visible = !this.visible;
            this.index = index;
        },
        resetForm() {
            this.$refs.newPropForm.resetFields();
        },
        /**
         * @method 删除自定义的属性值
         * @param { string } tag: 自定义的属性值
         * @param { int } tagIndex: 自定义的属性值索引 
         * 
         */
        handleClose(tag, tagIndex) {
            this.lists[this.index].customPropsList.splice(this.lists[this.index].customPropsList.indexOf(tag), 1);
            this.clickCustomProp(tag, tagIndex, true);
        },
        /**
         * @method 自定义属性值的点击事件
         * @param { string } value: 自定义的属性值
         * @param { int } propsIndex: 自定义的属性值索引 
         * 
         */
        clickCustomProp(value, propsIndex, isClose = false) {
            const arr = this.lists[propsIndex].chooseCustomPropsList;
            if (arr.length === 0 && !isClose) {
                arr.push(value);
            } else {
               arr.forEach((item, index) => {
                    if (item === value) {
                        arr.splice(index, 1);
                        for (let i = 0,length = this.lists[propsIndex].choosePropsList.length;i < length; i++) {
                            let chooseProps = this.lists[propsIndex].choosePropsList[i];
                            if (chooseProps.propertyValue === value) {
                                this.lists[propsIndex].choosePropsList.splice(i, 1);
                                break;
                            }
                        }
                    } else if(arr.findIndex((str) => str === value) === -1  && !isClose) {
                        arr.push(value);
                    }
                }); 
            }
            if (this.lists[propsIndex].choosePropsIdsList.length === 0) {
                this.lists[propsIndex].choosePropsList = arr.map((item) => {
                    return {
                        id: '',
                        propertyValue: item,
                    }
                });
            } else {
                const filterObj = this.lists[propsIndex].choosePropsList.map(item => item.propertyValue);
                
                this.lists[propsIndex].choosePropsList = this.lists[propsIndex].choosePropsList.concat(arr.filter((item) => filterObj.indexOf(item) === -1).map((item) => {
                    return {
                        id: '',
                        propertyValue: item,
                    }
                }));
            }
        }
    },
  }
</script>
<style lang="scss" scoped>
    @import './style/index.scss';
</style>
<style lang="scss">
    @import './style/indexOuter.scss'; 
</style>

