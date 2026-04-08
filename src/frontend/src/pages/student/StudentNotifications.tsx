import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Bell, Megaphone } from "lucide-react";
import { useState } from "react";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { PageLoader } from "../../components/LoadingSpinner";
import { useNotices } from "../../hooks/useBackend";

type FilterTab = "all" | "important" | "class";

export default function StudentNotifications() {
  const navigate = useNavigate();
  const { data: notices, isLoading } = useNotices();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/student" });
    if (tab === "profile") navigate({ to: "/student/profile" });
  };

  if (isLoading) return <PageLoader />;

  // Base: notices for students or all audiences
  const studentNotices = (notices ?? []).filter(
    (n) => n.audience === "student" || n.audience === "all",
  );

  const filtered =
    activeFilter === "important"
      ? studentNotices.filter((n) => n.isImportant)
      : activeFilter === "class"
        ? studentNotices.filter((n) => n.audience === "student")
        : studentNotices;

  const importantCount = studentNotices.filter((n) => n.isImportant).length;

  const FILTER_TABS: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "important", label: "Important" },
    { id: "class", label: "Student" },
  ];

  return (
    <Layout
      activeTab="notifications"
      onTabChange={handleTabChange}
      title="Notices"
    >
      <div className="px-4 pt-4 pb-4 space-y-4">
        {/* Filter tabs */}
        <div
          className="flex gap-1.5 bg-muted/50 rounded-xl p-1"
          data-ocid="notice-filter-tabs"
        >
          {FILTER_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveFilter(id)}
              className={cn(
                "flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeFilter === id
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
              data-ocid={`filter-${id}`}
            >
              {label}
              {id === "important" && importantCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full bg-destructive text-destructive-foreground">
                  {importantCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notice count */}
        {filtered.length > 0 && (
          <p className="text-xs text-muted-foreground px-0.5">
            {filtered.length} notice{filtered.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Notices list */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notices"
            description={
              activeFilter === "important"
                ? "No important notices at the moment."
                : activeFilter === "class"
                  ? "No student-specific notices yet."
                  : "School notices and updates will appear here."
            }
            data-ocid="empty-notifications"
          />
        ) : (
          <div className="space-y-2.5" data-ocid="notices-list">
            {[...filtered]
              .sort((a, b) => {
                // Important first, then by date
                if (a.isImportant && !b.isImportant) return -1;
                if (!a.isImportant && b.isImportant) return 1;
                return Number(b.createdAt) - Number(a.createdAt);
              })
              .map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "bg-card border border-border rounded-xl p-4 shadow-card",
                    n.isImportant
                      ? "border-l-4 border-l-destructive"
                      : "role-student",
                  )}
                  data-ocid={`notice-${n.id}`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div
                      className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                        n.isImportant ? "bg-destructive/10" : "bg-muted",
                      )}
                    >
                      {n.isImportant ? (
                        <Megaphone size={14} className="text-destructive" />
                      ) : (
                        <Bell size={14} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-foreground leading-tight">
                          {n.title}
                        </p>
                        {n.isImportant && (
                          <Badge
                            variant="outline"
                            className="text-[9px] font-bold px-1.5 py-0 bg-destructive/10 text-destructive border-destructive/30"
                          >
                            IMPORTANT
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {n.audience === "all" ? "All" : "Students"} ·{" "}
                        {new Date(
                          Number(n.createdAt) / 1_000_000,
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {n.content}
                  </p>
                  {n.createdBy && (
                    <p className="text-xs text-muted-foreground mt-2 font-medium">
                      — {n.createdBy}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
