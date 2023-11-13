import { Project } from "@/interfaces/project";
import ProjectCard from "./ProjectCard";
import ProjectService from "@/services/project";
import { useRequest } from "ahooks";
import { useState } from "react";

export function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  // TODO: add skeleton screen for loading
  useRequest(ProjectService.getMyParticipateProjects, {
    onSuccess: ((res) => {
      if (res.data?.length) {
        setProjects(res.data);
      }
    })
  });

  return (
    <section id="project-page" className="bg-white m-4 p-6">
      <h1 className="mt-0 text-5">Projects</h1>
      <section className="grid md-grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </section>
  );
}