import { createRequire } from 'node:module'; // 第1步 mjs 引入 cjs 并使用
const require = createRequire(import.meta.url); // 第2步 mjs 引入 cjs 并使用

import path from 'node:path';
import esbuild, { build } from 'esbuild';
import {es5Plugin} from "esbuild-plugin-es5";

const removeImportsPlugin= {
    name: 'remove-imports-plugin',
    setup(build) {
        build.onResolve({ filter: /.*/ }, (args) => {
            if (args.kind !== 'entry-point') {
                return { path: args.path + '.js', namespace: 'import-ns' }
            }
        });
        build.onLoad({ filter: /.*/, namespace: 'import-ns' }, () => ({
            contents: `// empty string, do nothing`,
            loader: 'js',
        }));
    }
};

/** build as iife, every file will be bundled separately */
export async function buildIifeFile(file) {
    build({
        entryPoints: [file],
        format: 'iife',
        // add Slick to global only when filename `slick.core.js` is detected
        globalName: /slick.core.js/.test(file) ? 'Slick' : undefined,
        define: { IIFE_ONLY: 'true' },
        outfile: `dist/browser/${file.replace(/.[j|t]s/, '')}.js`,
        plugins: [removeImportsPlugin],
    });
}

// bundle in ESM format into single file index.js
export function buildEsm() {
    build({
        entryPoints: ['index.js'],
        format: 'esm',
        target: 'es2020',
        treeShaking: true,
        define: { IIFE_ONLY: 'false' },
        outdir: `dist/esm`,
    });
}

const rebuildCountPlugin = {
    name: 'my-plugin',
    setup(build) {
        const { format } = build.initialOptions;
        let count = 0;
        build.onEnd(result => {
            if (count++ === 0){
                console.log(`${count} first build:`, result);
            }else{
                console.log(`${count} subsequent build:`, result);
            }
        });
    },
};

export async function buildESM(options) {
    const { entryPoints, isWatch } = options;
    const buildOptions = {
        // entryPoints: [ 'src/AnalyticsEventSDK/main.js',],
        entryPoints: entryPoints,
        // outfile: 'dist/AnalyticsEventSDK.js',
        outdir: 'dist',
        // outExtension: { '.js': '.mjs' },
        bundle: true,
        format: 'esm',
        plugins: [rebuildCountPlugin],
        footer: {
            js: '//comment',
            css: '/*comment*/',
        },
    }
    const ctx = await esbuild.context(buildOptions);
    if(isWatch){
        await ctx.watch();
    }else{
        await ctx.rebuild();
        await ctx.dispose();
    }
}
export async function buildIIFE(options) {
    /// 必须以单文件构建
    const { entryPoints, isWatch } = options;
    const basenameWithoutExtension = path.basename(entryPoints, path.extname(entryPoints));
    const buildOptions = {
        entryPoints: [ entryPoints ],
        outfile: `dist/${basenameWithoutExtension}.iife.js`,
        bundle: true,
        format: 'iife',
        globalName: basenameWithoutExtension, // => xxx.default
        // plugins: [rebuildCountPlugin],
        footer: {
            // js: '//comment',
            // 如果 使用 export default 输出到浏览器 xxx.default 解决: https://github.com/evanw/esbuild/issues/1182
            // js: `${basenameWithoutExtension} = ${basenameWithoutExtension}.default;`,
            css: '/*comment*/',
        },
        //=================================================================================================支持输出es5
        plugins: [rebuildCountPlugin, es5Plugin()], // # 1. Use esbuild-plugin-es5
        target: ['es5'], // # 2. Set the target to es5
        alias: { '@swc/helpers': path.dirname(require.resolve('@swc/helpers/package.json')) } // # 3. Set the alias to @swc/helpers
        //=================================================================================================支持输出es5end
    }
    const ctx = await esbuild.context(buildOptions);
    if(isWatch){
        await ctx.watch();
    }else{
        await ctx.rebuild();
        await ctx.dispose();
    }
}