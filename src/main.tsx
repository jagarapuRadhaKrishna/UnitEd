import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./theme/design-system.css";
import "./modules/auth/auth.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
