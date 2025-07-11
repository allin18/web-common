import { glob } from "glob";

const version = (await Bun.$`git rev-parse HEAD`.text())
  .slice(-7)
  .toUpperCase();
console.log(`version: v${version}`);

const result = await Bun.build({
  entrypoints: glob.sync("./nodejs/*.js"),
  outdir: "./nodejs/cjs",
  root: "./nodejs", // 输出时跳出此目录
  format: "cjs",
  target: "node",
  // minify: true,
  banner: "/**!\n\n cjs 版本 \n\n*/",
  footer: "/**!\n\n cjs 版本 end \n\n*/",
  define: {
    version: JSON.stringify(version),
  },
});

if (!result.success) {
  console.error("Build failed!\n", result.logs)
  process.exit();
}
