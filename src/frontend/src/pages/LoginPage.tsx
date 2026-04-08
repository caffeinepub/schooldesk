import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, GraduationCap, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

// ─── Role detection ───────────────────────────────────────────────────────────

type DetectedRole = "Admin" | "Teacher" | "Student / Parent" | null;

function detectRole(id: string): DetectedRole {
  const upper = id.toUpperCase().trim();
  if (!upper) return null;
  if (upper === "ADMIN" || upper.startsWith("ADM")) return "Admin";
  if (upper.startsWith("TCH")) return "Teacher";
  if (upper.length > 0) return "Student / Parent";
  return null;
}

const ROLE_STYLES: Record<string, string> = {
  Admin: "bg-primary/10 text-primary border-primary/20",
  Teacher: "bg-accent/10 text-accent border-accent/20",
  "Student / Parent":
    "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
};

const ID_HINTS = [
  {
    prefix: "ADM",
    label: "Admin",
    example: "ADM001 / admin",
    color: "bg-primary",
  },
  { prefix: "TCH", label: "Teacher", example: "TCH042", color: "bg-accent" },
  {
    prefix: "GR / other",
    label: "Student / Parent",
    example: "GR2024001",
    color: "bg-muted-foreground/50",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [roleId, setRoleId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const detectedRole = detectRole(roleId);
  const isFormValid =
    roleId.trim().length > 0 &&
    name.trim().length > 0 &&
    password.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError(null);
    setIsLoading(true);

    try {
      const success = await login(roleId.trim(), name.trim(), password);
      if (success) {
        const upper = roleId.toUpperCase().trim();
        const dest =
          upper === "ADMIN" || upper.startsWith("ADM")
            ? "/admin"
            : upper.startsWith("TCH")
              ? "/teacher"
              : "/student";
        toast.success("Welcome back!");
        navigate({ to: dest });
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        {/* ── Brand header ── */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="relative">
            <div className="w-16 h-16 rounded-[18px] bg-primary flex items-center justify-center shadow-elevated">
              <GraduationCap size={32} className="text-primary-foreground" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent border-2 border-background" />
          </div>
          <div className="text-center">
            <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
              SchoolDesk
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Unified School Management
            </p>
          </div>
        </div>

        {/* ── Login card ── */}
        <div className="bg-card border border-border rounded-2xl shadow-elevated overflow-hidden">
          {/* Card header strip */}
          <div className="bg-primary/5 border-b border-border px-6 py-4">
            <p className="font-display font-semibold text-sm text-foreground">
              Sign in to your account
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              All roles — one secure login
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role ID field */}
              <div className="space-y-1.5">
                <Label htmlFor="roleId" className="text-sm font-medium">
                  Role ID / GR No
                </Label>
                <Input
                  id="roleId"
                  value={roleId}
                  onChange={(e) => {
                    setRoleId(e.target.value);
                    setError(null);
                  }}
                  placeholder="e.g. admin, ADM001, TCH042, GR2024…"
                  autoComplete="username"
                  data-ocid="input-role-id"
                  className="h-11 font-mono text-sm"
                  disabled={isLoading}
                />
                {detectedRole && (
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${ROLE_STYLES[detectedRole]}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    Logging in as {detectedRole}
                  </div>
                )}
              </div>

              {/* Full Name field */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  autoComplete="name"
                  data-ocid="input-name"
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    data-ocid="input-password"
                    className="h-11 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div
                  className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                  data-ocid="login-error"
                >
                  <span className="text-xs leading-5">{error}</span>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full h-12 font-display font-semibold text-sm gap-2"
                disabled={!isFormValid || isLoading}
                data-ocid="btn-sign-in"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* ── ID format hints ── */}
        <div className="mt-4 bg-muted/50 border border-border rounded-xl p-4">
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            ID Format Guide
          </p>
          <div className="space-y-2">
            {ID_HINTS.map((hint) => (
              <div key={hint.prefix} className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${hint.color}`}
                />
                <span className="text-xs text-foreground">
                  <span className="font-semibold">{hint.label}</span>
                  <span className="text-muted-foreground"> — starts with </span>
                  <span className="font-mono text-foreground">
                    {hint.prefix}
                  </span>
                  <span className="text-muted-foreground"> (e.g. </span>
                  <span className="font-mono text-muted-foreground">
                    {hint.example}
                  </span>
                  <span className="text-muted-foreground">)</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Admin demo:</span>{" "}
              ID <span className="font-mono">admin</span> · Password{" "}
              <span className="font-mono">admin123</span>
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Built with caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
