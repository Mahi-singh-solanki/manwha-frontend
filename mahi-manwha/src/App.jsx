import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Reading } from "./components/Reading";
import { Home } from "./components/Home";
import { List } from "./components/List";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const App=()=>{
  const queryClient=new QueryClient()
  const router=createBrowserRouter([
    {
      path:"/",
      element:<Home/>
    },
    {
      path:"/:seriesId/chapter/:chapterId",
      element:<Reading/>
    },
    {
      path:"/list/:seriesId",
      element:<List/>
    }
  ])
  return <>
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}/>
  </QueryClientProvider>
  </>
}

export default App;