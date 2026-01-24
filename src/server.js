// src/server.js
import app from "./app.js";

const DEFAULT_PORT = 3000;
let port = process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT;

function startServer(portToTry) {
  const server = app.listen(portToTry, () => {
    console.log(`Ubuntu_ID running  on port ${portToTry}`);
  });
  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${portToTry} in use, trying port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      throw err;
    }
  });
}

startServer(port);
