<template>
    <div>
        <div class="goodsProps-list__wrap" v-for="(item, index) in lists" :key="index">
            <label class="title">
                <span class="required" v-if="item.isRequired === 0">*</span>
                {{item.propertyName}}：
            </label>
            <el-checkbox-group v-model="item.choosePropsIdsList" size="small" @change="(value) => checkChange(value, index)">
                <el-checkbox-button :label="prop_tag.propertyValue" v-for="(prop_tag, prop_index) in item.propertyValueList" :key="prop_index">
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

        <el-dialog title="新增属性值" width="25%" :visible.sync="visible">
            <el-form ref="newPropForm" 
                     :model="form" 
                     :rules="rules">
                <el-form-item style="margin-bottom: 0px;" label="" label-width="80" prop="propName">
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
    name: 'property-list',
    props: {
      lists: {
          type: Array,
          default() {
              return [];
          }
      },
    },
    data() {
        return {
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
    mounted(){
    },
    methods: {
        /**
         * @description 选择属性触发事件
         * @param { [string] } value 返回当前点击的row的选中id，
         * @param { int } index 返回当前点击的row的index,
         */
        checkChange(value, index) {
            this.lists[index].choosePropsList = [];
            let propsArray = this.lists[index].propertyValueList;
            for (let i = 0, length = propsArray.length; i < length; i++) {
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
        },
        showCustomDialog(index) {
            this.visible = !this.visible;
            this.index = index;
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
            console.log(2);
            const arr = this.lists[propsIndex].chooseCustomPropsList;
            if (arr.length === 0 && !isClose) {
                arr.push(value);
            } else {
                // 判断当前是 取消选中 or 选中
                arr.forEach((item, index) => {
                    if (item === value) {
                        // 取消选中情况下 删除 （this.lists[propsIndex].chooseCustomPropsList == 自定义属性选中的数组） 下面的这个元素
                        arr.splice(index, 1);
                        for (let i = 0,length = this.lists[propsIndex].choosePropsList.length;i < length; i++) {
                            let chooseProps = this.lists[propsIndex].choosePropsList[i];
                            if (chooseProps.propertyValue === value) {
                                // 并且删除  （this.lists[propsIndex].choosePropsList == 所有选中的数组） 下面的这个元素
                                this.lists[propsIndex].choosePropsList.splice(i, 1);
                                break;
                            }
                        }
                    } else if (arr.findIndex((str) => str === value) === -1 && !isClose) {
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
                // 取出对比对象
                const filterObj = this.lists[propsIndex].choosePropsList.map(item => item.propertyValue);
                // 对比后， 将此次新增的这个对象合并到所有选中数组里面
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

