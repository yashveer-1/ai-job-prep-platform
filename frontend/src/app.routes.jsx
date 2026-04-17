import {createBrowserRouter} from "react-router-dom";
import Register from "./features/auth/pages/register.jsx";
import Login from "./features/auth/pages/login.jsx";
import Protected from "./features/auth/components/Protected.jsx";


export const router = createBrowserRouter([
   {
    path: "/",
    element: <Protected><h1>Welcome to the App</h1></Protected> // 👈 default page
  },
    {
    
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
  
]);