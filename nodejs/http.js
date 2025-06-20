import https from 'node:https'
import http from 'node:http';

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