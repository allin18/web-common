import {EventManager} from "./event_manager";

export class DotEvent {
    // 参数置顶 devtools 里好直接看到事件ID
    /*
    * 事件参数 使用$标识
    * */
    $event_id = ""
    $start_time = Date.now().toString()
    // 事件参数 动态 根据上报要求提供动态的key-value
    // $step_id = ""
    // $user_id = ""
    // ...

    /*
    * 设备参数
    * */
    c_oneid = "" // 16位16进制Md5
    brand = "" // 设备品牌
    device_model = "" // 设备型号
    benchmarkLevel = -1 // 设备性能等级（仅 Android）
    language = "" // （微信）设置的语言
    channel_version = "" // （微信）版本号
    os_version = "" // 操作系统版本
    os_type = "" // 客户端平台(android-h5/ios-h5/pc-h5)
    device_id = "" // 设备ID(union_id)
    sdk_version = "" // SDK版本

    /*
    * 应用参数
    * */
    app_id = "" // 数据中心登记app_id，不可变
    channel = "" // 渠道ID，由数据中心及SDK技术部规范分配
    // ip = "" // IP地址
    app_version = "" // app版本
    app_version_code = "" // app细分版本
    union_id = "" // 第三方union_id
    open_id = "" // 第三方openId
    login_from = "" // 第三方场景值
    h5_param = "" // 落地页链接中的参数(通过冷启动接口wx.getLaunchOptionsSync()获得)

    // 自定义参数 TODO 前端自定义的 待实现
    // extendParams = {}

    constructor(eventId = '0', eventParams = {}) {
        // 公共赋值
        if(EventManager.baseDot !== null){
            const baseBeanJSON = EventManager.baseDot.toJSON();
            const json = {...baseBeanJSON, ...EventManager.extraFields}
            for (const key in json) {
                if(key === '$start_time'){
                    continue; // 时间不能删除
                }
                this[key] = json[key]
            }
        }
        // 私有赋值
        this.$event_id = eventId;
        for(let key in eventParams){
            this[`$${key}`] = eventParams[key];
        }
    }

    toJSON() {
        // return JSON.stringify(this);

        // 拷贝当前属性
        // const copiedReport = {};
        // Object.getOwnPropertyNames(report).forEach(prop => {
        //     copiedReport[prop] = report[prop];
        // });

        // 拷贝当前属性
        const copiedReport = {};
        Object.keys(this).forEach(prop => {
            copiedReport[prop] = this[prop];
        });

        return copiedReport;

        // Object.defineProperty() //  定义或者修改属性
    }

    toException() {

    }


    // 1 android
    // 2 ios
    // 3 pc
    static osTypeHelper(platform = 1){
        if (platform === 1) {
            return 'android-h5';
        } else if (platform === 2) {
            return 'ios-h5';
        }  else if (platform === 3) {
            return 'pc-h5';
        }
        return 'h5';
    }
}