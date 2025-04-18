import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { staffRouter } from "./routes/staff/staff.controller.ts";
import { BizException } from "./utils/exception.ts";
import { createResponse } from "./utils/response.ts";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Routes
// app.route('/api/auth', authRouter)
app.route("/api/staff", staffRouter);

// Error handling
app.onError((err, c) => {
  if (err instanceof BizException) {
    return c.json(createResponse(null, err.message, err.code));
  }
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
