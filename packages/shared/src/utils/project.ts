import { ProjectStatus, ProjectStatusRecord } from "@/types/project";

export const PROJECT_STATUS = {
  PENDING: "pending",
  PRE_ANNOTATING: "pre_annotating",
  ANNOTATING: "annotating",
  CHECKING: "checking",
  RE_ANNOTATING: "re_annotating",
  RE_CHECKING: "re_checking",
  APPROVED: "approved",
  RELEASED: "released"
} as const;

const ORDERED_PROJECT_STATUS_LIST: ProjectStatus[] = [
  PROJECT_STATUS.PENDING,
  PROJECT_STATUS.PRE_ANNOTATING,
  PROJECT_STATUS.ANNOTATING,
  PROJECT_STATUS.CHECKING,
  PROJECT_STATUS.RE_ANNOTATING,
  PROJECT_STATUS.RE_CHECKING,
  PROJECT_STATUS.APPROVED,
  PROJECT_STATUS.RELEASED
] as const;

export function isStatusBefore(current: ProjectStatus, target: ProjectStatus): boolean {
  const currentIndex = ORDERED_PROJECT_STATUS_LIST.indexOf(current);
  const targetIndex = ORDERED_PROJECT_STATUS_LIST.indexOf(target);

  return currentIndex < targetIndex;
}

export function composeProjectStatus(status: ProjectStatus, trigger?: string): ProjectStatusRecord {
  return {
    status,
    trigger,
    startAt: Date.now()
  };
}

export function appendProjectStatusHistory(
  newRecord: Omit<ProjectStatusRecord, "startAt" | "endAt">,
  original: ProjectStatusRecord[]
) {
  const startAt = Date.now();

  const lastRecord = original.at(-1);
  if (lastRecord) {
    lastRecord.endAt = startAt;
  }

  original.push({
    ...newRecord,
    startAt
  });
  return original;
}
