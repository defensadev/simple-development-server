(() => {
  const ws = new WebSocket(`ws://${window.location.host}`);

  ws.addEventListener("close", (ev) => {
    if (ev.reason === "reload") {
      window.location.reload();
    }
  });
})();
