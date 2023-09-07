import { defineConfig } from "tsup";
import fs from "fs";

export default defineConfig((options) => {
  // get all files from actions folder
  const files = fs
    .readdirSync("./actions")
    .filter((file) => file.endsWith(".ts") && file !== "tsup.config.ts");

  return {
    minify: !options.watch,
    dts: false,
    entry: files.map((f) => `actions/${f}`),
    format: ["cjs"],
    outDir: "./actions/dist",
    target: "node18",
  };
});
