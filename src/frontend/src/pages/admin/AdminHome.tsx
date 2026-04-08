import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  ChevronRight,
  DollarSign,
  GraduationCap,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TabId } from "../../components/BottomNav";
import { DashboardCard } from "../../components/DashboardCard";
import { Layout } from "../../components/Layout";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { useAnalytics, useNotices } from "../../hooks/useBackend";

const QUICK_ACTIONS = [
  {
    label: "Students",
    icon: Users,
    path: "/admin/students",
    ocid: "action-students",
  },
  {
    label: "Teachers",
    icon: GraduationCap,
    path: "/admin/teachers",
    ocid: "action-teachers",
  },
  { label: "Fees", icon: DollarSign, path: "/admin/fees", ocid: "action-fees" },
  {
    label: "Attendance",
    icon: CalendarCheck,
    path: "/admin/attendance",
    ocid: "action-attendance",
  },
  {
    label: "Notices",
    icon: Bell,
    path: "/admin/notices",
    ocid: "action-notices",
  },
] as const;

const FALLBACK_CHART = [
  { className: "Grade 6", count: 42 },
  { className: "Grade 7", count: 38 },
  { className: "Grade 8", count: 45 },
  { className: "Grade 9", count: 36 },
  { className: "Grade 10", count: 40 },
];

export default function AdminHome() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { data: analytics, isLoading } = useAnalytics();
  const { data: notices } = useNotices();

  const handleTabChange = (tab: TabId) => {
    if (tab === "profile") navigate({ to: "/admin/profile" });
    if (tab === "notifications") navigate({ to: "/admin/notifications" });
  };

  const feePercent =
    analytics && analytics.totalFees > 0
      ? Math.round((analytics.feesCollected / analytics.totalFees) * 100)
      : 0;

  const pendingFees = analytics
    ? analytics.totalFees - analytics.feesCollected
    : 0;

  const chartData = analytics?.enrollmentByClass?.length
    ? analytics.enrollmentByClass
    : FALLBACK_CHART;

  return (
    <Layout activeTab="home" onTabChange={handleTabChange}>
      <div className="px-4 pt-5 pb-4 space-y-5">
        {/* Welcome banner */}
        <div className="role-admin bg-card rounded-xl p-4 shadow-card border border-border">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
            Admin Dashboard
          </p>
          <h1 className="font-display font-bold text-xl text-foreground leading-tight">
            Welcome, {userProfile?.name?.split(" ")[0] ?? "Admin"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Stat cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" label="Loading dashboard…" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <DashboardCard
              icon={Users}
              iconColor="bg-primary/10 text-primary"
              label="Total Students"
              value={analytics?.totalStudents ?? 0}
              accent="admin"
              onClick={() => navigate({ to: "/admin/students" })}
              data-ocid="card-total-students"
            />
            <DashboardCard
              icon={GraduationCap}
              iconColor="bg-accent/10 text-accent"
              label="Total Teachers"
              value={analytics?.totalTeachers ?? 0}
              accent="teacher"
              onClick={() => navigate({ to: "/admin/teachers" })}
              data-ocid="card-total-teachers"
            />
            <DashboardCard
              icon={DollarSign}
              iconColor="bg-destructive/10 text-destructive"
              label="Pending Fees"
              value={`₹${pendingFees.toLocaleString()}`}
              subValue={`${feePercent}% collected`}
              onClick={() => navigate({ to: "/admin/fees" })}
              data-ocid="card-pending-fees"
            />
            <DashboardCard
              icon={Bell}
              iconColor="bg-secondary text-secondary-foreground"
              label="Active Notices"
              value={notices?.length ?? 0}
              subValue="Posted so far"
              onClick={() => navigate({ to: "/admin/notices" })}
              data-ocid="card-active-notices"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">
            Quick Actions
          </h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
            {QUICK_ACTIONS.map(({ label, icon: Icon, path, ocid }, i) => (
              <button
                type="button"
                key={path + label}
                onClick={() => navigate({ to: path })}
                data-ocid={ocid}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-smooth text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  i < QUICK_ACTIONS.length - 1 && "border-b border-border",
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <span className="flex-1 font-medium text-sm text-foreground">
                  {label}
                </span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Notices */}
        {notices && notices.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                Recent Notices
              </h2>
              <button
                type="button"
                onClick={() => navigate({ to: "/admin/notices" })}
                className="text-xs text-primary font-medium hover:underline focus-visible:outline-none"
              >
                View all
              </button>
            </div>
            <div className="space-y-2">
              {[...notices]
                .sort((a, b) => Number(b.createdAt - a.createdAt))
                .slice(0, 3)
                .map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "bg-card border border-border rounded-xl p-3.5 shadow-card",
                      n.isImportant && "border-l-4 border-l-primary",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <BookOpen
                        size={13}
                        className="text-muted-foreground mt-0.5 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {n.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Enrollment Chart */}
        <div className="bg-card rounded-xl shadow-card border border-border p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={15} className="text-primary" />
            <h2 className="font-display font-semibold text-sm text-foreground">
              Enrollment by Class
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.9 0.008 260)"
                vertical={false}
              />
              <XAxis
                dataKey="className"
                tick={{ fontSize: 10, fill: "oklch(0.5 0.01 260)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(0.5 0.01 260)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(1.0 0.004 260)",
                  border: "1px solid oklch(0.9 0.008 260)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "oklch(0.18 0.015 260)",
                }}
                cursor={{ fill: "oklch(0.94 0.01 260)" }}
              />
              <Bar
                dataKey="count"
                name="Students"
                fill="oklch(0.42 0.14 265)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
