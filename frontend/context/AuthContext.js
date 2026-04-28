import { createContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  clearStoredToken,
  setStoredToken,
  getStoredToken
} from "@/services/api";
import {
  fetchProfile,
  loginCustomer,
  loginMechanic,
  signupCustomer,
  signupMechanic,
  updateProfile as persistProfile
} from "@/services/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function hydrateSession() {
      try {
        const token = getStoredToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const profile = await fetchProfile();
        setUser(profile);
      } catch (error) {
        console.error("Session hydration failed", error);
        const isNetworkError = error.code === "ECONNABORTED" || !error.response;
        if (isNetworkError) {
          clearStoredToken();
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    const hydrationTimeout = setTimeout(() => {
      setLoading(false);
    }, 8000);

    hydrateSession().finally(() => clearTimeout(hydrationTimeout));
  }, []);

  const login = async (payload) => {
    const authResult = payload.role === "mechanic" ? await loginMechanic(payload) : await loginCustomer(payload);
    const principal = authResult.user || authResult.mechanic;
    setStoredToken(authResult.token);
    setUser(principal);
    toast.success(`Welcome back, ${principal.name.split(' ')[0]}`);
    return principal;
  };

  const signup = async (payload) => {
    const authResult = payload.role === "mechanic" ? await signupMechanic(payload) : await signupCustomer(payload);
    const principal = authResult.user || authResult.mechanic;
    setStoredToken(authResult.token);
    setUser(principal);
    toast.success("Account created successfully");
    return principal;
  };

  const refreshUser = async () => {
    const profile = await fetchProfile();
    setUser(profile);
    return profile;
  };

  const updateProfile = async (payload) => {
    const profile = await persistProfile(payload);
    setUser(profile);
    toast.success("Profile updated");
    return profile;
  };

  const logout = () => {
    clearStoredToken();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      signup,
      refreshUser,
      updateProfile,
      logout,
      setUser
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
