import { Project } from "./project";
import { User } from "./user";

export enum Role {
  admin = "admin",
  annotator = "annotator",
  checker = "checker"
}

export interface UserProjectRelation {
  project: Project;
  user: User;
  role: Role;
}
