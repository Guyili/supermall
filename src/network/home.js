// 首页的所有网络请求

import {request} from "@/network/request";

export function getHomeMultidata () {
  return request({
    url:'/home/multidata'
  })
}
