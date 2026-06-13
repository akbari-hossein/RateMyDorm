"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, formatApiError } from "@/lib/api";
import { getTelegramInitData, initTelegramWebApp } from "@/lib/telegram";
import type { Student } from "@/types";

const TOKEN_KEY = "ratemydorm_access";
const REFRESH_KEY = "ratemydorm_refresh";
const USER_KEY = "ratemydorm_user";

interface AuthContextValue {
  user: Student | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsOnboarding: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<Student>) => Promise<Student>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredUser(): Student | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Student;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const persistSession = useCallback(
    (access: string, refresh: string, student: Student) => {
      localStorage.setItem(TOKEN_KEY, access);
      localStorage.setItem(REFRESH_KEY, refresh);
      localStorage.setItem(USER_KEY, JSON.stringify(student));
      api.setToken(access);
      setUser(student);
    },
    []
  );

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    api.setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async () => {
    setError(null);
    const initData = getTelegramInitData();

    if (!initData) {
      setError(
        "Telegram authentication data is unavailable. Open this app inside Telegram."
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.authTelegram(initData);
      persistSession(response.access, response.refresh, response.user);
    } catch (err) {
      setError(formatApiError(err));
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [clearSession, persistSession]);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    try {
      const updated = await api.getStudent(user.id);
      persistSession(
        localStorage.getItem(TOKEN_KEY) || "",
        localStorage.getItem(REFRESH_KEY) || "",
        updated
      );
    } catch {
      // keep cached user if refresh fails
    }
  }, [persistSession, user]);

  const updateProfile = useCallback(
    async (data: Partial<Student>) => {
      if (!user) {
        throw new Error("Not authenticated");
      }
      const updated = await api.updateStudent(user.id, data);
      persistSession(
        localStorage.getItem(TOKEN_KEY) || "",
        localStorage.getItem(REFRESH_KEY) || "",
        updated
      );
      return updated;
    },
    [persistSession, user]
  );

  useEffect(() => {
    initTelegramWebApp();

    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = loadStoredUser();

    if (token && storedUser) {
      api.setToken(token);
      setUser(storedUser);
      setIsLoading(false);
      return;
    }

    login();
  }, [login]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      needsOnboarding: !!user && (!user.university || !user.current_building),
      error,
      login,
      logout: clearSession,
      refreshUser,
      updateProfile,
    }),
    [
      user,
      isLoading,
      error,
      login,
      clearSession,
      refreshUser,
      updateProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
