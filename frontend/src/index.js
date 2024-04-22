import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
const domain_secret = process.env.REACT_APP_DOMAIN;
const client_secret = process.env.REACT_APP_CLIENT_ID;
console.log("DOMAIN", domain_secret);
console.log("CLIENT", client_secret);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain_secret}
      clientId={client_secret}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
