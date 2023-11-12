import { Project } from "@/interfaces/project";
import { create } from "zustand";

interface WorkingProjectState {
  project: Project | undefined;
  setProject: (value: Project) => void;
}

const useWorkingProject = create<WorkingProjectState>((set) => ({
  project: undefined,
  setProject: (project) => set({ project })
}));

export default useWorkingProject;