import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import store from "./store/mainStore";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
// Bootstrap (incl. normalise)
import "bootstrap/dist/css/bootstrap.min.css";
// Global styles that overrides Boostrap reboot
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
