import http from "http";

import chokidar from "chokidar";
import express from "express";
import morgan from "morgan";
import open from "open";
import ws from "ws";

import { cleanUp, CSS, JS, useDevTools } from "./utils";
import { PORT, publicDir, OPEN_BROWSER, srcDir } from "./env";

const webApp = express();
const httpServer = http.createServer(webApp);
const WebSocketServer = new ws.Server({
  clientTracking: false,
  noServer: true,
});
const srcWatcher = chokidar.watch(srcDir.path, { ignoreInitial: true });
const publicWatcher = chokidar.watch(publicDir.path, { ignoreInitial: true });

srcWatcher.on("change", () => JS(false).then(() => CSS(false)));
srcWatcher.on("unlink", (p) => cleanUp(p));
srcWatcher.on("unlinkDir", () => cleanUp());

httpServer.on("upgrade", (req, socket, head) =>
  WebSocketServer.handleUpgrade(req, socket, head, (ws, wsReq) =>
    WebSocketServer.emit("connection", ws, wsReq)
  )
);

webApp.use(morgan("dev"));
webApp.use("/", async (req, res, next) => {
  const html = await useDevTools(req.url);
  if (!html) {
    next();
    return;
  }
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
});
webApp.use(express.static(publicDir.path));

WebSocketServer.on("connection", (ws) => {
  const listener = (p: string) => {
    if (p.endsWith(".css") && ws.readyState === ws.OPEN) {
      ws.close(1000, "reload");
      return;
    }
    CSS(false);
  };

  publicWatcher.on("change", listener);

  ws.once("close", () => {
    publicWatcher.removeListener("change", listener);
    ws.removeAllListeners();
    console.log("WS closed!");
  });

  console.log("WS opened!");
});

JS(false)
  .then(() => CSS(false))
  .then(() => {
    httpServer.listen(PORT, () => {
      const url = `http://localhost:${PORT}/`;
      console.log("listening on port", PORT, "\n" + url);
      OPEN_BROWSER && open(url);
    });
  });
