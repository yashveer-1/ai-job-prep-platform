import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ start as false OR handle properly
  const [loading, setLoading] = useState(false);

  // ✅ optional: simulate init (or fetch user later)
  useEffect(() => {
    setLoading(false); // ensures UI is not blocked
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}