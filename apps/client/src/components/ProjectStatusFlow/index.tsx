import "@xyflow/react/dist/style.css";

import {
  Background,
  PanOnScrollMode,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow
} from "@xyflow/react";
import { useEffect } from "react";

import { ProjectStatus } from "@/interfaces/project";

import { FlowChartContext } from "./components/FlowChartContext";
import StatusNode from "./components/StatusNode";
import useLayoutNodes from "./hooks/useLayoutNodes";

const FLOW_NODE_TYPE = {
  status: StatusNode
};

interface ProjectStatusFlowProps {
  statusHistory: ProjectStatus[];
}

function ProjectStatusFlowImpl({ statusHistory }: ProjectStatusFlowProps) {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([] as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as any);

  useEffect(() => {
    const _nodes = statusHistory.map((item) => {
      return {
        id: item.status,
        data: {
          label: item.status,
          timestamp: item.timestamp
        },
        position: { x: 0, y: 0 },
        type: "status"
      };
    });

    const _edges = statusHistory.slice(0, -1).map((_, index) => {
      const source = statusHistory[index].status;
      const target = statusHistory[index + 1].status;
      return {
        id: `${source}-to-${target}`,
        source,
        target
      };
    });

    setNodes(_nodes);
    setEdges(_edges);
  }, []);

  useLayoutNodes({
    onLayout: (layoutedNodes) => {
      setNodes(layoutedNodes);
      fitView();
    }
  });

  return (
    <FlowChartContext.Provider value={{ statusHistory: statusHistory }}>
      <div className="w-full h-100">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={FLOW_NODE_TYPE}
          fitView
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          nodesDraggable={false}
          nodesConnectable={false}
          panOnDrag={false}
          panOnScrollMode={PanOnScrollMode.Vertical}
        >
          <Background />
        </ReactFlow>
      </div>
    </FlowChartContext.Provider>
  );
}

export default function ProjectStatusFlow(props: ProjectStatusFlowProps) {
  return (
    <ReactFlowProvider>
      <ProjectStatusFlowImpl {...props} />
    </ReactFlowProvider>
  );
}
