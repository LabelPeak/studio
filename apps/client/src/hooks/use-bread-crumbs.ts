import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { IAccess } from "./useAccess";

// @unocss-include
export const MENU_ITEMS: Array<{
  name: string;
  url: string;
  icon: string;
  access?: keyof IAccess;
}> = [
  { name: "Projects", url: "/project", icon: "i-mdi-folder", access: "canSeeStaff" },
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: "i-mdi-view-dashboard",
    access: "canSeeSuperAdmin"
  },
  { name: "Staffs", url: "/staff", icon: "i-mdi-account-group", access: "canSeeSuperAdmin" },
  { name: "User", url: "/user", icon: "i-mdi-account-circle" }
] as const;

export const useBreadCrumbs = () => {
  const location = useLocation();
  const currentTab = useMemo(() => {
    const matchedTarget = MENU_ITEMS.find((item) => location.pathname.startsWith(item.url));
    return matchedTarget?.name || "";
  }, [location]);

  return {
    currentTab
  };
};
