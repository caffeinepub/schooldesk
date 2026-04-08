import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  "data-ocid"?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  "data-ocid": dataOcid,
}: EmptyStateProps) {
  return (
    <div
      data-ocid={dataOcid}
      className={cn(
        "flex flex-col items-center justify-center text-center px-6 py-12 gap-4",
        className,
      )}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <Icon size={28} className="text-muted-foreground" />
        </div>
      )}
      <div className="space-y-1.5">
        <h3 className="font-display font-semibold text-base text-foreground">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          size="sm"
          className="mt-1"
          data-ocid="empty-state-action"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
