import "./index.css";
import "virtual:uno.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { IntlProvider } from "react-intl";
import { RouterProvider } from "react-router-dom";

import router from "@/configs/router.tsx";

import { globalQueryClient } from "./configs/react-query";
import { loadLocale } from "./i18n";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#5E81AC"
        }
      }}
    >
      <IntlProvider {...loadLocale(navigator.language)}>
        <QueryClientProvider client={globalQueryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </IntlProvider>
    </ConfigProvider>
  </React.StrictMode>
);
