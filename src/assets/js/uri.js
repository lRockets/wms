let baseURL = "http://api.wms.jc-saas.com/"; //正式地址
// let baseURL= "http://192.168.0.34:8080/";  //cx地址
// let baseURL = "http://10.10.10.124:8080/"; //熊超地址
// let baseURL = "http://192.168.0.48:8080/";  //林奕地址
// let baseURL = "http://10.10.10.171:8080/";
// let baseURL = "http://10.10.13.64:8888/jcadmin/";
// let baseURL = "http://wms.jc-saas.com/";
const href = location.href; // 截取URL地址区分是否带项目路径
const cutTag = '/#';
// let baseURL = 'http://wms.jc-saas.com/';

function setBaseUrl() {
    let apiUrl = '';
    if (process.env.NODE_ENV === 'production') {
        apiUrl = 'http://api.wms.jc-dev.cn/';
        // const localHref = href.substring(0, href.indexOf(cutTag));
        // apiUrl = baseURL ? localHref : baseURL; // 判断是否分离部署
    } else {
        apiUrl = baseURL; // 判断是否分离部署
    }
    return apiUrl;
}

baseURL = setBaseUrl();
export {
    baseURL,
}