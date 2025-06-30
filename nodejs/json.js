import {pathToFileURL} from "node:url";

export async function importJson(url) {
    // const jsonText = fs.readFileSync(path.join(dir, 'version.json'), 'utf8');
    // return JSON.parse(jsonText);
    // const versionJson = (await import(`./src/version.json`, { assert: { type: "json" } })).default;
    return (await import(pathToFileURL(url), {assert: {type: "json"}})).default;
}