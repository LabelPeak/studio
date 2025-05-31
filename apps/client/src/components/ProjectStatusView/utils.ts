import { differenceInCalendarDays } from "date-fns";
import { first, last } from "remeda";
import { ProjectStatusRecord } from "shared";

/**
 * 单位：天
 * @param statusHistory
 * @returns
 */
export const calculateProjectDuration = (statusHistory: ProjectStatusRecord[]): number => {
  const firstDate = first(statusHistory)?.startAt;
  if (!firstDate) {
    return 0;
  }

  if (statusHistory.length < 2) {
    return differenceInCalendarDays(new Date(), firstDate || new Date());
  }

  const lastDate = last(statusHistory)?.startAt;
  if (!lastDate) {
    return 0;
  }

  return differenceInCalendarDays(lastDate, firstDate);
};
