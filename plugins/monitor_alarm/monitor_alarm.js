import axios from 'axios'
import { postRecord } from '@src/util/record_replay_manager.js';
import {cookie} from "../../core/src/jssdk/common/util/cookie";



// 埋点文档 
const http_error = 'http_error';
const http_warning = 'http_warning';
const http_slow = 'http_slow';
const cef_slow = 'cef_slow';

// 有效结果的标识
let effectiveResultFlags = [
    ['code', 0],
    ['code', 200],
    ['status', 0],
    ['status', 200],
]

// 基础参数
let reportBaseData = {};


class MonitorAlarm {
    taskId = '';
    createTime = '';
    reqData = {};
    reportData = {};

    constructor(req) {
        this.taskId = this._uuid();
        this.createTime = Date.now();//Math.floor(new Date().getTime() / 1000)
        this.reqData = {
            url: req.url,
            params: req.params || req.data,
            method: req.method,
        };
    }

    setReportData(event_type, event_value, result) {
        // 必须字段
        // if(params.event_type === undefined) return;
        // if(params.event_value === undefined) return;
        // 可以传扩展字段 extend1 extend2 extend3 ...
        let map = this._mergeCommonField();// 合并参数
        map.event_type = event_type;
        map.event_value = event_value; // JSON.stringify('');// 事件信息 捕获到的错误信息，比如error: 502 Bad Gateway
        map.request_url = this.reqData.url;
        if (this.reqData.params !== undefined) {
            map.request_params = JSON.stringify(this.reqData.params) || '';
        } else if (this.reqData.data !== undefined) {
            map.request_params = JSON.stringify(this.reqData.data) || '';
        } else {
            map.request_params = '';
        }
        map.request_result = this._getDataResult(result);
        this.reportData = map
    }

    _getDataResult(result) {
        let res = JSON.stringify(result);
        if (res.length > 2048) {
            return { ...res, data: '数据过长 暂不上报' };
        } else {
            return res;
        }
    }

    _mergeCommonField(obj = {}) {
        if (!reportBaseData.product_name) {
            console.error('未设置 产品名称');
        }
        let account = cookie.getItem('uuzu_account') || ''
        account = window.atob(decodeURIComponent(account))
        return {
            tag: 'collect_front_end_data', // 上报的固定的表名
            /// 基础字段 默认
            'device_id': '',
            'version': '',
            'os': cookie.getItem('os') || '',
            'os_version': '',
            'lang': cookie.getItem('lang') || '',
            'account': account,
            'product_name': '', // 文档
            'branch_company': '',
            'timestamp': Math.floor(new Date().getTime() / 1000),
            /// 预留字段 默认
            'extend1': location.href,
            /// 基础字段 覆盖
            ...reportBaseData,
            /// 业务字段 覆盖
            ...obj,
        }
    }

    _uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
}

class MonitorAlarmManager {
    // httpWarningHook = null; // http错误钩子
    timer = null; // http错误钩子
    currentTimestamp = 0;
    previousTimestamp = 0;
    timeInterval = 10000;
    reportList = [];
    reportListIng = []; // 上报中的队列

    // constructor(config) { }

    init(options) {
        if (options.whitelistCode) {
            effectiveResultFlags = effectiveResultFlags.concat(options.whitelistCode)
        }
        if (options.reportBaseData) {
            reportBaseData = options.reportBaseData;
        }
        // if (hookObj !== undefined) {
        //     if (typeof (hookObj.httpWarningHook) === 'function') {
        //         this.httpWarningHook = hookObj.httpWarningHook;
        //     }
        // }
    }

    taskQueueMap = {};
    collect(params) {
        let item = new MonitorAlarm(params);
        this.taskQueueMap[item.taskId] = item;
        params.monitorAlarm = item;
        return item;
    }

    check(obj) {
        let request, response;
        if (obj.name === 'AxiosError') {
            request = obj.config
            if (obj.response) {
                response = obj.response
            } else {
                // 如果接口异常 比如 500 502 axios是获取不到response （会导致无法上报，设置一个555达到上报的规则）
                // code:"ERR_NETWORK"  message:"Network Error" name:"AxiosError"
                response = { status: 555, data: obj.message };
            }
        } else {
            request = obj.config
            response = obj;
        }
        let { status, data } = response;
        let monitorAlarm = request.monitorAlarm;

        // 接口报错 500 - 600 范围内
        if (status >= 500 && status < 600) {
            monitorAlarm.setReportData(http_error, status, data)
            this.addReport(monitorAlarm.reportData)
            return;
        }

        // 验证200正确 验证301正确 稳妥一点也验证 301 302 303
        let check302 = status >= 301 && status <= 303;
        if (status !== 200 && !check302) {
            monitorAlarm.setReportData(http_warning, status, data)
            this.addReport(monitorAlarm.reportData)
            return;
        }

        // 接口非常规错误码
        // let checkCode = !!data.code && (data.code !== 0 && data.code !== 200); // 有的返回code
        // let checkStatus = !!data.status && (data.status !== 0 && data.status !== 200); // 有的返回status
        let event_value = 555555;
        let checkCode = effectiveResultFlags.some((element) => {
            if (data[element[0]] === element[1]) {
                event_value = element[1];
                return true;
            } else {
                return false;
            }
        })
        if (!checkCode) {
            // if (this.isReport(event_value)) {
            monitorAlarm.setReportData(http_warning, event_value, data)
            this.addReport(monitorAlarm.reportData)
            // }
            return;
        }

        // 接口响应慢(3秒以上)
        let createTime = monitorAlarm.createTime;
        // let afterTime3 = createTime + 3*1000 // if(afterTime3 < Date.now()){...report...}
        let diffTime = Date.now() - createTime;
        if (diffTime > 3 * 1000) {
            monitorAlarm.setReportData(http_warning, event_value, data)
            this.addReport(monitorAlarm.reportData)
            return;
        }
        // CEF加载网页慢
        return;
    }

    taskCompleted() {

    }

    // isReport(event_value) {
    //     if (this.httpWarningHook === null) {
    //         return true;
    //     } else {
    //         return this.httpWarningHook(event_value);
    //     }
    // }

    addReport(reportData) {
        this.reportList.push(reportData);
        this.startCreateTimer();
    }

    startReport() {
        // 实验性质
        this.reportListIng = this.reportList.splice(0);
        let data = this.reportListIng;
        if (location.href.indexOf('#/recharge') > -1) {
            postRecord().then((resUrl) => {
                data = data.map(i => {
                    i['extend2'] = resUrl;
                    return i;
                });
                axios.post('https://collect.gtarcade.com', data).then(r => {
                    this.reportListIng = [];
                    MonitorAlarmManager.log(`队列剩余：${this.reportList.length}`, data);
                });
            })
        } else {
            axios.post('https://collect.gtarcade.com', data).then(r => {
                this.reportListIng = [];
                MonitorAlarmManager.log(`队列剩余：${this.reportList.length}`, data);
            });
        }
        monitorAlarmManager.taskCompleted();//任务完成
    }

    startCreateTimer() {
        this.currentTimestamp = Date.now()
        // console.log(this.currentTimestamp - this.previousTimestamp);
        if (this.currentTimestamp - this.previousTimestamp >= this.timeInterval) {
            if (this.timer !== null) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => this.startReport(), this.timeInterval)
            // console.log('开始计时');
        } else {
            // ... 不会进这里
            // console.log('小于时间间隔 不处理');
        }
        this.previousTimestamp = this.currentTimestamp
    }

    static log(value, value2, value3, value4) {
        console.groupCollapsed('%c' + '监控上报:', 'color: orange;font-size: 18px;');  // orange = #ff9800   red
        console.log(value);
        !!value2 && console.log(value2);
        !!value3 && console.log(value3);
        !!value4 && console.log(value4);
        console.groupEnd();
    }

}

const monitorAlarmManager = new MonitorAlarmManager();
export default monitorAlarmManager;
