// // 测试数据上报
// import {xhrPostUtil} from "../util/xhr";
// import {getUUID} from "../util/uuid";
// import {DotEvent} from "./dot_event";
// import {EventManager} from "./event_manager";
//
// export class DotManager {
//     proxy = null;
//     domain = ''
//     backupDomain = ''
//     isRetryDomain = false  // 重试主域名
//     isRetryBackupDomain = false  // 切换备用域名
//
//     _data = [] // 参数集合
//
//     // 检查请求异常
//     isException = (result) => result['result'] === -1;
//
//     // 用于上报数据的函数
//     reportData(data) {
//         if (this._data.length === 0) {
//             // 此函数会循环调用 避免checkRecords的副作用
//             this._data = [data, ...this.checkRecords()];
//         }
//         const url = this.isRetryBackupDomain ? this.backupDomain : this.domain;
//         // 发送数据请求
//         if(EventManager.debug){
//             console.log('AnalyticsEventSDK', url);
//             console.log('AnalyticsEventSDK', this._data);
//         }
//         this.sendData(url, this._data)
//             .then(result => {
//                 // 检查响应是否为异常
//                 // 普通请求 只新增-1情况的199事件
//                 // 备用请求 成功和失败都上报199事件
//                 if (this.isException(result) || this.isRetryBackupDomain) {
//                     // 数据异常，记录事件ID为199的数据
//                     this.add199Event(result.requestId, true);
//                 }
//             })
//             .catch(error => {
//                 // 超市 和 异常 处理
//                 if (this.isRetryBackupDomain) {
//                     // 备用域名请求失败，记录数据
//                     console.error("向备份域名发送数据失败:", error);
//                     // 这里可以将数据存储在本地，确保不会丢失
//                     // 重新记录所有数据 保证不会丢失
//                     // this.add199Event(null, false); // 减少数据 1.5.0
//                 } else if (this.isRetryDomain) {
//                     // 主域名 第二次结果回调
//                     console.log("切换备用域名...");
//                     // 主域名重试请求失败，切换备用域名
//                     this.isRetryBackupDomain = true;
//                     // this.add199Event(null, false); // 减少数据 1.5.0
//                     this.reportData(data);
//                 } else {
//                     // 主域名 第一次结果回调
//                     console.log("重试使用主域名...");
//                     // 请求超时或其他错误，重试或切换备用域名
//                     this.isRetryDomain = true;
//                     this.add199Event(null, false);
//                     this.reportData(data);
//                     this.handleRequestError(error);
//                 }
//             });
//     }
//
//     // 发送数据请求
//     sendData(url, data) {
//         return new Promise((resolve, reject) => {
//             // setTimeout(() => {
//             //     // 模拟响应
//             //     // resolve({
//             //     //     "result": -1,
//             //     //     "msg": "exception 信息",
//             //     //     "took": 5,
//             //     //     "requestId": "20231109132057_A6697170"
//             //     // });
//             //     resolve({
//             //         "result": 0,
//             //         "msg": "success",
//             //         "took": 5,
//             //         "requestId": "20231109132057_A6697170"
//             //     });
//             // }, 1000);
//             const request = this.proxy ? this.proxy(url, data) : xhrPostUtil(url, data, 5000);
//             request.then(r => resolve(r)).catch(e => {
//                 reject('异常或者超时');
//             })
//         });
//     }
//
//     // 处理请求超时或其他错误
//     handleRequestError(error) {
//         console.error("Request error:", error);
//     }
//
//     // 记录异常数据
//     recordExceptionData() {
//         console.log("Recording exception data:", this._data);
//         if(localStorage.length > 16){
//             return; // 保护内存 最大5M 32是粗略判断使用的
//         }
//         // 可以将异常数据记录在本地，以便下次上报时上报
//         for (const it of this._data) {
//             const key = `report_data___${getUUID()}`;
//             const value = JSON.stringify({'url': this.domain, 'data': it});
//             localStorage.setItem(key, value);
//         }
//         console.log("Recording exception length", localStorage.length);
//     }
//
//     // 便利所有的存储key
//     localStorageForEachKey(callback) {
//         for (let i = 0; i < localStorage.length; i++) {
//             callback(localStorage.key(i));
//         }
//     }
//
//     checkRecords() {
//         // 获取localStorage中所有的键
//         const keys = [];
//         const values = [];
//         this.localStorageForEachKey((key) => {
//             if (key.indexOf('report_data___') !== -1) {
//                 const value = localStorage.getItem(key);
//                 const req = JSON.parse(value);
//                 if (req['url'] === this.domain) {
//                     keys.push(key)
//                     values.push(req['data']);
//                 }
//             }
//         })
//         keys.forEach(key => localStorage.removeItem(key)); // 删除所有的
//         return values;
//     }
//
//     // 数据异常，记录事件ID为199的数据
//     add199Event(requestId, isRemoveCurrentData) {
//         // 删除当前数据(请求有结果情况) 或者 取出当前异常数据(上报异常情况)
//         const exceptionData = isRemoveCurrentData ? this._data.shift() : this._data[0];
//         let bean = new DotEvent();
//         bean.$event_id = 199;
//         bean.$exception = JSON.stringify(exceptionData);
//         bean.$request_id = requestId ?? '';
//         this._data.push(bean.toJSON());
//         this.recordExceptionData();
//     }
// }