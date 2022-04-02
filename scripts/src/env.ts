import path from "path";

import yargs from "yargs/yargs";

const argv = yargs(process.argv.slice(2))
  .options({
    port: { type: "number", default: 3000, alias: "p" },
    open: { type: "boolean", default: true, alias: "o" },
    debonuce: { type: "number", default: 300, alias: "d" },
  })
  .parseSync();

export const cwd = process.cwd();

export const publicDir = {
  path: path.resolve(cwd, "./public"),
  indexCSS: path.resolve(cwd, "./public/index.css"),
  CSScontent: path.resolve(cwd, "./public/**/*.{html,js}"),
};

export const srcDir = {
  path: path.resolve(cwd, "./src"),
};

export const dirname = {
  mainCSS: path.resolve(__dirname, "../main.css"),
  wsJS: path.resolve(__dirname, "../ws.js"),
};

export const PORT = argv.port;

// the poll interval is measured in ms.
// JS and CSS will only be built once
// during FS_DEBOUNCE. it used to
// debounce filesystem changes.
export const FS_DEBOUNCE = argv.debonuce;

// OPEN_BROWSER is a boolean
// if true, opens the browser
// during `yarn start` or
// `npm run start`
export const OPEN_BROWSER = argv.open;
