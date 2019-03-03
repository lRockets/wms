/*公用url地址，不要修改*/
(function () {
  /*function Util() {

  }

  Util.prototype.addDotToNumber = function (num, dotLength) {
    dotLength = dotLength || 2;
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) num = "0.00";
    var sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * Math.pow(10, dotLength) + 0.50000000001);
    var cents = num % Math.pow(10, dotLength);
    num = Math.floor(num / Math.pow(10, dotLength)).toString();
    if (dotLength == 2) {
      if (parseInt(cents) < 10) cents = '0' + cents;
    }
    if (dotLength == 3) {
      if (parseInt(cents) < 10) cents = '00' + cents;
      if (10 < parseInt(cents) && parseInt(cents) < 100) cents = '0' + cents;
    }
    if (dotLength == 4) {
      if (parseInt(cents) < 10) cents = '000' + cents;
      if (10 <= parseInt(cents) && parseInt(cents) < 100) cents = '00' + cents;
      if (100 <= parseInt(cents) && parseInt(cents) < 1000) cents = '0' + cents;
    }
    for (var i = 0; i < Math.floor((num.length - ( 1 + i )) / 3); i++)
      num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    // if(isCents == false) return (((sign)? '' : '-') + num);
    return (((sign) ? '' : '-') + num + '.' + cents);
  };
  Util.prototype.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
  };
  Util.prototype.getDateByDateString = function (dataString) {
    var arr = dataString.replace(/-| |:/g, ',').split(',');
    var date = new Date(arr[0], parseInt(arr[1]) - 1, arr[2], arr[3], arr[4], arr[5]);
    return date;
  };*/

  /* ----- Date ----- */
  /**
   * Format a date as 'yyyy/MM/dd hh/mm'
   */
  Date.prototype.formatDateAndTime = function () {
    return (this.formatDate() +
    '\u00A0\u00A0' +
    (this.getHours() < 10 ? '0' + this.getHours() : this.getHours()) +
    ':' + (this.getMinutes() < 10 ? '0' + this.getMinutes() : this.getMinutes()) +
    ':' + (this.getSeconds() < 10 ? '0' + this.getSeconds() : this.getSeconds())).replace(/\s+/g, ' ');
  };
  //转换 时分秒 0点0分0秒
  Date.prototype.formatDateAndTimeStart = function(){
    return (this.formatDate()+
    '\u00A0\u00A0'+"00:00:00").replace(/\s+/g, ' ');
  };
  //转换 时分秒 23点59分59秒
  Date.prototype.formatDateAndTimeEnd = function(){
    return (this.formatDate()+
    '\u00A0\u00A0'+"23:59:59").replace(/\s+/g, ' ');
  };
  Date.prototype.setYesterdayFirst = function () {
    this.setDate(this.getDate() - 1);
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    return this;
  }
  Date.prototype.setTodayLast = function () {
    this.setHours(23);
    this.setMinutes(59);
    this.setSeconds(59);
    return this;
  }
  //获取昨天0点
  Date.prototype.getYesterdayFirst = function () {
    this.setDate(this.getDate() - 1);
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    return this.formatDateAndTime().replace(/\s+/g, ' ');
  };
  //获取昨天23点
  Date.prototype.getYesterdayLast = function () {
    this.setDate(this.getDate() - 1);
    this.setHours(23);
    this.setMinutes(59);
    this.setSeconds(59);
    return this.formatDateAndTime().replace(/\s+/g, ' ');
  };
  //获取今天0点
  Date.prototype.getTodayFirst = function () {
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    return this.formatDateAndTime().replace(/\s+/g, ' ');
  };
  //获取今天23点
  Date.prototype.getTodayLast = function () {
    this.setHours(23);
    this.setMinutes(59);
    this.setSeconds(59);
    return this.formatDateAndTime().replace(/\s+/g, ' ');
  };
  /*获取一周前 0点
  例 当前时间为2018-02-23
  通过new Date().getPrevWeekFirst()调用
  得到结果2018-02-16 00:00:00"*/
  Date.prototype.getPrevWeekFirst = function () {
    let nowdate = new Date();
    let newdate = new Date(nowdate-7*24*3600*1000);
    newdate.setHours(0);
    newdate.setMinutes(0);
    newdate.setSeconds(0);
    return newdate.formatDateAndTime().replace(/\s+/g, ' ');
  };
  //获取一个月前 0点
  Date.prototype.getPrevMonthFirst = function () {
    let nowdate = new Date();
    nowdate.setMonth(nowdate.getMonth()-1);
    nowdate.setHours(0);
    nowdate.setMinutes(0);
    nowdate.setSeconds(0);
    return nowdate.formatDateAndTime().replace(/\s+/g, ' ');
  };
  Date.prototype.getPrevMonth = function () {
    let nowdate = new Date();
    nowdate.setMonth(nowdate.getMonth()-1);
    return nowdate.formatMonth();
  };
  /**
   * Format a date as 'MM-dd hh:mm'
   */
  Date.prototype.formatShortDateAndTime = function () {
    return (((this.getMonth() + 1) < 10 ? '0' + (this.getMonth() + 1) : (this.getMonth() + 1)) +
    '-' + (this.getDate() < 10 ? '0' + this.getDate() : this.getDate()) +
    '\u00A0\u00A0' +
    (this.getHours() < 10 ? '0' + this.getHours() : this.getHours()) +
    ':' + (this.getMinutes() < 10 ? '0' + this.getMinutes() : this.getMinutes())).replace(/\s+/g, ' ');
  };
  /**
   * Format a date as 'yyyy/MM/dd'
   */
  Date.prototype.formatDate = function (divider) {
    divider = divider || '-';
    return this.getFullYear() + divider + this.formatShortDate(divider);
  };
  /**
   * Format a date as 'yyyy/MM/'
   */
  Date.prototype.formatMonth = function (divider) {
    divider = divider || '-';
    return this.getFullYear() + divider + ((this.getMonth() + 1) < 10 ? '0' + (this.getMonth() + 1) : (this.getMonth() + 1));
  };
  /**
   * Format a date as 'MM/dd'
   */
  Date.prototype.formatShortDate = function (divider) {
    divider = divider || '-';
    return ((this.getMonth() + 1) < 10 ? '0' + (this.getMonth() + 1) : (this.getMonth() + 1)) +
      divider + (this.getDate() < 10 ? '0' + this.getDate() : this.getDate());
  };

  Date.prototype.format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  };


 /* window.Util = new Util();*/
}());
