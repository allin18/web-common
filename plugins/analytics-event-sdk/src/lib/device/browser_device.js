const browserInfo = (() => {
    this.baseDot.brand = navigator.userAgent;
    this.baseDot.language = navigator.language;
    return {
        brand: navigator.userAgent,
        language: navigator.language,
    }
})();

// export function setDeviceInfoOnBrowser(bean) {
//     bean.brand = browserInfo.brand;
//     bean.language = browserInfo.language;
// }

/// 考虑这种模式是否可行
/// 各个平台自己实现 每个平台的获取设备方式不一样 放到源码包里会增加无用代码 或者可以采用其他文件扩展包的方式