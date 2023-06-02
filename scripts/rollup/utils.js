/* eslint-disable no-undef */
import { resolve } from "path";
import fs from "fs";
import ts from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";

const pkgPath = resolve(__dirname, "../../packages");

const distPath = resolve(__dirname, "../../dist/node_modules");

function resolvePkgPath(pkgName, isDist) {
  if (isDist) {
    return `${distPath}/${pkgName}`;
  } else {
    return `${pkgPath}/${pkgName}`;
  }
}

function getPkgJSON(pkgName) {
  const pkgJSONPath = resolvePkgPath(pkgName) + "/package.json";
  const str = fs.readFileSync(pkgJSONPath, { encoding: "utf-8" });
  return JSON.parse(str);
}

function getBaseRollupPlugins({ typescript = {} }={}) {
  return [commonjs(), ts(typescript)];
}

export { resolvePkgPath, getPkgJSON, getBaseRollupPlugins };
