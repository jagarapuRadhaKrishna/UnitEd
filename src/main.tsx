import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./theme/design-system.css";
import "./modules/auth/auth.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";

// Restore SPA path if we were redirected from 404 fallback
const redirectPath = sessionStorage.getItem("spa-fallback-path");
if (redirectPath && window.location.pathname === "/") {
  sessionStorage.removeItem("spa-fallback-path");
  window.history.replaceState(null, "", redirectPath);
}

createRoot(document.getElementById("root")!).render(<App />);
