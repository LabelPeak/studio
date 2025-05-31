import { useState } from "react";
import { ProjectStatusRecord } from "shared";

import { Project } from "@/interfaces/project";

import ProjectStatusFlow from "../ProjectStatusFlow";
import ProjectStepCheckList from "./components/ProjectStepCheckList";
import StatusDetail from "./components/StatusDetail";
import StatusHeader from "./components/StatusHeader";

interface ProjectStatusViewProps {
  project: Project;
}

export default function ProjectStatusView({ project }: ProjectStatusViewProps) {
  const [selectedStatusNode, setSelectedStatusNode] = useState<ProjectStatusRecord | null>(null);

  return (
    <section className="w-full">
      <StatusHeader project={project} />
      <ProjectStepCheckList project={project} />
      <div className="h-50">
        <ProjectStatusFlow
          statusHistory={project.statusHistory}
          onStatusNodeClick={(status) => setSelectedStatusNode(status)}
        />
      </div>
      <StatusDetail statusRecord={selectedStatusNode} />
    </section>
  );
}
