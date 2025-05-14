import { createBrowserRouter } from "react-router-dom";

import WelcomePage from "@/components/WelcomePage";
import { DashboardPage } from "@/pages/dashboard";
import Layout from "@/pages/layout";
import { LoginPage } from "@/pages/login";
import { ProjectPage } from "@/pages/project";
import { ProjectDetailPage } from "@/pages/project/[id]/index";
import ProjectSettingPage from "@/pages/project/[id]/settings";
import ProjectSettingAccess from "@/pages/project/[id]/settings/access";
import ProjectSettingGeneral from "@/pages/project/[id]/settings/general";
import ProjectSettingMember from "@/pages/project/[id]/settings/member";
import ProjectSettingPreset from "@/pages/project/[id]/settings/preset";
import StaffPage from "@/pages/staff";
import { UserPage } from "@/pages/user";

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
        element: <WelcomePage />
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
          },
          {
            path: "preset",
            element: <ProjectSettingPreset />
          },
          {
            path: "member",
            element: <ProjectSettingMember />
          },
          {
            path: "access",
            element: <ProjectSettingAccess />
          }
        ]
      },
      {
        path: "staff",
        element: <StaffPage />
      },
      {
        path: "user",
        element: <UserPage />
      }
    ]
  }
]);

export default router;
