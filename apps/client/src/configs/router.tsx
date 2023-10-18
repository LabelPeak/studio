import { DashboardPage } from "@/pages/dashboard";
import Layout from "@/pages/layout";
import { LoginPage } from "@/pages/login";
import { ProjectDetailPage } from "@/pages/project/[id]/index";
import { ProjectPage } from "@/pages/project";
import ProjectSettingGeneral from "@/pages/project/[id]/settings/general";
import ProjectSettingPage from "@/pages/project/[id]/settings";
import { UserPage } from "@/pages/user";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: "dashboard",
        element: <DashboardPage />
      },
      {
        path: "project",
        element: <ProjectPage />
      },
      {
        path: "project/:id",
        element: <ProjectDetailPage />
      },
      {
        path: "project/:id/settings",
        element: <ProjectSettingPage />,
        children: [
          {
            index: true,
            element: <ProjectSettingGeneral />
          },
          {
            path: "general",
            element: <ProjectSettingGeneral />
          }
        ]
      },
      {
        path: "user",
        element: <UserPage />
      }
    ]
  }
]);

export default router;