//重写Object.values方法
Object.values = function (obj) {
  if (obj !== Object(obj))
    throw new TypeError('Object.values called on a non-object');
  let val = [], key;
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      val.push(obj[key]);
    }
  }
  return val;
};
