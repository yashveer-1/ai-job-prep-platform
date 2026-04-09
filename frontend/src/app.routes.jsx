import {createBrowserRouter} from "react-router-dom";
import Register from "./features/auth/pages/register.jsx";
import Login from "./features/auth/pages/login.jsx";


export const router = createBrowserRouter([
   {
    path: "/",
    element: <Login /> // 👈 default page
  },
    {
    
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  }
]);