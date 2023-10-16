import { Link, Outlet, useLocation } from "react-router-dom";
import { ProductName } from "@/configs/constants";
import { Spin } from "antd";
import UserIdentifier from "./UserIdentifier";
import UserService from "@/services/user";
import classnames from "classnames";
import { useRequest } from "ahooks";
import useUser from "@/hooks/useUser";

export default function Layout() {
  const { username, setUser } = useUser();
  const { loading: logining } = useRequest(
    UserService.getProfile, {
      onSuccess: (res) => {
        if (res.data) {
          const { username } = res.data;
          setUser({ username });
        }
      }
    });

  const featureList = [
    { name: "Dashboard", url: "/dashboard", icon: "i-mdi-view-dashboard" },
    { name: "Projects", url: "/project", icon: "i-mdi-folder" },
    { name: "User", url: "/user", icon: "i-mdi-account-circle" },
  ];

  const location = useLocation();

  return (
    <section id="layout" className="h-[100vh] flex flex-col min-w-3xl">
      <header className="h-12 b-b-1 b-color-nord-snow-0 b-b-solid px-4 flex">
        <Link to="/dashboard" className="decoration-none flex items-center m-r-4">
          <img src="/favicon.png" className="w-6 h-6 m-r-2" />
          <span className="font-600 c-nord-polar-2 text-4"> { ProductName } </span>
        </Link>
        <div className="px-4 b-l-1 b-l-solid b-color-nord-snow-0 flex items-center">
          { location.pathname }
        </div>
        <div className="flex-auto" />
        <div className="flex items-center">
          <UserIdentifier name={ username || "" }/>
        </div>
      </header>
      <section className="flex flex-auto">
        <aside className="p-3 b-r-1 b-r-solid b-color-nord-snow-0 min-w-12">
          { !logining ? featureList.map(item => (
            <Link
              className={
                classnames(
                  "block p-3 r-2 b-rd-2 mb-1 c-nord-frost-3",
                  location.pathname === item.url
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
        <main className="flex-auto bg-nord-snow-2">
          { logining ?
            <div className="flex justify-center items-center h-full">
              <Spin size="large"/>
            </div>
            : <Outlet />
          }
        </main>
      </section>
    </section>
  );
}