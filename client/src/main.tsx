import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../node_modules/semantic-ui-css/semantic.min.css";
import "./index.scss";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
