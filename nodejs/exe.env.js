

    /*
    * 线上默认都是当前exe根目录 本地都默认是dist目录 方便输出
    * */
// export const workDir = isReleaseMode ? path.dirname(process.execPath) : path.join(process.cwd(), 'dist')