import { createBrowserRouter } from "react-router";
import { AppLayout } from "./layout/AppLayout";
import { RouterProvider } from "react-router";
import { Login } from "./pages/Login";
import { useEffect,useState } from "react";
import { Home } from "./pages/Home";
import { Chapters } from "./pages/Chapters";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Reading } from "./pages/Reading";
import { Completed } from "./pages/Completed";
import { Updated } from "./pages/Updated";
import { Profile } from "./pages/Profile";
import { SearchResult } from "./pages/SearchResult";
import { AddNew } from "./pages/AddNew";
const App=({ installPWA })=>{
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
  const router=createBrowserRouter([
    {
      path:"/",
      element:<AppLayout/>,
      children:([
        {
          path:"/",
          element:<Home/>
        },
        {
        path: "/chapters/:seriesId",
        element: <Chapters />
         },
         {
      path: "/:seriesId/chapters/:chapterId",
      element: <Reading />
    },
    {
      path:"/completed",
      element:<Completed/>
    },
    {
      path:"/updated",
      element:<Updated/>
    },
    {
      path:"/profile",
      element:<Profile/>
    },
    {
      path:"/search/:filter",
      element:<SearchResult/>
    },
    {
      path:"/add",
      element:<AddNew/>
    }
      ])     
    },
    {
      path:"/login",
      element:<Login/>
    }
  ])
  return <>
  <div>
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
  </div>
  </>
}

export default App;