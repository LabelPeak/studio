import { User } from "./user";

export enum Access {
  Hidden = "hidden",
  Read = "read",
  Write = "write",
}

export interface Project {
  id: number;
  name: string;
  access: Access;
  createAt: string;
  creator: User;
  labels: string[];
}