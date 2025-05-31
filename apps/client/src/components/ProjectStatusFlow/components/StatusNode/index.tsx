import { Handle, Position } from "@xyflow/react";

interface StatusNodeProps {
  data: any;
}

export default function StatusNode({ data }: StatusNodeProps) {
  return (
    <div className="py-1 px-3 rounded-full flex items-center border-1 border-solid border-gray-3 shadow bg-white hover:ring-2 hover:ring-nord-frost-3 cursor-pointer">
      <div className="w-2 h-2 rounded-full bg-green-5 mr-2 border-1 border-solid border-green-7" />
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
