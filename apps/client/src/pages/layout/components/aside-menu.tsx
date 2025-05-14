import classNames from "classnames";
import { Link } from "react-router-dom";

import { MENU_ITEMS, useBreadCrumbs } from "@/hooks/use-bread-crumbs";
import { useAccess } from "@/hooks/useAccess";

export default function AsideMenu() {
  const access = useAccess();
  const { currentTab } = useBreadCrumbs();

  return (
    <aside className="p-3 b-r-1 b-r-solid b-color-nord-snow-0 min-w-12">
      {MENU_ITEMS.filter((item) => item.access === undefined || access[item.access]).map((item) => (
        <Link
          className={classNames(
            "block p-3 r-2 b-rd-2 mb-1 c-nord-frost-3",
            currentTab === item.name ? "mb bg-nord-frost-3 bg-op-30" : "hover:bg-nord-snow-2 "
          )}
          key={item.name}
          to={item.url}
          title={item.name}
        >
          <div className={classNames([item.icon, "text-6"])} />
        </Link>
      ))}
    </aside>
  );
}
