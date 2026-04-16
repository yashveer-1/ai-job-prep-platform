import { useContext } from "react";
import  {AuthContext} from "../auth.context.jsx";
import { loginUser, registerUser, logoutUser, getCurrentUser } from "../services/auth.api.js";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);
  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const userData = await loginUser({ email, password });
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const userData = await registerUser({ name, email, password });
      setUser(userData);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Fetching current user failed:", error);
      setUser(null); // Clear user on failure
    } finally {
      setLoading(false);
    }
  };    

  return { user,  loading, handleLogin, handleRegister, handleLogout, fetchCurrentUser };
};