import fs from "fs";
import http from "http";

import chokidar from "chokidar";
import express from "express";
import morgan from "morgan";
import open from "open";
import ws from "ws";

import { CSS, JS } from "./builder";
import { dirname, PORT, publicDir, OPEN_BROWSER, srcDir } from "./env";

let wsJS: string | null = null;

const webApp = express();
const httpServer = http.createServer(webApp);
const WebSocketServer = new ws.Server({
  clientTracking: false,
  noServer: true,
});
const srcWatcher = chokidar.watch(srcDir.path, { ignoreInitial: true });
const publicWatcher = chokidar.watch(publicDir.path, { ignoreInitial: true });

srcWatcher.on("change", () => JS().then(() => CSS()));

httpServer.on("upgrade", (req, socket, head) =>
  WebSocketServer.handleUpgrade(req, socket, head, (ws, wsReq) =>
    WebSocketServer.emit("connection", ws, wsReq)
  )
);

webApp.use(morgan("dev"));
webApp.use("/", async (req, res, next) => {
  if (req.url === "/") {
    if (!wsJS) {
      wsJS =
        "<script>" +
        (await fs.promises.readFile(dirname.wsJS, "utf-8")) +
        "</script></head>";
    }
    const rawHTML = await fs.promises.readFile(publicDir.indexHTML, "utf-8");
    const html = rawHTML.replace("</head>", wsJS);
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
    return;
  }
  next();
});
webApp.use(express.static(publicDir.path));

WebSocketServer.on("connection", (ws) => {
  const listener = (p: string) => {
    if (p.endsWith(".css") && ws.readyState === ws.OPEN) {
      ws.close(1000, "reload");
      return;
    }
    CSS();
  };

  publicWatcher.on("change", listener);

  ws.once("close", () => {
    publicWatcher.removeListener("change", listener);
    ws.removeAllListeners();
    console.log("WS closed!");
  });

  console.log("WS opened!");
});

httpServer.listen(PORT, () => {
  const url = `http://localhost:${PORT}/`;
  console.log("listening on port", PORT, "\n" + url);
  OPEN_BROWSER && open(url);
});
