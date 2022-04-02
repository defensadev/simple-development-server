import { build } from "esbuild";

import { publicDir, srcDir } from "../env";

let lastInvokaction: null | number = null;

export const JS = async () => {
  const invokactionTime = new Date().getTime();
  if (lastInvokaction && invokactionTime - lastInvokaction <= 300) {
    return;
  }
  lastInvokaction = invokactionTime;

  const entryPoints = [srcDir.index];
  const outdir = publicDir.path;

  await build({
    bundle: true,
    entryPoints,
    format: "iife",
    legalComments: "linked",
    minify: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    platform: "browser",
    outdir,
    sourcemap: true,
  });

  console.log("JS BUILT!");
};
