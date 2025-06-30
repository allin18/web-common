import * as http from 'node:http';
import * as https from 'node:https';
import { URL } from 'node:url';

export const covertHttps = (url) => url.replaceAll("http:", "https:")

/**
 * 发送 JSON POST 请求
 * @param {string} url 请求地址（支持 http 和 https）
 * @param {Object} data 请求体数据（会被 JSON.stringify）
 * @returns {Promise<any>} 返回 JSON 响应
 */
export function postJson(url, data) {
    console.log(`📡 发送 POST 请求: ${url} 数据: ${JSON.stringify(data)}`);
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const isHttps = parsedUrl.protocol === 'https:';
        const lib = isHttps ? https : http;

        const body = JSON.stringify(data);

        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (isHttps ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
            },
        };

        const req = lib.request(options, (res) => {
            let raw = '';
            res.on('data', chunk => raw += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(raw));
                } catch (err) {
                    reject(new Error(`Invalid JSON: ${raw}`));
                }
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

export function requestGet(url) {
    return new Promise((resolve, reject) => {
        const uri = new URL(url)
        const options = {
            hostname: uri.hostname,
            port: 443,
            path: uri.pathname,
            method: 'GET'
        }
        const req = https.request(options, (res) => {
            console.log(`statusCode: ${res.statusCode}`)
            let data = ''
            res.on('data', (chunk) => (data += chunk))
            res.on('end', () => resolve(data))
        })
        req.on('error', (e) => {
            console.error(e)
        })
        req.end()
    })
}

// requestPost