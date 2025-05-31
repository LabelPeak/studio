import { PROJECT_STATUS } from "shared";

import { Label } from "./annotation";
import { Dataset } from "./dataset";
import { User } from "./user";

export enum Access {
  Hidden = "hidden",
  Read = "read",
  Write = "write"
}

export interface ProjectStatus {
  status: (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];
  timestamp: number;
}

export interface Project {
  id: number;
  name: string;
  access: Access;
  createAt: string;
  admin: User;
  presets: Label[];
  dataset: Dataset;
  statusHistory: ProjectStatus[];
}
