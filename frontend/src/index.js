import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store/mainStore";

import App from "./App";
// Bootstrap (incl. normalise)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// Global styles that overrides Boostrap reboot
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
