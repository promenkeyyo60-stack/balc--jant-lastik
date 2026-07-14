import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// PWA Service Worker kaydı
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => {
        if (regs.length > 0) {
          console.log("PWA aktif");
        } else {
          // Manuel kayıt (fallback)
          const base = import.meta.env.BASE_URL ?? "/";
          navigator.serviceWorker
            .register(`${base}sw.js`, { scope: base })
            .then(() => console.log("PWA aktif"))
            .catch((err) => console.log("Hata:", err));
        }
      });
  });
}
