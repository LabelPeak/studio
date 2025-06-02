import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import ProjectService from "@/services/project";

export function useProject(projectId: number) {
  const queryClient = useQueryClient();

  const { data: queryProjectResp, isFetching: loadingProject } = useSuspenseQuery({
    queryKey: ["project", projectId] as const,
    queryFn: ({ queryKey }) => {
      return ProjectService.getProjectDetail(queryKey[1]);
    }
  });

  const { project, role } = queryProjectResp;

  const refreshProject = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["project", projectId] as const
    });
  }, [queryClient, projectId]);

  return {
    project,
    role,
    loadingProject,
    refreshProject
  };
}
