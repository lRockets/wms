import defaultImage from '@/assets/images/404.png';
import { baseURL } from './uri.js';

let Util = {
  //用户配置设置
  setUserConfig(context, req){
    context.$ajaxPost("Erp/User/userConfigAction", req).then(res => {
      if (res.data.code == 1) {
        context.$message({
          type: "success",
          message: res.data.msg
        });
      }
    })
  },
  //用户配置获取
  getUserConfig(context, cb){
    /* context.$ajaxPost("Erp/User/userConfig",{}).then(res=>{
     if(res.data.code == 1){
     if(cb)cb(res.data);
     }
     });*/
    let req = {
      // user_id: context.$Cookies.get("user_id"),
      token: context.$Cookies.get("token")
    };
    let result = $.ajax({
      url: baseURL + 'Erp/User/userConfig',
      type: 'POST',
      data: req,
      async: false
    }).done(function (res) {
      if (res.code == 1) {
        return res.data;
      }
    }).fail(function (res) {
      // console.log(res);
    });
    return JSON.parse(result.responseText).data;
  },
  /*req包含2个参数
   order_no：订单编号
   content：描述
   * */
  logAjax(context, req){
    context.$ajaxPost("Erp/Order/add_order_log", req).then(res => {
      /*console.log(res.data);*/
    })
  },
  checkTagExist(condition,context){
    //判断操作对象是否存在于头部导航
    let result = {
      idx: -1,
      item: {}
    };
    let arr = context.$store.getters.dynamicTags;
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      let item = arr[i];
      if (item.path == condition) {
        result.idx = i;
        result.item = item;
        break;
      }
    }
    return result;
  },
  checkSelectedIdx(selectArr,errorArr,key){
    key = key || "order_no";
    let result = {
      okIdx: [],
      errorIdx: []
    };
    let len = selectArr.length;
    for (let i = 0; i < len; i++) {
      let item = selectArr[i];
      if (errorArr.indexOf(item[key]) > -1) {
        result.errorIdx.push(i)
      }else{
        result.okIdx.push(i)
      }
    }
    return result;
  },
  /*查找对象数组是否存在某关键字
   参数:
   list:数组
   keyword:关键字
   type:（匹配类型非必传）:（keys（键）/values（值））默认同时匹配
   isLike（匹配方式非必传）:ture（模糊匹配）/false(匹配相等)默认匹配相等
   * */
  findArrayObjKeyword: function (list, keyword, type, isLike) {
    if (typeof(type) == "string") {
      isLike = isLike || false;
      type = type || "";
    } else {
      isLike = type || false;
      type = "";
    }
    let newList = [];
    let result = Object.values(list).filter(item => {
      newList = type ? Object[type](item) : Object.keys(item).concat(Object.values(item));
      let exist = newList.filter(val => {
        return isLike ? val.indexOf(keyword) > -1 : val == keyword
      });
      return exist.length > 0
    });
    return {
      resultArr: result,
      flag: result.length > 0
    }
  },
  /*
   例如
   传入其请求路径"Erp/count/exportCountDepot"
   请求参数:req = {
   depot_id:"1",
   end_time:"2018-02-26 23:59:59",
   start_time:"2018-02-26 00:00:00",
   type:1
   }
   context:this(vue实例)
   得到结果http://erp.jcsjzx.cn/Erp/count/exportCountDepot?user_id=86&token=a70398ab4513d5ec7355bd3cd364f442d356770a
   &type=1&depot_id=1&start_time=2018-02-26 00:00:00&end_time=2018-02-26 23:59:59
   * */
  getExportUrl(url, req, context){//获取导出链接
    let arr = [];
    // req.user_id = context.$Cookies.get("user_id");
    req.loginToken = context.$Cookies.get("loginToken");
    Object.keys(req).forEach((item, index) => {
      arr.push(item + "=" + Object.values(req)[index]);
    });
    return baseURL + url + "?" + arr.join("&");
  },
  getErrorMsg(context, list, key){
    //错误信息 拼接
    key = key ? key : "orderid";
    let arr = [];
    list.forEach(item => {
      arr.push("订单编号:[" + item[key] + "],失败原因:" + item.msg)
    });
    context.$alert(arr.join("。"), '错误提示', {
      confirmButtonText: '确定',
      type: "error"
    }).catch({});
    return arr.join("。");
  },
  getResultByKey(key, val, list) {//根据特定字段过滤结果集
    return list.filter(item => {
      return item[key] == val;
    })
  },
  getResultByDepotID(val) {//根据特定字段过滤结果集----仓库
    return window.dictionary.depot_list.filter(item => {
      return item.depot_id == val;
    })
  },
  conditionTypeList: [
    {
      value: "",
      label: "请选择"
    },
    {
      value: "1",
      label: "物流编号"
    },
    {
      value: "2",
      label: "订单编号"
    },
    {
      value: "3",
      label: "单据编号"
    },
    {
      value: "4",
      label: "买家账号"
    },
    {
      value: "5",
      label: "收货人电话"
    },
    {
      value: "6",
      label: "收货人"
    },

    {
      value: "7",
      label: "收货人手机"
    },
    {
      value: "8",
      label: "收货人省份"
    },
    {
      value: "9",
      label: "卖家备注"
    },
    {
      value: "10",
      label: "销售员"
    },
    {
      value: "11",
      label: "物流公司"
    },
    {
      value: "12",
      label: "收获地址"
    },
    {
      value: "13",
      label: "经手人"
    },
    {
      value: "14",
      label: "售后单号"
    }
  ],//查询条件
  sourceList: [
    {
      value: "1",
      label: "京东"
    },
    {
      value: "2",
      label: "淘宝"
    },
    {
      value: "3",
      label: "线下"
    },
    {
      value: "4",
      label: "阿里巴巴"
    },
    {
      value: "5",
      label: "拼多多"
    }
  ],//订单来源
  yesNoList: [{label: "否", value: 0}, {label: "是", value: 1}],
  sourceStr: ["", "京东", "淘宝", "线下", "阿里巴巴", "拼多多"],
  mergeList: [{value: "0", label: "未合并"}, {value: "1", label: "已合并"}],//合并状态
  lockList: [{value: "0", label: "未锁定"}, {value: "1", label: "已锁定"}, {value: "2", label: "返回审核"}],//锁定状态
  flagList: [
    {value: "1", label: "红色", style: "flagRed"},
    {value: "2", label: "黄色", style: "flagYellow"},
    {value: "3", label: "绿色", style: "flagGreen"},
    {value: "4", label: "蓝色", style: "flagBlue"},
    {value: "5", label: "紫色", style: "flagPurple"}
  ],//旗帜
  flagClassName: ["", "flagRed", "flagYellow", "flagGreen", "flagBlue", "flagPurple"],
  payTypeStr: ["", "货到付款", "邮局汇款", "自提", "在线支付", "公司转账", "银行卡转账"],//货到付款
  audioName: {
    'url_detailYes':"detailYes.wav",
    'url_detailNo': "barCodeNo.wav",
    "4061": "WeightNoCheck.mp3",
    "4003": "WeightError.mp3",
    "4097": "WeightRepeat.mp3",
    "百世快运": "baishi.mp3",//百世通过
    "德邦快递": "debang.mp3",//德邦通过
    "德邦快收": "debang.mp3",//德邦通过
    "邮政EMS": "ems.mp3",//邮政通过
    "申通快递": "shentong.mp3",//申通通过
    "顺丰快递": "shunfeng.mp3",//顺丰通过
    "顺丰速运-航空": "shunfeng.mp3",//顺丰通过
    "顺丰代收-航空": "shunfeng.mp3",//顺丰通过
    "顺丰速运-陆运": "shunfeng.mp3",//顺丰通过
    "顺丰代收-陆运": "shunfeng.mp3",//顺丰通过
    "速尔快递": "suer.mp3",//速尔通过
    "圆通快递": "yuantong.mp3",//圆通通过
    "韵达快递": "yunda.mp3",//韵达通过
    "中通快递": "zhongtong.mp3",//中通通过
  },
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date());
      }
    }, {
      text: '昨天',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', date);
      }
    }, {
      text: '一周前',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', date);
      }
    },
      {
        text: '最近15天',
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 15);
          picker.$emit('pick', date);
        }
      },
      {
        text: '最近一个月',
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit('pick', date);
        }
      }, {
        text: '最近三个月',
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit('pick', date);
        }
      }]
  },//日期选择器特有的选项
  
  emptySrc: require('@/assets/images/empty.png'),//表格无数据图片路径

  getTabSumary(data, result){
    //表格合计
    data.map(item => {
      return Object.keys(item).filter(key => {
        if (Object.keys(result).indexOf(key) > -1) {
          result[key] += Number(item[key]) || 0
        }
      })
    });
    return result;
  },
  brandStr: ["", "精臣", "兄弟", "硕方", "普贴", "凯标", "爱普生", "wewin"],
  brandList: [
    {
      label: "精臣",
      value: "1"
    },
    {
      label: "兄弟",
      value: "2"
    },
    {
      label: "硕方",
      value: "3"
    },
    {
      label: "普贴",
      value: "4"
    },
    {
      label: "凯标",
      value: "5"
    },
    {
      label: "爱普生",
      value: "6"
    },
    {
      label: "wewin",
      value: "7"
    }
  ],
  ///商品品牌列表
  // uploadFile(context, file){//图片上传
  //   let formData = new FormData();
  //   formData.append('import', file);
  //   // formData.append('user_id', context.$Cookies.get("user_id"));
  //   formData.append('loginToken', context.$Cookies.get("loginToken"));
  //   return $.ajax({
  //     url: baseURL + 'Erp/Goods/uploadGoodsImage',
  //     type: 'POST',
  //     data: formData,
  //     async: false,
  //     cache: false,
  //     processData: false,
  //     contentType: false
  //   }).done(function (res) {
  //     if (res.code == 1) {
  //       return res;
  //     }
  //   }).fail(function (res) {
  //     // console.log(res);
  //   });
  // },
  RegExp: {//验证
    pureCN(rule, value, callback) {//纯中文
      let v = value.toString().trim();
      let flag = /^[\u4E00-\u9FA5]+$/.test(v);
      if (!flag) {
        if (callback) callback(new Error('填写内容为纯中文!'));
      }
      return flag;
    },

    pureEN(rule, value, callback) {//纯英文
      let v = value.toString().trim();
      let flag = /^[A-Za-z]+$/.test(v);
      if (!flag) {
        if (callback) callback(new Error('填写内容为纯英文!'));
      }
      return flag;
    },
    pureNumber: function (rule, value, callback) {
      let v = value.toString().trim();
      let flag = (/^\+?[1-9][0-9]*$/.test(v));
      if (!flag) {
        if (callback) callback(new Error('填写内容必须为纯数字!'));
      }
      return flag;
    },
    pureName: function (rule, value, callback) {
      let v = value.toString().trim();
      if(v){
        if (v.length<2||v.length>10) {
          if (callback) callback(new Error('请输入2-10个字'));
        }else{
          callback();
        }
      }else{
        callback();
      }
    },
    pureName2: function (rule, value, callback) {
      let v = value.toString().trim();
      if (v.length<2||v.length>10) {
        if (callback) callback(new Error('请输入2-10个字'));
      }else{
        callback();
      }
    },
    pureSort: function (rule, value, callback) {
      let v = value.toString().trim();
      let flag = (/^(\d|[1-9]\d{1,3})$/.test(v));
      if(v){
        if (!flag) {
          if (callback) callback(new Error('请输入0-9999的整数'));
        }else{
          callback();
        }
      }else{
        callback();
      }
    },
    num1Reg(rule, value, callback,numRule,numRuleChild,addlocation){     //单个新增（货架）
      let v = value.toString().trim()
      let tipArray=numRuleChild.split(';')
      let Tooltips=''      //不合格数据的提示信息
      let flag='';        //验证数据的正则表达式
      let nineLength=''     //9的长度
      let zeroLength='';   //0的长度
      if(tipArray[0]=='0'){   //当规则是字母加数字时
        let a=tipArray.length-1
        if(a>0){
          for(let i=0;i<tipArray.length-1;i++){
            nineLength=nineLength.concat('9')
          }
          for(let i=0;i<tipArray.length-2;i++){
            zeroLength=zeroLength.concat('0')
          }
          Tooltips='请输入 A'+zeroLength+'1 - Z'+nineLength+'/'+'a'+zeroLength+'1 - z'+nineLength
          flag =(new RegExp("^[A-z][0-9]{"+a+"}$")).test(v)
          let numSection=value.substring(1)
          if(numSection-0>0&&flag){
            callback();
          }else{
            if (callback) callback(new Error(Tooltips));
          }
        }else{ 
          Tooltips='请输入 A-Z/a-z 的字母'
          flag =/^[A-z]$/.test(v)
        }  
      }else{  //当规则为纯数字时
        if(tipArray.length==1){
          Tooltips='请输入 1-9 的整数'
          flag =/^[1-9]$/.test(v)
        }else{
          for(let i=0;i<tipArray.length;i++){
            nineLength=nineLength.concat('9')
          }
          for(let i=0;i<tipArray.length-1;i++){
            zeroLength=zeroLength.concat('0')
          }
          let a=tipArray.length-0
          Tooltips='请输入 '+zeroLength+'1 - '+nineLength+' 的整数'
          flag =(new RegExp("^[0-9]{"+a+"}$")).test(v)
          // let numSection=value.substring(1)
          if(value-0>0&&flag){
            callback();
          }else{
            if (callback) callback(new Error(Tooltips));
          }
        }
      }
      if(!flag){
        if (callback) callback(new Error(Tooltips));
      }else{
        callback();
        if(addlocation.type=='1'){
          if(addlocation.stochannelCode&&addlocation.stoshelfCode&&addlocation.layerNum&&addlocation.columnNum){
            addlocation.locationCode=addlocation.stoareaCode+numRule.stoareaRuleSuffix
                                    +addlocation.stochannelCode+numRule.stochannelRuleSuffix
                                    +addlocation.stoshelfCode+numRule.stoshelfRuleSuffix
                                    +addlocation.layerNum+numRule.layerRuleSuffix
                                    +addlocation.columnNum
          }else{
            addlocation.number6='';
          }
        }else{
          if(addlocation.stochannelCode&&addlocation.stoshelfCode){
            addlocation.locationCode=addlocation.stoareaCode+numRule.stoareaRuleSuffix
                                    +addlocation.stochannelCode+numRule.stochannelRuleSuffix
                                    +addlocation.stoshelfCode
          }else{
            addlocation.number6='';
          }
        }
      }
    },
    b_num1Reg(rule, value, callback,numRule){         //批量新增 起始流水号
      let v = value.toString().trim()
      let tipArray=numRule.split(';')
      let Tooltips=''      //不合格数据的提示信息
      let flag='';        //验证数据的正则表达式
      let nineLength=''     //9的长度
      let zeroLength='';   //0的长度

      if(tipArray[0]=='0'){   //当规则是字母加数字时
          let a=tipArray.length-1
          if(a>0){
              for(let i=0;i<tipArray.length-1;i++){
                  nineLength=nineLength.concat('9')
              }
              for(let i=0;i<tipArray.length-2;i++){
                  zeroLength=zeroLength.concat('0')
              }
              Tooltips='请输入 A'+zeroLength+'1 - Z'+nineLength+'/'+'a'+zeroLength+'1 - z'+nineLength
              flag =(new RegExp("^[A-z][0-9]{"+a+"}$")).test(v)
              let numSection=value.substring(1)
              if(numSection-0>0&&flag){
                callback();
              }else{
                if (callback) callback(new Error(Tooltips));
              }
          }else{
              Tooltips='请输入 A-Z/a-z 的字母'
              flag =/^[A-z]$/.test(v)
          }  
      }else{  //当规则为纯数字时
          if(tipArray.length==1){
              Tooltips='请输入 1-9 的整数'
              flag =/^[1-9]$/.test(v)
          }else{
              for(let i=0;i<tipArray.length;i++){
                  nineLength=nineLength.concat('9')
              }
              for(let i=0;i<tipArray.length-1;i++){
                  zeroLength=zeroLength.concat('0')
              }
              let a=tipArray.length-0
              Tooltips='请输入 '+zeroLength+'1 - '+nineLength+' 的整数'
              flag =(new RegExp("^[0-9]{"+a+"}$")).test(v)
              if(value-0>0&&flag){
                callback();
              }else{
                if (callback) callback(new Error(Tooltips));
              }
          }
      }
      if(!flag){
          if (callback) callback(new Error(Tooltips));
      }else{
          callback();
      }
    },
    produce1Reg(rule, value, callback,numRule,batch_num){    //批量新增 通道数
      let v = value.toString().trim()
      let tipArray=numRule.split(';')
      let Tooltips=''      //不合格数据的提示信息
      let flag=''        //验证数据的正则表达式
      let Arr=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
      let letterIndex=''   //字母在26字母中的位置与z的差额
      let nineLength=''     //9的长度
      if(batch_num){
          let numArray=batch_num.split('')
          if(tipArray[0]=='0'){           //含字母
              letterIndex=25-Arr.indexOf(numArray[0].toUpperCase())
              if(tipArray.length-1>0){     //字母加数字
                  let numSection=batch_num.substring(1)
                  for(let i=0;i<tipArray.length-1;i++){
                      nineLength=nineLength.concat('9')
                  }
                  let a=(nineLength-numSection)+1;
                  let aLength = a.toString().trim().length
                  if(letterIndex>0){ //当字母不是最后一位
                      let total=nineLength*letterIndex+a
                      let totalLength = total.toString().trim().length
                      Tooltips='请输入 1-'+total+'的整数'
                      flag=(new RegExp("^[1-9][0-9]{0,"+totalLength+"}$")).test(v)
                      if(value-0>=1&&value-0<=total&&flag){
                          callback();
                      }else{
                         if (callback) callback(new Error(Tooltips));
                      }
                  }else{       //当字母是最后一位时
                      if(a>1){
                          Tooltips='请输入 1-'+a+'的整数'
                          flag=(new RegExp("^[1-9][0-9]{0,"+aLength+"}$")).test(v)
                          if(value-0>=1&&value-0<=a&&flag){
                              callback();
                          }else{
                              if (callback) callback(new Error(Tooltips));
                          }
                      }else{
                          Tooltips='请输入 1'
                          flag =(new RegExp("^[1]$")).test(v)
                      }
                  }  
              }else{              //纯字母
                  let a=letterIndex+1
                  let aLength = a.toString().trim().length
                  if(letterIndex>0){
                      Tooltips='请输入 1-'+a+'的整数'
                      flag=(new RegExp("^[1-9][0-9]{0,"+aLength+"}$")).test(v)
                      if(value>=1&&value<=a&&flag){
                        callback();
                      }else{
                        if (callback) callback(new Error(Tooltips));
                      }
                  }else{
                      Tooltips='请输入 1'
                      flag =(new RegExp("^[1]$")).test(v)
                  }
              }
          }else{                      //纯数字时
              for(let i=0;i<numArray.length;i++){
                  nineLength=nineLength.concat('9')
              }
              let a=(nineLength-batch_num)+1;         //起始流水号只输入一个数字时
              let aLength = a.toString().trim().length
              if(a>1){
                  Tooltips='请输入 1-'+a+'的整数'
                  flag =(new RegExp("^[1-9][0-9]{0,"+aLength+"}$")).test(v)
                  if(value-0>=1&&value-0<=a&&flag){
                      callback();
                  }else{
                      if (callback) callback(new Error(Tooltips));
                  }
              }else{
                  Tooltips='请输入 1'
                  flag =(new RegExp("^[1]$")).test(v)
              }
          }
      }else{
          flag=''
          Tooltips='请先输入起始流水号'
      }
      if(!flag){
          if (callback) callback(new Error(Tooltips));
      }else{
          callback();
      }
  },
    lengthReg(rule, value, callback){  //0-10的数，保留小数点后两位
      let v = value.toString().trim(); 
      let flag = /^(0\.\d{1,2}|[1-9]|[1-9]\.\d{1,2}|10|10.0{1,2})$/.test(v);
      if(!flag){
        if (callback) callback(new Error('请输入0-10的数字，保留2位小数'));
      }else{
        callback();
      }
    },
   length2Reg(rule, value, callback){  //0-1000的数，保留小数点后两位
      let v = value.toString().trim(); 
      let flag = /^(0\.\d{1,2}|[1-9]\d{0,2}|1000|[1-9]\d{0,2}\.\d{1,2}|1000.0{1,2})$/.test(v);
      if(!flag){
        if (callback) callback(new Error('请输入0-1000的数字，保留2位小数'));
      }else{
        callback();
      }
    },

    passwordReg(rule, value, callback){//密码
      let v = value.toString().trim();
      let flag =  /^(?![0-9]+$)(?![a-zA-Z]+$)[^\u4e00-\u9fa5]{6,20}$/.test(v);
      if (!flag) {
        if (callback) callback(new Error('密码6-20位密码，且包含数字、字母、符号至少两种'));
      }else{
        callback()
      }
      // return flag;
    },
    LawfulReg: function (rule, value, callback) {
      let v = value.toString().trim();
      let flag = /^[\da-zA-Z_]+$/.test(v);
      /*/^\w+$/*/
      if (!flag) {
        if (callback) callback(new Error('填写内容只能由字母、数字、下划线组成!'));
      }
      return flag;
    },
    QtyMax(rule, value, callback,mix) {       //比较最大值
      let QtyMix=mix
      if(value&&QtyMix){
        if (value-QtyMix<0) {
          if (callback) callback(new Error('最大库存需大于等于最小库存'));
        }else{
          callback()
        }
      }else{
        callback()
      }
    },
    QtyMix(rule, value, callback,max) {       //比较最小值
      let QtyMax=max
      if(value&&QtyMax){
        if (QtyMax-value<0) {
          if (callback) callback(new Error('最大库存需大于等于最小库存'));
        }else{
          callback()
        }
      }else{
        callback()
      }
    },
    phoneReg(rule, value, callback) {//手机号
      let v = value.toString().trim();
      // let flag = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(v);
      let flag=/^\d{11}$/.test(v)
      if (!flag) {
        if (callback) callback(new Error('手机格式不正确!'));
      }else{
        callback()
      }
      // return flag;
    },
    phoneReg2(rule, value, callback) {//手机号
      let v = value.toString().trim();
      // let flag = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(v);
      let flag=/^\d{11}$/.test(v)
      if(v){
        if (!flag) {
          if (callback) callback(new Error('手机格式不正确!'));
        }else{
          callback()
        }
      }else{
        callback()
      }
    },
    dotPhone(rule, value, callback) {//网点电话
      let v = value.toString().trim();
      let flag = /^\d{5,11}$/.test(v);
      if(v){
        if (!flag) {
          if (callback) callback(new Error('请输入5-11位数字'));
        }else{
          callback()
        }
      }else{
        callback()
      }
    },
    dotPhone2(rule, value, callback) {//网点电话
      let v = value.toString().trim();
      let flag = /^\d{5,11}$/.test(v);
      if (!flag) {
        if (callback) callback(new Error('请输入5-11位数字'));
      }else{
        callback()
      }
    },
    noteReg(rule, value, callback) {//备注
      let v = value.toString().trim();
      if(v){
        if (v.length>200) {
          if (callback) callback(new Error('请输入0-200个字'));
        }else{
          callback()
        }
      }else{
        callback()
      }
    },
    emailReg: function (rule, value, callback) {
      let v = value.toString().trim();
      let flag = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(v);
      if (!flag) {
        if (callback) callback(new Error('邮箱格式不正确!'));
      }else{
        callback()
      }
    },
    emailReg2: function (rule, value, callback) {
      let v = value.toString().trim();
      let flag = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(v);
      if(v){
        if (!flag) {
          if (callback) callback(new Error('邮箱格式不正确!'));
        }else{
          callback()
        }
      }else{
        callback()
      }
    },
    strLengthReg: function (rule, value, callback) {
      let v = value.toString().trim();
      let flag = /^[a-zA-Z0-9_`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{5,30}$/.test(v);
      if(v){
        if (!flag) {
          if (callback) callback(new Error('请输入5-30个数字/字母/符号'));
        }else{
          callback()
        }
      }else{
        callback()
      }
    },
    strLengthReg2: function (rule, value, callback) {
      let v = value.toString().trim();
      let flag = /^[a-zA-Z0-9_`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{5,30}$/.test(v);
      if (!flag) {
        if (callback) callback(new Error('请输入5-30个数字/字母/符号'));
      }else{
        callback()
      }
    },
    httpReg: function (rule, value, callback) {
      let v = value.toString().trim();
      let flag = /^[a-zA-Z0-9_`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{5,50}$/.test(v);
      if(v){
        if (!flag) {
          if (callback) callback(new Error('请输入5-50个数字/字母/符号'));
        }else{
          callback()
        }
      }else{
        callback()
      }
    },
    identityReg: function (rule, value, callback) {
      let v = value.toString().trim();
      let flag = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(v);
      if (!flag) {
        if (callback) callback(new Error('身份证号不合法!'));
      }
      return flag;
    },
    bankReg: function (rule, value, callback) {
      let v = value.toString().trim();
      let strBank = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
      let flag = true;
      if (!(/^[0-9]{16,19}$/.test(v))) {
        flag = false;
        if (callback) callback(new Error('银行卡为16-19位的纯数字!'));
      } else if (strBank.indexOf(v.substring(0, 2)) == -1) {
        flag = false;
        if (callback) callback(new Error('银行卡号开头6位不符合规范!'));
      }
      return flag;
    }
  },
  keyupExp: {//keyup事件
    justNumber(){
      /*输入框仅输入数字*/
      event.target.value = event.target.value.replace(/[^0-9]/g, '').trim();
      return event.target.value;
    },
    justNumAndPointN(n){
      let str = event.target.value;
      if (str.indexOf(".") == 0) {
        if (str.length == 1) {
          event.target.value = "";
        } else {
          let end = end = str.substr((str.indexOf(".") + 1)).replace(/[^0-9]/g, '').substr(0, n);
          str = "0." + end;
          event.target.value = parseFloat(str);
        }
      } else if (str.indexOf(".") > 0) {
        let idx = str.indexOf(".");
        let start = str.substring(0, idx).replace(/[^0-9]/g, '');
        let end = str.substr(str.indexOf(".") + 1).replace(/[^0-9]/g, '').substr(0, n);
        str = start + "." + end;
        event.target.value = str;
      } else {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
      }
    },
    justNumAndPoint2(){
      /*输入框仅输入数字，小数点保留2位*/
      this.justNumAndPointN(2);
    },
    justNumAndPoint4(){
      /*输入框仅输入数字，小数点保留4位*/
      this.justNumAndPointN(4);
    }
  },
  calcEvent: {
    //单价，金额，数量计算事件
    calcPriceByNumber(data, dataList){
      //根据数量(整数)  算单价
      delegateObj.keyupExp.justNumber();
      let newData = {};
      for (let key in data) {
        newData[key] = parseFloat(data[key]) ? parseFloat(data[key]) : 0;
      }
      data.price = (newData.total_price / newData.item_total).toFixed(4);
      return this.calcAll(dataList);
    },
    calcPriceBySum(data, dataList){
      //根据金额（2位） 算单价（4位）
      delegateObj.keyupExp.justNumAndPoint4();
      let newData = {};
      for (let key in data) {
        newData[key] = parseFloat(data[key]) ? parseFloat(data[key]) : 0;
      }
      data.price = (newData.total_price / newData.item_total).toFixed(4);
      return this.calcAll(dataList);
    },
    calcSumByPrice(data, dataList){
      //根据单价（4位） 算金额（2位）
      delegateObj.keyupExp.justNumAndPoint4();
      let newData = {};
      for (let key in data) {
        newData[key] = parseFloat(data[key]) ? parseFloat(data[key]) : 0;
      }
      data.total_price = (newData.price * newData.item_total).toFixed(2);
      return this.calcAll(dataList);
    },
    calcAll(dataList){
      //计算总金额 总数量
      let sumNumber = 0, sumMoney = 0;
      dataList.forEach(item => {
        sumNumber += parseInt(item.item_total) ? parseInt(item.item_total) : 0;
        sumMoney += parseFloat(item.total_price) ? parseFloat(item.total_price) : 0;
      });
      return {
        sumNumber: sumNumber,
        sumMoney: sumMoney
      };
    }
  },
  calcPurchase: {
    /*采购下单算法
     字段：
     price 单价   item_total 数量   total_price 金额
     tax_rate 税率 tax 税额
     after_tax_price 税后单价 after_tax_total_price 税后金额
     公式：
     (1)单价=税后单价*（1-税率）
     data.price = (newData.after_tax_price * (1 - newData.tax_rate/100)).toFixed(4);
     (2)税额=税后单价*税率*数量
     data.tax = ((newData.after_tax_price * newData.tax_rate * newData.item_total)/100).toFixed(4);
     (3)税后金额=税后单价*数量
     data.after_tax_total_price = (newData.after_tax_price *  newData.item_total).toFixed(4);
     (4)总金额=单价*数量
     data.total_price = (newData.price * newData.item_total).toFixed(4);
     */
    calcByAfterTaxPrice(data, dataList){
      //税后单价变化
      let newData = {};
      for (let key in data) {
        newData[key] = parseFloat(data[key]) ? parseFloat(data[key]) : 0;
      }
      /*单价=税后单价*（1-税率）*/
      let result = data.price = (newData.after_tax_price * (1 - newData.tax_rate / 100)).toFixed(4);
      /*税额=税后单价*税率*数量*/
      data.tax = ((newData.after_tax_price * newData.tax_rate * newData.item_total) / 100).toFixed(4);
      /*税后金额=税后单价*数量*/
      data.after_tax_total_price = (newData.after_tax_price * newData.item_total).toFixed(4);
      /*总金额=数量*单价*/
      data.total_price = (result * newData.item_total).toFixed(4);
      return delegateObj.calcEvent.calcAll(dataList);
    },
    calcByTaxRate(data, dataList){
      //税率变化
      let newData = {};
      for (let key in data) {
        newData[key] = parseFloat(data[key]) ? parseFloat(data[key]) : 0;
      }
      /*单价=税后单价*（1-税率）*/
      let result = data.price = (newData.after_tax_price * (1 - newData.tax_rate / 100)).toFixed(4);
      /*税额=税后单价*税率*数量*/
      data.tax = ((newData.after_tax_price * newData.tax_rate * newData.item_total) / 100).toFixed(4);
      /*总金额=数量*单价*/
      data.total_price = (result * newData.item_total).toFixed(4);
      return delegateObj.calcEvent.calcAll(dataList);
    },
    calcByItemTotal(data, dataList){
      //数量变化
      let newData = {};
      for (let key in data) {
        newData[key] = parseFloat(data[key]) ? parseFloat(data[key]) : 0;
      }
      /*税额=税后单价*税率*数量*/
      data.tax = ((newData.after_tax_price * newData.tax_rate * newData.item_total) / 100).toFixed(4);
      /*税后金额=税后单价*数量*/
      data.after_tax_total_price = (newData.after_tax_price * newData.item_total).toFixed(4);
      /*总金额=单价*数量*/
      data.total_price = (newData.price * newData.item_total).toFixed(4);
      return delegateObj.calcEvent.calcAll(dataList);
    }
  },
  getNumber(a){
    var b = Number(a);
    return b ? b : 0;
  },
  isAllEqual(obj){
    /*判断数组是否全部相等
     *参数:
     *array 要比较的数组
     *isIgnore是否忽略大大小写
     * 返回值:
     * true 全部相等，false 不等
     * */
    let arrStr = JSON.stringify(obj.array);
    let firstStr = JSON.stringify(obj.array[0]);
    let flag = true;
    if (obj.array.length > 1) {
      for (var i = 1; i < obj.array.length; i++) {
        let str = JSON.stringify(obj.array[i]);
        if (obj.isIgnore) {
          str = str.toLowerCase();
          firstStr = firstStr.toLowerCase();
        }
        if (firstStr != str) {
          flag = false;
          break;
        }
      }
    }
    return flag;
  },
  isRepeat(obj){
    /*比较数组中是否有重复的元素
     *参数:
     *array 要比较的数组
     *isIgnore是否忽略大大小写
     * 返回值:
     * true有，false 没有
     * */
    let arrStr = JSON.stringify(obj.array);
    let firstStr = JSON.stringify(obj.array[0]);
    let flag = false;
    if (obj.array.length > 1) {
      for (var i = 1; i < obj.array.length; i++) {
        let str = JSON.stringify(obj.array[i]);
        if (obj.isIgnore) {
          str = str.toLowerCase();
          firstStr = firstStr.toLowerCase();
        }
        if (firstStr == str) {
          flag = true;
          break;
        }
      }
    }
    return flag;
  },
  removeRepetition(obj){
    /*去掉数组中重复的元素
     *参数:
     *isIgnore是否忽略大大小写
     * 返回值:
     * result
     * */
    let arrStr = JSON.stringify(obj.array);
    let firstStr = JSON.stringify(obj.array[0]);
    let result = [obj.array[0]], resultStr = JSON.stringify(result)
    if (obj.array.length > 1) {
      for (var i = 1; i < obj.array.length; i++) {
        let str = JSON.stringify(obj.array[i]);
        if (obj.isIgnore) {
          str = str.toLowerCase();
          resultStr = resultStr.toLowerCase();
        }
        if (resultStr.indexOf(str) == -1) {
          result.push(obj.array[i]);
          resultStr = JSON.stringify(result);
        }
      }
    }
    return result;
  },
  diffObjArray(list1, list2, attr){
    //对比两个数组，去掉相同的,返回新数组
    let result = [];
    for (let i = 0; i < list1.length; i++) {
      let obj = list1[i];
      let flag = false;
      for (let k = 0; k < list2.length; k++) {
        if (list2[k][attr] == obj[attr]) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        result.push(obj);
      }
    }
    return result;
  },
  formatImageUrl(imageUrl) {
    if ('' === imageUrl || null === imageUrl) {
      return defaultImage;
    } else {
      return `${baseURL}/wms/profile/${imageUrl}`;
    }
  },
};
var delegateObj = Util;
export {Util}



