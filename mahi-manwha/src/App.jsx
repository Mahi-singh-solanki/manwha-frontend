import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Reading } from "./components/Reading";
import { Home } from "./components/Home";
import { List } from "./components/List";
import { Section } from "./components/Section";
import { Login } from "./components/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const App = ({ installPWA }) => {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const show = () => setCanInstall(true);
    const hide = () => setCanInstall(false);

    window.addEventListener("pwa-install-available", show);
    window.addEventListener("pwa-install-response", hide);

    return () => {
      window.removeEventListener("pwa-install-available", show);
      window.removeEventListener("pwa-install-response", hide);
    };
  }, []);
  const queryClient = new QueryClient()
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />
    },
    {
      path: "/:seriesId/chapter/:chapterId",
      element: <Reading />
    },
    {
      path: "/list/:seriesId",
      element: <List />
    },
    {
      path: "/home",
      element: <Home />
    },
    {
      path: "/section",
      element: <Section />
    }
  ])
  return <>
    <QueryClientProvider client={queryClient}>
      {canInstall && (
  <button
    onClick={installPWA}
    style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      padding: "10px 16px",
      background: "#111",
      color: "white",
      borderRadius: "8px",
      border: "none",
      zIndex: 9999,
    }}
  >
    Install App
  </button>
)}
      <RouterProvider router={router} />
    </QueryClientProvider>
  </>
}

export default App;