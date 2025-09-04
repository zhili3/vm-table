
/**
 * 每三位数字加逗号
 */
 export function commaSplice(num) {
  if (!num) return num
  num = num + ''
  const num0 = num.split('.')[0]
  const num1 = num.split('.')[1]
  const reg = /(\d)(?=(?:\d{3})+$)/g
  const str = num1 ? '.' + num1 : ''
  return num0.toString().replace(reg, '$1,') + str
}

/**
 * 防抖
 * @param {string} fn 执行函数
 * @param {number} delay 延迟时间
 */
 export function throttle(delay) {
  let valid = true
  return function (fn) {
    /* 一开始就触发---后续每隔delay时间内只触发一次 */
    if (valid) {
      valid = false // 关闭阀门
      // 如果阀门已经打开，就继续往下
      setTimeout(() => {
        fn.call(this) // 定时器结束后执行
        valid = true // 执行完成后打开阀门
      }, delay)
    }
  }
}


// 判断是否有属性
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}