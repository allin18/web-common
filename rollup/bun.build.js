const version = (await Bun.$`git rev-parse HEAD`.text()).slice(-7).toUpperCase();
console.log(`${version} v${version}`);

const result = await Bun.build({
    entrypoints: ['./src/wx/main.js'],
    outdir: './build',
    // naming: "[dir]/[name].[ext]", // default

    // minify: true,
    banner: '"use client";', // 类似代码许可证的注释块
    footer: '// built with love in SF', // 页脚的注释块
    drop: ["debugger", "anyIdentifier.or.propertyAccess"], // 从包中删除函数调用

    define: {
        version: JSON.stringify(version)
    }
})

if (!result.success) process.exit(console.error('Build failed!\n', result.logs));
