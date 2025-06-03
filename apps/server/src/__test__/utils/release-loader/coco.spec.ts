import { describe, expect, it } from "vitest";

import { CocoReleaseLoader } from "@/utils/release-loader/coco.ts";

import { exampleDataItems, exampleDataset, exampleLabels } from "./input.example.ts";

describe("CocoLoader", () => {
  it("should transform to coco format", () => {
    const releaseName = "<releaseName>";
    const poc = "<poc>";

    const loader = new CocoReleaseLoader({
      releaseName,
      poc,
      dataset: exampleDataset,
      presetLabels: exampleLabels,
      dataItems: exampleDataItems
    });

    const result = loader.composeCocoOutputJSON();

    expect(result).matchSnapshot();
  });
});
