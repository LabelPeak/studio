import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { except } from "hono/combine";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";
import { serve as serveInngest } from "inngest/hono";

import preAnnotateFunction from "./inngest/pre-annotation.ts";
import { authMiddleware } from "./middlewares/auth.middleware.ts";
import { authRouter } from "./routes/auth/auth.controller.ts";
import { datasetRouter } from "./routes/dataset/dataset.controller.ts";
import { projectRouter } from "./routes/project/project.controller.ts";
import { staffRouter } from "./routes/staff/staff.controller.ts";
import { BizException } from "./utils/exception.ts";
import { initFirstAdmin } from "./utils/init.ts";
import { inngest } from "./utils/inngest.ts";
import { createResponse } from "./utils/response.ts";

initFirstAdmin();

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());
app.use(
  "/api/*",
  except(["/api/auth/login", "/api/inngest"], jwt({ secret: String(process.env.JWT_SECRET) }))
);
app.use("/api/*", except(["/api/auth/login", "/api/inngest"], authMiddleware));

// Routes
app.route("/api/auth", authRouter);
app.route("/api/staff", staffRouter);
app.route("/api/project", projectRouter);
app.route("/api/dataset", datasetRouter);

app.on(
  ["GET", "PUT", "POST"],
  "/api/inngest",
  serveInngest({
    client: inngest,
    functions: [preAnnotateFunction]
  })
);

// Error handling
app.onError((err, c) => {
  if (err instanceof BizException) {
    return c.json(createResponse(null, err.message, err.code));
  }
  console.error(err);
  return c.json(createResponse(null, "Internal Server Error", 500), 500);
});

app.notFound((c) => {
  return c.json(createResponse(null, "Not Found", 404), 404);
});

const port = process.env.PORT || 3000;
console.info(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port: Number(port)
});
