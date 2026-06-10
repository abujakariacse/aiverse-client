import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase.config';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Persistence loader
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_URL}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            // Token expired or invalid
            logout();
          }
        } catch (error) {
          console.error('Error fetching profile on load:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      photoURL: data.photoURL,
      role: data.role,
      subscriptionStatus: data.subscriptionStatus,
    });
    return data;
  };

  // Register handler
  const register = async (name, email, photoURL, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, photoURL, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      photoURL: data.photoURL,
      role: data.role,
      subscriptionStatus: data.subscriptionStatus,
    });
    return data;
  };

  // Google Login handler
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      // Sync with our backend
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fbUser.displayName,
          email: fbUser.email,
          photoURL: fbUser.photoURL,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Google Login failed on server');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        photoURL: data.photoURL,
        role: data.role,
        subscriptionStatus: data.subscriptionStatus,
      });
      return data;
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.warn('Firebase signout warning:', error);
    }
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  const updateProfileState = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// AuthContext user provider documentation
