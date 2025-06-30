import { record, Replayer, getRecordConsolePlugin, getReplayConsolePlugin, pack, unpack } from "rrweb"
// rrweb 自带的回放只提供所有的 JS API 以及最基本的 UI，如果需要功能更强的回放播放器 UI，可以使用 rrweb-player。
// import 'rrweb/dist/rrweb.min.css'; // 回放时需要引入对应的 CSS 文件
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';
//
import axios from 'axios'
const JSZip = require('jszip');

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:8083/api',
    timeout: 99999,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    // headers: {'Content-Type': 'multipart/form-data'}
})

//将字符串 转换成 Blob 对象
const str2JsonBlob = (str) => {
    // const bin = Uint8Array.from([10, 20, 30, 40, 50])
    // const blob = new Blob([bin], { type: "application/octet-stream" })
    const blob = new Blob([str], { type: 'application/json' }) // application/json text/plain application/zip
    const getUuid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    // const UUID = window.crypto.randomUUID();
    const UUID = getUuid();
    const file = new File([blob], `${UUID}.json`, { type: "application/json" })
    return file;
};

async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.get(`https://microsdk-api.y-------------o-------------u-------------z-------------u.com/upload/token`);
    let uploadUrl = res.data.data.upload_url;
    const http = 'http:'
    if (uploadUrl.indexOf(http) > -1) {
        uploadUrl = uploadUrl.replaceAll(http, 'https:')
    }
    return axiosInstance.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
        if (res.data.code !== 0) {
            console.error(res.data);
            throw res.data.message;
        } else {
            return res.data.data.url;
        }
    })
}

//----------------------------------------------------------------------------------------------------main

// 使用二维数组来存放多个 event 数组
const eventsMatrix = [[]];

// 向后端传送最新的两个 event 数组
export function postRecord() {
    const len = eventsMatrix.length;
    // const events = eventsMatrix[len - 2].concat(eventsMatrix[len - 1]);
    let events = [];
    if (len >= 2) {
        events = eventsMatrix[len - 2].concat(eventsMatrix[len - 1]);
    } else {
        events = eventsMatrix[len - 1];
    }
    const body = JSON.stringify({ events });
    return new Promise((resolve, reject) => {
        const zip = new JSZip();
        zip.file('logs.json', body);
        // zip.file('hello.txt', 'Hello world\n');
        // var img = zip.folder("images");
        // img.file("smile.gif", imgData, {base64: true});
        zip.generateAsync({ type: "blob" }).then(function (content) {
            // see FileSaver.js
            // saveAs(content, "example.zip");
            const blob = content;
            const file = new File([blob], 'example.zip', { type: content.type })
            uploadFile(file).then(function (resUrl) {
                console.log(resUrl);
                resolve(resUrl);
            });
        });
    });
}

export function createRecord() {
    record({
        emit(event, isCheckout) {
            // isCheckout 是一个标识，告诉你重新制作了快照
            if (isCheckout) {
                eventsMatrix.push([]);
            }
            const lastEvents = eventsMatrix[eventsMatrix.length - 1];
            lastEvents.push(event);
        },
        checkoutEveryNms: 5 * 60 * 1000, // 每5分钟重新制作快照
        packFn: pack, //压数据
        // 使用默认的配置选项
        plugins: [getRecordConsolePlugin({
            level: ['info', 'log', 'warn', 'error'],
            lengthThreshold: 10000,
            stringifyOptions: {
                stringLengthLimit: 1000,
                numOfKeysLimit: 100,
                depthOfLimit: 1,
            },
            logger: window.console,
        })],
    });
    window.onerror = postRecord;

    const globalPromiseRejectionHandler = (event) => {
        console.error('全局捕获[Promise.reject]', event.reason);
    }
    // 这个函数处理任何未处理的Promise.reject
    window.onunhandledrejection = globalPromiseRejectionHandler;

    // setTimeout(postRecord, 1000);// test-ui
    // https://oss.yxxxoxxxuxxxzxxxu.com/microsdk/36dcd30b-290e-4fa9-91e8-9fde38020604.zip
}

let rrwebPlayerInstance = null
export function createReplayer(events, el) {
    // const replayer = new Replayer(events, {
    //     root: el || document.body, // 可以自定义 DOM 元素
    //     plugins: [
    //         getReplayConsolePlugin({
    //             level: ['info', 'log', 'warn', 'error'],
    //         }),
    //     ],
    // });
    // replayer.play();

    if (rrwebPlayerInstance !== null) {
        try {
            rrwebPlayerInstance.destroy();
        } catch (e) {
            rrwebPlayerInstance.pause();
            rrwebPlayerInstance = null
            el.innerHTML = ''
        }
    }
    rrwebPlayerInstance = new rrwebPlayer({
        target: el || document.body, // 可以自定义 DOM 元素
        // 配置项
        props: {
            events: events,
            UNSAFE_replayCanvas: true, // 开启后将会关闭沙盒策略，导致一定风险 Blocked script execution in 'https://xxx.com/xxx/' because the document's frame is sandboxed and the 'allow-scripts' permission is not set.
            unpackFn: unpack, //解压数据
            plugins: [
                getReplayConsolePlugin({
                    level: ['info', 'log', 'warn', 'error'],
                }),
            ],
        },
    });
}

export function utilLoadZip(zipUrl) {
    return fetch(zipUrl)
        .then(res => res.blob())
        .then(JSZip.loadAsync)
        .then(function (zip) {
            return zip.file("logs.json").async("string");
        })
        .then(function success(text) {
            const logs = JSON.parse(text)
            return logs.events;
        }, function error(e) {
            throw 'readNetWorkZip';
        });
}