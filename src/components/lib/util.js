export const formatDate = function (time, fmt) {
  if (time) {
    if (!fmt)
      fmt = "yyyy-MM-dd";
    let date = new Date(time);
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      }
    }
    return fmt;
  } else
    return "";
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}


export const TMap = function (key) {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(qq) //注意这里
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://map.qq.com/api/js?v=2.exp&callback=init&key=" + key;
    script.onerror = reject;
    document.head.appendChild(script);
  })
}
