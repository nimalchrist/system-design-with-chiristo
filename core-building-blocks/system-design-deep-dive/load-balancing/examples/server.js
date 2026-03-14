const http = require("http");
const os = require("os");

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200);
    return res.end("OK");
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      instanceId: process.env.INSTANCE_ID || "unknown",
      hostname: os.hostname(),
      timestamp: new Date().toISOString()
    })
  );
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});
