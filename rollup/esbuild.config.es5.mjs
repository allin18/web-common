import { createRequire } from 'node:module'; // 第1步 mjs 引入 cjs 并使用
const require = createRequire(import.meta.url); // 第2步 mjs 引入 cjs 并使用
import path from 'path';
// esbuild
import esbuild from 'esbuild';
import {es5Plugin} from 'esbuild-plugin-es5';

const isWatch = process.argv.includes('--watch');
console.log(isWatch)

// await esbuild.build({
//     entryPoints: ['src/BasePlugins/main.js'],
//     outfile: 'dist/xxx.js',
//     bundle: true,
//     // watch: process.argv.includes('--watch'),
//     plugins: [es5Plugin()], // # 1. Use esbuild-plugin-es5
//     target: ['es5'], // # 2. Set the target to es5
//     alias: {
//         // # 3. Set the alias to @swc/helpers
//         '@swc/helpers': path.dirname(require.resolve('@swc/helpers/package.json')),
//     }
// });

// const context = await esbuild.context({
//     entryPoints: ['src/BasePlugins/main.js'],
//     outfile: 'dist/xxx.js',
//     bundle: true,
//     plugins: [es5Plugin()], // # 1. Use esbuild-plugin-es5
//     target: ['es5'], // # 2. Set the target to es5
//     alias: {
//         // # 3. Set the alias to @swc/helpers
//         '@swc/helpers': path.dirname(require.resolve('@swc/helpers/package.json')),
//     }
// })
//
// // Manually do an incremental build
// const result = await context.rebuild()
//
// // Enable watch mode
// await context.watch()
//
// // Enable serve mode
// await context.serve()
//
// // Dispose of the context
// context.dispose()

const rebuildCountPlugin = {
    name: 'my-plugin',
    setup(build) {
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
const buildOptions = {
    entryPoints: ['src/AnalyticsEventSDK/main.js'],
    outfile: 'dist/AnalyticsEventSDK.js',
    bundle: true,
    plugins: [es5Plugin(), rebuildCountPlugin], // # 1. Use esbuild-plugin-es5
    target: ['es5'], // # 2. Set the target to es5
    alias: {
        // # 3. Set the alias to @swc/helpers
        '@swc/helpers': path.dirname(require.resolve('@swc/helpers/package.json')),
    }
}
const ctx = await esbuild.context(buildOptions);
if(isWatch){
    await ctx.watch();
}else{
    await ctx.rebuild();
}

await ctx.dispose();







// esbuild
//     .build({
//         // Application.js file, used by Rails to bundle all JS Rails code
//         entryPoints: ['src/BasePlugins/main.js'],
//         outfile: 'dist/xxx.js',
//         bundle: true,
//         // Path to application.js folder
//         absWorkingDir: path.join(process.cwd(), 'app/javascript'),
//         // Destination of JS bundle, points to the Rails JS Asset folder
//         outdir: path.join(process.cwd(), 'app/assets/builds'),
//         // Enables watch option. Will regenerate JS bundle if files are changed
//         watch: process.argv.includes('--watch'),
//         // Split option is disabled, only needed when using multiple input files
//         // More information: https://esbuild.github.io/api/#splitting (change it if using multiple inputs)
//         splitting: false,
//         chunkNames: 'chunks/[name]-[hash]',
//         // Remove unused JS methods
//         treeShaking: true,
//         // Adds mapping information so web browser console can map bundle errors to the corresponding
//         // code line and column in the real code
//         // More information: https://esbuild.github.io/api/#sourcemap
//         sourcemap: process.argv.includes('--development'),
//         // Compresses bundle
//         // More information: https://esbuild.github.io/api/#minify
//         minify: process.argv.includes('--production'),
//         // Removes all console lines from bundle
//         // More information: https://esbuild.github.io/api/#drop
//         drop: process.argv.includes('--production') ? ['console'] : [],
//         // Build command log output: https://esbuild.github.io/api/#log-level
//         logLevel: 'info',
//         // Set of ESLint plugins
//         plugins: [
//             // Plugin to easily import Rails JS files, such as Stimulus controllers and channels
//             // https://github.com/excid3/esbuild-rails
//             rails(),
//             // Configures bundle with Babel. Babel configuration defined in babel.config.js
//             // Babel translates JS code to make it compatible with older JS versions.
//             // https://github.com/nativew/esbuild-plugin-babel
//             babel()
//         ]
//     })
//     .catch(() => process.exit(1))