import { createContext } from "react";
import { ProjectStatusRecord } from "shared";

export const FlowChartContext = createContext<{
  statusHistory: ProjectStatusRecord[];
  onStatusNodeClick: (status: ProjectStatusRecord) => void;
}>({
  statusHistory: [],
  onStatusNodeClick: () => undefined
});
