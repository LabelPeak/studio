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
import { ProjectStatus, ProjectStatusRecord } from "shared";

import useLayoutNodes from "../../hooks/useLayoutNodes";
import { getInitialEdges, getInitialNodes } from "../../hooks/usePipelineNodes";
import { FlowChartContext } from "../FlowChartContext";
import StatusNode from "../FlowStatusNode";

const FLOW_NODE_TYPE = {
  status: StatusNode
};

interface ProjectStatusFlowProps {
  statusHistory: ProjectStatusRecord[];
  onStatusNodeClick: (status: ProjectStatusRecord) => void;
}

function ProjectStatusFlowImpl({ statusHistory, onStatusNodeClick }: ProjectStatusFlowProps) {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([] as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as any);

  useEffect(() => {
    const initialNodes = getInitialNodes();

    const map = new Map(statusHistory.map((item) => [item.status, item]));

    // Merge
    const _nodes = initialNodes.map((node) => {
      if (map.get(node.id as ProjectStatus)) {
        return {
          id: node.id,
          data: map.get(node.id as ProjectStatus),
          position: { x: 0, y: 0 },
          type: "status"
        };
      }
      return node;
    });

    const _edges = getInitialEdges();

    setNodes(_nodes as any[]);
    setEdges(_edges);
  }, []);

  useLayoutNodes({
    onLayout: (layoutedNodes) => {
      setNodes(layoutedNodes);
      fitView({
        maxZoom: 1,
        minZoom: 1
      });
    }
  });

  return (
    <FlowChartContext.Provider value={{ statusHistory, onStatusNodeClick }}>
      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={FLOW_NODE_TYPE}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          nodesDraggable={false}
          nodesConnectable={false}
          panOnDrag={false}
          panOnScrollMode={PanOnScrollMode.Horizontal}
          panOnScroll
          proOptions={{
            hideAttribution: true
          }}
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
