import { last } from "remeda";
import type { PROJECT_STATUS, ProjectStatusRecord } from "shared";

export function composeProjectStatus(
  status: (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS],
  trigger?: string
): ProjectStatusRecord {
  return {
    status,
    trigger,
    startAt: Date.now()
  };
}

export function appendProjectStatusHistory(
  newRecord: ProjectStatusRecord,
  original: ProjectStatusRecord[]
) {
  const lastRecord = last(original);
  if (lastRecord) {
    lastRecord.endAt = newRecord.startAt;
  }

  original.push(newRecord);
  return original;
}
