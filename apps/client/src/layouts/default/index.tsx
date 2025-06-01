import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link, Outlet } from "react-router-dom";

import ErrorFallback from "@/components/ErrorFallback";
import LoadingLayer from "@/components/LoadingLayer";
import { ProductName } from "@/configs/constants";

import AsideMenu from "./components/aside-menu";
import BreakCrumbIndicator from "./components/break-crumb-indicator";
import UserIdentifier from "./components/user-identifier";

export default function DefaultLayout() {
  return (
    <ErrorBoundary fallbackRender={ErrorFallback}>
      <section id="layout" className="h-[100vh] flex flex-col min-w-3xl">
        <header className="h-12 b-b-1 b-color-nord-snow-0 b-b-solid px-4 flex flex-shrink-0">
          <Link to="/" className="decoration-none flex items-center m-r-4">
            <img src="/favicon.png" className="w-6 h-6 m-r-2" />
            <span className="font-600 c-nord-polar-2 text-4"> {ProductName} </span>
          </Link>
          <div className="flex-auto flex flex justify-between">
            <BreakCrumbIndicator />
            <div className="flex items-center">
              <UserIdentifier />
            </div>
          </div>
        </header>
        <section className="flex flex-auto of-hidden">
          <AsideMenu />
          <main className="flex-auto bg-nord-snow-2 of-hidden">
            <Suspense fallback={<LoadingLayer />}>
              <Outlet />
            </Suspense>
          </main>
        </section>
      </section>
    </ErrorBoundary>
  );
}
