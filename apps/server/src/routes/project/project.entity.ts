export const PROJECT_ROLE = {
  ADMIN: "admin",
  ANNOTATOR: "annotator",
  CHECKER: "checker"
} as const;

export const PROJECT_ACCESS = {
  READ: "read",
  WRITE: "write",
  HIDDEN: "hidden"
} as const;

export const PROJECT_STATUS_KEY = {
  ANNOTATING: "annotating",
  CHECKING: "checking",
  NOT_START: "not-start",
  RELEASING: "releasing",
  RE_ANNOTATING: "re-annotating",
  RE_CHECKING: "re-checking"
};
