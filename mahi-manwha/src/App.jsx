import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Reading } from "./components/Reading";
import { Home } from "./components/Home";
import { List } from "./components/List";
import { Section } from "./components/Section";
import { Login } from "./components/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const App=()=>{
  const queryClient=new QueryClient()
  const router=createBrowserRouter([
    {
      path:"/",
      element:<Login/>
    },
    {
      path:"/:seriesId/chapter/:chapterId",
      element:<Reading/>
    },
    {
      path:"/list/:seriesId",
      element:<List/>
    },
    {
      path:"/home",
      element:<Home/>
    },
    {
      path:"/section",
      element:<Section/>
    }
  ])
  return <>
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}/>
  </QueryClientProvider>
  </>
}

export default App;