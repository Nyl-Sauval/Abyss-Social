import React, {type ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {API_BASE_URL} from "../config";
import type {User} from "../types/User.ts";
import type {AuthContextType} from "./AuthContextBase";
import {AuthContext} from "./AuthContextBase";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [hasInitialized, setHasInitialized] = useState(() => !localStorage.getItem("token"));
  const isLoading = !!token && !hasInitialized;

  const clearAuthState = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setHasInitialized(true);
  }, []);

  const fetchCurrentUser = useCallback(async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        clearAuthState();
      }
    } catch (error) {
      console.error(error);
      clearAuthState();
    } finally {
      setHasInitialized(true);
    }
  }, [clearAuthState]);

  const deleteAccount = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        clearAuthState();
      } else {
        const errorData = await response.text();
        console.error("Détail de l'erreur serveur :", errorData);
        // On log l'erreur; le caller peut afficher un message générique si besoin.
      }
    } catch (error) {
      console.error("Erreur de suppression:", error);
    }
  }, [token, clearAuthState]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      await fetchCurrentUser(token);
    })();
  }, [token, fetchCurrentUser]);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    setHasInitialized(false);
    await fetchCurrentUser(token);
  }, [token, fetchCurrentUser]);

  const login = useCallback(async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setHasInitialized(false);
    await fetchCurrentUser(newToken);
  }, [fetchCurrentUser]);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }

    clearAuthState();
  }, [token, clearAuthState]);

  const contextValue: AuthContextType = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      setToken,
      deleteAccount,
      fetchCurrentUser,
      refreshUser,
    }),
    [user, token, isLoading, login, logout, deleteAccount, fetchCurrentUser, refreshUser],
  );

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
};