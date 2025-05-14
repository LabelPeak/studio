import { useBreadCrumbs } from "@/hooks/use-bread-crumbs";

export default function BreakCrumbIndicator() {
  const { currentTab } = useBreadCrumbs();
  return (
    <div className="px-4 b-l-1 b-l-solid b-color-nord-snow-0 flex items-center">{currentTab}</div>
  );
}
