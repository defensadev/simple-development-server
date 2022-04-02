import fs from "fs";
import path from "path";

import { dirname, publicDir } from "../env";

let wsJS: null | string = null;

export const useDevTools = async (url: string): Promise<null | string> => {
  try {
    if (url === "/") {
      url = "/index.html";
    }
    if (!url.startsWith("/")) {
      url = "/" + url;
    }
    if (url.endsWith("/")) {
      url = url.slice(0, url.length - 1);
    }
    const splitter = url.split("/");
    const lastItem = splitter[splitter.length - 1];
    if (url.endsWith(".html") || !lastItem.includes(".")) {
      if (!wsJS) {
        wsJS =
          "<script>" +
          (await fs.promises.readFile(dirname.wsJS, "utf-8")) +
          "</script></head>";
      }
      if (url.endsWith(".html")) {
        const rawHTML = await fs.promises.readFile(
          path.resolve(publicDir.path, "." + url),
          "utf-8"
        );
        const html = rawHTML.replace("</head>", wsJS);
        return html;
      }
      const directPath = path.resolve(publicDir.path, "." + url + ".html");
      const subPath = path.resolve(publicDir.path, "." + url + "/index.html");

      const rawHTML = await fs.promises
        .readFile(directPath, "utf-8")
        .catch(() => fs.promises.readFile(subPath, "utf-8"));
      const html = rawHTML.replace("</head>", wsJS);
      return html;
    }

    return null;
  } catch {
    return null;
  }
};
