import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { Bell, Megaphone } from "lucide-react";
import { useState } from "react";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { PageLoader } from "../../components/LoadingSpinner";
import { useNotices } from "../../hooks/useBackend";
import type { NoticeAudience } from "../../types";

const TABS: { id: NoticeAudience | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "teacher", label: "Teachers" },
];

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TeacherNotifications() {
  const navigate = useNavigate();
  const { data: notices, isLoading } = useNotices();
  const [activeTab, setActiveTab] = useState<NoticeAudience | "all">("all");

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/teacher" });
    if (tab === "profile") navigate({ to: "/teacher/profile" });
  };

  const base = (notices ?? []).filter(
    (n) => n.audience === "teacher" || n.audience === "all",
  );

  const filtered =
    activeTab === "all" ? base : base.filter((n) => n.audience === activeTab);

  if (isLoading) return <PageLoader />;

  return (
    <Layout
      activeTab="notifications"
      onTabChange={handleTabChange}
      title="Notices"
    >
      <div className="px-4 pt-4 pb-4 space-y-4">
        {/* Filter tabs */}
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-smooth ${
                activeTab === t.id
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card text-muted-foreground border-border hover:border-accent/50"
              }`}
              data-ocid={`filter-${t.id}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Notice list */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notices"
            description="Important updates for teachers will appear here."
            data-ocid="empty-notifications"
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`bg-card border border-border rounded-xl p-4 shadow-card ${
                  n.isImportant
                    ? "border-l-4 border-l-destructive"
                    : "role-teacher"
                }`}
                data-ocid={`notice-${n.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Megaphone size={15} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm text-foreground leading-snug flex-1 min-w-0">
                        {n.title}
                      </p>
                      {n.isImportant && (
                        <Badge
                          variant="outline"
                          className="text-[10px] shrink-0 text-destructive border-destructive/30 bg-destructive/5"
                        >
                          Important
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {n.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] text-muted-foreground">
                        {formatDate(n.createdAt)}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-[10px] text-muted-foreground border-border"
                      >
                        {n.audience === "all" ? "Everyone" : "Teachers"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
