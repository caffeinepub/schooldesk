import { cn } from "@/lib/utils";
import { Bell, Home, User } from "lucide-react";
import type { UserRole } from "../types";

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "notifications", label: "Notices", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
] as const;

type TabId = (typeof tabs)[number]["id"];

function homePathForRole(role: UserRole): string {
  if (role === "admin") return "/admin";
  if (role === "teacher") return "/teacher";
  if (role === "student") return "/student";
  return "/";
}

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elevated"
      data-ocid="bottom-nav"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch max-w-lg mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              type="button"
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] transition-smooth",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label={label}
              data-ocid={`nav-tab-${id}`}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={cn("transition-smooth", isActive && "scale-110")}
              />
              <span
                className={cn(
                  "text-[10px] font-medium tracking-wide transition-smooth",
                  isActive ? "font-semibold" : "font-medium",
                )}
              >
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export type { TabId };
export { homePathForRole };
