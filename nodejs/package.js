import fs from "node:fs";
import path from 'node:path'

export function versionPlusPlus() {
    // const packageJson = require('./package.json'); // 假设你是 Node 环境
    const packagePath = path.join('./', 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    const oldVersion = packageJson.version.split('.'); // 例如 ['0', '0', '1']
    const major = parseInt(oldVersion[0], 10);
    const minor = parseInt(oldVersion[1], 10);
    const patch = parseInt(oldVersion[2], 10) + 1; // 尾号 +1

    const newVersion = `${major}.${minor}.${patch}`;
    console.log('version ++', packageJson.version, '->', newVersion);

    packageJson.version = newVersion
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
}