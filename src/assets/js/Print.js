import TPLShippingData from '@/assets/json/allocatingOutboundData.json';
import TPLSaleData from '@/assets/json/saleOutboundData.json';
import TPLSFCodeData from '@/assets/json/SFcod.json';

let Print = {
  yfList: [
    {
      label: "寄方付",
      value: "1"
    },
    {
      label: "到方付",
      value: "2"
    }
  ],//运费
  sxList: [
    {
      label: "顺丰标快",
      value: "1"
    },
    {
      label: "顺丰特惠",
      value: "2"
    }
  ],//时效
  templateList: [
    {
      label: "开票",
      value: "0"
    },
    {
      label: "不开票",
      value: "1"
    }
  ],//打印模板列表
  sfStrArr: ["顺丰代收-航空", "顺丰代收-陆运", "顺丰速运-航空", "顺丰速运-陆运"],
  printDefault: '',
  printStatus: '',
  printList: [],//打印机列表
  doPrint(printData, reqObj) {
    let doc = [];
    for (let i = 0; i < printData.length; i++) {
      let data = {};
      let _c = printData[i].contents && JSON.parse(printData[i].contents);
      if (_c.code === 1) {
        data = _c.msg.map((item) => {
          return {
            ...JSON.parse(item.print_data),
            waybill_code: item.waybill_code,
            object_id: item.object_id,
          }
        });
      }
      doc.push({
        documentID: JSON.parse(printData[i].documentID),
        contents: [{
          templateURL: printData[i].template_url,
          data: data[0].data,
        }]
      })
    }
    let request = this.getRequestObject("print");    
    request.task = new Object();
    request.task.taskID = this.getUUID(8,10);
    if (reqObj.preview) {
      request.task.preview = reqObj.preview;
      request.task.previewType =reqObj.previewType;
    } else {
      request.task.preview = false;
    }
    request.task.printer = reqObj.printer;
    request.task.documents = doc;
    socket.send(JSON.stringify(request));
  },
  doPrintV2(printer, waybillArray) {
    let request = this.getRequestObject("print");    
    request.task = new Object();
    request.task.taskID = this.getUUID(8,10);
    request.task.preview = false;
    request.task.printer = printer;

    let documents = new Array();
    for(let i = 0; i< waybillArray.length; i++) {
         var doc = new Object();
         doc.documentID = waybillArray[i];
         var content = new Array();
        //  var waybillJson = getWaybillJson(waybillArray[i]);
        //  var customAreaData = getCustomAreaData(waybillArray[i]);
         // content.push({waybillJson,customAreaData});
         content.push({
          "encryptedData": "AES:sqZphfylZBNd8EHQAFCfgYmP69kdZ1iQomiXHR11Dr38FHIp9OYQ/47HUcTzUgu2YQ66yX1Kc3ZGELxU8LJpCy8HQ5UUYVbaSF6N+ClfI3UsItD/w90abYo3rMjiISe59jlU7P7XadDlSHRVTsW1lzUQeW2b7umBbrf5nsQhmgnsRs4Xd71/T5Xs0odYZOrXuodfoohygkbMkDb/X7EpGYwn+nK1LwxI16kf5GQbHfnUN4S1NTHK6KQSOYjwU1G5O5jdknszEB3bHx1EwNHg4XccOb8Oppryjd99yZkGMWIhJd2ctn9ipxBD+deCyu4dL9V3G3N16pJ8yv7KWMo5TJqNeIQSr8XE9fjDIeJ4MUAkFM4ykPH2Ta9uJgchOPn7Fg4phTesr2d+PnQUNFIAP/jMNdyT00/d/TnMa/XqyHfdsn1612K3ea7WU6km99FIb3a8L+TSFqRl4Km77j3bRld9FXW/evf8IAWQCTfrfYYn26dzrAcbBbmV80nVLAc//X1eWefanQZtN6L3qgjrdlkgJfO4v/TWBa6TUT8zOA0lbrCO/mnbclHVMeiWKp9Mr8QUa4uf57vasNsTZZ6nW/FnLUa+9V3IkiazpR6oR2SJzgWxnCF1y7haCaUHxiwYw0JDL41eaXeT9wkOYLVFSIeWrCznanWxLy6/D04cEinMK3v7bkedp0ly7vPiJXhkTV+eQ7eQfuIsknIO7msMt8f/+erA1o8LXShYP3THeU8a5w4ULmq4Iw8/n0MKTvM1MbvFu5/b5R5LZJxcTmgCJHhqa85kI5DuBfaEtksNKB8VuuV2Avlmz52jU0FFCSTbRkGLyVHyNTV5U/TyYnwiyiC0BY1fEN051CkgRxEIRpUFdLtEPb1RUy8MVmFBRONM335mslSzpmPz4FzrNSe1mRxcD2LzXQ8ueKbAnppfLVuU1v9Veg6ReEZUdqEdtfUWobBpQD/JFntXrYAOl5t2ZPfp/vejMY61P3AuCydTzdnsivvzUSuZQ+ilNBxlieHgCwl9NUYpqa1CARXAcHW9k3h3rqHBMJebI5/rLqwCT7XkZo7WAX0IorxmnYKvsxpXFRgykNdyQoXKEev+jLGr2ilePxZOqg0FnhA/qhhh3V4GEIsdGE/FfS+IEGLgR2VFnDVqS+/6yg6Z/Q3/Z/4Ao7HnbfZEezczv3Zh0HXw/vW9cW7JyaoGc074XFSMlpqEaBoCxulvmSJewWX7T/6SSWOe2zpLAphyGBHlwjb3+HrpbfZYMkHpzqztnx1KxRijw3ZyftKo2IBDmGmlbteufqsinJQSkc2biS0aCNF4nWmMEpCusJH+1fo+h5FFxC6D4qq964NLlpYo9506O6wEdSLMtyjwUjGc0awrCOCBqCmCQKcmKJ99NsghyxtK4Xj3brec87mCaUow/8agH3F/cR+cR7i+0kedyCSy/LcgU9Y=",
          "signature": "MD:jcPOktTeXcdW3+arHpaOBA==",
          'templateURL': waybillArray[i].logcompUrl,
         });
         doc.contents = content;
         documents.push(doc);
    }
    request.task['documents'] = documents;
    console.log(request);
    socket.send(JSON.stringify(request));
    // socket.send(JSON.stringify(request));
  },
 /***
   * 
   * 获取请求的UUID，指定长度和进制,如 
   * getUUID(8, 2)   //"01001010" 8 character (base=2)
   * getUUID(8, 10) // "47473046" 8 character ID (base=10)
   * getUUID(8, 16) // "098F4D35" 8 character ID (base=16)
   *   
   */
  getUUID(len, radix) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [], i;
    radix = radix || chars.length;
    if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      let r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  },
  fhmxCheckStock(context, req, cb){//发货明细打印检查库存
    context.$ajaxPost("Erp/System/printRes", req).then(res => {
      if (res.data.code == 1) {
        context.$message({
          type: "success",
          message: res.data.msg
        });
        if (cb) cb(res.data);
      } else {
        context.$alert(res.data.msg, '错误提示', {
          confirmButtonText: '确定',
          type: "error"
        }).catch({});
      }
      if(res.data.error.length){   //假如 有报错信息，就提示出来
        let msg = res.data.error.map(item => {
          return item.msg;
        });
        context.$alert(msg.toString(), '错误提示', {
          confirmButtonText: '确定',
          type: "error"
        }).catch({});
      }
    })
  },
  doFhmxPrint(context, req, cb){//发货明细打印走接口
    let msg = "";
    if (req.printer == "") {
      msg = "请选择打印机名称";
    } else if (req.num < 1) {
      msg = "打印份数不能小于1！";
    } else if (req.type == "") {
      msg = "请选择打印类型！";
    }
    if (msg != "") {
      context.$alert(msg, '错误提示', {
        confirmButtonText: '确定',
        type: "error"
      }).catch({});
    } else {
 
      if (req.store_owner == '32' && req.bill_num != ""){
        context.$ajaxPost("Erp/System/printOutPageZy", req).then(res => {
          if (res.data.code == 1) {
            doSend(JSON.stringify(res.data.data), function () {
              context.$message({
                type: "success",
                message: res.data.msg
              });
              let logReq = {
                order_no: req.order_nos,
                content: req.action
              };
              context.$Util.logAjax(context, logReq);
              if (cb) cb();
            });
          } else {
            context.$alert(res.data.msg, '错误提示', {
              confirmButtonText: '确定',
              type: "error"
            }).catch({});
          }
        })
      }else {
        context.$ajaxPost("Erp/System/printOutPage", req).then(res => {
          if (res.data.code == 1) {
            doSend(JSON.stringify(res.data.data), function () {
              context.$message({
                type: "success",
                message: res.data.msg
              });
              let logReq = {
                order_no: req.order_nos,
                content: req.action
              };
              context.$Util.logAjax(context, logReq);
              if (cb) cb();
            });
          } else {
            context.$alert(res.data.msg, '错误提示', {
              confirmButtonText: '确定',
              type: "error"
            }).catch({});
          }
        })
      }
    }
  },
  getRestNumber(context, req){//获取剩余数量 只能选中一条数据
    req.user_id = context.$Cookies.get("user_id");
    req.token = context.$Cookies.get("token");
    let result = {};
    $.ajax({
      url: context.$baseURL + "/Erp/Order/getWaybillInfo",
      data: req,
      type: "POST",
      dataType: "JSON",
      async: false,
    }).done(res => {
      if (res.code == 1) {
        result = res.data;
      } else {
        context.$message({
          type: "error",
          message: res.msg
        });
      }
    });
    return result;
  },
  // 物流打印判断
  switchWlPrint(context, req, cb, selectedList){
    let msg = "";
    if (!req.printer) {
      msg = "请选择打印机！"
    }
    if (msg != "") {
      context.$alert(msg, '错误提示', {
        confirmButtonText: '确定',
        type: "error"
      }).catch({});
      return;
    }
    let logisticsName = "";
    if (selectedList) {
      logisticsName = selectedList[0].logistics;
    } else {
      logisticsName = req.logisticsName;
    }
    if (delegateObj.sfStrArr.indexOf(logisticsName) > -1) {//顺丰物流
      let sfMsg = "";
      if (!req.pay_method) {
        sfMsg = "请选择运费！";
      }
      if (sfMsg != "") {
        context.$alert(sfMsg, '错误提示', {
          confirmButtonText: '确定',
          type: "error"
        }).catch({});
        return;
      }
      delete req.logisticsName;
      delegateObj.doSfWlPrint(context, req, (res) => {
        if (cb) cb(res, "sf");
      });
    } else if (logisticsName.indexOf("京东") > -1) {//京东物流
      delete req.logisticsName;
      delegateObj.doJdWlPrint(context, req, (res) => {
        if (cb) cb(res, "jd");
      });
    } else {//普通物流
      /*京东来源&&圆通、中通、韵达*/
      if((logisticsName =="圆通快递"||logisticsName =="中通快递"||logisticsName =="韵达快递")&&req.source==1){
        delete req.logisticsName;
        delete req.source;
        delegateObj.doJdSourceWlPrint(context, req, (res) => {
          if (cb) cb(res, "jdsource");
        })
      }else{
        delete req.logisticsName;
        delegateObj.doNormalWlPrint(context, req, (res) => {
          if (cb) cb(res, "normal");
        })
      }
    }
  },
  doJdSourceWlPrint(context, req, cb){//物流打印（京东来源&&圆通、中通、韵达）
    context.$ajaxPost("Erp/Order/getJdWjLogistic", req).then(res => {
      if (res.data.code == 1) {
        if (res.data.error.length == 0) {
          context.$message({
            type: "success",
            message: res.data.msg
          });
        } else {
          context.$Util.getErrorMsg(context, res.data.error, "orderid");
        }
      } else {
        context.$alert(res.data.msg, '错误提示', {
          confirmButtonText: '确定',
          type: "error"
        }).catch({});
      }
      if (res.data.success.length > 0) {
        for (let i = 0; i < res.data.success.length; i++) {
          doSend(JSON.stringify(res.data.success[i]));
        }
      }
      let logids = [];
      if (res.data.okorder.length > 0) {
        res.data.okorder.forEach(item => {
          logids.push(item.orderid)
        });
        let logReq = {
          order_no: logids.toString(),
          content: req.action
        };
        context.$Util.logAjax(context, logReq);
      }
      if (cb) cb(res.data);
    })
  },
  doJdWlPrint(context, req, cb){//物流打印（京东）
    context.$ajaxPost("Erp/order/getJdLogistic", req).then(res => {
      if (res.data.code == 1) {
        if (res.data.error.length == 0) {
          context.$message({
            type: "success",
            message: res.data.msg
          });
        } else {
          context.$Util.getErrorMsg(context, res.data.error, "orderid");
        }
      } else {
        context.$alert(res.data.msg, '错误提示', {
          confirmButtonText: '确定',
          type: "error"
        }).catch({});
      }
      if (res.data.success.length > 0) {
        for (let i = 0; i < res.data.success.length; i++) {
          doSend(JSON.stringify(res.data.success[i]));
        }
      }
      let logids = [];
      if (res.data.okorder.length > 0) {
        res.data.okorder.forEach(item => {
          logids.push(item.orderid)
        });
        let logReq = {
          order_no: logids.toString(),
          content: req.action
        };
        context.$Util.logAjax(context, logReq);
      }
      if (cb) cb(res.data);
    })
  },
  doSfWlPrint(context, req, cb){//物流打印（顺丰）
    context.$ajaxPost("Erp/order/printSfLogistic", req).then(res => {
      if (res.data.code == 1) {
        if (res.data.errorlist.length == 0) {
          context.$message({
            type: "success",
            message: "打印成功!"
          });
        } else {
          context.$Util.getErrorMsg(context, res.data.errorlist);
        }
        let logids = [];
        if (res.data.okorder.length > 0) {
          res.data.okorder.forEach(item => {
            logids.push(item.orderid)
          })
          let logReq = {
            order_no: logids.toString(),
            content: req.action
          };
          context.$Util.logAjax(context, logReq);
        }
      } else {
        context.$alert(res.data.msg, '错误提示', {
          confirmButtonText: '确定',
          type: "error"
        }).catch({});
      }
      if (res.data.success.length > 0) {
        for (var i = 0; i < res.data.success.length; i++) {
          doSend(JSON.stringify(res.data.success[i]));
        }
      }
      if (cb) cb(res.data);
    })
  },
  // 物流打印（常规）
  doNormalWlPrint(context, req, cb){
    context.$ajaxPost("Erp/order/printLogistic", req).then(res => {
      if (res.data.code == 1) {
        this.doPrint(res.data, req);
        let logReq = {
          order_no: req.order_nos,
          content:req.action
        };
        context.$Util.logAjax(context, logReq);
        if (res.data.errorlist.length == 0) {
          context.$message({
            type: "success",
            message: res.data.msg
          });
        } else {
          context.$Util.getErrorMsg(context, res.data.errorlist);
        }
      } else {
        context.$alert(res.data.msg, '错误提示', {
          confirmButtonText: '确定',
          type: "error"
        }).catch({});
      }
      if (cb) cb(res);
    })
  },
  formatData(item) {
    let printArray;
    // data.forEach((item, index) => {
      if (item.type === 1) {
        printArray = JSON.parse(JSON.stringify(TPLSaleData));
      } else if (item.type === 2) {
        printArray = JSON.parse(JSON.stringify(TPLShippingData));
      }
      printArray.Tables.forEach((_t) => {
        if (_t.Name === 'OneToOne') {
          _t.Data = item.lord[0];
        } else if (_t.Name === 'OneToMany') {
          console.log(item.skuList)
          _t.Data = item.skuList;
        }
      });
    // });
    return printArray;
  },
  formatExpressData(item) {
    let printArray;
    printArray = JSON.parse(JSON.stringify(TPLSFCodeData));
    console.log(printArray);
    // data.forEach((item, index) => {
      printArray.Tables.forEach((_t) => {
        if (_t.Name === 'OneToOne') {
          // let tplData = JSON.parse(JSON.parse(item.contents).msg[0].print_data).data;
          _t.Data = item
          // _t.Data.push({
          //   '条码': `${tplData.waybillCode}`,
          //   '目的地': `${tplData.recipient.address.province} ${tplData.recipient.address.city} ${tplData.recipient.address.district} ${tplData.recipient.address.detail}`,
          //   '收件人': `${tplData.recipient.name}`,
          //   '收件人电话': `${tplData.recipient.mobile}`,
          //   '收件人地址': `${tplData.recipient.address.province} ${tplData.recipient.address.city} ${tplData.recipient.address.district} ${tplData.recipient.address.detail}`,
          //   '发件人': `${tplData.sender.name}`,
          //   '发件人电话': `${tplData.sender.phone}`,
          //   '发件人地址': `${tplData.sender.address.province} ${tplData.sender.address.city} ${tplData.sender.address.district} ${tplData.sender.address.detail}`,
          // });
        }
      });
    // });
    return printArray;
  },
  doConnect() {
    // 如果是https的话，端口是13529
    let socket = new WebSocket('ws://localhost:13528');
    return socket;
  },
  getRequestObject(cmd) {
    let request = new Object();
    request.requestID = this.getUUID(8, 16);
    request.version = "1.0";
    request.cmd = cmd;
    return request;
  },
};

let socket = Print.doConnect();
let request = Print.getRequestObject('getPrinters');
socket.onopen = (event) => {
    socket.send(JSON.stringify(request));
    socket.onmessage =  (event) => {
        let data = JSON.parse(event.data);
        Print.printDefault = data.defaultPrinter;
        Print.printStatus = '准备就绪';
        if ('getPrinters' === data.cmd) {
          Print.printList = data.printers.map((item) => {
            return {
                value: item.name,
                label: item.name,
            }
          });
        } else if ('print' === data.cmd) {
          if ('成功' === data.msg) {
            console.log(data.msg);
          }
        }
    };
    socket.onclose = (event) => {
        console.log('Client notified socket has closed',event);
        // this.printStatus = '无法连接';
    };
};

var delegateObj = Print;
export {
  Print
}
