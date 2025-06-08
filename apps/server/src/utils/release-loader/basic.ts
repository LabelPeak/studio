import { format } from "date-fns";
import type { InferSelectModel } from "drizzle-orm";
import { nanoid } from "nanoid";

import type { dataItemTable, datasetTable } from "@/db/schema.ts";

export type DataItem = InferSelectModel<typeof dataItemTable>;

export type Dataset = InferSelectModel<typeof datasetTable>;

export const MAX_ANNOTATION_PER_FILE = 100;

interface BasicReleaseLoaderOptions {
  releaseName: string;
  poc: string;
  dataset: Dataset;
  presetLabels: string[];
  dataItems: DataItem[];
}

export abstract class BasicReleaseLoader {
  releaseName: string;
  poc: string;
  dataset: Dataset;
  presetLabels: string[];
  dataItems: DataItem[];

  constructor({ releaseName, poc, dataset, presetLabels, dataItems }: BasicReleaseLoaderOptions) {
    this.dataset = dataset;
    this.presetLabels = presetLabels;
    this.dataItems = dataItems;
    this.releaseName = releaseName;
    this.poc = poc;
  }

  abstract releaseToZip(): Promise<Buffer>;

  getArchiveName() {
    return `labelpeak-dataset-${this.releaseName}-${format(new Date(), "yyyyMMdd")}-${nanoid(6)}`;
  }
}
