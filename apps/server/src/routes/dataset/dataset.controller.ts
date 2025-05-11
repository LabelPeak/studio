import { Hono } from "hono";

import { BizException } from "@/utils/exception.ts";
import { createResponse } from "@/utils/response.ts";

import { DatasetSchema } from "./dataset.dto.ts";
import { datasetService } from "./dataset.service.ts";

const datasetRouter = new Hono();

datasetRouter.get("/dataitem", async (c) => {
  const parsed = DatasetSchema.findAllDataItemByDatasetIdSchema.safeParse({
    datasetId: Number(c.req.query("datasetId")),
    page: Number(c.req.query("page")),
    size: Number(c.req.query("size"))
  });

  if (!parsed.success) {
    throw new BizException("invalid_param");
  }

  const res = await datasetService.findAllDataItemByDatasetId(parsed.data);

  return c.json(createResponse(res));
});

datasetRouter.post("/upload/:id", async (c) => {
  const { file } = await c.req.parseBody();
  const parsed = DatasetSchema.uploadDataItemsSchema.safeParse({
    datasetId: Number(c.req.param("id")),
    file
  });

  if (!parsed.success) {
    throw new BizException("invalid_param");
  }

  const res = await datasetService.uploadDataItems(parsed.data, c.get("authPayload"));
  return c.json(createResponse(res));
});

export { datasetRouter };
