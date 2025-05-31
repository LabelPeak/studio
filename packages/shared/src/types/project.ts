import { PROJECT_STATUS } from "@/utils/project";

export interface ProjectStatusRecord {
  status: (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];
  startAt: number;
  endAt?: number;
  /**
   * 触发者用户名
   */
  trigger?: string;
}
