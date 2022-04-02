(() => {
  const ws = new WebSocket("ws://localhost:{{PORT}}");

  ws.addEventListener("close", (ev) => {
    if (ev.reason === "reload") {
      window.location.reload();
    }
  });
})();
