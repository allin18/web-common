// 一、使用Math.random()。
// function getUuid() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//         var r = (Math.random() * 16) | 0,
//             v = c == 'x' ? r : (r & 0x3) | 0x8;
//         return v.toString(16);
//     });
// }

// 二、使用crypto提供的randomUUID方法
// const UUID = crypto.randomUUID();

// 三、使用crypto提供的getRandomValues方法
// function getUuid() {
//     return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
// }

// 实际开发中推荐的方法
export function getUUID() {
    if (typeof crypto === 'object') {
        if (typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        if (typeof crypto.getRandomValues === 'function') {
            try {
                const test = crypto.getRandomValues(new Uint8Array(1));
                if (test && typeof test[0] === 'number') {
                    return ('10000000-1000-4000-8000-100000000000').replace(/[018]/g, (c) => {
                        const num = Number(c);
                        return (num ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> num / 4).toString(16);
                    });
                }
            } catch (e) {
                // fallback to non-crypto version
            }
        }
    }
    // fallback: Math.random-based UUID (not cryptographically secure)
    return generateUUIDv4();
}

function generateUUID() {
    let uuid = '', i, random;
    for (i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid += '-';
        } else if (i === 14) {
            uuid += '4';
        } else if (i === 19) {
            random = Math.random() * 16 | 0;
            uuid += (random & 0x3 | 0x8).toString(16);
        } else {
            random = Math.random() * 16 | 0;
            uuid += random.toString(16);
        }
    }
    return uuid;
}

function generateUUIDv4() {
    let timestamp = Date.now();
    let perfOffset = 0;

    if (typeof performance !== "undefined" && typeof performance.now === "function") {
        // 转为微秒，与 timestamp 单位对齐
        perfOffset = Math.floor(performance.now() * 1000);
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
        let rand = Math.random() * 16;

        if (timestamp > 0) {
            rand = (timestamp + rand) % 16 | 0;
            timestamp = Math.floor(timestamp / 16);
        } else {
            rand = (perfOffset + rand) % 16 | 0;
            perfOffset = Math.floor(perfOffset / 16);
        }

        return (char === "x" ? rand : (rand & 0x3) | 0x8).toString(16);
    });
}

export function getUUID16() {
    return getUUID().replace(/-/g, '').substring(4, 20)
}

export function getUUID8() {
    return getUUID().replace(/-/g, '').substring(8, 16)
}