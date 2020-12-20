import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
import configureStore from "./store";

import { initApi, initInterceptors } from "axios-config";

import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import { isSSOEnabled } from "Constants";
import { AppPlaceholder } from "shared/components";

initApi();

ReactDOM.render(
  <React.StrictMode>
    {isSSOEnabled() ? (
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{ onLoad: "login-required" }}
        LoadingComponent={<AppPlaceholder />}
        isLoadingCheck={(keycloak) => {
          if (keycloak.authenticated) {
            initInterceptors(() => {
              return new Promise<string>((resolve, reject) => {
                if (keycloak.token) {
                  keycloak
                    .updateToken(5)
                    .then(() => resolve(keycloak.token!))
                    .catch(() => reject("Failed to refresh token"));
                } else {
                  keycloak.login();
                  reject("Not logged in");
                }
              });
            });
          }

          return !keycloak.authenticated;
        }}
      >
        <Provider store={configureStore()}>
          <App />
        </Provider>
      </ReactKeycloakProvider>
    ) : (
      <Provider store={configureStore()}>
        <App />
      </Provider>
    )}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
