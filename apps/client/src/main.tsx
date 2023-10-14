import { ConfigProvider } from "antd";
import { IntlProvider } from "react-intl";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { loadLocale } from "./i18n";
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
      <IntlProvider { ...loadLocale(navigator.language) }>
        <RouterProvider router={router}/>
      </IntlProvider>
    </ConfigProvider>
  </React.StrictMode>
);