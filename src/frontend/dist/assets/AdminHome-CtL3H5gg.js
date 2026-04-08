import { u as useNavigate, a as useAuth, j as jsxRuntimeExports, L as LoadingSpinner, c as cn } from "./index-BBwbkILB.js";
import { D as DashboardCard } from "./DashboardCard-N--pxpbJ.js";
import { L as Layout, B as Bell } from "./Layout-8MqYqfzj.js";
import { u as useAnalytics, a as useNotices } from "./useBackend-slhkZeTo.js";
import { U as Users } from "./users-CS1xEMfi.js";
import { c as createLucideIcon, G as GraduationCap } from "./graduation-cap-D7guj77i.js";
import { D as DollarSign } from "./dollar-sign-CVQveGAv.js";
import { C as CalendarCheck } from "./calendar-check-D5NNW0ab.js";
import { C as ChevronRight } from "./chevron-right-hTEMbx7u.js";
import { B as BookOpen } from "./book-open-CnWzzPJQ.js";
import { g as generateCategoricalChart, B as Bar, X as XAxis, Y as YAxis, f as formatAxisMap, R as ResponsiveContainer, C as CartesianGrid, T as Tooltip } from "./generateCategoricalChart-BcwxDTTC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode);
var BarChart = generateCategoricalChart({
  chartName: "BarChart",
  GraphicalChild: Bar,
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: ["axis", "item"],
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: XAxis
  }, {
    axisType: "yAxis",
    AxisComp: YAxis
  }],
  formatAxisMap
});
const QUICK_ACTIONS = [
  {
    label: "Students",
    icon: Users,
    path: "/admin/students",
    ocid: "action-students"
  },
  {
    label: "Teachers",
    icon: GraduationCap,
    path: "/admin/teachers",
    ocid: "action-teachers"
  },
  { label: "Fees", icon: DollarSign, path: "/admin/fees", ocid: "action-fees" },
  {
    label: "Attendance",
    icon: CalendarCheck,
    path: "/admin/attendance",
    ocid: "action-attendance"
  },
  {
    label: "Notices",
    icon: Bell,
    path: "/admin/notices",
    ocid: "action-notices"
  }
];
const FALLBACK_CHART = [
  { className: "Grade 6", count: 42 },
  { className: "Grade 7", count: 38 },
  { className: "Grade 8", count: 45 },
  { className: "Grade 9", count: 36 },
  { className: "Grade 10", count: 40 }
];
function AdminHome() {
  var _a, _b;
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { data: analytics, isLoading } = useAnalytics();
  const { data: notices } = useNotices();
  const handleTabChange = (tab) => {
    if (tab === "profile") navigate({ to: "/admin/profile" });
    if (tab === "notifications") navigate({ to: "/admin/notifications" });
  };
  const feePercent = analytics && analytics.totalFees > 0 ? Math.round(analytics.feesCollected / analytics.totalFees * 100) : 0;
  const pendingFees = analytics ? analytics.totalFees - analytics.feesCollected : 0;
  const chartData = ((_a = analytics == null ? void 0 : analytics.enrollmentByClass) == null ? void 0 : _a.length) ? analytics.enrollmentByClass : FALLBACK_CHART;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { activeTab: "home", onTabChange: handleTabChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-4 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "role-admin bg-card rounded-xl p-4 shadow-card border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5", children: "Admin Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-xl text-foreground leading-tight", children: [
        "Welcome, ",
        ((_b = userProfile == null ? void 0 : userProfile.name) == null ? void 0 : _b.split(" ")[0]) ?? "Admin"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }) })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "md", label: "Loading dashboard…" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DashboardCard,
        {
          icon: Users,
          iconColor: "bg-primary/10 text-primary",
          label: "Total Students",
          value: (analytics == null ? void 0 : analytics.totalStudents) ?? 0,
          accent: "admin",
          onClick: () => navigate({ to: "/admin/students" }),
          "data-ocid": "card-total-students"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DashboardCard,
        {
          icon: GraduationCap,
          iconColor: "bg-accent/10 text-accent",
          label: "Total Teachers",
          value: (analytics == null ? void 0 : analytics.totalTeachers) ?? 0,
          accent: "teacher",
          onClick: () => navigate({ to: "/admin/teachers" }),
          "data-ocid": "card-total-teachers"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DashboardCard,
        {
          icon: DollarSign,
          iconColor: "bg-destructive/10 text-destructive",
          label: "Pending Fees",
          value: `₹${pendingFees.toLocaleString()}`,
          subValue: `${feePercent}% collected`,
          onClick: () => navigate({ to: "/admin/fees" }),
          "data-ocid": "card-pending-fees"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DashboardCard,
        {
          icon: Bell,
          iconColor: "bg-secondary text-secondary-foreground",
          label: "Active Notices",
          value: (notices == null ? void 0 : notices.length) ?? 0,
          subValue: "Posted so far",
          onClick: () => navigate({ to: "/admin/notices" }),
          "data-ocid": "card-active-notices"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2.5", children: "Quick Actions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl overflow-hidden shadow-card", children: QUICK_ACTIONS.map(({ label, icon: Icon, path, ocid }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: path }),
          "data-ocid": ocid,
          className: cn(
            "w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-smooth text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
            i < QUICK_ACTIONS.length - 1 && "border-b border-border"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 font-medium text-sm text-foreground", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "text-muted-foreground" })
          ]
        },
        path + label
      )) })
    ] }),
    notices && notices.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider", children: "Recent Notices" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: "/admin/notices" }),
            className: "text-xs text-primary font-medium hover:underline focus-visible:outline-none",
            children: "View all"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [...notices].sort((a, b) => Number(b.createdAt - a.createdAt)).slice(0, 3).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: cn(
            "bg-card border border-border rounded-xl p-3.5 shadow-card",
            n.isImportant && "border-l-4 border-l-primary"
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              BookOpen,
              {
                size: 13,
                className: "text-muted-foreground mt-0.5 flex-shrink-0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: n.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: n.content })
            ] })
          ] })
        },
        n.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl shadow-card border border-border p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { size: 15, className: "text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-sm text-foreground", children: "Enrollment by Class" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        BarChart,
        {
          data: chartData,
          margin: { top: 0, right: 0, left: -20, bottom: 0 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CartesianGrid,
              {
                strokeDasharray: "3 3",
                stroke: "oklch(0.9 0.008 260)",
                vertical: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              XAxis,
              {
                dataKey: "className",
                tick: { fontSize: 10, fill: "oklch(0.5 0.01 260)" },
                axisLine: false,
                tickLine: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              YAxis,
              {
                tick: { fontSize: 10, fill: "oklch(0.5 0.01 260)" },
                axisLine: false,
                tickLine: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tooltip,
              {
                contentStyle: {
                  background: "oklch(1.0 0.004 260)",
                  border: "1px solid oklch(0.9 0.008 260)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "oklch(0.18 0.015 260)"
                },
                cursor: { fill: "oklch(0.94 0.01 260)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Bar,
              {
                dataKey: "count",
                name: "Students",
                fill: "oklch(0.42 0.14 265)",
                radius: [4, 4, 0, 0]
              }
            )
          ]
        }
      ) })
    ] })
  ] }) });
}
export {
  AdminHome as default
};
