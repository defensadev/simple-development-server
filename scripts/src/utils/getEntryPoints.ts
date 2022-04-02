import path from "path";
import fs from "fs";

import { srcDir } from "../env";

export const getEntryPoints = async (dir?: string): Promise<Array<string>> => {
  if (!dir) {
    return await getEntryPoints(srcDir.path);
  }

  const files = await fs.promises.readdir(dir);

  return await Promise.all(
    files.map(async (file) => {
      const fullPath = path.resolve(dir, file);

      if (file.endsWith(".entry.ts")) {
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
