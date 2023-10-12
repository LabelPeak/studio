import { DashboardPage } from "@/pages/dashboard";
import Layout from "@/pages/layout";
import { LoginPage } from "@/pages/login";
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
      }
    ]
  }
]);

export default router;