import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Bell, BellDot } from "lucide-react";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useNotices } from "../../hooks/useBackend";
import type { NoticeAudience } from "../../types";

const AUDIENCE_LABELS: Record<NoticeAudience, string> = {
  all: "Everyone",
  admin: "Admin",
  teacher: "Teachers",
  student: "Students",
};

const AUDIENCE_COLORS: Record<NoticeAudience, string> = {
  all: "bg-primary/10 text-primary border-primary/20",
  admin: "bg-destructive/10 text-destructive border-destructive/20",
  teacher: "bg-accent/10 text-accent border-accent/20",
  student: "bg-secondary text-secondary-foreground border-border",
};

function formatTs(ts: bigint): string {
  try {
    const d = new Date(Number(ts) / 1_000_000);
    const diffDays = Math.floor((Date.now() - d.getTime()) / 86_400_000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "—";
  }
}

export default function AdminNotifications() {
  const navigate = useNavigate();
  const { data: notices = [], isLoading } = useNotices();

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/admin" });
    if (tab === "profile") navigate({ to: "/admin/profile" });
  };

  const sorted = [...notices].sort((a, b) => Number(b.createdAt - a.createdAt));
  const important = sorted.filter((n) => n.isImportant);
  const regular = sorted.filter((n) => !n.isImportant);

  return (
    <Layout
      activeTab="notifications"
      onTabChange={handleTabChange}
      title="Notifications"
    >
      <div className="px-4 pt-4 pb-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          {notices.length} notice{notices.length !== 1 ? "s" : ""} posted
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner label="Loading notifications…" />
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="Important notices and alerts will appear here."
            actionLabel="Post a Notice"
            onAction={() => navigate({ to: "/admin/notices" })}
            data-ocid="empty-notifications"
          />
        ) : (
          <>
            {important.length > 0 && (
              <div>
                <h2 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Important
                </h2>
                <div className="space-y-2">
                  {important.map((n) => (
                    <div
                      key={n.id}
                      className="bg-card border border-border border-l-4 border-l-primary rounded-xl p-3.5 shadow-card"
                      data-ocid={`notification-important-${n.id}`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BellDot size={14} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-sm text-foreground flex-1 min-w-0 truncate">
                              {n.title}
                            </p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                              {formatTs(n.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {n.content}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs border mt-1.5",
                              AUDIENCE_COLORS[n.audience],
                            )}
                          >
                            {AUDIENCE_LABELS[n.audience]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {regular.length > 0 && (
              <div>
                <h2 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  General
                </h2>
                <div className="space-y-2">
                  {regular.map((n) => (
                    <div
                      key={n.id}
                      className="bg-card border border-border rounded-xl p-3.5 shadow-card"
                      data-ocid={`notification-row-${n.id}`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Bell size={14} className="text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-sm text-foreground flex-1 min-w-0 truncate">
                              {n.title}
                            </p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                              {formatTs(n.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {n.content}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs border mt-1.5",
                              AUDIENCE_COLORS[n.audience],
                            )}
                          >
                            {AUDIENCE_LABELS[n.audience]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate({ to: "/admin/notices" })}
                data-ocid="btn-manage-notices"
              >
                Manage All Notices
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
