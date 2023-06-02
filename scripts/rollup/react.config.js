import { getPkgJSON, resolvePkgPath, getBaseRollupPlugins } from "./utils";
import generatePackageJson from "rollup-plugin-generate-package-json";
const { name, module } = getPkgJSON("react");

// react包路径
const pkgPath = resolvePkgPath(name);
// react产物路径
const distPath = resolvePkgPath(name, true);

export default [
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${distPath}/index.js`,
      name: "index.js",
      format: "umd",
    },
    plugins: [
      ...getBaseRollupPlugins(),
      // 打包packJson文件
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: distPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: "index.js",
        }),
      }),
    ],
  },
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      {
        file: `${distPath}/jsx-runtime.js`,
        name: "jsx-runtime.js",
        format: "umd",
      },
      {
        file: `${distPath}/jsx-dev-runtime.js`,
        name: "jsx-dev-runtime.js",
        format: "umd",
      },
    ],
    plugins: getBaseRollupPlugins(),
  },
];
