import { env } from "./infrastructure/config/env.js";
import app from "./presentation/server/app.js";
import connectDb from "./infrastructure/config/db.js";
import http from "http";
import { createSocketServer } from "./infrastructure/config/socket/socket-server.js";
import { createRootRoutes } from "./presentation/routes/root.routes.js";
import { errorHandler } from "./presentation/middleware/error-handler.js";

const PORT = env.port;

connectDb().then(() => {
  const server = http.createServer(app);

  //  Socket server initialize
  const realtimeGateway = createSocketServer(server);

  app.use("/api", createRootRoutes(realtimeGateway));
  app.use(errorHandler);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
