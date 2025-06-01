import { createBrowserRouter } from "react-router-dom";

import WelcomePage from "@/components/WelcomePage";
import DefaultLayout from "@/layouts/default";
import ProjectSettingAccess from "@/pages/(project-settings)/access";
import ProjectSettingGeneral from "@/pages/(project-settings)/general";
import ProjectSettingMember from "@/pages/(project-settings)/member";
import ProjectSettingPreset from "@/pages/(project-settings)/preset";
import ProjectSettingPage from "@/pages/(project-settings)/settings-entry";
import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { ProjectDetailPage } from "@/pages/project-detail/index";
import { ProjectListPage } from "@/pages/project-list";
import StaffPage from "@/pages/staff";
import { UserPage } from "@/pages/user";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: <DefaultLayout />,
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
        element: <ProjectListPage />
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
