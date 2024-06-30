import React from "react";
import "./index.css";
import App from "./App";
import Topbar from "./component/Topbar";
import { RecoilRoot } from "recoil";
import { createRoot } from "react-dom/client";

/* Pick a theme of your choice */

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <div className="p-6">
        <Topbar />
        <App />
      </div>
    </RecoilRoot>
  </React.StrictMode>
);
