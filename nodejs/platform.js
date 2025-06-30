export const platform = process.platform;

export const isWindows = platform === 'win32'
export const isMac = platform === 'darwin'
export const isLinux = platform === 'linux'

// if (platform === 'win32') {
//     console.log('Windows');
// } else if (platform === 'darwin') {
//     console.log('macOS');
// } else if (platform === 'linux') {
//     console.log('Linux');
// } else {
//     console.log('Other OS:', platform);
// }
