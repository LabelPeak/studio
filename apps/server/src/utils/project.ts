import { last } from "remeda";
import type { ProjectStatus, ProjectStatusRecord } from "shared";

export function composeProjectStatus(status: ProjectStatus, trigger?: string): ProjectStatusRecord {
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
