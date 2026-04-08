import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  icon?: LucideIcon;
  iconColor?: string;
  label: string;
  value: string | number;
  subValue?: string;
  accent?: "admin" | "teacher" | "student" | "none";
  onClick?: () => void;
  className?: string;
  "data-ocid"?: string;
}

export function DashboardCard({
  icon: Icon,
  iconColor,
  label,
  value,
  subValue,
  accent = "none",
  onClick,
  className,
  "data-ocid": dataOcid,
}: DashboardCardProps) {
  const accentClass = {
    admin: "role-admin",
    teacher: "role-teacher",
    student: "role-student",
    none: "",
  }[accent];

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => (e.key === "Enter" || e.key === " ") && onClick()
          : undefined
      }
      data-ocid={dataOcid}
      className={cn(
        "bg-card rounded-xl p-4 shadow-card border border-border",
        accentClass,
        onClick &&
          "cursor-pointer hover:shadow-elevated transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 truncate">
            {label}
          </p>
          <p className="text-2xl font-display font-bold text-foreground leading-tight">
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {subValue}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
              iconColor ?? "bg-primary/10 text-primary",
            )}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
