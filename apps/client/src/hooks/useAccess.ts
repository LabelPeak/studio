import { Role } from "@/interfaces/user-project-relation";

import useUser from "./useUser";

interface IProps {
  role?: Role;
}

export interface IAccess {
  canSeeSuperAdmin: boolean;
  canSeeStaff: boolean;
  canSeeAdmin: boolean;
  canSeeChecker: boolean;
  canSeeAnnotator: boolean;
}

/**
 * Access status combining project role
 * and superadmin
 *
 * Default role: annotator
 */
export function useAccess(props?: IProps): IAccess {
  const { role } = props || {};
  const user = useUser();

  return {
    canSeeSuperAdmin: user.superadmin || false,
    canSeeStaff: user.superadmin === false,
    canSeeAdmin: role === Role.admin,
    canSeeChecker: role === Role.checker,
    canSeeAnnotator: role === Role.annotator
  };
}
