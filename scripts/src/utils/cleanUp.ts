import fs from "fs";

import { getEntryPoints } from "./getEntryPoints";

import { FS_DEBOUNCE, publicDir } from "../env";

let lastInvokaction: null | number = null;

export const cleanUp = async (p?: string) => {
  const invokactionTime = new Date().getTime();
  if (lastInvokaction && invokactionTime - lastInvokaction <= FS_DEBOUNCE) {
    return;
  }
  lastInvokaction = invokactionTime;

  if (p) {
    const pMap = p.replace(/\.entry\.js$/, ".entry.js.map");
    return await Promise.all([
      fs.promises.unlink(p).catch(() => null),
      fs.promises.unlink(pMap).catch(() => null),
    ]);
  }

  const [srcEntriesRaw, publicEntries] = await Promise.all([
    getEntryPoints(),
    getEntryPoints(publicDir.path, ".entry.js"),
  ]);

  const srcEntries = srcEntriesRaw.map((se) => {
    const splitter = se.split("/");
    return splitter[splitter.length - 1];
  });

  return await Promise.all(
    publicEntries.map(async (pe) => {
      const splitter = pe.split("/");
      const lastPart = splitter[splitter.length - 1];
      const equal = lastPart.replace(".entry.js", ".entry.ts");
      if (srcEntries.includes(equal)) {
        return;
      }
      const peMap = pe.replace(/\.entry\.js$/, ".entry.js.map");
      await Promise.all([
        fs.promises.unlink(pe).catch(() => null),
        fs.promises.unlink(peMap).catch(() => null),
      ]);
    })
  );
};
