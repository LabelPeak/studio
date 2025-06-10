import { Label, ProjectStatusRecord } from "shared";

import { Dataset } from "./dataset";
import { User } from "./user";

export enum Access {
  Hidden = "hidden",
  Read = "read",
  Write = "write"
}

export interface Project {
  id: number;
  name: string;
  access: Access;
  createAt: string;
  admin: User;
  presets: Label[];
  dataset: Dataset;
  statusHistory: ProjectStatusRecord[];
  releaseUrl: string;
}
