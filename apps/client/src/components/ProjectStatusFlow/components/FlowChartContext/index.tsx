import { createContext } from "react";

import { ProjectStatus } from "@/interfaces/project";

export const FlowChartContext = createContext<{
  statusHistory: ProjectStatus[];
}>({
  statusHistory: []
});
