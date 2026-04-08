import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  DollarSign,
  Star,
  TrendingUp,
} from "lucide-react";
import type { TabId } from "../../components/BottomNav";
import { DashboardCard } from "../../components/DashboardCard";
import { Layout } from "../../components/Layout";
import { PageLoader } from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import {
  useAttendanceSummary,
  useFeesByStudent,
  useHomeworkByClass,
  useMarksByStudent,
  useMyProfile,
  useNotices,
} from "../../hooks/useBackend";

const QUICK_LINKS = [
  { label: "Marks", icon: Star, path: "/student/marks", ocid: "action-marks" },
  {
    label: "Homework",
    icon: BookOpen,
    path: "/student/homework",
    ocid: "action-homework",
  },
  {
    label: "Attendance",
    icon: ClipboardCheck,
    path: "/student/attendance",
    ocid: "action-attendance",
  },
  {
    label: "Notices",
    icon: Bell,
    path: "/student/notifications",
    ocid: "action-notices",
  },
] as const;

export default function StudentHome() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const studentId = userProfile?.id ?? "";

  const { data: profile } = useMyProfile();
  const { data: notices, isLoading } = useNotices();
  const { data: attendanceSummary } = useAttendanceSummary(studentId);
  const { data: fees } = useFeesByStudent(studentId);
  const { data: marks } = useMarksByStudent(studentId);

  // Get student's class from profile roleId — used to fetch homework
  const studentClass = (profile as { className?: string })?.className ?? "";
  const { data: homework } = useHomeworkByClass(studentClass);

  const handleTabChange = (tab: TabId) => {
    if (tab === "profile") navigate({ to: "/student/profile" });
    if (tab === "notifications") navigate({ to: "/student/notifications" });
  };

  const unpaidFees = (fees ?? []).filter((f) => f.status !== "paid");
  const outstandingBalance = unpaidFees.reduce(
    (sum, f) => sum + (f.amount - f.paidAmount),
    0,
  );
  const attendanceRate = attendanceSummary?.percentage ?? 0;

  const pendingHomework = (homework ?? []).filter((hw) => {
    const due = new Date(hw.dueDate);
    return due >= new Date();
  }).length;

  const avgScore =
    marks && marks.length > 0
      ? Math.round(
          (marks.reduce((sum, m) => {
            const score = m.score ?? m.marks ?? 0;
            const max = m.maxScore ?? m.maxMarks ?? 0;
            return sum + (max > 0 ? (score / max) * 100 : 0);
          }, 0) /
            marks.length) *
            10,
        ) / 10
      : null;

  const recentNotices = (notices ?? [])
    .filter((n) => n.audience === "student" || n.audience === "all")
    .slice(0, 3);

  if (isLoading) return <PageLoader />;

  return (
    <Layout activeTab="home" onTabChange={handleTabChange}>
      <div className="px-4 pt-5 pb-4 space-y-5">
        {/* Greeting */}
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Hi, {userProfile?.name?.split(" ")[0] ?? "Student"} 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        {/* Primary stats */}
        <div className="grid grid-cols-2 gap-3">
          <DashboardCard
            icon={ClipboardCheck}
            iconColor="bg-accent/10 text-accent"
            label="Attendance"
            value={`${attendanceRate}%`}
            subValue={`${attendanceSummary?.present ?? 0} of ${attendanceSummary?.totalDays ?? 0} days`}
            accent="student"
            onClick={() => navigate({ to: "/student/attendance" })}
            data-ocid="card-attendance"
          />
          <DashboardCard
            icon={DollarSign}
            iconColor={
              outstandingBalance > 0
                ? "bg-destructive/10 text-destructive"
                : "bg-accent/10 text-accent"
            }
            label="Fees Balance"
            value={
              outstandingBalance > 0
                ? `₹${outstandingBalance.toLocaleString("en-IN")}`
                : "All Clear"
            }
            subValue={
              outstandingBalance > 0
                ? `${unpaidFees.length} pending`
                : "No dues"
            }
            accent="student"
            onClick={() => navigate({ to: "/student/fees" })}
            data-ocid="card-fees"
          />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 gap-3">
          <DashboardCard
            icon={BookOpen}
            iconColor={
              pendingHomework > 0
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }
            label="Pending HW"
            value={pendingHomework}
            subValue={pendingHomework > 0 ? "Due soon" : "All submitted"}
            accent="student"
            onClick={() => navigate({ to: "/student/homework" })}
            data-ocid="card-homework"
          />
          <DashboardCard
            icon={TrendingUp}
            iconColor="bg-primary/10 text-primary"
            label="Avg Score"
            value={avgScore !== null ? `${avgScore}%` : "--"}
            subValue={marks?.length ? `${marks.length} assessments` : "No data"}
            accent="student"
            onClick={() => navigate({ to: "/student/marks" })}
            data-ocid="card-marks"
          />
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">
            Quick Access
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_LINKS.map(({ label, icon: Icon, path, ocid }) => (
              <button
                type="button"
                key={path}
                onClick={() => navigate({ to: path })}
                className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3 shadow-card hover:shadow-elevated transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                data-ocid={ocid}
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <span className="font-medium text-sm text-foreground">
                  {label}
                </span>
                <ChevronRight
                  size={14}
                  className="text-muted-foreground ml-auto"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Recent notices */}
        {recentNotices.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                Latest Notices
              </h3>
              <button
                type="button"
                onClick={() => navigate({ to: "/student/notifications" })}
                className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline"
              >
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-2" data-ocid="notices-preview">
              {recentNotices.map((n) => (
                <div
                  key={n.id}
                  className={`bg-card border border-border rounded-xl p-3.5 shadow-card ${
                    n.isImportant
                      ? "border-l-4 border-l-destructive"
                      : "role-student"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {n.content}
                      </p>
                    </div>
                    {n.isImportant && (
                      <span className="flex-shrink-0 text-[9px] font-bold text-destructive uppercase tracking-wider bg-destructive/10 px-1.5 py-0.5 rounded">
                        Important
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
