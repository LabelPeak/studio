import { useNodesInitialized, useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

import { getLayoutedElements } from "@/utils/flow";

interface UseLayoutNodesOptions {
  onLayout: (nodes: any[]) => void;
}

export default function useLayoutNodes({ onLayout }: UseLayoutNodesOptions) {
  const { getNodes, getEdges } = useReactFlow();
  const nodesInitialized = useNodesInitialized({
    includeHiddenNodes: true
  });

  useEffect(() => {
    if (nodesInitialized) {
      onLayout(getLayoutedElements(getNodes(), getEdges()).nodes);
    }
  }, [nodesInitialized]);
}
