import fs from "fs";

import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "postcss";
import tailwindcss from "tailwindcss";

import { dirname, FS_DEBOUNCE, publicDir } from "../env";

let mainCSS: null | string = null;
let lastInvokaction: null | number = null;

const productionProcessor = postcss(
  tailwindcss({
    content: [publicDir.CSScontent],
    theme: {
      extend: {},
    },
    plugins: [],
  }),
  autoprefixer(),
  cssnano()
);

const developmentProcessor = postcss(
  tailwindcss({
    content: [publicDir.CSScontent],
    theme: {
      extend: {},
    },
    plugins: [],
  })
);

export const CSS = async (production: boolean) => {
  const invokactionTime = new Date().getTime();
  if (lastInvokaction && invokactionTime - lastInvokaction <= FS_DEBOUNCE) {
    return;
  }
  lastInvokaction = invokactionTime;

  if (!mainCSS) {
    mainCSS = await fs.promises.readFile(dirname.mainCSS, "utf-8");
  }

  const processor = production ? productionProcessor : developmentProcessor;

  const out = await processor.process(mainCSS, {
    to: publicDir.indexCSS,
    from: dirname.mainCSS,
  });

  await fs.promises.writeFile(publicDir.indexCSS, out.css, "utf-8");

  console.log("CSS BUILT!");
};
