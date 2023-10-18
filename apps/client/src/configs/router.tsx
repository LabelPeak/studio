import { DashboardPage } from "@/pages/dashboard";
import Layout from "@/pages/layout";
import { LoginPage } from "@/pages/login";
import { ProjectDetailPage } from "@/pages/project/[id]/index";
import { ProjectPage } from "@/pages/project";
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
        path: "user",
        element: <UserPage />
      }
    ]
  }
]);

export default router;