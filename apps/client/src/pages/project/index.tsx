import { useQuery } from "@tanstack/react-query";

import ProjectService from "@/services/project";

import ProjectCard from "./components/project-card";

// TODO: add skeleton screen for loading
export function ProjectPage() {
  const { data: relations = [] } = useQuery({
    queryKey: ["mineProjects"],
    queryFn: ProjectService.getMyParticipateProjects
  });

  return (
    <section id="project-page" className="bg-white m-4 p-6">
      <h1 className="mt-0 text-5">Projects</h1>
      <section className="grid md-grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {relations.map((relation) => (
          <ProjectCard key={relation.project.id} project={relation.project} role={relation.role} />
        ))}
      </section>
    </section>
  );
}
