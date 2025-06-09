import { last } from "remeda";
import { PROJECT_STATUS, ProjectStatus, ProjectStatusRecord } from "shared";

interface UsePipelineNodesOptions {
  statusHistory: ProjectStatusRecord[];
}

export const EMPTY_NODE_DATA_RECORD: Record<ProjectStatus, ProjectStatusRecord> = {
  [PROJECT_STATUS.PENDING]: {
    status: PROJECT_STATUS.PENDING,
    startAt: Date.now()
  },
  [PROJECT_STATUS.ANNOTATING]: {
    status: PROJECT_STATUS.ANNOTATING,
    startAt: Date.now()
  },
  [PROJECT_STATUS.CHECKING]: {
    status: PROJECT_STATUS.CHECKING,
    startAt: Date.now()
  },
  [PROJECT_STATUS.RELEASED]: {
    status: PROJECT_STATUS.RELEASED,
    startAt: Date.now()
  },
  [PROJECT_STATUS.PRE_ANNOTATING]: {
    status: PROJECT_STATUS.PRE_ANNOTATING,
    startAt: Date.now()
  },
  [PROJECT_STATUS.RE_ANNOTATING]: {
    status: PROJECT_STATUS.RE_ANNOTATING,
    startAt: Date.now()
  },
  [PROJECT_STATUS.RE_CHECKING]: {
    status: PROJECT_STATUS.RE_CHECKING,
    startAt: Date.now()
  },
  [PROJECT_STATUS.APPROVED]: {
    status: PROJECT_STATUS.APPROVED,
    startAt: Date.now()
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
  }
];

export function UsePipelineNodes({ statusHistory }: UsePipelineNodesOptions) {
  const currentStatus = last(statusHistory)?.status;

  if (currentStatus === PROJECT_STATUS.PENDING) {
    return statusHistory.map((item) => {
      return {
        id: item.status,
        data: item,
        position: { x: 0, y: 0 },
        type: "status"
      };
    });
  }
}
