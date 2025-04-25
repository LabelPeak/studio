import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { except } from "hono/combine";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";

import { authMiddleware } from "./middlewares/auth.middleware.ts";
import { authRouter } from "./routes/auth/auth.controller.ts";
import { projectRouter } from "./routes/project/project.controller.ts";
import { staffRouter } from "./routes/staff/staff.controller.ts";
import { BizException } from "./utils/exception.ts";
import { createResponse } from "./utils/response.ts";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());
app.use("/api/*", except("/api/auth/login", jwt({ secret: String(process.env.JWT_SECRET) })));
app.use("/api/*", except("/api/auth/login", authMiddleware));

// Routes
app.route("/api/auth", authRouter);
app.route("/api/staff", staffRouter);
app.route("/api/project", projectRouter);

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
