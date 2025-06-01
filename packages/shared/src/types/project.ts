import { PROJECT_STATUS } from "@/utils/project";

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export interface ProjectStatusRecord {
  status: ProjectStatus;
  startAt: number;
  endAt?: number;
  /**
   * 触发者用户名
   */
  trigger?: string;
}
