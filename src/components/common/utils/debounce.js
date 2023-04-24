export function debounce(func, delay){
  let timer = null

  return function (...args){
    // 如果timer有值的话就清除timer，然后重新计时
    // clearTimeout() 方法可取消由 setTimeout() 方法设置的定时操作
    if (timer) clearTimeout(timer)

    timer = setTimeout( () => {
      func.apply(this,args)
    }, delay)

    // console.log(timer);
  }
}
