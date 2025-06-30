import {EventManager} from './event_manager'
import {DotEvent} from './dot_event'


export {
    EventManager,
    DotEvent,
};

// ================================================ 自在西游报错
// WAGame.js:formatted:14696 MiniProgramError
// ReferenceError: window is not defined
// Error: ReferenceError: window is not defined
// ReferenceError: window is not defined
// at (native-agent.js:390:26)
// at (WAGameSubContext.js:1:131638)
// at Object.runWith (WAGameSubContext.js:1:130395)
// at E (WAGameSubContext.js:1:131616)
// at n (WAGameSubContext.js:1:129599)
// at require (game.js:2:1)
// at (WAGameSubContext.js:1:131638)
// at Object.runWith (WAGameSubContext.js:1:130395)
// at E (WAGameSubContext.js:1:131616)
// at (game.js:356:10)
// ================================================= end
// (() => {
//     //
//     // 适合iife模式 比编译的iife更直接使用
//     //
//     const library = {
//         EventManager,
//         DotEvent,
//     }
//     let globalVariant = null;
//     if (typeof window !== 'undefined') {
//         globalVariant = window; // 浏览器
//     } else if (typeof window === 'undefined' && typeof global !== 'object') {
//         globalVariant = global; // nodejs
//     } else if (typeof window === 'undefined' && typeof GameGlobal !== 'object') {
//         globalVariant = GameGlobal; // 微信小程序 小游戏(特有GameGlobal) TODO 小程序怎么赋值?
//     }
//     for (const key in library) {
//         globalVariant[key] = library[key];
//     }
// })()
















// window.ReportData =

// ReportData.devicesParamsExtend(params => {
//     params.xxx = '';
//     params.xxx = '';
//     params.xxx = '';
//     params.xxx = '';
//     params.xxx = '';
//     return params;
// });

// ReportData.devicesParamsExtend(params => {
//     params.xxx = '';
//     params.xxx = '';
//     params.xxx = '';
//     params.xxx = '';
//     params.xxx = '';
//     return params;
// });

// AnalyticsEventSDK.init('gameId key');
// AnalyticsEventSDK.send(new DotEvent());