import { baseURL } from '@/assets/js/uri';

const outPutType = (typeId) => {
    const typeArr = ['销售出库', '调拨出库', '换货出库', '补发出库', '维修出库', '其他出库','自提'];
    return typeArr[typeId - 1];
};

const payWayType = (payWayId) => {
    const typeArr = ['货到付款', '在线付款', '支付宝', '微信支付', '公对公转账'];
    return typeArr[payWayId - 1];
};

const invoiceType = (invoiceId) => {
    const typeArr = ['电子普通发票', '电子增值税专用发票', '纸质普通发票', '纸质增值税专用发票'];
    return typeArr[invoiceId - 1];
};

const dataSourceType = (sourceId) => {
    const typeArr = ['自动', '手动'];
    return typeArr[sourceId - 1];
};

/**
 * @method 根据状态值确定显示状态
 * @param { int } statusId: 销售单的状态值
 * @returns { string } saleText: 销售单的中文状态
 */
const saleStatus = (statusId) => {
    let saleText = '';
    switch (statusId) {
        case -3:
            saleText = '删除';
            break;
        case -2:
            saleText = '拣货关闭';
            break;
        case -1:
            saleText = '已拦截';
            break;
        case 0:
            saleText = '拣货异常';
            break;
        case 1:
            saleText = '待分配';
            break;
        case 2:
            saleText = '待拣货';
            break;
        case 3:
            saleText = '拣货中';
            break;
        case 4:
            saleText = '待验货';
            break;
        case 5:
            saleText = '待称重';
            break;
        case 6:
            saleText = '待出库';
            break;
        case 7:
            saleText = '出库完成';
            break;
        default:
            saleText = '验货完成';
            break;
    }
    return saleText;
};

const formatImageUrl = (url) => {
    return `${baseURL}/url`;
};

export {
    outPutType,
    payWayType,
    invoiceType,
    dataSourceType,
    saleStatus,
    formatImageUrl,
};