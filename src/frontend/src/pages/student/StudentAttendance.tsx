import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { ClipboardCheck } from "lucide-react";
import type { TabId } from "../../components/BottomNav";
import { EmptyState } from "../../components/EmptyState";
import { Layout } from "../../components/Layout";
import { PageLoader } from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import {
  useAttendanceByStudent,
  useAttendanceSummary,
} from "../../hooks/useBackend";
import type { AttendanceStatus } from "../../types";

const STATUS_STYLES: Record<
  AttendanceStatus,
  { dot: string; bg: string; text: string; label: string }
> = {
  present: {
    dot: "bg-accent",
    bg: "bg-accent/10",
    text: "text-accent",
    label: "Present",
  },
  absent: {
    dot: "bg-destructive",
    bg: "bg-destructive/10",
    text: "text-destructive",
    label: "Absent",
  },
  late: {
    dot: "bg-[oklch(0.65_0.18_55)]",
    bg: "bg-[oklch(0.65_0.18_55)]/10",
    text: "text-[oklch(0.5_0.18_55)]",
    label: "Late",
  },
  excused: {
    dot: "bg-muted-foreground",
    bg: "bg-muted",
    text: "text-muted-foreground",
    label: "Excused",
  },
};

export default function StudentAttendance() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const studentId = userProfile?.id ?? "";
  const { data: records, isLoading } = useAttendanceByStudent(studentId);
  const { data: summary } = useAttendanceSummary(studentId);

  const handleTabChange = (tab: TabId) => {
    if (tab === "home") navigate({ to: "/student" });
    if (tab === "profile") navigate({ to: "/student/profile" });
    if (tab === "notifications") navigate({ to: "/student/notifications" });
  };

  if (isLoading) return <PageLoader />;

  const sortedRecords = records
    ? [...records].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
    : [];

  return (
    <Layout
      activeTab="home"
      onTabChange={handleTabChange}
      title="My Attendance"
    >
      <div className="px-4 pt-4 pb-4 space-y-4">
        {/* Summary card */}
        {summary && (
          <div
            className="bg-card border border-border rounded-xl p-4 shadow-card role-student"
            data-ocid="attendance-summary"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-sm text-foreground">
                Overall Attendance
              </h3>
              <span
                className={cn(
                  "text-2xl font-display font-bold",
                  summary.percentage >= 75 ? "text-accent" : "text-destructive",
                )}
              >
                {summary.percentage}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div
                className={cn(
                  "h-full rounded-full transition-smooth",
                  summary.percentage >= 75 ? "bg-accent" : "bg-destructive",
                )}
                style={{ width: `${Math.min(100, summary.percentage)}%` }}
              />
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                {
                  label: "Total",
                  value: summary.totalDays,
                  color: "text-foreground",
                },
                {
                  label: "Present",
                  value: summary.present,
                  color: "text-accent",
                },
                {
                  label: "Absent",
                  value: summary.absent,
                  color: "text-destructive",
                },
                {
                  label: "Late",
                  value: summary.late,
                  color: "text-[oklch(0.5_0.18_55)]",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-muted/50 rounded-lg py-2">
                  <p className={cn("font-bold text-lg leading-tight", color)}>
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {summary.percentage < 75 && (
              <p className="text-xs text-destructive mt-3 text-center font-medium">
                ⚠ Attendance below 75% — please attend regularly
              </p>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-3 px-0.5">
          {(
            Object.entries(STATUS_STYLES) as [
              AttendanceStatus,
              (typeof STATUS_STYLES)[AttendanceStatus],
            ][]
          ).map(([status, cfg]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={cn("w-2 h-2 rounded-full", cfg.dot)} />
              <span className="text-xs text-muted-foreground">{cfg.label}</span>
            </div>
          ))}
        </div>

        {/* Records list */}
        {sortedRecords.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="No attendance records"
            description="Your attendance history will appear here once your teacher marks it."
            data-ocid="empty-attendance"
          />
        ) : (
          <div className="space-y-1.5" data-ocid="attendance-list">
            {sortedRecords.map((record) => {
              const cfg = STATUS_STYLES[record.status] ?? STATUS_STYLES.excused;
              const dateObj = new Date(record.date);
              return (
                <div
                  key={record.id}
                  className={cn(
                    "border border-border rounded-xl px-3.5 py-2.5 flex items-center justify-between shadow-card",
                    cfg.bg,
                  )}
                  data-ocid={`attendance-row-${record.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        cfg.dot,
                      )}
                    />
                    <div>
                      <p className="text-sm text-foreground font-medium">
                        {dateObj.toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      {record.remarks && (
                        <p className="text-xs text-muted-foreground">
                          {record.remarks}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      cfg.bg,
                      cfg.text,
                    )}
                  >
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
