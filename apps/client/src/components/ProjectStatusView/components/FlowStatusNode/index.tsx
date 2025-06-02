import { Handle, Position } from "@xyflow/react";
import { useContext } from "react";
import { useIntl } from "react-intl";
import { ProjectStatusRecord } from "shared";

import { FlowChartContext } from "../FlowChartContext";
import StatusLight from "../StatusLight";

interface StatusNodeProps {
  data: ProjectStatusRecord;
}

export default function StatusNode({ data }: StatusNodeProps) {
  const { onStatusNodeClick, statusHistory } = useContext(FlowChartContext);
  const intl = useIntl();

  return (
    <div
      className="py-1 px-3 rounded-full flex items-center border-1 border-solid border-gray-3 shadow bg-white hover:ring-2 hover:ring-nord-frost-3 cursor-pointer"
      onClick={() => onStatusNodeClick(data)}
    >
      <Handle type="target" position={Position.Left} className="op-0" />
      <StatusLight status={data.status} statusHistory={statusHistory} />
      <div className="ml-1">{intl.formatMessage({ id: `project-status-${data.status}` })}</div>
      <Handle type="source" position={Position.Right} className="op-0" />
    </div>
  );
}
