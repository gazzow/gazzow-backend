import { env } from "./infrastructure/config/env.js";
import app from "./presentation/server/app.js";
import connectDb from "./infrastructure/config/db.js";

const PORT = env.port;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
