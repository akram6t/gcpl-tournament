import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) return { success: false, error: data.error || "Login failed" };

      localStorage.setItem("gcpl_token", data.token);
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  },

  signup: async (name, email, password, role) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();

      if (!res.ok) return { success: false, error: data.error || "Signup failed" };

      localStorage.setItem("gcpl_token", data.token);
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  },

  logout: () => {
    localStorage.removeItem("gcpl_token");
    set({ user: null, token: null, isLoading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("gcpl_token");
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, token, isLoading: false });
      } else {
        localStorage.removeItem("gcpl_token");
        set({ user: null, token: null, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
