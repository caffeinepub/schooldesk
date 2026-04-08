import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AttendanceStatus, FeeStatus } from "../types";

type StatusVariant = FeeStatus | AttendanceStatus | "active" | "inactive";

const STATUS_CONFIG: Record<
  StatusVariant,
  { label: string; className: string }
> = {
  // Fee statuses
  paid: {
    label: "Paid",
    className: "bg-accent/10 text-accent border-accent/30",
  },
  unpaid: {
    label: "Unpaid",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  late: {
    label: "Late",
    className:
      "bg-[oklch(0.75_0.15_55)]/10 text-[oklch(0.55_0.18_55)] border-[oklch(0.75_0.15_55)]/30",
  },
  partial: {
    label: "Partial",
    className: "bg-primary/10 text-primary border-primary/30",
  },
  // Attendance statuses
  present: {
    label: "Present",
    className: "bg-accent/10 text-accent border-accent/30",
  },
  absent: {
    label: "Absent",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  excused: {
    label: "Excused",
    className: "bg-muted text-muted-foreground border-border",
  },
  // General
  active: {
    label: "Active",
    className: "bg-accent/10 text-accent border-accent/30",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground border-border",
  },
};

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-semibold px-2 py-0.5 border",
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  );
}
