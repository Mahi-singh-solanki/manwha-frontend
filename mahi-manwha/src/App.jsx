import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Reading } from "./components/Reading";
import { Home } from "./components/Home";
import { List } from "./components/List";
const App=()=>{
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
  return <RouterProvider router={router}/>
}

export default App;