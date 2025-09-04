import Vue from "vue";

export const isServer = Vue.prototype.$isServer;
/* istanbul ignore next */
const root = isServer ? global : window;

// console.log('isServer===>', isServer)
/* istanbul ignore next */
const iRaf = root.requestAnimationFrame || fallback;

let prev = Date.now();

function fallback(fn) {
  const curr = Date.now();
  const ms = Math.max(0, 16 - (curr - prev));
  const id = setTimeout(fn, ms);
  prev = curr + ms;
  return id;
}

export function raf(fn) {
  return iRaf.call(root, fn);
}

// 滚动到指定位置
export function scrollLeftTo(
  scroller,
  to,
  duration
) {
  let count = 0;
  const from = scroller.scrollLeft;
  const frames = duration === 0 ? 1 : Math.round((duration * 1000) / 16);

  function animate() {
    scroller.scrollLeft += (to - from) / frames;
    if (++count < frames) {
      raf(animate);
    }
  }
  animate();
}