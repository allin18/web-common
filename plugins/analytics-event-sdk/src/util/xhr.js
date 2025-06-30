export function getJsonHttpUtil(reqUrl) {
    return new Promise((resolve, reject) => {
        const url = `${reqUrl}?v=${Date.now()}`;/*json文件url*/
        const request = new XMLHttpRequest();
        request.open("get", url);/*设置请求方法与路径*/
        request.send(null);/*不发送数据到服务器*/
        request.onload = () => {/*XHR对象获取到返回信息后执行*/
            if (request.status === 200) {/*返回状态为200，即为数据获取成功*/
                const json = JSON.parse(request.responseText);
                resolve(json);
            }
        }
    })
}

export function xhrPostUtil(url, params, timeout) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest(); // 创建 XMLHttpRequest 对象
        xhr.timeout = timeout ?? 15000; // 设置超时时间为3000毫秒，即3秒
        xhr.ontimeout = function () {
            console.error('xhrPostUtil', 'The request for ' + url + ' timed out.');
            reject();
        };
        xhr.open("POST", url); // 设置请求方法和URL
        xhr.setRequestHeader("Content-Type", "application/json"); // 设置请求头，指定发送的是 JSON 数据
        // 监听请求状态的变化
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // 当请求完成且成功时执行的操作
                    // console.log(xhr.responseText);
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    // 当请求异常
                    // 1.客户端异常
                    // 2.跨域请求（CORS）失败
                    // 3.请求被浏览器拦截
                    // 4.请求在发送前被取消
                    // console.error(xhr);
                    reject('请求异常');
                }
            }else{
                // ... 其他情况 不能reject()
            }
        };
        // 将 JavaScript 对象转换为 JSON 字符串
        const dataPayload = JSON.stringify(params);
        // 发送请求
        xhr.send(dataPayload);
    })
}