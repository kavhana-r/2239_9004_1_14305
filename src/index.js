import "@ant-design/v5-patch-for-react-19";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ConfigProvider, App as AntdApp } from "antd";

import App from "./App";
import { store } from "./store";

import "antd/dist/reset.css";
import "./index.css";
import "./App.css";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#10b981",
            colorPrimaryHover: "#059669",
            colorPrimaryActive: "#047857",
            colorSuccess: "#10b981",
            colorWarning: "#f59e0b",
            colorError: "#ef4444",
            colorInfo: "#0ea5e9",
            borderRadius: 10,
            fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            colorBgBase: "#ffffff",
          },
          components: {
            Button: {
              fontWeight: 600,
              borderRadius: 8,
              controlHeight: 40,
              colorPrimary: "#10b981",
              colorPrimaryHover: "#059669",
            },
            Card: {
              borderRadiusLG: 16,
            },
            Table: {
              borderRadiusLG: 14,
              headerBg: "#f8fafc",
              headerColor: "#475569",
            },
            Modal: {
              borderRadiusLG: 16,
            },
            Input: {
              borderRadius: 8,
              controlHeight: 40,
            },
            Select: {
              borderRadius: 8,
              controlHeight: 40,
            },
            Menu: {
              darkItemBg: "transparent",
              darkItemSelectedBg: "#10b981",
              darkItemSelectedColor: "#ffffff",
              darkItemHoverBg: "rgba(16, 185, 129, 0.15)",
              darkItemColor: "#94a3b8",
            },
          },
        }}
      >
        <AntdApp>
          <App />
        </AntdApp>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);