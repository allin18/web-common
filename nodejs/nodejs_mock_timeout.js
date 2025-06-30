import * as http from 'node:http';
import {URL} from 'node:url';

// http://localhost:3000/test-timeout?delay=5000

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)

    if (url.pathname === '/test-timeout') {
        const delayParam = url.searchParams.get('delay')
        const delay = parseInt(delayParam, 10) || 0

        console.log(`收到请求 /test-timeout，延迟 ${delay} 毫秒响应...`)

        setTimeout(() => {
            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8'
            })
            res.end(`响应完成（延迟 ${delay} 毫秒）`)
        }, delay + 1000)
    } else {
        res.writeHead(404)
        res.end('Not Found')
    }
})

export function startServer() {
    server.listen(3000, () => {
        console.log('服务运行中：http://localhost:3000')
        console.log('例子：http://localhost:3000/test-timeout?delay=5000')
    })
}
