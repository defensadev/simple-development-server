import { build } from "esbuild";

import { FS_DEBOUNCE, publicDir, srcDir } from "../env";

let lastInvokaction: null | number = null;

export const JS = async (production: boolean) => {
  const invokactionTime = new Date().getTime();
  if (lastInvokaction && invokactionTime - lastInvokaction <= FS_DEBOUNCE) {
    return;
  }
  lastInvokaction = invokactionTime;

  const entryPoints = [srcDir.index];
  const outdir = publicDir.path;

  await build({
    bundle: true,
    entryPoints,
    format: "iife",
    legalComments: production ? "linked" : "none",
    minify: production,
    minifyIdentifiers: production,
    minifySyntax: production,
    minifyWhitespace: production,
    platform: "browser",
    outdir,
    sourcemap: true,
  });

  console.log("JS BUILT!");
};
