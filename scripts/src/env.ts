import path from "path";

const cwd = process.cwd();

export const publicDir = {
  path: path.resolve(cwd, "./public"),
  indexCSS: path.resolve(cwd, "./public/index.css"),
  indexHTML: path.resolve(cwd, "./public/index.html"),
  CSScontent: path.resolve(cwd, "./public/**/*.{html,js}"),
};

export const srcDir = {
  path: path.resolve(cwd, "./src"),
  index: path.resolve(cwd, "./src/index.ts"),
};

export const dirname = {
  mainCSS: path.resolve(__dirname, "../main.css"),
  wsJS: path.resolve(__dirname, "../ws.js"),
};

export const PORT = 3000;
