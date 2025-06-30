import {ReportManager} from "./report_manager.js";
import {getUUID, getUUID16} from "../util/uuid.js";
import {DotEvent} from "./dot_event";

export const TAG = "AnalyticsEventSDK"

export class EventManager {
    // static key = ''; // 上报的key 等于域名地址
    static getUUID = () => getUUID();
    static getUUID16 = () => getUUID16();

    static coreDomain = 'https://xxx.com/';
    static coreDomainBackup = 'https://xxx.com/';
    static nonCoreDomain = '';
    static nonCoreDomainBackup = '';
    static projectId = '';

    static baseDot = null;
    static proxy = null;
    static debug = false;
    static count = 0

    // 不再采用 非核心域名上报机制 暂时无法实现 还是 数据部同意让都上报到主域名 如果实现 则事件分两个容器 同一批次两个接口同时上报
    // static send(bean) {
    //     const isCore = bean.$event_id < 10000;
    //     const data = bean.toJSON();
    //     const rdi = new DotManager();
    //     rdi.proxy = EventManager.proxy;
    //     rdi.domain = (isCore ? EventManager.coreDomain : EventManager.nonCoreDomain) + EventManager.projectId;
    //     rdi.backupDomain = (isCore ? EventManager.coreDomainBackup : EventManager.nonCoreDomainBackup) + EventManager.projectId;
    //     rdi.reportData(data);
    // }

    static init(options = {}, baseDot, proxyHttp) {
        if (options === null) {
            options = {}; // 兼容 不然 options.coreDomain 报错 如果不传的话
        }

        // EventManager.projectId = projectId;
        EventManager.projectId = `${baseDot.os_type}/${baseDot.app_id}`;
        EventManager.baseDot = baseDot;
        if (proxyHttp) {
            EventManager.proxy = proxyHttp;
        }
        setInterval(() => {
            if (EventManager._dataQueue.length >= 15) {
                // 每秒查询 满足15条就立即上报
                EventManager._reportHandler();
            } else {
                // 不足15条 5秒后收集上报 剩余数据
                if (EventManager._timerInstance === null) {
                    EventManager._timer();
                }
            }
        }, 1000);
    }

    static _timerLock = false; // 每秒上报和每5秒上报 竞争
    static MAX_DATA_SIZE = 30;
    static _dataQueue = [
        // ...Array.from({length: 25}, (_, i) => {
        //     return {
        //         "c_oneid": "",
        //         "brand": "",
        //         "device_model": "",
        //         "benchmarkLevel": -1,
        //         "language": "",
        //         "channel_version": "",
        //         "os_version": "",
        //         "os_type": "android-h5",
        //         "device_id": "",
        //         "sdk_version": "",
        //         "app_id": "40100103",
        //         "channel": "520214",
        //         "app_version": "",
        //         "app_version_code": "",
        //         "union_id": "",
        //         "open_id": "",
        //         "login_from": "",
        //         "h5_param": "",
        //         "$event_id": "10000000",
        //         "$start_time": `test_${i}`,
        //         "$_xxx": "xxx",
        //         "$_xxx2": "xxx2"
        //     }
        // }),
    ];
    static reportManager = new ReportManager();

    static send(bean) {
        EventManager.count++
        if (EventManager._dataQueue.length >= EventManager.MAX_DATA_SIZE) {
            console.warn('本地数据已达到最大容量，后续数据将不会记录');
            return;
        }
        const data = bean.toJSON();
        EventManager._dataQueue.push(data);
    }

    // 立即上报 会附带滞留得数据 可以理解
    static sendNow(bean) {
        EventManager.send(bean);
        EventManager._reportHandler();
    }

    static _timerInstance = null;

    static _timer() {
        // 1）核心事件立即上报；非核心事件5s上报或者满15条上报（考虑存储有限）
        // 2）核心事件和非核心事件上报失败均不用重试
        // 3）非核心事件失败后，下次上报周期时间间隔延长，5s-->10s-->20s
        // 4）域名采用 主主备 模式切换，循环中某步成功则重新开始 主主备
        // 5）单次上报最多15条
        EventManager._timerInstance = setTimeout(() => EventManager._reportHandler(), 5000);
    }

    static _timerReset() {
        clearTimeout(EventManager._timerInstance);
        EventManager._timerInstance = null;
        EventManager._timerLock = false;
    }

    static _reportHandler() {
        if (EventManager._timerLock) {
            EventManager.log(TAG, '等待上一次上报完成');
            return;
        }
        EventManager._timerLock = true;
        const rDate = EventManager.getReportData();
        if (rDate.length === 0) {
            EventManager._timerReset();
            return;
        }
        EventManager.reportManager.proxy = EventManager.proxy;
        EventManager.reportManager.domain = EventManager.coreDomain + EventManager.projectId;
        EventManager.reportManager.backupDomain = EventManager.coreDomainBackup + EventManager.projectId;
        EventManager.reportManager.reportData(rDate)
            .then(result => {
                // EventManager.log(TAG, result); // {"code": 0}
            })
            .catch(error => {
                if (error.code === 1 || error.code === 2 || error.code === 4 || error.code === 5) {
                    for (const it of rDate) {
                        EventManager._dataQueue.push(it);
                    }
                    EventManager.add199Event(error.requestId, rDate);
                } else if (error.code === 3) {
                    EventManager.add199Event(error.requestId, rDate);
                }
                // else if (error.code === 5) {
                //     // 什么也不做
                // }
                EventManager.log(TAG, error);
            })
            .finally(() => {
                EventManager._timerReset();
            });
    }

    // 取出上报数据
    static getReportData() {
        let take;
        const allLength = EventManager._dataQueue.length;
        if (allLength >= 15) {
            take = EventManager._dataQueue.splice(0, 15); // 数组长度大于等于 15，取前 15 条
        } else {
            take = EventManager._dataQueue.splice(0); // 数组长度小于 15，取出所有数据
        }
        if (EventManager.debug && take.length > 0) {
            EventManager.log(
                TAG,
                `全部数据(${allLength}) 取出数据(${take.length})`,
                take.map((item) => item["$event_id"]),
                take,
            );
        }
        return take;
    }

    // 数据异常，记录事件ID为199的数据
    static add199Event(requestId, exceptionData) {
        // 删除当前数据(请求有结果情况) 或者 取出当前异常数据(上报异常情况)
        let bean = new DotEvent();
        bean.$event_id = 199;
        bean.$exception = JSON.stringify(exceptionData);
        bean.$request_id = requestId ?? '';
        EventManager._dataQueue.push(bean.toJSON());
    }

    static log(...arg) {
        if (!EventManager.debug) {
            return;
        }
        console.log('🐛', ...arg);
        // const {emoji, tagColor, msgColor} = {emoji: "\u{1F4CA}", tagColor: "#a855f7", msgColor: "#22d3ee"};
        // tag = emoji + " " + tag;
        // console.log(
        //     `%c${tag} %c${lineTag}`,
        //     `color: ${msgColor}; font-weight: bold; font-size: 20px`,
        //     `color: #facc15; font-weight: bold; font-size: 16px`,
        //     ...arg,
        // );
    }


    /**
    * 暴露的方法实现
    * */
    static track(options) {
        // event 文档可选
        // options = { "type": "0", "event": "", "eventName": "", "extra": {} };
        const type = options.type;
        const extra = options.extra ?? {};
        const eventId = options.event ?? '';
        const eventName = options.eventName ?? '';

        // 拼接其他事件参数
        const eventParams = {
            eventName: eventName,
        }
        // =============================================== 兼容驼峰
        for (const key in extra) {
            let keyCopy = key;
            if (key === 'stepId') {
                keyCopy = 'step_id'
            } else if (key === 'stepName') {
                keyCopy = 'step_name'
            }
            eventParams[keyCopy] = extra[key];
        }
        // =============================================== 兼容end

        // 上报
        if (type === '0') {
            // 非立即上报 自定义打点的 event 从 10000 起往后添加
            EventManager.send(new DotEvent(eventId, eventParams));
        } else if (type === '9') {
            // 立即上报 自定义核心数据上报
            EventManager.sendNow(new DotEvent(eventId, eventParams));
        } else if (type === '1') {
            // 前置事件的type固定为 1
            // 立即上报 核心事件
            EventManager.sendNow(new DotEvent('107', eventParams));
        } else if (type === '2') {
            // 新手引导的type固定为 2
            // 立即上报 核心事件
            EventManager.sendNow(new DotEvent('108', eventParams));
        }
    }

    // 游戏服务端透传数据
    static getTrackingInfo() {
        return {
            "s_oneid": "",
            "c_oneid": EventManager.baseDot.c_oneid,
            "device_id": EventManager.baseDot.device_id,
            "cpsid": "",
            "channel": EventManager.baseDot.channel,
            "os_type": EventManager.baseDot.os_type,
            "language": EventManager.baseDot.language,
            "app_package_name": "",
            "device_model": EventManager.baseDot.device_model,
            "os_version": EventManager.baseDot.os_version,
            "app_version": EventManager.baseDot.app_version,
            "app_version_code": "",
            // h5 新增
            "open_id": EventManager.baseDot.open_id,
            "union_id": EventManager.baseDot.union_id,
            "login_from": EventManager.baseDot.login_from,
            "h5_param": EventManager.baseDot.h5_param,
        };
    }

    // 多主体
    static setHosts(options = {}) {
        if (options.coreDomain && options.coreDomain !== '') {
            EventManager.coreDomain = options.coreDomain + '/';
        }
        if (options.coreDomainBackup && options.coreDomainBackup !== '') {
            EventManager.coreDomainBackup = options.coreDomainBackup + '/';
        }
        if (options.nonCoreDomain && options.nonCoreDomain !== '') {
            EventManager.nonCoreDomain = options.nonCoreDomain + '/';
        }
        if (options.nonCoreDomainBackup && options.nonCoreDomainBackup !== '') {
            EventManager.nonCoreDomainBackup = options.nonCoreDomainBackup + '/';
        }
        EventManager.log(TAG, "设置域名", 'coreDomain=', EventManager.coreDomain, 'nonCoreDomain=', EventManager.nonCoreDomain);
    }

    // 公共字段
    static extraFields = {}
    static setFields(options = {}) {
        for(let key in options){
            EventManager.extraFields[`$${key}`] = options[key];
        }
    }
}