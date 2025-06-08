import { describe, expect, it } from "vitest";

import { YoloReleaseLoader } from "@/utils/release-loader/yolo.ts";

import { exampleDataItems, exampleDataset, exampleLabels } from "./input.example.ts";

describe("YoloReleaseLoader", () => {
  it("should compose yolo annotation per file", () => {
    const releaseName = "<releaseName>";
    const poc = "<poc>";

    const loader = new YoloReleaseLoader({
      releaseName,
      poc,
      dataset: exampleDataset,
      presetLabels: exampleLabels,
      dataItems: exampleDataItems
    });

    const presetMap = new Map(exampleLabels.map((label, index) => [label, index]));

    const result = loader.composeYoloAnnotationPerFile(exampleDataItems[0], presetMap);

    expect(result).matchSnapshot();
  });

  it("should compose yolo output yaml", () => {
    const releaseName = "<releaseName>";
    const poc = "<poc>";

    const loader = new YoloReleaseLoader({
      releaseName,
      poc,
      dataset: exampleDataset,
      presetLabels: exampleLabels,
      dataItems: exampleDataItems
    });

    const result = loader.composeYoloOutputYAML();

    expect(result).matchSnapshot();
  });
});
