import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Topbar from "./component/Topbar";

ReactDOM.render(
  <React.StrictMode>
    <body className=" p-4">
      <Topbar />
      <App />
    </body>
  </React.StrictMode>,
  document.getElementById("root")
);
