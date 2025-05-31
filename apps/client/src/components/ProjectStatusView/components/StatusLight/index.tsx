import clsx from "clsx";

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

const StatusLight = {
  Pending,
  InProgress,
  Completed
};

export default StatusLight;
