import { Handle, Position } from "@xyflow/react";
import { useContext } from "react";
import { ProjectStatusRecord } from "shared";

import { FlowChartContext } from "../FlowChartContext";

interface StatusNodeProps {
  data: ProjectStatusRecord;
}

export default function StatusNode({ data }: StatusNodeProps) {
  const { onStatusNodeClick } = useContext(FlowChartContext);

  return (
    <div
      className="py-1 px-3 rounded-full flex items-center border-1 border-solid border-gray-3 shadow bg-white hover:ring-2 hover:ring-nord-frost-3 cursor-pointer"
      onClick={() => onStatusNodeClick(data)}
    >
      <div className="w-2 h-2 rounded-full bg-green-5 mr-2 border-1 border-solid border-green-7" />
      <Handle type="target" position={Position.Left} className="op-0" />
      <div>{data.status}</div>
      <Handle type="source" position={Position.Right} className="op-0" />
    </div>
  );
}
