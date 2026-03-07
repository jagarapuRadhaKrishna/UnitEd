import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./theme/design-system.css";
import "./modules/auth/auth.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";

const restoreSpaFallbackPath = () => {
  try {
    const currentUrl = new URL(window.location.href);
    const redirectPath = window.sessionStorage.getItem("spa-fallback-path");
    const cameFromFallback = currentUrl.searchParams.has("spa-fallback");

    if (!redirectPath) {
      if (cameFromFallback) {
        currentUrl.searchParams.delete("spa-fallback");
        const cleanUrl = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
        window.history.replaceState(null, "", cleanUrl);
      }
      return;
    }

    if (window.location.pathname === "/" || cameFromFallback) {
      window.sessionStorage.removeItem("spa-fallback-path");
      window.history.replaceState(null, "", redirectPath);
    }
  } catch (error) {
    console.error("Failed to restore SPA fallback path:", error);
  }
};

if (typeof window !== "undefined") {
  restoreSpaFallbackPath();
}

createRoot(document.getElementById("root")!).render(<App />);
