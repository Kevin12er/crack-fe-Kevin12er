"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "learnbridge-auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to read auth session:", error);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, isHydrated]);

  const login = ({ email, password, role, name }) => {
    const safeName = name || email?.split("@")[0] || "Pengguna";
    const nextUser = {
      id: Date.now().toString(),
      name: safeName,
      email,
      role,
      password,
      isAuthenticated: true,
    };

    setUser(nextUser);
    return nextUser;
  };

  const register = ({ email, password, role, name }) => {
    const safeName = name || email?.split("@")[0] || "Pengguna";
    const nextUser = {
      id: Date.now().toString(),
      name: safeName,
      email,
      role,
      password,
      isAuthenticated: true,
    };

    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = ({ name }) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;

      return {
        ...currentUser,
        name: name?.trim() || currentUser.name,
      };
    });
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.isAuthenticated),
      login,
      register,
      logout,
      updateProfile,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
