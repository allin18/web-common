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
  banner: "// cjs 版本",
  footer: "// cjs 版本",
  define: {
    version: JSON.stringify(version),
  },
});

if (!result.success) {
  console.error("Build failed!\n", result.logs)
  process.exit();
}
