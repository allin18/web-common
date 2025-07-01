import path from "node:path";
export const isReleaseMode = isRelease()
export const isDebugMode = !isReleaseMode
export const mode = isReleaseMode ? "production" : 'development' // runtimeMode
function isRelease() {
    // 开发环境: process.argv[0] = node.exe 路径
    // 打包环境: process.argv[0] = exe 自身路径
    // const v = process.argv[0].includes(process.execPath);
    // console.log('argv[0]', process.argv[0])
    // console.log('execPath', process.execPath)
    const v = process.execPath.indexOf('node.exe') === -1;
    console.log(v ? 'Release 模式' : 'Debug 模式');
    return v;
}

/*
* 线上默认都是当前exe根目录 本地都默认是dist目录 方便输出
* */
export const workDir = isReleaseMode ? path.dirname(process.execPath) : path.join(process.cwd(), 'dist')