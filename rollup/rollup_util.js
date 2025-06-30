// # 编译为包含自执行函数（'iife'）的 <script>。
// rollup main.js --file bundle.js --format iife
// # 编译为一个 CommonJS 模块 ('cjs')
// rollup main.js --file bundle.js --format cjs
// # UMD 格式需要一个包名
// rollup main.js --file bundle.js --format umd --name "myBundle"

// export default {
// 	input: 'src/main.js',
// 	output: [
// 		{
// 			file: 'dist/bundle.js',
// 			format: 'iife'
// 		},
// 		{
// 			file: 'dist/umd-bundle.js',
// 			format: 'umd',
// 			name: 'xxx',
// 		},
// 		{
// 			file: `dist/umd-bundle.min.js`,
// 			format: 'umd',
// 			name: 'xxx',
// 			plugins: [terser()],
// 		},
// 	]
// };