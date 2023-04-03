import axios from 'axios'

export function request(config){
    // 1、创建axios实例
    const instance = axios.create({
      // http://123.207.32.32:7888/api/hy66
      // http://123.207.32.32:8000
      baseURL: 'http://123.207.32.32:7888/api/hy66',
      timeout: 5000
    })
    // 2、axios的拦截器
    //    请求的拦截
    instance.interceptors.request.use(config => {
      // console.log(config);
      // 拦截后的一些操作，比如对header的操作、增加等待动画、增加用户登录判断（token）等
      return config
    }, err => {
      // console.log(err);
    });
    //    响应的拦截
    instance.interceptors.response.use(res =>{
      // console.log(res);
      return res.data
    },err => {
      console.log(err);
    })

    // 3、发送网络请求
    return instance(config)
}
