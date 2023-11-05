import { Role } from "@/interfaces/project";
import useUser from "./useUser";

interface IProps {
  role?: Role;
}

export interface IAccess {
  canSeeSuperAdmin: boolean;
  canSeeAdmin: boolean;
  canSeeChecker: boolean;
  canSeeAnnotator: boolean;
}

/**
 * Access status combining project role
 * and user isAdmin
 *
 * Default role: annotator
 */
export function useAccess(props: IProps): IAccess {
  const { role } = props;

  const user = useUser();

  return {
    canSeeSuperAdmin: user.isAdmin || false,
    canSeeAdmin: role === Role.admin,
    canSeeChecker: role === Role.checker,
    canSeeAnnotator: role === Role.annotator,
  };
}