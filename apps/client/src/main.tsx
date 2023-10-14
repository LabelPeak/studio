import { ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "@/configs/router.tsx";
import "./index.css";
import "virtual:uno.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={{
      token: {
        colorPrimary: "#5E81AC"
      }
    }}>
      <RouterProvider router={router}/>
    </ConfigProvider>
  </React.StrictMode>
);