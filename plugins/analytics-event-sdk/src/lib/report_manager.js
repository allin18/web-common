import {xhrPostUtil} from "../util/xhr";
import {TAG} from "./event_manager";

export class ReportManager {
    proxy = null;
    domain = '';
    backupDomain = '';

    domainFailCount = 0;
    backupDomainFailCount = 0;

    // 用于上报数据的函数
    reportData(data) {
        return new Promise((resolve, reject) => {
            let url = '';
            // 如果 主 首次 或者 已失败一次 则使用 主
            if (this.domainFailCount <= 1) {
                url = this.domain
            }
            // 如果 主 已失败二次 则切换 备
            if (this.domainFailCount > 1) {
                url = this.backupDomain
            }
            // // 如果 主 主 备 都失败 则全部丢掉事件
            // if (this.backupDomainFailCount > 0) {
            //     resolve({code: 777});
            //     return;
            // }

            // const complete
            const clearCount = () => {
                if (this.domainFailCount > 0) {
                    this.domainFailCount = 0;
                }
                if (this.backupDomainFailCount > 0) {
                    this.backupDomainFailCount = 0;
                }
            }
            // 顺序不要动 不能写.finally(() => {})里
            const startCount = () => {
                if (url === this.domain) {
                    this.domainFailCount++;
                }
                if (url === this.backupDomain) {
                    this.backupDomainFailCount++;
                }
            }
            if (url.startsWith('___')) {
                // 可以优化为 所有都失效重试的code 以及后续再赋值未成功初始化的数据
                reject({code: 5})
                return
            }
            // 发送数据请求
            this.sendData(url, data)
                .then(result => {
                    // 检查响应是否为异常 数据异常，记录事件ID为199的数据
                    const isException = result['result'] === -1;
                    if (isException) {
                        startCount();
                        // 普通请求 只新增-1情况的199事件
                        if (url === this.domain) {
                            if (this.domainFailCount === 0) {
                                reject({code: 1, requestId: result.requestId});
                            } else if (this.domainFailCount === 1) {
                                reject({code: 2, requestId: result.requestId});
                            } else {
                                // 超过3次就丢弃 也处理不了
                                resolve({code: 0});
                            }
                        }
                        // 备用请求 成功和失败都上报199事件 （未实现成功上报199 ）
                        if (url === this.backupDomain) {
                            clearCount()
                            reject({code: 3, requestId: result.requestId});
                        }
                    } else {
                        clearCount()
                        resolve({code: 0});
                    }
                })
                .catch(error => {
                    startCount();
                    console.error(TAG, error);
                    if (typeof error === 'string' && error.indexOf('request:fail timeout') > -1) {
                        if (url === this.domain) {
                            reject({code: 4}); // 微信超时
                        }
                        if (url === this.backupDomain) {
                            clearCount()
                            reject({code: 5}); // 微信超时 丢弃 代表3次超时
                        }
                    } else if (typeof error === 'object' && error.errMsg.indexOf('超时') > -1) {
                        if (url === this.domain) {
                            reject({code: 4}); // 抖音超时
                        }
                        if (url === this.backupDomain) {
                            clearCount()
                            reject({code: 5}); // 抖音超时 丢弃 代表3次超时
                        }
                    } else if (typeof error === 'object' && error.errMsg.indexOf('time out') > -1) {
                        if (url === this.domain) {
                            reject({code: 4}); // 抖音超时
                        }
                        if (url === this.backupDomain) {
                            clearCount()
                            reject({code: 5}); // 抖音超时 丢弃 代表3次超时
                        }
                    } else {
                        clearCount()
                        resolve({code: 0});
                    }
                });
        });
    }

    // 发送数据请求
    sendData(url, data) {
        return new Promise((resolve, reject) => {
            // setTimeout(() => {
            //     // 模拟响应
            //     // resolve({
            //     //     "result": -1,
            //     //     "msg": "exception 信息",
            //     //     "took": 5,
            //     //     "requestId": "20231109132057_A6697170"
            //     // });
            //     resolve({
            //         "result": 0,
            //         "msg": "success",
            //         "took": 5,
            //         "requestId": "20231109132057_A6697170"
            //     });
            // }, 1000);
            const request = this.proxy ? this.proxy(url, data) : xhrPostUtil(url, data, 5000);
            request.then(r => resolve(r)).catch(e => reject(e))
        });
    }
}