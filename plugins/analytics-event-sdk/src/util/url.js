/*
* 解析url query 部分 返回 {}
* */
export function getQueryParams (qs) {
  let parts = qs.substring(1).split('&')
  let params = {}

  for (var i = 0; i < parts.length; i++) {
    var nv = parts[i].split('=')
    if (!nv[0]) continue
    params[nv[0]] = decodeURIComponent(nv[1])
  }
  // console.log(params)
  return params
}