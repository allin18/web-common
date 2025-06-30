import fs from 'node:fs';
import axios from 'axios';

/*
* 上传文件
* */
export async function uploadFile(CI_USER, CI_PASS, url, filePath) {
    try {
        // const formData = new FormData();
        // const fileContent = fs.readFileSync(filePath);
        // formData.append('file', fileContent, path.basename(filePath));
        const fileData = fs.readFileSync(filePath);
        const config = {
            auth: {
                username: CI_USER,
                password: CI_PASS
            },
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'Content-Type': 'application/octet-stream',
            },
        };
        const response = await axios.put(url, fileData, config);
        // console.log(`HTTP Status Code: ${response.status}`);
        return url;
    } catch (error) {
        if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.error(`HTTP Status Code: ${error.response.status}`);
            console.error(`HTTP Error Url|Data: ${error.config.url} ${error.response.data}`);
        }
        console.error(`HTTP Error Message: ${error.message}`);
        // throw error.message;
    }
}
