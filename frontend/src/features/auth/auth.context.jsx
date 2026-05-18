import { useState, useEffect } from 'react';
import { AuthContext } from './auth.context-value.js';
import { getCurrentUser } from './services/auth.api.js';
import { getAuthUser, hasAuthToken } from '../../services/api.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (hasAuthToken() ? getAuthUser() : null));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function hydrateUser() {
      const cachedUser = hasAuthToken() ? getAuthUser() : null;

      if (cachedUser) {
        if (isMounted) {
          setUser(cachedUser);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await getCurrentUser();
        if (isMounted) {
          setUser(data.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    hydrateUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
