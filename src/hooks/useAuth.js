"use client"
import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Get user role from custom claims
        const idTokenResult = await user.getIdTokenResult();
        setUserRole(idTokenResult.claims.role || 'user');
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const isAdmin = userRole === 'admin';
  const isUser = userRole === 'user';

  return (
    <AuthContext.Provider value={{ user, userRole, isAdmin, isUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};