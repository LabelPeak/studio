import { Dataset } from "./dataset";
import { User } from "./user";

export enum Access {
  Hidden = "hidden",
  Read = "read",
  Write = "write",
}

export enum Role {
  admin = "admin",
  annotator = "annotator",
  checker = "checker"
}

export interface Project {
  id: number;
  name: string;
  access: Access;
  createAt: string;
  admin: User;
  presets: string;
  dataset: Dataset;
  role: Role
}