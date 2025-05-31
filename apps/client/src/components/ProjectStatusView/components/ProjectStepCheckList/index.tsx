import clsx from "clsx";

import { Project } from "@/interfaces/project";

interface CheckItemProps {
  checked: boolean;
  label: string;
}

function CheckItem({ checked, label }: CheckItemProps) {
  const checkedIconClass = "i-mdi-checkbox-marked-circle text-green-6";
  const uncheckedIconClass = "i-mdi-checkbox-blank-circle-outline text-gray-3";

  return (
    <div className={clsx("flex px-2 py-1 rd-full items-center", checked && "bg-green-1")}>
      <div className={`${checked ? checkedIconClass : uncheckedIconClass} mr-1 text-4`} />
      <span className={clsx(checked ? "text-gray-8" : "text-gray-5")}>{label}</span>
    </div>
  );
}

interface ProjectStepCheckListProps {
  project: Project;
}

export default function ProjectStepCheckList({ project }: ProjectStepCheckListProps) {
  // TODO: 根据项目状态计算需要检查的步骤
  console.log(project);
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <CheckItem checked={false} label="Need Pre-annotation" />
      <CheckItem checked label="Need Re-annotation" />
    </div>
  );
}
