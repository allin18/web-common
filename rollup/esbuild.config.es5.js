const path = require('path');
const esbuild = require('esbuild');
const {es5Plugin} = require('esbuild-plugin-es5');

esbuild.build({
    entryPoints: ['src/AnalyticsEventSDK/main.js'],
    bundle: true,
    outfile: 'dist/AnalyticsEventSDK.js',
    plugins: [es5Plugin()], // # 1. Use esbuild-plugin-es5
    target: ['es5'], // # 2. Set the target to es5
    alias: {
        // # 3. Set the alias to @swc/helpers
        '@swc/helpers': path.dirname(require.resolve('@swc/helpers/package.json')),
    }
});
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