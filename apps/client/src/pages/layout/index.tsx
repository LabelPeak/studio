import { IAccess, useAccess } from "@/hooks/useAccess";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import LoadingLayer from "@/components/LoadingLayer";
import { ProductName } from "@/configs/constants";
import StaffService from "@/services/staff";
import UserIdentifier from "./UserIdentifier";
import classnames from "classnames";
import { message } from "antd";
import useAuth from "@/hooks/useAuth";
import { useRequest } from "ahooks";
import useUser from "@/hooks/useUser";

const featureList: Array<{
  name: string;
  url: string;
  icon: string;
  access?: keyof IAccess;
}> = [
  { name: "Projects", url: "/project", icon: "i-mdi-folder", access: "canSeeStaff" },
  { name: "Dashboard", url: "/dashboard", icon: "i-mdi-view-dashboard", access: "canSeeSuperAdmin" },
  { name: "Staffs", url: "/staff", icon: "i-mdi-account-group", access: "canSeeSuperAdmin" },
  { name: "User", url: "/user", icon: "i-mdi-account-circle" },
];

export default function Layout() {
  const { realname, setUser, reset: resetUser } = useUser();
  const { reset: resetAuth } = useAuth();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const access = useAccess();
  const navigate = useNavigate();

  const { loading: logining } = useRequest(StaffService.getProfile, {
    pollingInterval: 30 * 1000,
    onSuccess: (res) => {
      if (res.code === 200 && res.data) {
        setUser(res.data);
        setIsFirstLoad(false);
      } else {
        throw new Error(res.msg);
      }
    },
    onError: () => {
      handleLoginExpired();
    },
  });

  function handleLoginExpired() {
    resetUser();
    resetAuth();
    navigate("/login");
    message.warning("登录信息过期，请重新登录");
  }

  const location = useLocation();
  const currentTab = useMemo(() => {
    const matchedTarget = featureList.find(item =>
      location.pathname.startsWith(item.url)
    );
    return matchedTarget?.name || "";
  }, [location]);

  return (
    <section id="layout" className="h-[100vh] flex flex-col min-w-3xl">
      <header className="h-12 b-b-1 b-color-nord-snow-0 b-b-solid px-4 flex flex-shrink-0">
        <Link to="/" className="decoration-none flex items-center m-r-4">
          <img src="/favicon.png" className="w-6 h-6 m-r-2" />
          <span className="font-600 c-nord-polar-2 text-4"> { ProductName } </span>
        </Link>
        <div className="px-4 b-l-1 b-l-solid b-color-nord-snow-0 flex items-center">
          { currentTab }
        </div>
        <div className="flex-auto" />
        <div className="flex items-center">
          <UserIdentifier name={ realname || "" }/>
        </div>
      </header>
      <section className="flex flex-auto of-hidden">
        <aside className="p-3 b-r-1 b-r-solid b-color-nord-snow-0 min-w-12">
          { !(logining && isFirstLoad) ? featureList
            .filter(item => (item.access === undefined) || access[item.access])
            .map(item => (
              <Link
                className={
                  classnames(
                    "block p-3 r-2 b-rd-2 mb-1 c-nord-frost-3",
                    currentTab === item.name
                      ? "mb bg-nord-frost-3 bg-op-30" : "hover:bg-nord-snow-2 "
                  )}
                key={item.name}
                to={item.url}
                title={item.name}
              >
                <div className={classnames([item.icon, "text-6"])} />
              </Link>
            )): null}
        </aside>
        <main className="flex-auto bg-nord-snow-2 of-hidden">
          { logining && isFirstLoad ?  <LoadingLayer /> : <Outlet /> }
        </main>
      </section>
    </section>
  );
}