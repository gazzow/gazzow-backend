import { env } from "./infrastructure/config/env.js";
import app from "./presentation/server/app.js";
import connectDb from "./infrastructure/config/db.js";
import http from "http";
import { createSocketServer } from "./infrastructure/config/socket/socket-server.js";

const PORT = env.port;

connectDb().then(() => {
  const server = http.createServer(app);

  //  Socket server initialize
  createSocketServer(server);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
