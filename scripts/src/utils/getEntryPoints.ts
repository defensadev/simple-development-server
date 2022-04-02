import path from "path";
import fs from "fs";

import { srcDir } from "../env";

export const getEntryPoints = async (
  dir?: string,
  ending?: string
): Promise<Array<string>> => {
  const endingDefault = ending ? ending : ".entry.ts";
  const dirDefault = dir ? dir : srcDir.path;

  const files = await fs.promises.readdir(dirDefault);

  return await Promise.all(
    files.map(async (file) => {
      const fullPath = path.resolve(dirDefault, file);

      if (file.endsWith(endingDefault)) {
        return [fullPath];
      }

      const stats = await fs.promises.stat(fullPath);
      if (stats.isDirectory()) {
        return await getEntryPoints(fullPath);
      }
      return [];
    })
  ).then((res) => res.flat());
};
