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
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("token");
    }
  }, [user, isHydrated]);

  const login = (userData) => {
    // Ambil role murni dari backend database (INSTRUCTOR / STUDENT)
    const backendRole = String(userData?.role || "").toUpperCase();
    const isGuru = backendRole === "INSTRUCTOR";

    const nextUser = {
      ...userData,
      role: isGuru ? "INSTRUCTOR" : "STUDENT",
      isAuthenticated: true,
    };

    setUser(nextUser);
    return nextUser;
  };

  const register = (userData) => {
    return login(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(STORAGE_KEY);
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
      isHydrated,
      loading: !isHydrated,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, isHydrated],
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