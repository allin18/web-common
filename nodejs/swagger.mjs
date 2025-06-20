import { requestGet } from 'web-common/nodejs/http.js'
import { runCommand } from 'web-common/nodejs/process.js'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = dirname(fileURLToPath(import.meta.url))
import { writeFile } from 'fs/promises'

;(async () => {
  /*
   * 下载swagger
   * */
  const swaggerUrl = 'https://api.xxx.com/swagger/Default/swagger.json'
  const parts = swaggerUrl.split('/');
  const name = (parts[parts.length - 2]).toLowerCase();
  console.log(`接口地址: ${swaggerUrl} name: ${name}`)
  const swaggerText = await requestGet(swaggerUrl)
  const swaggerPath = path.join(__dirname, `${name}.json`)
  await writeFile(swaggerPath, swaggerText, 'utf8')
  console.log(`保存路径: ${swaggerPath}`)

  /*
   * 构建openapi
   * */
  const input = swaggerPath
  const output = path.join(__dirname, name)
  const command = `npx --yes @openapitools/openapi-generator-cli generate -g typescript-axios -i "${input}" -o "${output}"`
  console.log(`构建开始: ${command}`)
  await runCommand(command)
  console.log(`构建结束: 完成`)
})()