import httpServer from "@src/servers/httpServer";
import {Base64} from "js-base64";

// 有效结果的标识
const effectiveResultFlags = [
    ['code',0],
    ['code', 200],
    ['status', 0],
    ['status', 200],
]
const apiDowngradeList = [
    // 充值页面
    ['/recharge','/api/user/info'],
    // ['/recharge','/common/user/last-pay'], // 最后一次属于实时接口
    ['/recharge','/common/merchant/manner-list'],
    ['/recharge','/common/merchant/game-list'],
    ['/recharge','/unionServer/userRole'],
    ['/recharge','.com/game-list'],
    // 游戏中心页面
    ['/games/center','.com/game-list'],
];


class LocalStorageManager {

    keys = [];

    constructor(config) {
        this.keys = config;
    }
    /*
    *
        LocalStorageManager.set(apis.userInfo, _data);
    * */
    set(url,data={}){
        localStorage.setItem(url,JSON.stringify(data));
    }

    /*
    *
        let val = LocalStorageManager.get(apis.userInfo);
        if(val !== null){
            commit('setUerInfo', val);
        }
    * */
    get(url){
        let val = localStorage.getItem(url);
        if(val){
            return JSON.parse(val);
        }else{
            return null;
        }
    }

    // promise 返回区域
    // runZone(httpServerPromise){
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             let res =  await httpServerPromise;
    //             resolve(res);
    //         } catch (e) {
    //             reject();
    //         }
    //     });
    // }
    // async runZone(apiParams, httpServerPromise){
    //     let key = `${apiParams.url}___${JSON.stringify(apiParams.params)}___${JSON.stringify(apiParams.data)}`
    //     let bo = this.keys.some((item, index, array) => key.indexOf(item) > -1);
    //     if(bo){
    //         let v = null;
    //         let errFunc = () => {
    //             // 错误 404 502 ...
    //             let val = this.get(key);
    //             if(val !== null){
    //                 v = val;
    //             }
    //             LocalStorageManager.log(key,val);
    //         };
    //         await httpServerPromise.then((res) => {
    //             if(res.__proto__.name === 'Error'){
    //                 // axios的Error对象 如：clientweb项目
    //                 errFunc();
    //             }else{
    //                 this.set(key, res);
    //                 v = res;
    //             }
    //         }).catch(e => {
    //             // 这里好像因为上面的返回 一直不会走 如：clientweb项目
    //             errFunc();
    //         });
    //         return v;
    //         // return new Promise(async (resolve, reject) => {
    //         //     try {
    //         //         let res =  await httpServerPromise;
    //         //         this.set(key, res);
    //         //         resolve(res);
    //         //     } catch (e) {
    //         //         let val = this.get(key);
    //         //         if(val !== null){
    //         //             resolve(val);
    //         //         }else{
    //         //             reject();
    //         //         }
    //         //     }
    //         // });
    //     }else{
    //         return await httpServerPromise;
    //     }
    // }

    create(config){
        let key = `${config.url}___${JSON.stringify(config.params)}___${JSON.stringify(config.data)}`
        if(this.isMatch(key)){
            config.sosKey = key;
        }else{

        }
    }

    // check(config){
    //
    // }

    responseSuccess(response){
        let sosKey = response.config.sosKey;
        if(sosKey === undefined) return false;
        /*
        * 考虑 有效结果
        * */
        let isEffectiveResult = false; // 是否是有效结果
        for (const [field, status] of effectiveResultFlags) {
            if(response.data[field] === status){
                isEffectiveResult = true;
                break;  //跳出循环
            }
        }
        if(isEffectiveResult){
            // 有效结果 才储存
            this.set(sosKey, response.data);
        }else{
            // 无效结果 才储存 如: {"code": 000,"data":"111"}
            // 此处考虑是否要捞取正确的值
            let val = this.get(sosKey);
            if(val !== null){
                response.data = val;
            }else {
                // 找不到本地数据就算了
            }
        }
        return true;
    }

    // 返回是否处理过
    responseFail(error){
        let sosKey = error.config.sosKey;
        if(sosKey === undefined) return false;
        // 错误 404 502 ...
        let val = this.get(sosKey);
        if(val !== null){
            // 老版本fiddler抓包修改500数据为空 会有response对象
            // 新版本fiddler everywhere抓包修改500数据为空 不会有response对象 (可能是响应标头返回的东西太少了)
            if(error.response === undefined || error.response.data === ''){
                // 服务错误此时没有response 造一个
                error.response = {status: 200, data: val, description: '服务降级功能,前端模拟的response'};
            }
        }
        LocalStorageManager.log(sosKey,val);
        return true;
    }

    isMatch(key){
        return this.keys.some((item, index, array) => {
            const [href, keyword] = item;
            return location.href.indexOf(href) > -1 && key.indexOf(keyword) > -1;
        });
    }

    static log(value, value2, value3){
        console.groupCollapsed('%c'+'监控上报:','color: orange;font-size: 18px;');  // orange = #ff9800   red
        console.log(value);
        !!value2 && console.log(value2);
        !!value3 && console.log(value3);
        console.groupEnd();
    }

}

const apiDowngradeManager = new LocalStorageManager(apiDowngradeList);
export default apiDowngradeManager;

// return apiDowngradeManager.runZone({
//     url: url,
//     params: config.params,
// }, inst);
// return apiDowngradeManager.runZone({
//     url: url,
//     params: config.params,
//     data: data,
// }, inst);


// // -----------------------------------------------------------------------------test-ui
// if (apiDowngradeManager.test-ui(url)) {
//     return apiDowngradeManager.runZone({
//         url: url,
//         params: config.params,
//     }, Promise.reject())
// }
// // -----------------------------------------------------------------------------
// // -----------------------------------------------------------------------------test-ui
// if (apiDowngradeManager.test-ui(url)) {
//     return apiDowngradeManager.runZone({
//         url: url,
//         params: config.params,
//         data: data,
//     }, Promise.reject())
// }
// // -----------------------------------------------------------------------------