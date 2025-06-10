import { PROJECT_STATUS, ProjectStatus, ProjectStatusRecord } from "shared";

interface PipelineNode {
  id: string;
  data: ProjectStatusRecord;
  position: {
    x: number;
    y: number;
  };
  type: "status";
}

export const EMPTY_NODE_DATA_RECORD: Record<ProjectStatus, PipelineNode> = {
  [PROJECT_STATUS.PENDING]: {
    id: PROJECT_STATUS.PENDING,
    type: "status",
    position: { x: 0, y: 0 },
    data: {
      status: PROJECT_STATUS.PENDING
    }
  },
  [PROJECT_STATUS.ANNOTATING]: {
    id: PROJECT_STATUS.ANNOTATING,
    type: "status",
    position: { x: 0, y: 0 },
    data: {
      status: PROJECT_STATUS.ANNOTATING
    }
  },
  [PROJECT_STATUS.CHECKING]: {
    id: PROJECT_STATUS.CHECKING,
    type: "status",
    position: { x: 0, y: 0 },
    data: {
      status: PROJECT_STATUS.CHECKING
    }
  },
  [PROJECT_STATUS.RELEASED]: {
    id: PROJECT_STATUS.RELEASED,
    type: "status",
    position: { x: 0, y: 0 },
    data: {
      status: PROJECT_STATUS.RELEASED
    }
  },
  [PROJECT_STATUS.PRE_ANNOTATING]: {
    id: PROJECT_STATUS.PRE_ANNOTATING,
    type: "status",
    position: { x: 0, y: 0 },
    data: {
      status: PROJECT_STATUS.PRE_ANNOTATING
    }
  },
  [PROJECT_STATUS.RE_ANNOTATING]: {
    id: PROJECT_STATUS.RE_ANNOTATING,
    type: "status",
    position: { x: 0, y: 0 },
    data: {
      status: PROJECT_STATUS.RE_ANNOTATING
    }
  },
  [PROJECT_STATUS.RE_CHECKING]: {
    id: PROJECT_STATUS.RE_CHECKING,
    type: "status",
    position: { x: 0, y: 0 },
    data: {
      status: PROJECT_STATUS.RE_CHECKING
    }
  },
  [PROJECT_STATUS.APPROVED]: {
    id: PROJECT_STATUS.APPROVED,
    type: "status",
    position: { x: 0, y: 0 },
    data: {
      status: PROJECT_STATUS.APPROVED
    }
  }
};

export const EMPTY_EDGE_LIST = [
  {
    id: `${PROJECT_STATUS.PENDING}-to-${PROJECT_STATUS.ANNOTATING}`,
    source: PROJECT_STATUS.PENDING,
    target: PROJECT_STATUS.ANNOTATING
  },
  {
    id: `${PROJECT_STATUS.ANNOTATING}-to-${PROJECT_STATUS.CHECKING}`,
    source: PROJECT_STATUS.ANNOTATING,
    target: PROJECT_STATUS.CHECKING
  },
  {
    id: `${PROJECT_STATUS.CHECKING}-to-${PROJECT_STATUS.APPROVED}`,
    source: PROJECT_STATUS.CHECKING,
    target: PROJECT_STATUS.APPROVED
  },
  {
    id: `${PROJECT_STATUS.APPROVED}-to-${PROJECT_STATUS.RELEASED}`,
    source: PROJECT_STATUS.APPROVED,
    target: PROJECT_STATUS.RELEASED
  },
  {
    id: `${PROJECT_STATUS.PENDING}-to-${PROJECT_STATUS.PRE_ANNOTATING}`,
    source: PROJECT_STATUS.PENDING,
    target: PROJECT_STATUS.PRE_ANNOTATING
  },
  {
    id: `${PROJECT_STATUS.PRE_ANNOTATING}-to-${PROJECT_STATUS.CHECKING}`,
    source: PROJECT_STATUS.PRE_ANNOTATING,
    target: PROJECT_STATUS.CHECKING
  },
  {
    id: `${PROJECT_STATUS.CHECKING}-to-${PROJECT_STATUS.RE_ANNOTATING}`,
    source: PROJECT_STATUS.CHECKING,
    target: PROJECT_STATUS.RE_ANNOTATING
  },
  {
    id: `${PROJECT_STATUS.RE_ANNOTATING}-to-${PROJECT_STATUS.RE_CHECKING}`,
    source: PROJECT_STATUS.RE_ANNOTATING,
    target: PROJECT_STATUS.RE_CHECKING
  },
  {
    id: `${PROJECT_STATUS.RE_CHECKING}-to-${PROJECT_STATUS.APPROVED}`,
    source: PROJECT_STATUS.RE_CHECKING,
    target: PROJECT_STATUS.APPROVED
  }
];

export const getInitialNodes = () => {
  return [
    EMPTY_NODE_DATA_RECORD[PROJECT_STATUS.PENDING],
    EMPTY_NODE_DATA_RECORD[PROJECT_STATUS.ANNOTATING],
    EMPTY_NODE_DATA_RECORD[PROJECT_STATUS.PRE_ANNOTATING],
    EMPTY_NODE_DATA_RECORD[PROJECT_STATUS.CHECKING],
    EMPTY_NODE_DATA_RECORD[PROJECT_STATUS.RE_ANNOTATING],
    EMPTY_NODE_DATA_RECORD[PROJECT_STATUS.RE_CHECKING],
    EMPTY_NODE_DATA_RECORD[PROJECT_STATUS.APPROVED],
    EMPTY_NODE_DATA_RECORD[PROJECT_STATUS.RELEASED]
  ];
};

export const getInitialEdges = () => {
  return EMPTY_EDGE_LIST;
};
