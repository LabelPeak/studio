import { Typography } from "antd";

import { Project } from "@/interfaces/project";

import { calculateProjectDuration } from "../../utils";

interface StatusHeaderProps {
  project: Project;
}

export default function StatusHeader({ project }: StatusHeaderProps) {
  const duration = calculateProjectDuration(project.statusHistory);

  return (
    <header className="w-full flex items-baseline border-b-1 border-b-solid border-gray-1 pb-2 mb-2">
      <h2 className="text-lg font-bold m-0 mr-2">{project.name}</h2>
      <Typography.Text className="text-gray-500">已经进行 {duration} 天</Typography.Text>
    </header>
  );
}
