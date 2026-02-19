import { Footer } from "./footer"
import { Outlet } from "react-router-dom"


export const AppLayout=()=>{
    return <div>
    <Outlet/>
    <Footer/>
    </div>
}