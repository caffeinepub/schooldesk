import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  Star,
  Users,
} from "lucide-react";
import type { TabId } from "../../components/BottomNav";
import { DashboardCard } from "../../components/DashboardCard";
import { Layout } from "../../components/Layout";
import { PageLoader } from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import {
  useAttendanceByClass,
  useHomeworkByClass,
  useNotices,
  useStudents,
  useTeachers,
} from "../../hooks/useBackend";

const ACTIONS = [
  { label: "Attendance", icon: ClipboardCheck, path: "/teacher/attendance" },
  { label: "Homework", icon: BookOpen, path: "/teacher/homework" },
  { label: "Marks", icon: Star, path: "/teacher/marks" },
];

export default function TeacherHome() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { data: teachers, isLoading: teachersLoading } = useTeachers();
  const { data: notices, isLoading: noticesLoading } = useNotices();
  const { data: students } = useStudents();

  const currentTeacher = teachers?.find(
    (t) => t.teacherId === userProfile?.roleId,
  );
  const assignedClasses = currentTeacher?.assignedClasses ?? [];
  const primaryClass = assignedClasses[0] ?? "";

  const { data: attendance } = useAttendanceByClass(primaryClass);
  const { data: homework } = useHomeworkByClass(primaryClass);

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance?.filter((a) => a.date === today) ?? [];
  const absentToday = todayAttendance.filter(
    (a) => a.status === "absent",
  ).length;
  const pendingHomework =
    homework?.filter((h) => new Date(h.dueDate) >= new Date()).length ?? 0;

  const handleTabChange = (tab: TabId) => {
    if (tab === "profile") navigate({ to: "/teacher/profile" });
    if (tab === "notifications") navigate({ to: "/teacher/notifications" });
  };

  if (teachersLoading || noticesLoading) return <PageLoader />;

  const relevantNotices = (notices ?? []).filter(
    (n) => n.audience === "teacher" || n.audience === "all",
  );

  return (
    <Layout activeTab="home" onTabChange={handleTabChange}>
      <div className="px-4 pt-5 pb-4 space-y-5">
        {/* Welcome */}
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Welcome, {userProfile?.name?.split(" ")[0] ?? "Teacher"}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <DashboardCard
            icon={Users}
            label="Classes"
            value={assignedClasses.length}
            subValue="assigned"
            accent="teacher"
            iconColor="bg-accent/10 text-accent"
            data-ocid="stat-classes"
          />
          <DashboardCard
            icon={BookOpen}
            label="Pending HW"
            value={pendingHomework}
            subValue="assignments"
            accent="teacher"
            iconColor="bg-accent/10 text-accent"
            data-ocid="stat-homework"
          />
          <DashboardCard
            icon={ClipboardCheck}
            label="Absent Today"
            value={absentToday}
            subValue={primaryClass || "no class"}
            accent="teacher"
            iconColor="bg-destructive/10 text-destructive"
            data-ocid="stat-absent"
          />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2">
          {ACTIONS.map(({ label, icon: Icon, path }) => (
            <button
              type="button"
              key={path}
              onClick={() => navigate({ to: path })}
              className="bg-card border border-border rounded-xl p-3 flex flex-col items-center gap-2 shadow-card hover:shadow-elevated transition-smooth"
              data-ocid={`action-${label.toLowerCase()}`}
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Icon size={18} className="text-accent" />
              </div>
              <span className="text-xs font-medium text-foreground">
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Assigned classes */}
        {assignedClasses.length > 0 && (
          <div>
            <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2.5">
              My Classes
            </h3>
            <div className="space-y-2">
              {assignedClasses.map((cls) => {
                const classStudents =
                  students?.filter(
                    (s) =>
                      `${s.className}-${s.section}` === cls ||
                      s.className === cls,
                  ) ?? [];
                return (
                  <div
                    key={cls}
                    className="bg-card border border-border rounded-xl p-3.5 shadow-card role-teacher flex items-center justify-between"
                    data-ocid={`class-row-${cls}`}
                  >
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {cls}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {classStudents.length} student
                        {classStudents.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate({ to: "/teacher/attendance" })}
                      className="text-accent"
                      aria-label="Take attendance"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notices */}
        {relevantNotices.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Notices
              </h3>
              <button
                type="button"
                onClick={() => navigate({ to: "/teacher/notifications" })}
                className="text-xs text-accent font-medium flex items-center gap-0.5"
              >
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {relevantNotices.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  className={`bg-card border border-border rounded-xl p-3.5 shadow-card ${n.isImportant ? "border-l-4 border-l-destructive" : "role-teacher"}`}
                >
                  <p className="font-semibold text-sm text-foreground">
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {n.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
