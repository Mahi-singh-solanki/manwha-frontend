import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();          // stop auto-mini bar
  deferredPrompt = e;          // save for later
  window.dispatchEvent(new Event("pwa-install-available"));
});
export function installPWA() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(() => {
    deferredPrompt = null;
    window.dispatchEvent(new Event("pwa-install-response"));
  });
}
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("SW registered:", reg.scope))
      .catch((err) => console.error("SW registration failed:", err));
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App installPWA={installPWA}/>
  </StrictMode>,
)
