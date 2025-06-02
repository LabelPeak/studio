import clsx from "clsx";
import { last } from "remeda";
import { isStatusBefore, ProjectStatus, ProjectStatusRecord } from "shared";

const lightCommonClassName = "w-2 h-2 rounded-full border-1 border-solid";

function Pending() {
  return <div className={clsx(lightCommonClassName, "bg-gray-500", "border-gray-700")} />;
}

function InProgress() {
  return <div className={clsx(lightCommonClassName, "bg-yellow-500", "border-yellow-700")} />;
}

function Completed() {
  return <div className={clsx(lightCommonClassName, "bg-green-500", "border-green-700")} />;
}

interface StatusLightProps {
  status: ProjectStatus;
  statusHistory: ProjectStatusRecord[];
}

function StatusLight({ status, statusHistory }: StatusLightProps) {
  const currentStatus = last(statusHistory)?.status;

  if (currentStatus === undefined) {
    return <Pending />;
  } else if (currentStatus === status) {
    return <InProgress />;
  } else if (isStatusBefore(currentStatus, status)) {
    return <Pending />;
  } else if (isStatusBefore(status, currentStatus)) {
    return <Completed />;
  }
}

StatusLight.Pending = Pending;
StatusLight.InProgress = InProgress;
StatusLight.Completed = Completed;

export default StatusLight;
