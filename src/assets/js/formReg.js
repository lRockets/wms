import Vue from 'vue';
const vProto = Vue.prototype;
/**
 * @method 验证某一范围的字
 * @param { int } min: 验证的范围最小值
 * @param { int } max: 验证的范围最大值
 * @return { Function } callback: 验证后执行的回调函数
 */
const RegMin2MaxChar = (min = 0, max = 10) => {
    return (rule, value, callback) => {
        // 后台返回的初始值为null
        if (value === null) {
            value = '';
        }
        if (typeof value === 'string' && value.trim() !== '') {
            if (value.length > max || value.length < min) {
                return callback(new Error(`请填写${min}-${max}个字`));
            } else {
                return callback();
            }
        } else {
            return callback();
        }
    };
}

/**
 * @method 验证某一范围的数字/字母
 * @param { int } min: 验证的范围最小值
 * @param { int } max: 验证的范围最大值
 * @return { Function } callback: 验证后执行的回调函数
 */
const RegMin2MaxNumberAndLetter = (min = 0, max = 10) => {
    const regShowText = `请填写${min}-${max}个数字/字母`;
    return (rule, value, callback) => {
        const isRegPass = /^[a-zA-Z0-9]+$/.test(value);
        // 后台返回的初始值为null
        if (value === null) {
            value = '';
        }
        if (typeof value === 'string' && value.trim() !== '') {
            if (value.length > max || value.length < min || !isRegPass) {
                return callback(new Error(regShowText));
            } else {
                return callback();
            }
        } else {
            return callback();
        }
    };
}

/**
 * @method 验证某一范围的数字个数或者某一范围的数字大小
 * @param { int } min: 验证的范围最小值
 * @param { int } max: 验证的范围最大值
 * @param { bool } isRange: 是否是数字个数
*                   - true: 是数字个数范围
*                   - false: 是数字大小范围
 * @return { Function } callback: 验证后执行的回调函数
 */
const RegMin2MaxNumber = (min = 0, max = 10, isRange = true) => {
    let regShowText = '';
    if (isRange) {
        regShowText = `请填写${min}-${max}个数字`;
        return (rule, value, callback) => {
            const isRegPass = /^\d+$/.test(value);
            // 后台返回的初始值为null
            if (value === null) {
                value = '';
            }
            if (typeof value === 'string' && value.trim() !== '') {
                if (value.length > max || value.length < min || !isRegPass) {
                    return callback(new Error(regShowText));
                } else {
                    return callback();
                }
            } else {
                return callback();
            }
        };
    } else {
        regShowText = `请填写${min}-${max}的数字`;
        return (rule, value, callback) => {
            // const isRegPass = /^\d+$/.test(value);
            const isRegPass = /(^\d+$|^\d+\.?\d+$)/.test(value);
            // 后台返回的初始值为null
            if (value === null) {
                value = '';
            }
            // console.log(value);
            if (typeof value === 'string' && value.trim() !== '') {
                value = Number(value);
                if (value > max || value < min || !isRegPass) {
                    return callback(new Error(regShowText));
                } else {
                    return callback();
                }
            } else {
                return callback();
            }
        };
    }
}

/**
 * @method 验证某一范围的数字/字母/符号
 * @param { int } min: 验证的范围最小值
 * @param { int } max: 验证的范围最大值
 * @return { Function } callback: 验证后执行的回调函数
 */
const RegMin2MaxWithOutCN = (min = 0, max = 10) => {
    const regShowText = `请填写${min}-${max}个数字/字母/符号`;
    return (rule, value, callback) => {
        // 取反，排除汉字的情况
        const isRegPass = /[\u4e00-\u9fa5]+/.test(value);
        // 后台返回的初始值为null
        if (value === null) {
            value = '';
        }
        if (typeof value === 'string' && value.trim() !== '') {
            if (value.length > max || value.length < min || isRegPass) {
                return callback(new Error(regShowText));
            } else {
                return callback();
            }
        } else {
            return callback();
        }
    };
}

/**
 * @method 验证某一范围的数字/字母/符号，包含后台验证
 * @param { int } min: 验证的范围最小值
 * @param { int } max: 验证的范围最大值
 * @param { Object } fetchObj: 验证的对象
 * @return { Function } callback: 验证后执行的回调函数
 */
const RegMin2MaxAndCheckWithOutCN = (min = 0, max = 10, fetchObj, allObj, skuId) => {
    const regShowText = `请填写${min}-${max}个数字/字母/符号`;
    const regCommonShowText = '当前条码已存在，不可重复添加';

    return async (rule, value, callback) => {
        // 取反，排除汉字的情况
        const isRegPass = /[\u4e00-\u9fa5]+/.test(value);
        // 后台返回的初始值为null
        if (value === null) {
            value = '';
        }
        if (typeof value === 'string' && value.trim() !== '') {
            if (value.length > max || value.length < min || isRegPass) {
                return callback(new Error(regShowText));
            } else {
                if (fetchObj) {
                    let params;
                    if (skuId) {
                        params = {
                            [fetchObj.key]: value,
                            excludeSkuId: skuId,
                        }
                    } else {
                        params = {
                            [fetchObj.key]: value,
                        }
                    }
                    
                    const { data } = await vProto.$ajaxPost('wms/goodsSku/select.do', {
                        reqParam: JSON.stringify(params),
                    });
                    if (data.code === 200 && !data.data) {
                        const flag = allObj.find((item) => {
                            return item[fetchObj.key] === value;
                        })
                        if (!flag) {
                            return callback();
                        } else {
                            return callback(new Error(regCommonShowText));
                        }
                    } else {
                        return callback(new Error(regCommonShowText));
                    }
                } else {
                    return callback(); 
                }
            }
        } else {
            return callback();
        }
    };
}

export {
    RegMin2MaxChar,
    RegMin2MaxNumber,
    RegMin2MaxNumberAndLetter,
    RegMin2MaxWithOutCN,
    RegMin2MaxAndCheckWithOutCN,
}