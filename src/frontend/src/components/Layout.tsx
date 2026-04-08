import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GraduationCap, LogOut } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BottomNav, type TabId } from "./BottomNav";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
  unknown: "Guest",
};

const ROLE_CLASSES: Record<string, string> = {
  admin: "bg-primary/10 text-primary border-primary/30",
  teacher: "bg-accent/10 text-accent border-accent/30",
  student: "bg-muted text-muted-foreground border-border",
  unknown: "bg-muted text-muted-foreground border-border",
};

interface LayoutProps {
  children: ReactNode;
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
  showNav?: boolean;
  title?: string;
  rightAction?: ReactNode;
}

export function Layout({
  children,
  activeTab = "home",
  onTabChange,
  showNav = true,
  title,
  rightAction,
}: LayoutProps) {
  const { role, userProfile, logout } = useAuth();
  const [localTab, setLocalTab] = useState<TabId>(activeTab);

  const handleTabChange = (tab: TabId) => {
    setLocalTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-card">
        <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <GraduationCap size={22} className="text-primary" />
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              {title ?? "SchoolDesk"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {userProfile && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-semibold px-2 py-0.5 border",
                  ROLE_CLASSES[role] ?? ROLE_CLASSES.unknown,
                )}
              >
                {ROLE_LABELS[role] ?? "Guest"}
              </Badge>
            )}
            {rightAction}
            {userProfile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                aria-label="Logout"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                data-ocid="btn-logout"
              >
                <LogOut size={16} />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        className={cn("flex-1 max-w-lg mx-auto w-full", showNav && "pb-20")}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        className={cn(
          "max-w-lg mx-auto w-full px-4 py-3 text-center text-xs text-muted-foreground bg-muted/40",
          showNav && "mb-16",
        )}
      >
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.hostname : "",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Built with love using caffeine.ai
        </a>
      </footer>

      {/* Bottom Nav */}
      {showNav && (
        <BottomNav
          activeTab={onTabChange ? activeTab : localTab}
          onTabChange={handleTabChange}
        />
      )}
    </div>
  );
}
