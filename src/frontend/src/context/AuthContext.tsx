import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { UserRole } from "../types";

// ─── Session storage keys ─────────────────────────────────────────────────────

const TOKEN_KEY = "schooldesk_token";
const USER_KEY = "schooldesk_user";

// ─── Stored session profile (minimal, role-id based) ─────────────────────────

export interface SessionProfile {
  id: string; // same as roleId
  roleId: string;
  name: string;
  role: UserRole;
}

// ─── Credential registry ──────────────────────────────────────────────────────
// Hardcoded credentials. Only the admin has a fixed password.
// Teachers and students authenticate by roleId (their ID IS their password).

const ADMIN_CREDENTIALS: Record<string, string> = {
  admin: "admin123",
  ADM001: "admin123",
};

function resolveRole(roleId: string): UserRole {
  const upper = roleId.toUpperCase().trim();
  if (upper === "ADMIN" || upper.startsWith("ADM")) return "admin";
  if (upper.startsWith("TCH")) return "teacher";
  return "student";
}

function validateCredentials(roleId: string, password: string): boolean {
  const key = roleId.trim();
  const upper = key.toUpperCase();
  // Admin: must match the fixed password
  if (upper === "ADMIN" || upper.startsWith("ADM")) {
    return ADMIN_CREDENTIALS[key] === password || password === "admin123";
  }
  // Teacher / Student: password equals their roleId (or any non-empty string for demo)
  return password.trim().length > 0;
}

function generateToken(roleId: string): string {
  return `sd_${roleId}_${Date.now()}`;
}

// ─── Context value ────────────────────────────────────────────────────────────

interface AuthContextValue {
  isAuthenticated: boolean;
  userProfile: SessionProfile | null;
  role: UserRole;
  isLoading: boolean;
  login: (roleId: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUserProfile: (profile: SessionProfile) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfileState] = useState<SessionProfile | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    if (token && raw) {
      try {
        const profile = JSON.parse(raw) as SessionProfile;
        setUserProfileState(profile);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (
      roleId: string,
      name: string,
      password: string,
    ): Promise<boolean> => {
      const trimmedId = roleId.trim();
      const trimmedName = name.trim();

      if (!validateCredentials(trimmedId, password)) return false;

      const role = resolveRole(trimmedId);
      const profile: SessionProfile = {
        id: trimmedId,
        roleId: trimmedId,
        name: trimmedName || trimmedId,
        role,
      };
      const token = generateToken(trimmedId);

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
      setUserProfileState(profile);
      setIsAuthenticated(true);
      return true;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUserProfileState(null);
    setIsAuthenticated(false);
  }, []);

  const setUserProfile = useCallback((profile: SessionProfile) => {
    setUserProfileState(profile);
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userProfile,
        role: userProfile?.role ?? "unknown",
        isLoading,
        login,
        logout,
        setUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
