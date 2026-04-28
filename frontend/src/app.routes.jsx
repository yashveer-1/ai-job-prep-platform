import {createBrowserRouter} from "react-router-dom";
import Register from "./features/auth/pages/register.jsx";
import Login from "./features/auth/pages/login.jsx";
import Protected from "./features/auth/components/Protected.jsx";
import Dashboard from "./features/interview/pages/Dashboard.jsx";


export const router = createBrowserRouter([
   {
    path: "/",
    element: <Protected><Dashboard /></Protected>
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
