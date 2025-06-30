// const isReleaseMode = isRelease()
// const isDebugMode = !isReleaseMode
// const mode = isReleaseMode ? "production" : 'development' // runtimeMode
//
// module.exports = {
//     isReleaseMode,
//     isDebugMode,
//     mode,
// }
//
// function isRelease() {
//     // 开发环境: process.argv[0] = node.exe 路径
//     // 打包环境: process.argv[0] = exe 自身路径
//     // const v = process.argv[0].includes(process.execPath);
//     // console.log('argv[0]', process.argv[0])
//     // console.log('execPath', process.execPath)
//     const v = process.execPath.indexOf('node.exe') === -1;
//     console.log(v ? 'Release 模式' : 'Debug 模式');
//     return v;
// }