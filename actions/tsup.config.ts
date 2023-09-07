import { defineConfig } from "tsup";
import fs from "fs";
import { globby } from "globby";
import path from "path";

export default defineConfig(async (options) => {
  const actions = (await globby(["actions/*/*.ts"])).map((path) => {
    const splitted = path.split("/");
    const actionPath =
      splitted.slice(0, splitted.length - 1).join("/") + "/action.yml";
    return {
      entry: path,
      actionPath,
    };
  });

  const entry: Record<string, string> = {};
  actions.forEach((a) => {
    const splitted = a.entry.split("/");
    const entryName = splitted[splitted.length - 2];
    if (!entryName) throw new Error("No file name");
    entry[entryName + "/index"] = a.entry;
  });

  return {
    minify: false,
    dts: false,
    entry,
    outDir: "actions/dist",
    format: ["cjs"],
    target: "node18",
    bundle: true,
    async onSuccess() {
      // copy action.yml files into dist
      actions.forEach((a) => {
        const fullPath = path.join(process.cwd(), a.actionPath);
        const newPath = fullPath.replace("/actions/", "/actions/dist/");
        fs.copyFileSync(fullPath, newPath);
      });
      return;
    },
  };
});
